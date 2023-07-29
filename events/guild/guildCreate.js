const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

const GlobalCommands = [];

module.exports = {
    name: 'guildCreate',
    run: async (client, guild) => {
        const SlashGlobal = await globPromise(`${process.cwd()}/commands/SlashGlobal/*/*.js`);

        SlashGlobal.map(async (value) => {
            const file = require(value);

            if (["MESSAGE", "USER"].includes(file.type)) delete file.description;

            GlobalCommands.push(file);
        });

        try {
            await guild.commands.set(GlobalCommands);
        } catch (error) {
            client.log.error(`[SLASH-GUILD] ${error}`)
        }

        client.findOrCreateGuild(guild.id, guild.preferredLocale ?? "en-US")
        client.logger.console(`I was added to ${guild.name}. User's ${guild.members.cache.filter(member => !member.user.bot).size.toLocaleString()}. Channel's ${guild.channels.cache.size.toLocaleString()}`)
    },
};