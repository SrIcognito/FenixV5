const { MessageEmbed } = require('discord.js')
const config = require('../config/config')

module.exports = class Embed extends MessageEmbed {
    constructor(opts = {}, data = {}) {

        super(data);

        this.setDescription = this.setDescription;

        let { color = null, iconURL = null } = opts;

        const { title = null, description = null, timestamp = false, footer = null } = opts;

        switch (color?.toLowerCase?.()) {
            case "error":
                color = config.colors.error;
                if (!iconURL) iconURL = config.emojis.error;
                break;
            case "warn":
                color = config.colors.warn;
                if (!iconURL) iconURL = config.emojis.warn;
                break;
            case "success":
                color = config.colors.success;
                if (!iconURL) iconURL = config.emojis.success;
                break;
            default:
                if (!color) color = config.colors.default;
                if (!iconURL) iconURL = "https://cdn.discordapp.com/emojis/924763912992329821.webp?size=128&quality=high";
                break;
        }

        this.setColor(color);
        this.setAuthor({ name: title, iconURL: iconURL });

        if (footer) this.setFooter({ text: footer });
        if (description) this.setDescription(description);
        if (timestamp) this.setTimestamp();
    }
};