let { MessageEmbed } = require("discord.js");

module.exports = {
    name: "embed",
    description: "Create or edit an embed.",
    category: 'Administration',
    authorPermission: ["ADMINISTRATOR"],
    type: 'CHAT_INPUT',
    cooldown: 5000,
    ownerOnly: false,
    guild: true,
    options: [
        {
            name: "create",
            description: "Create a embed.",
            type: "SUB_COMMAND",
            options: [
                {
                    type: "CHANNEL",
                    name: "channel",
                    channelTypes: ['GUILD_TEXT', 'GUILD_NEWS'],
                    description: "What channel do you want your embed to be in?",
                    required: true
                },

                {
                    type: "STRING",
                    name: "description",
                    description: "What do you want the description to be?",
                    required: true
                },
                {
                    type: "BOOLEAN",
                    name: "timestamp",
                    description: "Do you want a timestamp?",
                    required: true,
                },                
                {
                    type: "STRING",
                    name: "author",
                    description: "What author-title do you want for the embed?",
                    required: false
                },
                {
                    type: "STRING",
                    name: "iconurl",
                    description: "What author-title image do you want for the embed?",
                    required: false
                },
                {
                    type: "STRING",
                    name: "color",
                    description: "What color do you want?",
                    required: false
                },
                {
                    type: "STRING",
                    name: "footer",
                    description: "What do you want the footer to be?",
                    required: false
                },
                {
                    type: "STRING",
                    name: "image",
                    description: "Now you use the image otherwise just leave it",
                    required: false
                },
                {
                    type: "STRING",
                    name: "thumbnail",
                    description: "Now you use the thumbnails otherwise just leave it",
                    required: false
                }
            ]
        },
        {
            name: "edit",
            type: "SUB_COMMAND",
            description: "Edit a Embed",
            options: [
                {
                    name: "url",
                    description: "Url message or share url in message paste here",
                    type: "STRING",
                    required: true
                },
                {
                    type: "STRING",
                    name: "author",
                    description: "What author-title do you want for the embed?",
                    required: false
                },
                {
                    type: "STRING",
                    name: "description",
                    description: "What do you want the description to be?",
                    required: false
                },
                {
                    type: "BOOLEAN",
                    name: "timestamp",
                    description: "Do you want a timestamp?",
                    required: false,
                },

                {
                    type: "STRING",
                    name: "author-image",
                    description: "What author-title image do you want for the embed?",
                    required: false
                },
                {
                    type: "STRING",
                    name: "color",
                    description: "What color do you want?",
                    required: false
                },
                {
                    type: "STRING",
                    name: "footer",
                    description: "What do you want the footer to be?",
                    required: false
                },
                {
                    type: "STRING",
                    name: "image",
                    description: "Now you use the image otherwise just leave it",
                    required: false
                },
                {
                    type: "STRING",
                    name: "thumbnail",
                    description: "Now you use the thumbnails otherwise just leave it",
                    required: false
                }
            ]
        }
    ],
    run: async (client, interaction, args) => {

        // SUBCOMMAND
        const subCommand = interaction.options.getSubcommand();

        // OPTIONS
        const Author = interaction.options.getString("author");
        const IconURL = interaction.options.getString("author-image");
        const Description = interaction.options.getString("description");
        const Color = interaction.options.getString("color") || client.colors.default;
        const Footer = interaction.options.getString("footer");
        const Timestamp = interaction.options.getBoolean("timestamp");
        const Image = interaction.options.getString("image");
        const Thumbnail = interaction.options.getString("thumbnail");

        // CREATE
        const Channel = interaction.options.getChannel("channel");

        // EDIT
        const Url = interaction.options.getString("url");

        if (subCommand === "create") { // CREATE
            const Embed = new MessageEmbed()
                .setAuthor({ name: Author ? Author : "", iconURL: IconURL ? IconURL : "" })
                .setDescription(String(Description).replace(/%;/gi, "\n"))
                .setColor(Color)
                .setThumbnail(Thumbnail ? Thumbnail : "")
                .setImage(Image ? Image : "")
                .setFooter({ text: Footer ? Footer : "" })

            if (Timestamp) Embed.setTimestamp()

            Channel.send({ embeds: [Embed] }).then(async (msg) => {
                const Success = new MessageEmbed().setAuthor({ name: `Embed Enviado Satisfactoriamente.`, url: msg.url, iconURL: client.emotes.success }).setColor(client.colors.success)
                return interaction.reply({ embeds: [Success], ephemeral: true });
            }).catch(async (err) => {
                const Fail = new MessageEmbed().setAuthor({ name: `Ha ocurrido un error, reportelo a mi desarrollador.`, iconURL: client.emotes.error }).setColor(client.colors.error)
                return interaction.reply({ embeds: [Fail], ephemeral: true });
            });
        }

        else if (subCommand === "edit") { // EDIT
            if (!Title && !Description) {
                const Fail = new MessageEmbed().setAuthor({ name: `Debe añadir como mimino el titulo o descripcion.`, iconURL: client.emotes.error }).setColor(client.colors.error)
                return interaction.reply({ embeds: [Fail], ephemeral: true });
            }

            await interaction.guild.channels.cache.get(Url.split("/")[5]).messages.fetch(Url.split("/")[6]).then(async (Message) => {
                const Embed = new MessageEmbed()
                    .setAuthor({ name: Author ? Author : Message.embeds[0].author.name, iconURL: IconURL ? IconURL : Message.embeds[0].author.iconURL })
                    .setDescription(`${String(Description ? Description : Message.embeds[0].description).replace(/%;/gi, "\n")}`)
                    .setColor(Color ? Color : Message.embeds[0].color)
                    .setTimestamp(Timestamp ? new Date() : Message.embeds[0].timestamp)
                    .setFooter({ text: Footer ? Footer : Message.embeds[0].footer.text });

                if (Thumbnail || Message.embeds[0].thumbnail) Embed.setThumbnail(Thumbnail ? Thumbnail : Message.embeds[0].thumbnail);
                if (Image || Message.embeds[0].image) Embed.setImage(Image ? Image : Message.embeds[0].image);

                await Message.edit({ embeds: [Embed] }).then(async (msg) => {
                    const Success = new MessageEmbed().setAuthor({ name: `Embed Enviado Satisfactoriamente.`, url: msg.url, iconURL: client.emotes.success }).setColor(client.colors.success)
                    return interaction.reply({ embeds: [Success], ephemeral: true });
                }).catch(async (err) => {
                    log.error("Catch Message Edit Error", err)
                    const Fail = new MessageEmbed().setAuthor({ name: `Ha ocurrido un error, reportelo a mi desarrollador.`, iconURL: client.emotes.error }).setDescription('No se puede editar la inserción. ¡Intente verificar la URL del mensaje y vuelva a intentarlo!').setColor(client.colors.error)
                    return interaction.reply({ embeds: [Fail], ephemeral: true });
                });
            }).catch(async (err) => {
                log.error("Catch Message Error", err)
                const Fail = new MessageEmbed().setAuthor({ name: `Ha ocurrido un error, reportelo a mi desarrollador.`, iconURL: client.emotes.error }).setDescription('No se puede editar la inserción. ¡Intente verificar la URL del mensaje y vuelva a intentarlo!').setColor(client.colors.error)
                return interaction.reply({ embeds: [Fail], ephemeral: true });
            });
        }
    }
};