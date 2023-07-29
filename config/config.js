module.exports = {
    emojis: {
        error: 'https://cdn.discordapp.com/emojis/890353306843619358.png?v=1',
        success: 'https://cdn.discordapp.com/emojis/890340119691808788.png?v=1',
        warn: 'https://cdn.discordapp.com/emojis/890338117641465867.png?v=1',
        bar: {
            fillStart: '<a:fillStart:939321920669769728>',
            fillBar: '<a:FillBar:939321928634748968>',
            fillEnd: '<a:fillEnd:939321936754925568>',
            emptyStart: '<:emptyStart:939323038934138940>',
            emptyBar: '<:emptyBar:939323028989440101>',
            emptyEnd: '<:emptyEnd:939323050111946854>'
        },
        static: {
            arrowmc: "<:GreenArrow:947146707957862450>"
        }
    },

    colors: {
        error: '#2f3136',
        warn: '#2f3136',
        success: '#2f3136',
        default: '#2f3136'
    },

    discord: {
        server: "869743013222567977",
        logchannel: "902991865333293157",
        filterTime: 30000,
        token: "OTI5NzE4MDczNTI5ODg0NzEy.GxoC3r.CBYW9BJ0IJ2vy3vHpEyDoIxqhj_RY3GjISFjAM",
        devID: ["417042588969992203"]
    },

    invites: {
        bot: (client) => {
            return client.generateInvite({
                scopes: ["bot", "applications.commands"],
                permissions: "1539142184183",
            });
        },
    },

    mongo: {
        token: "mongodb+srv://fenix:KWXyyRl1KFV4gQmX@fenixdb.fvwao.mongodb.net/firtsdbs?retryWrites=true&w=majority" 
    }, 

    page: {
        id: "929718073529884712", // https://discordapp.com/developers/applications/ID/information
        clientSecret: "mXghmMC3_-t4O_j6WaaLaWjxwhx4tc-A", // https://discordapp.com/developers/applications/ID/information
        domain: "http://localhost",
        port: 8080,
        usingCustomDomain: false
    }
};