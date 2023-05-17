import { EmbedBuilder, Message, ButtonBuilder, ButtonStyle, ActionRowBuilder, BaseButtonComponentData, MessageActionRowComponentBuilder, ButtonInteraction, PermissionFlagsBits } from "discord.js";
import { hasPermission } from "./permission";
import { sendToEach } from "./send";

const pingToID = (ping: string) => ping.replace("<@", "").replace(">", "");

export const logBan = async (message: Message) => {
    if (!hasPermission(message.member, PermissionFlagsBits.BanMembers)) {
        await message.reply("You don't have permission to use this command.");

        return false;
    }

    const content = message.content.replace(`${process.env.PREFIX}ban `, "");

    if (!message.guildId) return;

    const [user, ...reason] = content.split(" ");

    if (!user || !reason) {
        await message.reply("You must provide a user and a reason.");

        return false;
    }

    const isPing = user.startsWith("<@") && user.endsWith(">");

    const userID = isPing ? pingToID(user) : user;

    if (!Number(userID) || isNaN(Number(userID))) {
        await message.reply("You must provide a valid user ID or ping a user.");

        return false;
    }

    const embed = new EmbedBuilder({
        color: 0xef5250,
        title: "Ban Report",
        description: `**User** <@${userID}> (${userID})\n\n**Reason** ${reason.join(" ")}`,
        timestamp: new Date(),
    });

    const ban = new ButtonBuilder({
        style: ButtonStyle.Danger,
        label: "Ban User",
        customId: "ban",
    });

    const kick = new ButtonBuilder({
        style: ButtonStyle.Primary,
        label: "Kick User",
        customId: "kick",
    });

    const cancel = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: "Cancel",
        customId: "cancel",
    });

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(cancel, ban);

    const collectorFilter = (i: ButtonInteraction) => {
        const guildMember = i.guild?.members.cache.get(i.user.id);

        return hasPermission(guildMember, PermissionFlagsBits.BanMembers);
    };

    await sendToEach([embed], [row], message, async (response) => {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter });

        switch (confirmation.customId) {
            case "ban": {
                const guildMember = confirmation.guild?.members.cache.get(userID);

                if (!guildMember) return;

                try {
                    await guildMember.ban({ reason: reason.join(" ") });

                    await confirmation.update({
                        embeds: [
                            new EmbedBuilder({
                                color: 0x43b581,
                                title: "Ban Report",
                                description: `**User** <@${userID}> (${userID})\n\n**Reason** ${reason.join(" ")}\n\n**Status** Banned`,
                                timestamp: new Date(),
                            }),
                        ],
                        components: [],
                    });
                } catch (e) {
                    message.reply(`Oops! Something went wrong. Please try again.\n\n\`\`\`${e}\`\`\``);
                }

                break;
            }
            case "cancel": {
                await confirmation.update({
                    embeds: [
                        new EmbedBuilder({
                            color: 0x43b581,
                            title: "Ban Report",
                            description: `**User** <@${userID}> (${userID})\n\n**Reason** ${reason.join(" ")}\n\n**Status** Cancelled`,
                            timestamp: new Date(),
                        }),
                    ],
                    components: [],
                });

                break;
            }
        }
    });

    return true;
};
