import { GuildMember, Message, PermissionResolvable } from "discord.js";

export const hasPermission = (user: GuildMember, permission: PermissionResolvable, error?: boolean) => {
    if (user.permissions.has(permission)) return true;

    return false;
};
