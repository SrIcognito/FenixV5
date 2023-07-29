const mongoose = require("mongoose");

const Bot = new mongoose.Schema({
    clientId: {
        type: String,
        required: true,
        unique: true
    },
    maintenance: {
        status: {
            type: Boolean,
            required: false,
            default: false
        },
        length: {
            type: Date,
            required: false,
            default: ""
        },
    }
});

module.exports = mongoose.model("Bot", Bot);
