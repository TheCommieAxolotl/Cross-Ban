import { PermissionFlagsBits } from "discord.js";

import { hasPermission } from "../modules/permission";
import makeCommand from "../modules/command";
import { logBan } from "../modules/ban";

makeCommand("ban", ["user", "?reason"], async (message) => {
    if (!hasPermission(message.member, PermissionFlagsBits.Administrator)) return await message.reply("You don't have permission to use this command.");

    const res = await logBan(message);

    if (res) {
        message.react("✅");
    }
});
