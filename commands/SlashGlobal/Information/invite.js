const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'invite',
    category: 'Information',
    description: '🗒️ Get my invite and follow the Cube!',
    type: 'CHAT_INPUT',
    authorPermission: [],
    botPermission: ["SEND_MESSAGE", "EMBED_LINK"],
    cooldown: 5000,
    options: [],
    run: async (client, interaction, args) => {
        const { guild } = interaction

        const GuildDB = await client.getGuild(guild.id);

        const Invite = new MessageEmbed()
            .setAuthor({ name: client.languages.__({ phrase: 'client.invite.title', locale: GuildDB.language }), iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(client.languages.__({ phrase: 'client.invite.description', locale: GuildDB.language }))
            .setColor(client.colors.default)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setURL(client.config.invites.bot(client))
                    .setEmoji('💌')
                    .setLabel(client.languages.__({ phrase: 'client.buttons.invite', locale: GuildDB.language }))
                    .setStyle('LINK'),
                new MessageButton()
                    .setURL('https://discord.gg/PUweWWYF9n')
                    .setEmoji('📬')
                    .setLabel(client.languages.__({ phrase: 'client.buttons.support', locale: GuildDB.language }))
                    .setStyle('LINK'),
                new MessageButton()
                    .setURL(`https://top.gg/bot/${client.user.id}`)
                    .setEmoji('💀')
                    .setLabel(client.languages.__({ phrase: 'client.buttons.vote', locale: GuildDB.language }))
                    .setStyle('LINK'),
            );

        await interaction.reply({ embeds: [Invite], components: [row] })
    }
}