const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
        guildId: { type: String, required: true, unique: true, },
        language: { type: String, required: true, trim: true, default: "en-US", },
        plugins: {
                welcome: {
                        enabled: {
                                default: false,
                                type: Boolean,
                        },
                        message: {
                                default: "Welcome {mention} to the {server} server!\nYou are our {members_formatted} member",
                                type: String,
                        },
                        image: {
                                default: false,
                                type: Boolean,
                        },
                        user_role: {
                                default: "",
                                type: String,
                        },
                        bot_role: {
                                default: "",
                                type: String,
                        },
                        channel: {
                                default: "",
                                type: String,
                        },
                },
                goodbye: {
                        enabled: {
                                default: false,
                                type: Boolean,
                        },
                        message: {
                                default: "GoodBye {mention}!\nWe are sad to see you go!\nWithout you, we are {members} members",
                                type: String,
                        },
                        image: {
                                default: false,
                                type: Boolean,
                        },
                        channel: {
                                default: "",
                                type: String,
                        },
                },
                leveling: {
                        enabled: {
                                default: false,
                                type: Boolean,
                        },
                        channel: {
                                default: "",
                                type: String,
                        },
                },
                serverlogs: {
                        enabled: {
                                default: false,
                                type: Boolean,
                        },
                        channel: {
                                default: "",
                                type: String,
                        },
                },
                moderation: {
                        modlogs: {
                                enabled: {
                                        default: false,
                                        type: Boolean,
                                },
                                channel: {
                                        default: "",
                                        type: String,
                                },
                        },
                        antispam: {
                                enabled: {
                                        default: false,
                                        type: Boolean,
                                }, 
                                ignorechannels: {
                                        default: [],
                                        type: Array,
                                },
                                ignoreroles: {
                                        default: [],
                                        type: Array,
                                }
                        },
                        antibadwords: {
                                enabled: {
                                        default: false,
                                        type: Boolean,
                                }, 
                                badwordslist: {
                                        default: [],
                                        type: Array,
                                },
                                ignorechannels: {
                                        default: [],
                                        type: Array,
                                },
                                ignoreroles: {
                                        default: [],
                                        type: Array,
                                }
                        },
                        antiurl: {
                                enabled: {
                                        default: false,
                                        type: Boolean,
                                }, 
                                ignorechannels: {
                                        default: [],
                                        type: Array,
                                },
                                ignoreroles: {
                                        default: [],
                                        type: Array,
                                }
                        },
                        antiinvites: {
                                enabled: {
                                        default: false,
                                        type: Boolean,
                                }, 
                                ignorechannels: {
                                        default: [],
                                        type: Array,
                                },
                                ignoreroles: {
                                        default: [],
                                        type: Array,
                                }
                        },
                        antiscamlink: {
                                enabled: {
                                        default: false,
                                        type: Boolean,
                                },
                        }
                }
        },
});

const Guild = new mongoose.model("Guild", guildSchema);

module.exports = Guild;