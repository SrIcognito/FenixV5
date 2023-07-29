const User = require("../../../schemas/User/User-Schema");

module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        User.findOne({ userId: userId }).deleteOne(async (err, user) => {
            if (err) {
                return reject("Could not delete User");
            } else {
                return resolve("User Deleted");
            }
        });
    });
};