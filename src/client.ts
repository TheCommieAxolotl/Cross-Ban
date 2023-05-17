import { ActivityType, Client, Partials } from "discord.js";

export default new Client({
    intents: ["MessageContent", "Guilds", "GuildMessages"],
    presence: {
        activities: [
            {
                name: "You",
                type: ActivityType.Watching,
            },
        ],
        status: "online",
    },
    partials: [Partials.Channel, Partials.Message],
});
