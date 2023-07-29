const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        premium: {
            status: {
                type: Boolean,
                default: false
            },
            lenght: {
                type: Number,
                default: ""
            },
            get: {
                type: Date,
                default: ""
            }
        },
        blacklist: {
            status: {
                type: Boolean,
                default: false
            },
            reason: {
                type: String,
                default: ""
            },
            lenght: {
                type: Number,
                default: ""
            }
        },
    });

const User = new mongoose.model("User", userSchema);

module.exports = User;