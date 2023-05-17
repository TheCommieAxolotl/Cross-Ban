import { PermissionFlagsBits } from "discord.js";

import { hasPermission } from "../modules/permission";
import { decrypt, encrypt, hash } from "../modules/crypto";
import { Stream } from "../modules/datastore";
import makeCommand from "../modules/command";
import client from "../client";

const KEYS = Stream("KEYS");

makeCommand<{
    arg: string;
    value?: string;
}>("key", ["arg", "value"], async (message, args) => {
    const { arg, value } = args;

    if (!hasPermission(message.member, PermissionFlagsBits.Administrator)) return await message.reply("You don't have permission to use this command.");

    switch (arg) {
        case "set": {
            if (!message.guild) {
                return await message.channel.send("This command can only be used in a server.");
            }

            if (!value) {
                return await message.channel.send("You must provide a value.");
            }

            await message.channel.send(`Setting key to \`${value}\` for ${message.guild?.name}`);

            KEYS[message.guild.id] = encrypt(value);

            break;
        }
        case "view": {
            if (!message.guild) {
                return await message.channel.send("This command can only be used in a server.");
            }

            const key = KEYS[message.guild.id];

            if (!key) {
                return await message.channel.send("This server doesn't have a key set up.");
            }

            const shared = Object.entries(KEYS)
                .filter(([id, k]) => k === key && id !== message.guild?.id)
                .map(([id]) => id)
                .map((id) => client.guilds.cache.get(id));

            await message.channel.send(
                `The key for ${message.guild.name} is \`${decrypt(key)}\`. It is shared with ${shared.length} other server${shared.length === 1 ? "" : "s"}.\n\n${shared
                    .map((guild) => `${guild.name}`)
                    .join(",\n")}`
            );

            break;
        }
        case "generate": {
            if (!message.guild) {
                return await message.channel.send("This command can only be used in a server.");
            }

            const suggestedKey = hash();

            await message.channel.send(`Randomly generated key.\n\n \`\`\`\n${suggestedKey}\n\`\`\``);

            break;
        }
    }
});
