import makeCommand, { COMMANDS } from "../modules/command";

makeCommand("about", [], async (message) => {
    message.reply(
        `
Beep boop! I'm Cross Ban.

I'm a bot that allows you to ban users across servers.

Get started by setting a server key with \`${process.env.PREFIX}key set <key>\`.

Then send a message in a channel named \`x-ban-log\` with the \`${process.env.PREFIX}ban\` command and ✨ta-da✨! I'll alert other servers with the same key that you've suggested a ban.
    `.trim()
    );
});

const COMMAND_INFO = {
    about: {
        desc: "Get information about the bot.",
        args: [],
    },
    ban: {
        desc: "Ban a user across servers.",
        args: [
            ["user", "Either a plain User ID or a Ping."],
            ["?reason", "Optionally provide a reason for the ban."],
        ],
    },
    key: {
        desc: "Manage your server's key.",
        args: [
            ["set", "Set your server's key."],
            ["view", "Get your server's key."],
            ["generate", "Generate a new random key."],
        ],
    },
    help: { desc: "Get help with a command.", args: [["command", "The command to get help with."]] },
};

makeCommand<{
    command?: string;
}>("help", ["command"], async (message, args) => {
    const command = COMMANDS.find((cmd) => cmd.name === args.command);

    if (!command) {
        return message.reply(
            `
Need a hand? Here's a list of commands:

${COMMANDS.map((cmd) => `- \`${cmd.name}\``).join("\n")}
            `.trim()
        );
    }

    if (!COMMAND_INFO[command.name]) return message.reply(`Oops! I don't have any information about that command.`);

    message.reply(
        `
${command.name} - ${COMMAND_INFO[command.name].desc}

Usage: \`${process.env.PREFIX}${command.name} ${command.args.map((arg) => `<${arg}>`).join(" ")}\`

${COMMAND_INFO[command.name].args.map((arg) => `- \`${arg[0]}\` - ${arg[1]}`).join("\n")}
        `.trim()
    );
});
