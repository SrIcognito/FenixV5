const Guild = require("../../../schemas/Guild/Guild-Schema");

module.exports = (guildId) => {
    return new Promise((resolve, reject) => {
        Guild.findOne({ guildId: guildId }, async (err, guild) => {
            if (err) {
                return reject("Error finding guild");
            } else if (guild) {
                return resolve(guild);
            } else {
                return reject("No guild with guild ID " + guildId);
            }
        });
    });
};