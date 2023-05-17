import { ActionRowBuilder, BaseButtonComponentData, EmbedBuilder, Message, MessageActionRowComponentBuilder } from "discord.js";

import { Stream } from "./datastore";
import client from "../client";

const KEYS = Stream("KEYS");

export const sendToEach = async (embeds: EmbedBuilder[], components: ActionRowBuilder<MessageActionRowComponentBuilder>[], message: Message, callback: (e: Message) => void) => {
    const guildKey = KEYS[`${message.guildId}`];

    if (!guildKey) return message.reply(`Oops! This server (${message.guild?.name}) doesn't have a key set up!\n\nAdd one with \`${process.env.PREFIX}key set <key>\``);

    const guilds = await client.guilds.fetch();

    for (const _guild of guilds.values()) {
        const guild = await _guild.fetch();

        const key = KEYS[`${guild.id}`];

        if (!key) continue;

        if (key === guildKey) {
            const channel = guild.channels.cache.find((channel) => channel.name === "x-ban-log");

            if (!channel) continue;

            if (!channel.isTextBased()) continue;

            const res = await channel.send({
                embeds,
                components,
            });

            callback(res);
        }
    }
};
