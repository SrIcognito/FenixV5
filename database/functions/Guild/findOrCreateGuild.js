const Guild = require("../../../schemas/Guild/Guild-Schema");

module.exports = (guildId, lang) => {
    return new Promise((resolve, reject) => {
        Guild.findOne({ guildId: guildId }, async (err, guild) => {
            if (guild) {
                return resolve(guild);
            } else {
                let guildDB = new Guild({ guildId, lang });
                await guildDB.save();
                return resolve(guildDB);
            }
        });
    });
};