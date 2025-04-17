import { Client, GatewayIntentBits, Partials } from "discord.js";

const UserIds = {
    "yukiisen": "1187828042098290894"
}

export const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });

client.once("ready", () => console.log("Discord client ready!"));

client.on("messageCreate", async (message) => {
  console.log("Something!");
    if (message.author.bot) return;

    console.log(message.content);
    console.log(message.author.id);

    message.reply("what?");
});

client.login(import.meta.env.DISCORD_TOKEN);
