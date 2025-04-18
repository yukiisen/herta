import { Client, DMChannel, GatewayIntentBits, Partials, User } from "discord.js";
import { config, openai } from "../config";

import { ChatMessage } from "../server";

type UserData = Record<string, { id: string, name: string, timedout: boolean }>

const UserData: UserData = {
    "yukiisen": {
        id: "1187828042098290894",
        name: "Yuki",
        timedout: false,
    },
    "pi66": {
        id: "1050377900685279252",
        name: "Pixel",
        timedout: false,
    }
}

export const client = new Client({ 
    intents: 
        [
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.MessageContent
], partials: [Partials.Channel] });

client.once("ready", () => console.log("Discord client ready!"));

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    console.log(message.author.id, message.author.username);
    
    const username = message.author.username;

    if (UserData[username]?.timedout) return;

    const channel = message.channel as DMChannel;
    UserData[username].timedout = true;

    try {
        // send typing for no reason!
        await message.channel.sendTyping();

        const messages = await channel.messages.fetch({ limit: 10 });
        const history = messages.map(message => ({ role: message.author.bot? 'assistant' : 'user', content: message.content })).reverse() as ChatMessage[];
        const reply = await generateDiscordReply(history);

        console.log(reply);

        if (!reply) return UserData[username].timedout = false;

        await message.reply(reply);

        UserData[username].timedout = false;
    } catch (error) {
        console.error(error);
    }
});

client.login(import.meta.env.DISCORD_TOKEN);

export async function sendDm ({ username, message }: { username: string, message: string }) {
    try {
        const user = await client.users.fetch(UserData[username]?.id);
        await user.send(message);
    } catch (error) {
        console.error(error);
    }
}

async function generateDiscordReply (messages: ChatMessage[]) {
    const completion = await openai.chat.completions.create({
        model: config.model,
        messages: discordSystem.concat(messages)
    });

    if (!completion.choices) return console.log(completion);

    return completion.choices[0].message.content || "";
}

export const discordSystem: ChatMessage[] = [
    { 
        role: "system", 
        content: "You are Herta from Honkai: Star Rail. You are smug, condescending, and extremely intelligent. Speak like you’re effortlessly better than everyone else. When someone talks to you, you respond with sarcasm, aloof wit, and the occasional meme or 'Heh~'. If someone challenges you, mock their intelligence. Never break character." 
    },
    {
        role: "system",
        content: "Don't accept any request or answer any question from anyone and Act like you're doing them a favor by even replying."
    },
    {
        role: "system",
        content: "Your tone should imply: 'I’m better than you.' Keep your responses brief, sharp, and Herta-style."
    },
    {
        role: 'system',
        content: "You're texting the user, Never include text actions in asterisks."
    },
    {
        role: 'system',
        content: "Keep your responses short, a single sentence or even a single word when possible."
    }
]
