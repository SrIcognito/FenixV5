const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { capitalizeFirstLetter } = require('../../../utils/functions');
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: 'wiki',
    category: 'Information',
    description: '🗒️ Get detailed information of a command!',
    type: 'CHAT_INPUT',
    authorPermission: [],
    botPermission: ["SEND_MESSAGE", "EMBED_LINK"],
    cooldown: 5000,
    options: [{
        name: 'command',
        description: 'The name of the command.',
        type: 'STRING',
        required: true,
    }],
    run: async (client, interaction, args) => {
        const { guild, member } = interaction

        const GuildDB = await client.getGuild(guild.id);

        const CommandName = interaction.options.getString('command');

        const Command = await client.globalcommands.get(CommandName.toLowerCase());

        if (!Command) {
            let Error = new client.Embed({
                title: client.languages.__({ phrase: 'client.wikipedia.error.title', locale: GuildDB.language }),
                description: client.languages.__({ phrase: 'client.wikipedia.error.description', locale: GuildDB.language }, { command: capitalizeFirstLetter(CommandName) }),
                color: 'error'
            });

            return interaction.reply({ embeds: [Error] })
        }

        let description = await translate(Command.description, { to: client.languages.__({ phrase: `client.ISO.${GuildDB.language}`, locale: GuildDB.language }) });

        let Options = [];

        Options.push(Command.name)

        for (const Option of Command.options) {
            if (Option.type !== "SUB_COMMAND") {
                if (Option.required === true) {
                    Options.push(`[${capitalizeFirstLetter(Option.name)}]`)
                } else if (Option.required === false) {
                    Options.push(`<${capitalizeFirstLetter(Option.name)}>`)
                }
            } else if (Option.type === "SUB_COMMAND") {
                Options.push(`(${capitalizeFirstLetter(Option.name)})`)
                for (const Sub_Option of Option.options) {
                    if (Sub_Option.required === true) {
                        Options.push(`[${capitalizeFirstLetter(Sub_Option.name)}]`)
                    } else if (Sub_Option.required === false) {
                        Options.push(`<${capitalizeFirstLetter(Sub_Option.name)}>`)
                    }
                }
            }
        }

        const Wikipedia = new MessageEmbed()
            .addField(`${client.languages.__({ phrase: `client.wikipedia.title`, locale: GuildDB.language }, { command: capitalizeFirstLetter(Command.name) })}`, `\u200b
                ${client.languages.__({ phrase: `client.wikipedia.name`, locale: GuildDB.language }, { command: Command.name })}
                ${client.languages.__({ phrase: `client.wikipedia.category`, locale: GuildDB.language }, { category: client.languages.__({ phrase: `client.commands.category.list.${Command.category.toLowerCase()}`, locale: GuildDB.language }) })}
                ${client.languages.__({ phrase: `client.wikipedia.description`, locale: GuildDB.language }, { description: description.text })} 
                ${client.languages.__({ phrase: `client.wikipedia.use`, locale: GuildDB.language }, { use: Options.join(' ') })}`)
            .setColor(client.colors.default)
            .setTimestamp()
            .setFooter({ text: client.languages.__({ phrase: `client.wikipedia.footer`, locale: GuildDB.language }, { member: member.user.tag }), iconURL: 'https://cdn.discordapp.com/emojis/933114867974549554.webp?size=128&quality=high' })

        await interaction.reply({ embeds: [Wikipedia] })
    }
}