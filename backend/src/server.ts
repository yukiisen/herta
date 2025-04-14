import { ServerWebSocket } from "bun";
import DataStore from "./store";
import OpenAI from "openai";

import { system, openai, config } from "./config";

type UserReq = { type: 'message', content: { role: 'user', content: string } };
type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const history = new DataStore<{ messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] }>('history.json');

// this will take a while so better wait.
history.load().then(() => console.log("History Loaded!"));

export default async function handleClientMessage (client: ServerWebSocket<unknown>, message: string) {
    const content: UserReq = JSON.parse(message);

    console.log(content);
    if (content.type == 'message') {
        const reply = await generateReply(content.content);
        history.getData("messages").push(reply);

        client.send(JSON.stringify({ role: reply.role, content: JSON.parse(reply.content?.toString() || "") }));
    } else {
        client.send("Invalid input!");
    }
}


async function generateReply (message: ChatMessage): Promise<ChatMessage> {
    history.alter(e => e.messages.push(message));

    const completion = await openai.chat.completions.create({
        model: config.model,
        messages: system.concat(history.getData("messages")),
    });

    const tmp = completion.choices[0].message;
    const reply = { role: tmp.role, content: tmp.content } as OpenAI.Chat.Completions.ChatCompletionMessageParam;

    return reply;
}
