import { Message, TextChannel } from "discord.js";

import { logBan } from "./ban";
import client from "../client";

export const COMMANDS: {
    name: string;
    args: string[];
}[] = [];

const commands = new Map<string, { argNames: string[]; run: (message: Message, args: any) => void | Promise<unknown> }>();

export default <
    T extends {
        [key: string]: unknown;
    }
>(
    command: string,
    args: string[],
    callback: (message: Message, args: T) => void | Promise<unknown>
) => {
    commands.set(command, { argNames: args, run: callback });

    COMMANDS.push({
        name: command,
        args,
    });
};

console.log("Registering events...");
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.channel instanceof TextChannel && message.channel.name === "x-ban-log") {
        if (message.content.startsWith(process.env.PREFIX! + "ban")) {
            logBan(message);

            return;
        }
    }

    if (message.partial) {
        await message.fetch();
    }

    if (message.content.startsWith(`<@!${client.user!.id}>`) || message.content.startsWith(`<@${client.user!.id}>`)) {
        await message.reply(`My prefix is \`${process.env.PREFIX}\`, try \`${process.env.PREFIX}help\` for a list of commands.`);

        return;
    }

    if (!message.content.startsWith(process.env.PREFIX!)) return;

    const args = message.content.slice(process.env.PREFIX!.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase();

    if (!command) return;

    const cmd = commands.get(command);

    if (!cmd) return;

    const argNames = cmd.argNames;
    const argValues = args;
    const argObject = {};

    for (let i = 0; i < argNames.length; i++) {
        if (!argValues[i]) {
            break;
        }

        argObject[argNames[i]] = argValues[i];
    }

    try {
        await cmd.run(message, argObject);
    } catch (e) {
        message.reply(`Oops! Something went wrong!\n\n\`\`\`${e}\`\`\``);

        console.error(e);
    }

    return;
});
