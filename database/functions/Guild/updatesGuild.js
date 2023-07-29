const Guild = require("../../../schemas/Guild/Guild-Schema");

module.exports = (guildId, data) => {
    return new Promise((resolve, reject) => {
        Guild.findOneAndUpdate({ guildId: guildId }, data, { upsert: true }, (err) => {
            if (err) {
                return reject("Could not update guild");
            } else {
                return resolve("Guild Updated");
            }
        });
    });
};