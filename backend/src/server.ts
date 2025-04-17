import { ServerWebSocket, stdout } from "bun";
import DataStore from "./store";
import OpenAI from "openai";

import { openApp, openFile, executeCommand } from "./modules/shell";

import { system, openai, config } from "./config";

import { client } from "./modules/discord";

type UserReq = { type: 'message', content: { role: 'user', content: string } };
type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const history = new DataStore<{ messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] }>('history.json');

// this will take a while so better wait.
history.load().then(() => console.log("History Loaded!"));

client.once("ready", () => {});

export default async function handleClientMessage (client: ServerWebSocket<unknown>, message: string) {
    const content: UserReq = JSON.parse(message);

    console.log(content);
    if (content.type == 'message') {
        const reply = await generateReply(content.content);
        history.getData("messages").push(reply);

        const message = handleJSON(reply.content?.toString() || "");

        if (!message) { return client.send(JSON.stringify({ role: reply.role, content: { message: "Invalid JSON!" } })); }

        client.send(JSON.stringify({ role: reply.role, content: JSON.parse(reply.content?.toString() || "") }));

        if (!!message.command) { 
            const out: string = await Promise.race([executeCommand(message.command), sleep(5, "Process timeout")]) as string;
            client.send(JSON.stringify({ role: 'command', content: JSON.stringify({ command: message.command, stdout: out }) }));
            
            // add output to history for future messages
            const last = history.getData("messages").pop();
            const data = JSON.parse(last?.content?.toString() ?? "");

            data.command_output = out;
            history.getData("messages").push({ role: last?.role || 'assistant', content: JSON.stringify(data) } as ChatMessage);
        }

        if (!!message.app) openApp(message.app);
        if (!!message.file) openFile(message.file);
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


function handleJSON (json: string): any | null {
    try {
        return JSON.parse(json);
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

function sleep (time: number, data: any = "Timeout!") {
    return new Promise((res, _) => {
        setTimeout(() => res(data), time * 1000);
    })
}
