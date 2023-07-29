const User = require("../../../schemas/User/User-Schema");

module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        User.findOne({ userId: userId }, async (err, user) => {
            if (user) {
                return resolve(user);
            } else {
                let UserDB = new User({ userId });
                await UserDB.save();
                return resolve(UserDB);
            }
        });
    });
};