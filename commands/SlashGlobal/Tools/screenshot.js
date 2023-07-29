const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const puppeteer = require('puppeteer');
const { is_url, is_porn_url } = require('../../../utils/functions');

module.exports = {
    name: 'screenshot',
    category: 'Tools',
    description: '🛠️ Get a screenshot of a web page!',
    type: 'CHAT_INPUT',
    authorPermission: [],
    botPermission: ["SEND_MESSAGE", "EMBED_LINK"],
    cooldown: 5000,
    options: [{
        name: 'url',
        description: 'The URL of the page to take screenshot.',
        type: 'STRING',
        required: true,
    }],
    run: async (client, interaction, args) => {
        const { guild, member, channel } = interaction

        await interaction.deferReply();

        const GuildDB = await client.getGuild(guild.id);

        const url = interaction.options.getString('url');

        if (!is_url(url)) {
            let Error = new client.Embed({
                title: client.languages.__({ phrase: 'command.screenshot.error.title', locale: GuildDB.language }),
                description: client.languages.__({ phrase: 'command.screenshot.error.description', locale: GuildDB.language }),
                color: 'error'
            });

            return interaction.editReply({ embeds: [Error] })
        }

        if (is_porn_url(url) && !channel.nsfw) {
            let Error = new client.Embed({
                title: "Oops! Esta pagina web esta Prohibida!",
                description: "Uhmm, si quieres revisar esa pagina hazlo en un canal **NSFW**.",
                color: 'error'
            });

            return interaction.editReply({ embeds: [Error] })
        }

        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.goto(url);
        
        let screenshot = await page.screenshot(); 
        await browser.close();

        const Attachment = new MessageAttachment(screenshot, `screenshot.png`);

        const Screenshot = new MessageEmbed()   
            .setImage('attachment://screenshot.png')
            .setColor(client.colors.default)
            .setTimestamp()
            .setFooter({ text: client.languages.__({ phrase: 'command.screenshot.footer', locale: GuildDB.language }, { member: member.user.tag }), iconURL: 'https://cdn.discordapp.com/emojis/867777823817465886.webp?size=128&quality=lossless' })

        await interaction.editReply({ embeds: [Screenshot], files: [Attachment] })
    }
}