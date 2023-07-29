const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { antiSpam, antiLink } = require('../../utils/filters');
const { progressBar } = require('../../utils/functions');
const Levels = require('../../utils/leveling');

const roles = [
  {
    level: 5,
    roleid: "936364767512256572"
  },
  {
    level: 6,
    roleid: "934947153590251581"
  }
]

module.exports = {
  name: 'messageCreate',
  run: async (client, message) => {
    const { guild, channel, member } = message

    /* T A G - H E L P */
    if (message.author.bot) return;
    const GuildDB = await client.findOrCreateGuild(guild.id);

    if (message.content === `<@!${client.user.id}>` || message.content === `${client.user.id}`) {
      let helpEmbed = new MessageEmbed()
        .setAuthor({ name: client.languages.__({ phrase: 'client.mention.title', locale: GuildDB.language }), iconURL: "https://cdn.discordapp.com/emojis/924763912992329821.webp?size=128&quality=lossless" })
        .setDescription(client.languages.__({ phrase: 'client.mention.description', locale: GuildDB.language }))
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
            .setEmoji('933837122203418765')
            .setLabel(client.languages.__({ phrase: 'client.buttons.vote', locale: GuildDB.language }))
            .setStyle('LINK'),
        );

      message.reply({ embeds: [helpEmbed], components: [row], allowedMentions: { repliedUser: false } }).then(msg => {
        setTimeout(() => msg.delete().catch(err => client.logger.error(err)), ms('25s'));
      }).catch(err => {
        client.logger.error(err)
      })
    }

    if (message.content === "MexiFollaRoba") {
      const user = await Levels.fetch(message.author.id, guild.id);
      const requiredXp = Levels.xpFor(parseInt(user.level) + 1);

      message.reply({ content: `${user.level} ${progressBar(user.xp, requiredXp, 8)} ${user.xp}/${requiredXp}`, allowedMentions: { repliedUser: false } });
    }

    const user = await Levels.fetch(message.author.id, guild.id);

    // await Levels.deleteUser(message.author.id, guild.id)

    // if (user.lastUpdated !== null && 15000 - (Date.now() - user.lastUpdated) > 0) return;

    const randomAmountOfXp = Math.floor(Math.random() * 999) + 1; // Min 1, Max 30
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

    if (hasLeveledUp) {
      const sendEmbed = await channel.send({ content: `${message.author} Has Subido de nivel, ahora eres nivel **${user.level + 1}**!`, allowedMentions: { repliedUser: false } })
      sendEmbed.react('🥳')
    }

    for (const Data of roles) {
        if (user.level >= Data.level) {
          if (!member.roles.cache.has(Data.roleid)) {
            console.log("a")
            member.roles.add(Data.roleid);
          }
        }
      }
  }
};