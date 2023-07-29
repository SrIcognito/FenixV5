const mongoose = require("mongoose");

const Commands = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        default: ""
    },
    created: {
        type: Date,
        required: true,
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
        }
    }
});

module.exports = mongoose.model("Commands", Commands);
