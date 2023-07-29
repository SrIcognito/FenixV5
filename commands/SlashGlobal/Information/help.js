const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'help',
  category: 'Information',
  description: '🗒️ Information about me!',
  type: 'CHAT_INPUT',
  authorPermission: [],
  botPermission: ["SEND_MESSAGE", "EMBED_LINK"],
  cooldown: 5000,
  options: [],
  run: async (client, interaction, args) => {
    const { guild, member } = interaction

    const GuildDB = await client.getGuild(guild.id);

    const Help = new MessageEmbed()
      .setAuthor({ name: client.languages.__({ phrase: 'client.help.title', locale: GuildDB.language }) })
      .setDescription(client.languages.__({ phrase: 'client.help.description', locale: GuildDB.language }, { member: member.user.tag, client: client.user.username }))
      .addField(client.languages.__({ phrase: 'client.help.about_me.title', locale: GuildDB.language }), client.languages.__({ phrase: 'client.help.about_me.description', locale: GuildDB.language }, { commands: client.globalcommands.size.toLocaleString() }))
      .addField(client.languages.__({ phrase: 'client.help.report.title', locale: GuildDB.language }), client.languages.__({ phrase: 'client.help.report.description', locale: GuildDB.language }))
      .setImage(client.languages.__({ phrase: 'client.help.banner', locale: GuildDB.language }))
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

    await interaction.reply({ embeds: [Help], components: [row] })
  }
}