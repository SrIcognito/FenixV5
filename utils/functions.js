const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const translate = require("@iamtraction/google-translate");
const config = require("../config/config");
const { table } = require("table");
const ms = require("ms");

module.exports = {
  textformat: function (member, text) {
    const terms = [
      { name: "{{member}}", value: `<@${member.id}>` },
      { name: "{{member.tag}}", value: `${member.user.tag}` },
      { name: "{{member.id}}", value: `${member.id}` },
      { name: "{{guild.id}}", value: `${member.guild.id}` },
      { name: "{{guild.name}}", value: `${member.guild.name}` },
      { name: "{{guild.membercount}}", value: `${member.guild.memberCount}` },
    ];

    for (let { name, value } of terms)
      text = text.replace(new RegExp(name, "gi"), value);

    return text;
  },

  progressBar: function (value, maxValue, size) {
  
    let barArray = [];
  
    let fill = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
    let empty = size - fill > 0 ? size - fill : 0;
  
    for (let i = 1; i <= fill; i++) barArray.push(config.emojis.bar.fillBar);
    for (let i = 1; i <= empty; i++) barArray.push(config.emojis.bar.emptyBar);
  
    barArray[0] = barArray[0] == config.emojis.bar.fillBar ? config.emojis.bar.fillStart : config.emojis.bar.emptyStart;
    barArray[barArray.length -1] = barArray[barArray.length -1] == config.emojis.bar.fillBar ? config.emojis.bar.fillEnd : config.emojis.bar.emptyEnd;
  
    return barArray.join(``);
  },

  traduce: async function (text, tolanguage) {
    let traduction = await translate(text, { to: tolanguage });
    return traduction.text;
  },

  capitalizeFirstLetter: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  resume: function (text, number) {
    let str = "";
    if (text.length > number) {
      str += text.substring(0, number);
      str = str.slice(0, number - 6) + "...";
      return str;
    } else {
      str += text;
      return str;
    }
  },

  formatBytes: function (a, b) {
    if (a == 0) return "0 Bytes";
    const c = 1024,
      d = b || 2,
      e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      f = Math.floor(Math.log(a) / Math.log(c));

    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  },

  timelapse: function (string) {
    return Math.floor(string / 1000);
  },

  is_url: function (string) {
    return /(https|http):\/\/[\S]+/gi.test(string) ? true : false;
  },

  is_porn_url: function (string) {
    const prohibitedSites = require("../data/prohibitedSites.json");
    return new RegExp(`\\b(?:${prohibitedSites.pornSites.join("|")})\\b`, "gi").test(string) ? true : false;
  },

  is_swear: function (string) {
    const badwords = require("./badwords.json");
    return new RegExp(`\\b(?:${badwords.join("|")})\\b`, "gi").test(string) ? true : false;
  },

  updatePresence: function (client, status) {
    let num = Math.floor(Math.random() * status.length);
    client.user.setPresence({
      activities: [status[num]]
    })
  },

  logData: function (title, data) {
    const config = {
      border: {
        topBody: `─`,
        topJoin: `┬`,
        topLeft: `┌`,
        topRight: `┐`,

        bottomBody: `─`,
        bottomJoin: `┴`,
        bottomLeft: `└`,
        bottomRight: `┘`,

        bodyLeft: `│`,
        bodyRight: `│`,
        bodyJoin: `│`,

        joinBody: `─`,
        joinLeft: `├`,
        joinRight: `┤`,
        joinJoin: `┼`
      },
      header: {
        alignment: 'center',
        content: title
      }
    };

    console.log(table(data, config))
  },

  chunkify: function (arr, len) {
    let chunks = [];
    let i = 0;
    let n = arr.length;

    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }

    return chunks;
  },

  pagination: async function (interaction, pages, { timeout = 120000, editReply = false, followUp = false }) {
    let page = 0;

    const { guild, member } = interaction;

    const button0 = new MessageButton()
      .setCustomId("previousdownbtn")
      .setEmoji("885863969405943828")
      .setStyle("SECONDARY");

    const button1 = new MessageButton()
      .setCustomId("previousbtn")
      .setEmoji("926996570610761758")
      .setStyle("PRIMARY");

    const button2 = new MessageButton()
      .setCustomId("nextbtn")
      .setEmoji("900054705961574511")
      .setStyle("PRIMARY");

    const button3 = new MessageButton()
      .setCustomId("nextupbtn")
      .setEmoji("885864040826540032")
      .setStyle("SECONDARY");

    const buttonList = [button0, button1, button2, button3];

    const row = new MessageActionRow().addComponents(buttonList);

    const disabledRow = new MessageActionRow().addComponents(
      buttonList[0].setDisabled(true),
      buttonList[1].setDisabled(true),
      buttonList[2].setDisabled(false),
      buttonList[3].setDisabled(false)
    );

    const changeFooter = () => {
      const embed = pages[page];
      const newEmbed = new MessageEmbed(embed);

      if (embed?.footer?.text) {
        if (embed?.footer?.iconURL) {
          return newEmbed.setFooter({ text: `${embed.footer.text} - Pagina ${page + 1}/${pages.length}`, iconURL: embed.footer.iconURL });
        } else {
          return newEmbed.setFooter({ text: `${embed.footer.text} - Pagina ${page + 1}/${pages.length}`, iconURL: config.emojis.warn });
        }
      } else if (embed?.footer?.iconURL) {
        return newEmbed.setFooter({ text: `Pagina ${page + 1}/${pages.length}`, iconURL: embed.footer.iconURL });
      } else {
        return newEmbed.setFooter({ text: `Pagina ${page + 1}/${pages.length}`, iconURL: config.emojis.warn });
      }
    };

    let curPage;

    if (followUp) {
      curPage = await interaction.followUp({ embeds: [changeFooter()], components: [disabledRow], fetchReply: true });
    } else if (editReply) {
      curPage = await interaction.editReply({ embeds: [changeFooter()], components: [disabledRow], fetchReply: true });
    } else if (!editReply && !FollowUp) {
      curPage = await interaction.reply({ embeds: [changeFooter()], components: [disabledRow], fetchReply: true });
    }

    const filter = (i) => i.customId === buttonList[0].customId || i.customId === buttonList[1].customId || i.customId === buttonList[2].customId || i.customId === buttonList[3].customId && i.user.id === member.user.id;

    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on("collect", async (i) => {
      if (i.customId === buttonList[0].customId) {
        await i.deferUpdate();
        page = 0;
      } else if (i.customId === buttonList[1].customId) {
        await i.deferUpdate();
        page = page - 1;
      } else if (i.customId === buttonList[2].customId) {
        await i.deferUpdate();
        page = page + 1;
      } else if (i.customId === buttonList[3].customId) {
        await i.deferUpdate();
        page = pages.length - 1;
      }

      if (page + 1 >= pages.length) {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(false),
          buttonList[1].setDisabled(false),
          buttonList[2].setDisabled(true),
          buttonList[3].setDisabled(true)
        );

        return await i.editReply({ embeds: [changeFooter()], components: [disabledRow] });
      } else if (page <= 0) {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true),
          buttonList[2].setDisabled(false),
          buttonList[3].setDisabled(false)
        );

        return await i.editReply({ embeds: [changeFooter()], components: [disabledRow] });
      }

      await i.editReply({ embeds: [changeFooter()], components: [row] });

      collector.resetTimer();
    });

    collector.on("end", () => {
      const disabledRow = new MessageActionRow().addComponents(
        buttonList[0].setDisabled(true),
        buttonList[1].setDisabled(true),
        buttonList[2].setDisabled(true),
        buttonList[3].setDisabled(true)
      );

      curPage.edit({ embeds: [changeFooter()], components: [disabledRow] }).catch(async (err) => { })
    });

    return curPage;
  }
};
