const Guild = require("../../../schemas/Guild/Guild-Schema");

module.exports = (guildId, property, value) => {
    return new Promise((resolve, reject) => {
        Guild.findOneAndUpdate({ guildId: guildId }, { [property]: value }, { upsert: true }, (err) => {
            if (err) {
                return reject("Could not update guild");
            } else {
                return resolve("Guild Updated");
            }
        });
    });
};