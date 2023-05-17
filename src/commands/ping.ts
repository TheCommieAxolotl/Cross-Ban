import makeCommand from "../modules/command";

makeCommand("ping", [], async (message) => {
    const reply = await message.reply({
        content: "Pinging...",
        options: {
            fetchReply: true,
        },
    });

    reply.edit({ content: `Pong! Latency is ${reply.createdTimestamp - message.createdTimestamp}ms.` });
});
