const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

const chalk = require("chalk");
const { logData, timelapse } = require("../utils/functions");

const CommandSchema = require('../schemas/Bot/Commands-Schema');

const GlobalCommands = [];

module.exports = async (client) => {
    const data = [[`${chalk.yellow.bold("COMMANDS")}`, `${chalk.yellow.bold("STATUS")}`, `${chalk.yellow.bold("DESCRIPTION OF COMMANDS")}`]]

    const SlashGlobal = await globPromise(`${process.cwd()}/commands/SlashGlobal/*/*.js`);

    SlashGlobal.map(async (value) => {
        const file = require(value);

        if (!file.name) {
            return data.push([file.replace(".js", ""), `${chalk.red("✘ Error")}`, "Missing a name."]);
        }

        if (!file.description && file.type === "CHAT_INPUT") {
            return data.push([file.name, `${chalk.red("✘ Error")}`, "Missing a description."]);
        }

        if (!file.type) {
            return data.push([file.name, `${chalk.red("✘ Error")}`, "Missing a type. [CHAT_INPUT - MESSAGE - USER]"]);
        }

        if (!file.category) {
            return data.push([file.name, `${chalk.red("✘ Error")}`, "Missing a category."]);
        }

        if (isNaN(file.cooldown)) {
            return data.push([file.name, `${chalk.red("✘ Error")}`, "Cooldown is invalid."]);
        }

        client.globalcommands.set(file.name, file);
        client.commands.set(file.name, file);

        await data.push([file.name, `${chalk.green("✔ Loaded")}`, "Command Loaded."]);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;

        GlobalCommands.push(file);

        const CommandDB = await CommandSchema.findOne({ name: file.name });

        if (!CommandDB) {
            const NewCommand = new CommandSchema({
                name: file.name,
                created: Date.now(),
                maintenance: {
                    status: false,
                    length: ""
                }
            })

            await NewCommand.save().catch(error => client.logger.error(error));
        } else {
            let Name = CommandDB.name
            let Time = CommandDB.maintenance.length
            let Status = CommandDB.maintenance.status

            if (Status) {
                if (timelapse(Time) <= timelapse(Date.now())) {
                    await CommandSchema.findOneAndUpdate({ name: Name }, { maintenance: { status: false, length: null } });
                }
            }
        }
    });

    logData(`${chalk.bold("Global Slash Commands")}`, data);

    client.on("ready", async () => {
        // Register for all the guilds the bot is in
        if (GlobalCommands) {
            try {
                await client.application.commands.set(GlobalCommands);
            } catch (error) {
                client.logger.error(`[SLASH-GLOBAL]`.red, `${error}`)
            }
        }
    });
}
