const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'guildDelete',
    run: async (client, guild) => {
        client.deleteGuild(guild.id);
        client.logger.console(`I was removed to ${guild.name}. User's ${guild.members.cache.filter(member => !member.user.bot).size.toLocaleString()}.`)
    },
};