const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { capitalizeFirstLetter } = require('../../../utils/functions');
const CommandSchema = require('../../../schemas/Bot/Commands-Schema');
const BotSchema = require('../../../schemas/Bot/Bot-Schema');
const ms = require('ms');

module.exports = {
    name: 'maintenance',
    category: 'Administrator',
    description: 'Put a command or to the bot in maintenance.',
    type: 'CHAT_INPUT',
    authorPermission: ['ADMINISTRATOR'],
    cooldown: 5000,
    guild: true,
    options: [{
        name: 'command',
        description: 'Put a command in maintenance or not.',
        type: 'SUB_COMMAND',
        options: [{
            type: 'STRING',
            name: 'name',
            description: 'The command name?',
            required: true
        },
        {
            type: 'STRING',
            name: 'status',
            description: 'Status of maintenance.',
            required: true,
            choices: [{
                name: 'Maintenance On',
                value: "true"
            },
            {
                name: 'Maintenance Off',
                value: "false"
            }]
        },
        {
            type: 'STRING',
            name: 'time',
            description: 'Duration of maintenance, for example: [10w/10d/10h/10m/10s]',
            required: false,
        }]
    },
    {
        name: 'bot',
        description: 'Put a bot in maintenance or not.',
        type: 'SUB_COMMAND',
        options: [{
            type: 'STRING',
            name: 'status',
            description: 'Status of maintenance.',
            required: true,
            choices: [{
                name: 'Maintenance On',
                value: "true"
            },
            {
                name: 'Maintenance Off',
                value: "false"
            }]
            },
            {
                type: 'STRING',
                name: 'time',
                description: 'Duration of maintenance, for example: [10w/10d/10h/10m/10s]',
                required: false,
            }],
        }],
    run: async (client, interaction, args) => {
        const { guild, member } = interaction

        const GuildDB = await client.getGuild(guild.id);

        const subCommand = interaction.options.getSubcommand();
        const CommandName = interaction.options.getString('name');
        let Status = interaction.options.getString('status');
        let Duration = interaction.options.getString('time');

        if (Status === "true") Status === true;
        if (Status === "false") Status === false;

        if (Duration) {
            const msRegex = RegExp(/([0-9](w|d|h|m|s))/);
            const allRegex = RegExp(/((a|b|c|e|f|g|i|j|k|l|n|o|p|q|r|t|u|v|x|y|z))/);
            const msallRegex = RegExp(/(dd|ds|dm|dh|dw|sd|ss|sm|sh|sw|md|ms|mm|mh|mw|hd|hs|hm|hh|hw|wd|ws|wm|wh|ww)/);

            if (!msRegex.test(Duration) || allRegex.test(Duration) || msallRegex.test(Duration) || !msRegex.test(Duration) && allRegex.test(Duration) || !msRegex.test(Duration) && msallRegex.test(Duration) || Duration.startsWith('0')) {
                return interaction.reply({ content: `El Tiempo dado es invalido, sigue los ejemplos.`, ephemeral: true });
            }

            Duration = Date.now() + ms(Duration)
        }

        if (subCommand === "command") {
            const Command = await client.globalcommands.get(CommandName.toLowerCase());

            if (!Command) {
                let Error = new client.Embed({
                    title: "Oops! Ese comando no existe!",
                    description: `El comando **${capitalizeFirstLetter(CommandName)}** no se encuentra en mi base de datos!`,
                    color: 'error'
                });

                return interaction.reply({ embeds: [Error] })
            }

            await CommandSchema.findOneAndUpdate({ name: CommandName.toLowerCase() }, { maintenance: { status: Status, length: Duration ? Duration : null }}).then(() => {
                let Success = new client.Embed({
                    title: "Hey! He actualizado el comando!",
                    description: Status === "true" ? `El comando **${capitalizeFirstLetter(CommandName)}** ahora se encuentra en Mantenimiento!` : `El comando **${capitalizeFirstLetter(CommandName)}** ahora no encuentra en Mantenimiento!`,
                    color: 'success'
                });

                return interaction.reply({ embeds: [Success] })
            });
        } else if (subCommand === "bot") {
            await BotSchema.findOneAndUpdate({ clientId: client.user.id }, { maintenance: { status: Status, length: Duration ? Duration : null }}).then(() => {
                let Success = new client.Embed({
                    title: "Hey! Me he actualizado!",
                    description: Status === "true" ? `**${client.user.username}** ahora se encuentra en Mantenimiento!` : `**${client.user.username}** ahora no se encuentra en Mantenimiento!`,
                    color: 'success'
                });

                return interaction.reply({ embeds: [Success] })
            });
        }
    }
}