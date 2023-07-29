const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

const chalk = require("chalk");
const { logData, timelapse } = require("../utils/functions");

const CommandSchema = require('../schemas/Bot/Commands-Schema');

const GuildCommands = [];
const GlobalCommands = [];

module.exports = async (client) => {
    const data = [[`${chalk.yellow.bold("COMMANDS")}`, `${chalk.yellow.bold("STATUS")}`, `${chalk.yellow.bold("DESCRIPTION OF COMMANDS")}`]]

    const SlashGuild = await globPromise(`${process.cwd()}/commands/SlashGuild/*/*.js`);

    SlashGuild.map(async (value) => {
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

        if (file.authorPermission) {
            file.defaultPermission = false
        }

        client.guildcommands.set(file.name, file);
        client.commands.set(file.name, file);

        await data.push([file.name, `${chalk.green("✔ Loaded")}`, "Command Loaded."])

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;

        GuildCommands.push(file);
    });

    const data2 = [[`${chalk.yellow.bold("COMMANDS")}`, `${chalk.yellow.bold("STATUS")}`, `${chalk.yellow.bold("DESCRIPTION OF COMMANDS")}`]]

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

        await data2.push([file.name, `${chalk.green("✔ Loaded")}`, "Command Loaded."]);

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

    logData(`${chalk.bold("Guild Slash Commands")}`, data);

    logData(`${chalk.bold("Global Slash Commands")}`, data2);

    client.on("ready", async () => {

        // Register for one guild the bot is in
        try {
            client.guilds.cache.forEach(async (guild) => {
                if (guild.id === client.config.discord.server) {
                    const AllCommands = GlobalCommands.concat(GuildCommands);

                    await guild.commands.set(AllCommands).then(async (cmd) => {
                        const fullPermissions = cmd.reduce((accumulator, r) => {
                            let Roles;

                            const command = AllCommands.find((c) => c.name === r.name);
                            const PermissionsCMD = command.authorPermission;
                            if (!PermissionsCMD) Roles = null;
                            if (PermissionsCMD) Roles = guild.roles.cache.filter((a) => a.permissions.has(PermissionsCMD) && !a.managed);

                            if (!Roles || !command.guild) return accumulator;

                            const permissions = Roles.reduce((a, r) => {
                                return [...a, { id: r.id, type: "ROLE", permission: true }];
                            }, []);

                            return [...accumulator, { id: r.id, permissions }];
                        }, []);

                        await guild.commands.permissions.set({ fullPermissions });
                    });
                } else {
                    await guild.commands.set(GlobalCommands);
                }
            });
        } catch (error) {
            client.logger.error(`[SLASH-GUILD] ${error}`);
        }
    });
};

