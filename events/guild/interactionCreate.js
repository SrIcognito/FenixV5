const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const cooldown = require('../../schemas/Commands/cooldown-schema')
const BotSchema = require('../../schemas/Bot/Bot-Schema');
const CommandSchema = require('../../schemas/Bot/Commands-Schema');
const { capitalizeFirstLetter, timelapse } = require('../../utils/functions');

module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        const { guild, commandName, channel } = interaction
        if (!guild) return;

        if (interaction.isCommand() || interaction.isContextMenu()) {
            const args = [];

            const command = client.commands.get(commandName);
            if (!command) return client.logger.error(`[SLASH-COMMANDS] An error has occurred, ${commandName} not exist in the guild ${guild.name} (${guild.id})!`)

            interaction.member = interaction.guild.members.cache.get(interaction.user.id);

            let author = interaction.member.user

            if (!guild.me.permissionsIn(channel).has("SEND_MESSAGES")) return;

            const GuildDB = await client.getGuild(guild.id);
            const User = await client.findOrCreateUser(author.id);
            const BotDB = await BotSchema.findOne({ clientId: client.user.id });
            const CommandDB = await CommandSchema.findOne({ name: commandName });

            // /* G L O B A L - M A I N T E N A N C E */
            // let globalmaintenanceEmbed = new MessageEmbed()
            //     .setAuthor({ name: client.languages.__({ phrase: 'command_execute.maintenance.bot.title', locale: GuildDB.language }), iconURL: client.emotes.error })
            //     .setColor(client.colors.error)
            //     .setDescription(client.languages.__({ phrase: 'command_execute.maintenance.bot.description', locale: GuildDB.language }, { timestamp: timelapse(BotDB.maintenance.length) }))

            // if (BotDB.maintenance.status && !client.config.discord.devID.includes(author.id)) return interaction.reply({ embeds: [globalmaintenanceEmbed], ephemeral: true })

            /* M A I N T E N A N C E */
            if (CommandDB) {
                let maintenanceEmbed = new MessageEmbed()
                    .setAuthor({ name: client.languages.__({ phrase: 'command_execute.maintenance.command.title', locale: GuildDB.language }), iconURL: client.emotes.error })
                    .setColor(client.colors.error)
                    .setDescription(client.languages.__({ phrase: 'command_execute.maintenance.command.description', locale: GuildDB.language }, { command: capitalizeFirstLetter(commandName), timestamp: timelapse(CommandDB.maintenance.length) }))

                if (CommandDB.maintenance.status && !client.config.discord.devID.includes(author.id)) return interaction.reply({ embeds: [maintenanceEmbed], ephemeral: true })
            }

            /* O W N E R */
            let ownerEmbed = new MessageEmbed()
                .setAuthor({ name: client.languages.__({ phrase: 'command_execute.dev.title', locale: GuildDB.language }), iconURL: client.emotes.error })
                .setColor(client.colors.error)
                .setDescription(client.languages.__({ phrase: 'command_execute.dev.description', locale: GuildDB.language }))

            if (command.ownerOnly && !client.config.discord.devID.includes(author.id)) return interaction.reply({ embeds: [ownerEmbed], ephemeral: true })

            // /* B L A C K L I S T */
            // let blackEmbed = new MessageEmbed()
            //     .setAuthor({ name: client.languages.__({ phrase: 'command_execute.blacklisted.title', locale: GuildDB.language }), iconURL: client.emotes.warn })
            //     .setColor(client.colors.warn)
            //     .setDescription(client.languages.__({ phrase: 'command_execute.blacklisted.description', locale: GuildDB.language }))

            // if (User.blacklist.status && !client.config.discord.devID.includes(author.id)) return interaction.reply({ embeds: [blackEmbed], ephemeral: true })

            // /* V I P */
            // let PremiumEmbed = new MessageEmbed()
            //     .setAuthor({ name: client.languages.__({ phrase: 'command_execute.premium.title', locale: GuildDB.language }), iconURL: client.emotes.warn })
            //     .setColor(client.colors.warn)
            //     .setDescription(client.languages.__({ phrase: 'command_execute.premium.description', locale: GuildDB.language }))

            // if (command.Premium && !User.premium.status && !client.config.discord.devID.includes(author.id)) return interaction.reply({ embeds: [PremiumEmbed], ephemeral: true })

            /* P E R M I S S I O N S */
            if (command.botPermission) {
                const Permissions = command.botPermission.filter(x => !interaction.guild.me.permissions.has(x)).map(x => "`" + x + "`")

                let botEmbed = new MessageEmbed()
                    .setAuthor({ name: client.languages.__({ phrase: 'command_execute.permission.bot.title', locale: GuildDB.language }), iconURL: client.emotes.error })
                    .setColor(client.colors.error)

                if (Permissions.length > 1) {
                    botEmbed.setDescription(client.languages.__({ phrase: 'command_execute.permission.bot.description_two', locale: GuildDB.language }, { permissions: Permissions.join(", ") }))
                } else if (Permissions.length === 1) {
                    botEmbed.setDescription(client.languages.__({ phrase: 'command_execute.permission.bot.description_one', locale: GuildDB.language }, { permissions: Permissions.join(", ") }))
                }

                if (Permissions.length > 1 || Permissions.length === 1) return interaction.reply({ embeds: [botEmbed], ephemeral: true });
            }

            if (command.authorPermission) {
                const Permissions = command.authorPermission.filter(x => !interaction.member.permissions.has(x)).map(x => x)

                let userEmbed = new MessageEmbed()
                    .setAuthor({ name: client.languages.__({ phrase: 'command_execute.permission.author.title', locale: GuildDB.language }), iconURL: client.emotes.error })
                    .setColor(client.colors.error)

                if (Permissions.length > 1) {
                    userEmbed.setDescription(client.languages.__({ phrase: 'command_execute.permission.author.description_two', locale: GuildDB.language }, { permissions: Permissions.join(", ") }))
                } else if (Permissions.length === 1) {
                    userEmbed.setDescription(client.languages.__({ phrase: 'command_execute.permission.author.description_one', locale: GuildDB.language }, { permissions: Permissions.join(", ") }))
                }

                if (Permissions.length > 1 || Permissions.length === 1) return interaction.reply({ embeds: [userEmbed], ephemeral: true });
            }

            /* C O M M A N D - O P T I O N S */
            if (interaction.isCommand()) {
                for (let option of interaction.options.data) {
                    if (option.type === "SUB_COMMAND") {
                        if (option.name) args.push(option.name);
                        option.options?.forEach((x) => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }
            }

            /* C O O L D O W N */
            if (command.cooldown && !client.config.discord.devID.includes(author.id)) {
                const cooldownDB = await cooldown.findOne({ guildId: interaction.guild.id, userId: interaction.member.id, cmd: command.name })

                if (cooldownDB) {
                    if (cooldownDB.time && command.cooldown - (Date.now() - cooldownDB.time) > 0) {
                        const current_time = Math.floor(new Date() / 1000)
                        const time_left = Math.floor(current_time + (command.cooldown - (current_time - cooldownDB.time)))
                        const timestamp = Math.floor(time_left / 1000)

                        let cooldownEmbed = new MessageEmbed()
                            .setAuthor({ name: client.languages.__({ phrase: 'command_execute.cooldown.title', locale: GuildDB.language }), iconURL: client.emotes.error })
                            .setColor(client.colors.error)
                            .setDescription(client.languages.__({ phrase: 'command_execute.cooldown.description', locale: GuildDB.language }, { timestamp: timestamp }))

                        interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
                    } else {
                        await cooldown.findOneAndUpdate({ guildId: interaction.guild.id, userId: interaction.member.id, cmd: command.name }, { time: Date.now() });

                        command.run(client, interaction, args);
                    }
                } else {
                    new cooldown({
                        guildId: interaction.guild.id,
                        userId: interaction.member.id,
                        cmd: command.name,
                        time: Date.now(),
                        cooldown: command.cooldown,
                    }).save();

                    command.run(client, interaction, args);
                }
            } else {
                command.run(client, interaction, args);
            }
        }
    }
};