import z from "zod";

import client from "./client";

import "./commands/";

import { config } from "dotenv";

config();

const env_validator = z.object({
    TOKEN: z.string(),
    PREFIX: z.string(),
    HASH_SECRET: z.string().length(32),
});

env_validator.parse(process.env);

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}! Active on ${client.guilds.cache.size} servers.`);
});

client.login(process.env.TOKEN);
