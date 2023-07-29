const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { logData, updatePresence, timelapse } = require("../../utils/functions");
const CommandsSchema = require('../../schemas/Bot/Commands-Schema');
const dashboard = require('../../dashboard/dashboard');

const chalk = require("chalk");
const ms = require('ms');

module.exports = {
	name: 'ready',
	run: async (client) => {
		const data = [
			["LOGGED IN AS", `${chalk.red.bold(client.user.tag)}`, "The bot that I am logged in as."],
			["SERVERS", `${chalk.yellow.bold(client.guilds.cache.size.toLocaleString())}`, "The amount of servers that I am in."],
			["USERS", `${chalk.green.bold(client.users.cache.size.toLocaleString())}`, "The amount of users using my commands."],
			["COMMANDS", `${chalk.blue.bold(client.commands.size.toLocaleString())}`, "Commands Loaded"]
		]

		dashboard(client)
			.then(client.logger.success('Dashboard Loaded.'))
			.catch((err) => client.logger.error(err));

		logData(`${chalk.bold("Client Data")}`, data);

		setInterval(async () => {
			const CommandDB = await CommandsSchema.find();

			for (const Command of CommandDB) {
				let Name = Command.name
				let Time = Command.maintenance.length
				let Status = Command.maintenance.status

				if (Status) {
					if (timelapse(Time) <= timelapse(Date.now())) {
						await CommandSchema.findOneAndUpdate({ name: Name }, { maintenance: { status: false, length: null }});
					}
				}
			}
		}, ms("12h"))
	},
};