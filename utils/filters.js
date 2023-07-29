const { MessageEmbed, MessageActionRow, MessageButton, Permissions } = require("discord.js");
const config = require("../config/config");
const ms = require("ms");
const { is_url } = require("./functions");

const usersMap = new Map();

function doSanctionEvent(client, guild, GuildDB, message, options = { FilterType, LogEmbed }) {
    if (GuildDB.plugins.moderation.modlogs.enabled) {
        const LogChannel = client.findChannel(guild, String(GuildDB.plugins.moderation.modlogs.channel));

        if (LogChannel) {
            LogChannel.send({ embeds: [options.LogEmbed] })
        }
    }
}

module.exports = {
    antiSpam: async function (client, message) {
        const { guild, member, channel } = message

        const GuildDB = await client.getGuild(guild.id);
        const antiSpam = GuildDB.plugins.moderation.antispam

        let roles = []

        if (antiSpam.ignoreroles) {
            antiSpam.ignoreroles.forEach(role => roles.push(client.findRole(guild, String(role))));
        }

        let channels = []

        if (antiSpam.ignorechannels) {
            antiSpam.ignorechannels.forEach(channel2 => channels.push(client.findChannel(guild, String(channel2))));
        }

        let flag = false

        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || member.user.id === guild.ownerId) flag = true;

        roles.forEach(role => {
            if (member.roles.cache.find(r => r.id === role.id)) flag = true
        });

        channels.forEach(channel2 => {
            if (channel.id === channel2.id) flag = true
        });

        if ((flag === false) && (antiSpam.enabled)) {
            const LIMIT = 5;
            const DIFF = 1000;

            const DUPELIMIT = 5
            const DUPEDIFF = 100000

            const TIME = 30000

            const doMuteEvent = function () {
                channel.messages.fetch({ limit: 10 }).then((messages) => {
                    const botMessages = [];
                    messages.filter(m => m.author.id === message.author.id).forEach(msg => botMessages.push(msg));
                    channel.bulkDelete(botMessages);
                });

                if (member.communicationDisabledUntilTimestamp <= Date.now()) {
                    member.timeout(ms("30s"), "[Anti-Spam]").catch((err) => { if (err) client.logger.error(err); }).then(() => {
                        const DetectSpam = new MessageEmbed()
                            .setAuthor({ name: `Hey! ${member.user.tag} ¡No escribas tan rapido y repitas lo mismo!`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setColor(client.colors.default)

                        channel.send({ embeds: [DetectSpam] })

                        if (GuildDB.plugins.moderation.modlogs.enabled) {
                            const LogChannel = client.findChannel(guild, String(GuildDB.plugins.moderation.modlogs.channel));

                            if (LogChannel) {
                                const LogSpam = new MessageEmbed()
                                    .setColor(client.colors.default)
                                    .setTitle("<:Link:937042903128232067> Se ha detectado un Spamer.\n")
                                    .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
                                    .addField("Usuario:", `\`\`\`${message.author.tag} (${message.author.id})\`\`\``)

                                LogChannel.send({ embeds: [LogSpam] })
                            }
                        }
                    });
                }
            }

            if (usersMap.has(message.author.id)) {
                const userData = usersMap.get(message.author.id);
                const { lastMessage, timer } = userData;
                const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                let msgCount = userData.msgCount;
                let dupeCount = userData.dupeCount;

                if (message.content.toLowerCase() === userData.lastMessage.content.toLowerCase()) {
                    if (difference > DUPEDIFF) {
                        clearTimeout(timer);
                        userData.dupeCount = 1;
                        userData.lastMessage = message;
                        userData.timer = setTimeout(() => { usersMap.delete(message.author.id); }, TIME);
                        usersMap.set(message.author.id, userData);
                    } else {
                        ++dupeCount;
                        if (parseInt(dupeCount) === DUPELIMIT) {
                            doMuteEvent()
                        } else {
                            userData.dupeCount = dupeCount;
                            usersMap.set(message.author.id, userData);
                        }
                    }
                } else {
                    if (difference > DIFF) {
                        clearTimeout(timer);
                        userData.msgCount = 1;
                        userData.lastMessage = message;
                        userData.timer = setTimeout(() => { usersMap.delete(message.author.id); }, TIME);
                        usersMap.set(message.author.id, userData);
                    } else {
                        ++msgCount;
                        if (parseInt(msgCount) === LIMIT) {
                            doMuteEvent()
                        } else {
                            userData.msgCount = msgCount
                            usersMap.set(message.author.id, userData)
                        }
                    }
                }
            } else {
                let fn = setTimeout(() => { usersMap.delete(message.author.id); }, TIME);
                usersMap.set(message.author.id, {
                    msgCount: 1,
                    dupeCount: 1,
                    lastMessage: message,
                    timer: fn
                });
            }
        }
    },

    antiLink: async function (client, message) {
        const { guild, member, channel, content } = message

        const GuildDB = await client.getGuild(guild.id);
        const antiLink = GuildDB.plugins.moderation.antiurl

        let roles = []

        if (antiLink.ignoreroles) {
            antiLink.ignoreroles.forEach(role => roles.push(client.findRole(guild, String(role))));
        }

        let channels = []

        if (antiLink.ignorechannels) {
            antiLink.ignorechannels.forEach(channel2 => channels.push(client.findChannel(guild, String(channel2))));
        }

        let flag = false

        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || member.user.id === guild.ownerId) flag = true;

        roles.forEach(role => {
            if (member.roles.cache.find(r => r.id === role.id)) flag = true
        });

        channels.forEach(channel2 => {
            if (channel.id === channel2.id) flag = true
        });

        if ((flag === false) && (antiLink.enabled)) {
            let isURL = is_url(content);

            const doLinkEvent = function () {
                message.delete()

                const DetectLink = new MessageEmbed()
                    .setAuthor({ name: `Hey! ${member.user.tag} ¡Los links estan prohibidos!`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setColor(client.colors.default)

                channel.send({ embeds: [DetectLink] })

                if (GuildDB.plugins.moderation.modlogs.enabled) {
                    const LogChannel = client.findChannel(guild, String(GuildDB.plugins.moderation.modlogs.channel));

                    if (LogChannel) {
                        const LogLink = new MessageEmbed()
                            .setColor(client.colors.default)
                            .setTitle("<:Link:937042903128232067> Se ha detectado un Link.\n")
                            .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
                            .addField("Usuario:", `\`\`\`${message.author.tag} (${message.author.id})\`\`\``)
                            .addField("Contenido del Mensaje:", `\`\`\`${message.content}\`\`\``)

                        LogChannel.send({ embeds: [LogLink] })
                    }
                }
            }

            if (isURL) {
                doLinkEvent()
            }
        }
    },
}