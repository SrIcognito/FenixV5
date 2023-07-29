const User = require("../../../schemas/User/User-Schema");

module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        User.findOne({ userId: userId }, async (err, user) => {
            if (err) {
                return reject("Error finding User");
            } else if (user) {
                return resolve(user);
            } else {
                return reject("No User with User ID " + userId);
            }
        });
    });
};