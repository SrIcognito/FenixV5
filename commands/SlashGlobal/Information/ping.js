const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose')

module.exports = {
    name: 'ping',
    category: 'Information',
    description: '🗒️ Get the ping of Cubed!',
    type: 'CHAT_INPUT',
    authorPermission: [],
    botPermission: ["SEND_MESSAGE", "EMBED_LINK"],
    cooldown: 5000,
    options: [],
    run: async (client, interaction, args) => {
        const { guild } = interaction

        const GuildDB = await client.getGuild(guild.id);

        let circles = {
            green: "<:Good:933379690763276328>",
            yellow: "<:Neutral:933379690914271242>",
            red: "<:Bad:933379690775863446>"
        }

        await interaction.deferReply().then(async () => {
            let apiLatency = client.ws.ping
            let botLatency = interaction.createdTimestamp - new Date()

            const date = Date.now();

            let dbLatency = await new Promise((r, j) => {
                mongoose.connection.db.admin().ping((err, result) => { (err | !result) ? j(err | result) : r(Date.now() - date) })
            });

            const Data = new MessageEmbed()
                .setAuthor({ name: client.languages.__({ phrase: 'client.ping.title', locale: GuildDB.language }), iconURL: "https://cdn.discordapp.com/emojis/933391930916749372.gif?size=128&quality=high" })
                .setFields(
                    { name: `${botLatency <= 200 ? circles.green : botLatency <= 400 ? circles.yellow : circles.red} ${client.languages.__({ phrase: 'client.ping.messages', locale: GuildDB.language })}`, value: "**```js\n" + `${botLatency} ms` + "```**", inline: true },
                    { name: `${dbLatency <= 200 ? circles.green : dbLatency <= 400 ? circles.yellow : circles.red} ${client.languages.__({ phrase: 'client.ping.database', locale: GuildDB.language })}`, value: "**```js\n" + `${dbLatency} ms` + "```**", inline: true },
                    { name: ` ${apiLatency <= 200 ? circles.green : apiLatency <= 400 ? circles.yellow : circles.red} ${client.languages.__({ phrase: 'client.ping.websocket', locale: GuildDB.language })}`, value: "**```js\n" + `${apiLatency} ms` + "```**", inline: true }
                )
                .setColor(client.colors.default)

            await interaction.editReply({ embeds: [Data] });
        });
    }
}