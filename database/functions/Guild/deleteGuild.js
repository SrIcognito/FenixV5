const Guild = require("../../../schemas/Guild/Guild-Schema");

module.exports = (guildId) => {
    return new Promise((resolve, reject) => {
        Guild.findOne({ guildId: guildId }).deleteOne(async (err, guild) => {
            if (err) {
                return reject("Could not delete guild");
            } else {
                return resolve("Guild Deleted");
            }
        });
    });
};