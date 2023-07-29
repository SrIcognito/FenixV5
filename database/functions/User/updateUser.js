const User = require("../../../schemas/User/User-Schema");

module.exports = (userId, property, value) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ userId: userId }, { [property]: value }, { upsert: true }, (err) => {
            if (err) {
                return reject("Could not update User");
            } else {
                return resolve("User Updated");
            }
        });
    });
};