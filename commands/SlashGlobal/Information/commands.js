const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { capitalizeFirstLetter, timelapse } = require('../../../utils/functions');
const CommandSchema = require('../../../schemas/Bot/Commands-Schema');
const fs = require("fs");
const ms = require('ms');

module.exports = {
    name: 'commands',
    category: 'Information',
    description: '🗒️ List of my commands!',
    type: 'CHAT_INPUT',
    authorPermission: [],
    botPermission: ["SEND_MESSAGE", "EMBED_LINK"],
    cooldown: 5000,
    options: [],
    run: async (client, interaction, args) => {
        const { guild, member } = interaction

        let listCommands = [];
        let SelectMenuOptions = [];
        let listCategories = [];
        let newCommands = [];
        let offCommands = [];

        const Emojis = { // Add emoji if created a new category.
            home: {
                id: "934937243968217100",
                emoji: "<a:Home:934937243968217100>"
            },
            remove: {
                id: "935389931415691284",
                emoji: "<:Delete:935389931415691284>"
            },
            configuration: {
                id: "934930726850285608",
                emoji: "<:Configuration:934930726850285608>"
            },
            information: {
                id: "934932237043007548",
                emoji: "<:Information:934932237043007548>"
            },
            moderation: {
                id: "934932237030391929",
                emoji: "<:Moderation:934932237030391929>"
            },
            tools: {
                id: "934932236720037939",
                emoji: "<:Tools:934932236720037939>"
            },
            fun: {
                id: "934932237781176401",
                emoji: "<:Fun:934932237781176401>"
            },
        };

        const GuildDB = await client.getGuild(guild.id);
        const GlobalCommands = await client.globalcommands;

        fs.readdirSync('./commands/SlashGlobal').forEach((Category) => {
            listCategories.push(`${Emojis[Category.toLowerCase()].emoji} **${client.emojistatic.arrowmc} \`\`${client.languages.__({ phrase: `client.commands.category.list.${Category.toLowerCase()}`, locale: GuildDB.language })}\`\`**`);

            SelectMenuOptions.push({
                label: client.languages.__({ phrase: `client.commands.category.list.${Category.toLowerCase()}`, locale: GuildDB.language }),
                value: Category.toLowerCase(),
                emoji: Emojis[Category.toLowerCase()].id,
                description: client.languages.__({ phrase: `client.commands.category.select_option.description`, locale: GuildDB.language }, { category: client.languages.__({ phrase: `client.commands.category.list.${Category.toLowerCase()}`, locale: GuildDB.language }) }),
            });
        });

        let SelectMenu = new MessageActionRow().addComponents([
            new MessageSelectMenu()
                .setCustomId("help-menu")
                .setPlaceholder(client.languages.__({ phrase: `client.commands.category.select_menu.description`, locale: GuildDB.language }))
                .addOptions(SelectMenuOptions),
        ]);

        let Button = new MessageActionRow().addComponents([
            new MessageButton()
                .setCustomId("home")
                .setLabel(client.languages.__({ phrase: `client.commands.category.list.home`, locale: GuildDB.language }))
                .setStyle("PRIMARY")
                .setEmoji(Emojis["home"].id),
            new MessageButton()
                .setCustomId("delete")
                .setLabel(client.languages.__({ phrase: `client.commands.category.list.remove`, locale: GuildDB.language }))
                .setStyle("PRIMARY")
                .setEmoji(Emojis["remove"].id),
        ]);

        const Commands = new MessageEmbed()
            .setTitle(`\🗒️ ${client.languages.__({ phrase: 'client.commands.title', locale: GuildDB.language })}`)
            .setDescription(client.languages.__({ phrase: 'client.commands.description', locale: GuildDB.language }, { member: member.user.tag, client: client.user.username }))
            .addField(client.languages.__({ phrase: 'client.commands.category.select_category.title', locale: GuildDB.language }), `>>> ${listCategories.join('\n')}`, true)
            .setImage(client.languages.__({ phrase: 'client.commands.banner', locale: GuildDB.language }))
            .setColor(client.colors.default)

        const CommandDB = await CommandSchema.find();

        for (const Command of CommandDB) {
            let Name = Command.name
            let Created = Command.created

            if (timelapse(Created) + 172800 > timelapse(Date.now())) {
                let command = client.globalcommands.get(Name)
                newCommands.push(`${Emojis[command.category.toLowerCase()].emoji} **• \`${Name}\`**`);
            }
        }

        if (newCommands.length > 0) {
            Commands.addField(client.languages.__({ phrase: 'client.commands.new_commands', locale: GuildDB.language }), `>>> ${newCommands.join('\n')}`, true)
        }

        Commands.addField(client.languages.__({ phrase: 'client.commands.extra_fact.title', locale: GuildDB.language }), client.languages.__({ phrase: 'client.commands.extra_fact.description', locale: GuildDB.language }))

        const message = await interaction.reply({ embeds: [Commands], components: [SelectMenu, Button], fetchReply: true });

        const collector = await message.createMessageComponentCollector({ time: client.config.discord.filetTime });

        collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                let Error = new client.Embed({
                    title: client.languages.__({ phrase: 'client.collector.error.you_not_are_the_author.title', locale: GuildDB.language }),
                    description: client.languages.__({ phrase: 'client.collector.error.you_not_are_the_author.description', locale: GuildDB.language }),
                    color: 'error'
                });

                return i.reply({ embeds: [Error], ephemeral: true });
            }

            if (i.isButton()) {
                if (i.customId === "home") {
                    await i.deferUpdate().catch((e) => { client.logger.error(e) });
                    message.edit({ embeds: [Commands] }).catch((e) => { client.logger.error(e) });
                } else if (i.customId === "delete") {
                    await i.deferUpdate().catch((e) => { client.logger.error(e) });
                    message.delete().catch((e) => { client.logger.error(e) });
                }
            }

            if (i.isSelectMenu()) {
                if (i.customId === "help-menu") {
                    await i.deferUpdate().catch((e) => { client.logger.error(e) });
                    let [directory] = i.values;

                    if (offCommands.length > 0) offCommands.splice(0, offCommands.length);
                    if (listCommands.length > 0) listCommands.splice(0, listCommands.length);

                    const FilteredCommands = Array.from(GlobalCommands.values()).filter((command) => command.category.toLowerCase() === directory);

                    for (let i = 0; FilteredCommands.length > i; i++) {
                        let Name = FilteredCommands[i].name
                        let Description = FilteredCommands[i].description
                        let Category = FilteredCommands[i].category.toLowerCase()

                        if (Category === directory) {
                            const CommandDB = await CommandSchema.findOne({ name: Name });

                            if (CommandDB.maintenance.status) {
                                offCommands.push(`> **• \`${Name}\`**\n> **↳** <t:${timelapse(CommandDB.maintenance.length)}:R>`);
                            }

                            listCommands.push(`> **\`#${i + 1}\`** ${client.emojistatic.arrowmc} ***\`/${Name}\`***`)
                        }
                    }

                    let List = new MessageEmbed()
                        .setTitle(`\🗒 ${client.languages.__({ phrase: `client.commands.category.list_commands_category.title`, locale: GuildDB.language }, { category: client.languages.__({ phrase: `client.commands.category.list.${directory.toLowerCase()}`, locale: GuildDB.language }) })}`)
                        .setDescription(client.languages.__({ phrase: `client.commands.category.list_commands_category.description`, locale: GuildDB.language }, { category: client.languages.__({ phrase: `client.commands.category.list.${directory.toLowerCase()}`, locale: GuildDB.language }) }))
                        .setColor(client.colors.default)

                    List.addField(client.languages.__({ phrase: `client.commands.category.list_commands_category.title_category`, locale: GuildDB.language }, { category: client.languages.__({ phrase: `client.commands.category.list.${directory.toLowerCase()}`, locale: GuildDB.language }) }), `${listCommands.join("\n")}`, true)

                    if (offCommands.length > 0) {
                        List.addField(client.languages.__({ phrase: 'client.commands.maintenance_commands', locale: GuildDB.language }), `${offCommands.join('\n\n')}`, true)
                    }

                    await message.edit({ embeds: [List] }).catch((e) => { client.logger.error(e) });
                }
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === "time") {
                let Error = new client.Embed({
                    title: client.languages.__({ phrase: 'client.collector.error.time.title', locale: GuildDB.language }),
                    description: client.languages.__({ phrase: 'client.collector.error.time.description', locale: GuildDB.language }),
                    color: 'error'
                });

                return interaction.followUp({ embeds: [Error], ephemeral: true });
            }
        });
    }
}