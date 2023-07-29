const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'legal',
    category: 'Information',
    description: '🗒️ Get information about my Legal part!',
    type: 'CHAT_INPUT',
    authorPermission: [],
    botPermission: ["SEND_MESSAGE", "EMBED_LINK"],
    cooldown: 5000,
    options: [{
        name: 'option',
        description: 'Choose a option.',
        type: 'STRING',
        required: true,
        choices: [
            {
                name: "Privacy Policy",
                value: "privacy"
            }
        ]
    }],
    run: async (client, interaction, args) => {
        const { guild } = interaction

        const GuildDB = await client.getGuild(guild.id);

        const Option = interaction.options.getString('option');

        if (Option === 'privacy') {
            const Privacy = new MessageEmbed()
                .addField(client.languages.__({ phrase: 'client.legal.privacy.point_one.title', locale: GuildDB.language }), client.languages.__({ phrase: 'client.legal.privacy.point_one.description', locale: GuildDB.language }))
                .addField(client.languages.__({ phrase: 'client.legal.privacy.point_two.title', locale: GuildDB.language }), client.languages.__({ phrase: 'client.legal.privacy.point_two.description', locale: GuildDB.language }))
                .addField(client.languages.__({ phrase: 'client.legal.privacy.point_three.title', locale: GuildDB.language }), client.languages.__({ phrase: 'client.legal.privacy.point_three.description', locale: GuildDB.language }))
                .setColor(client.colors.default)

            await interaction.reply({ embeds: [Privacy] })
        }
    }
}