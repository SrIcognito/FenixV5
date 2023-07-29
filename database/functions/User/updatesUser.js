const User = require("../../../schemas/User/User-Schema");

module.exports = (userId, data) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ userId: userId }, data, { upsert: true }, (err) => {
            if (err) {
                return reject("Could not update User");
            } else {
                return resolve("User Updated");
            }
        });
    });
};