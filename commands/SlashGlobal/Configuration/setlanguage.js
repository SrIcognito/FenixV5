module.exports = {
  name: 'setlanguage',
  category: 'Configuration',
  description: '⚙️ Set the language of your Server!',
  type: 'CHAT_INPUT',
  authorPermission: ['MANAGE_MESSAGES'],
  botPermission: ["SEND_MESSAGE", "EMBED_LINK"],
  cooldown: 50000,
  options: [{
    name: 'languages',
    description: 'Choose a language.',
    type: 'STRING',
    required: true,
    choices: [
      {
        name: "English",
        value: "en-US"
      },
      {
        name: "Spanish",
        value: "es-ES"
      }
    ]
  }],
  run: async (client, interaction, args) => {
    const { guild } = interaction

    const GuildDB = await client.getGuild(guild.id);

    const Language = interaction.options.getString('languages');

    if (GuildDB.language === Language) {
      let Error = new client.Embed({
        title: client.languages.__({ phrase: 'command.setlanguage.language_error.title', locale: GuildDB.language }),
        description: client.languages.__({ phrase: 'command.setlanguage.language_error.description', locale: GuildDB.language }, { language: client.languages.__({ phrase: `translations.${Language}`, locale: GuildDB.language }) }),
        color: 'error'
      });

      return await interaction.reply({ embeds: [Error] })
    }

    await client.updateGuild(guild.id, "language", Language).then(async () => {
      let Success = new client.Embed({
        iconURL: "https://cdn.iconscout.com/icon/free/png-256/languages-1891043-1597953.png",
        title: client.languages.__({ phrase: 'command.setlanguage.language_success.title', locale: Language }),
        description: client.languages.__({ phrase: 'command.setlanguage.language_success.description', locale: Language }, { language: client.languages.__({ phrase: `translations.${Language}`, locale: Language }) }),
        color: 'success'
      });

      await interaction.reply({ embeds: [Success] });
    }).catch(error => client.logger.error(error));
  }
}