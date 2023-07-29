const mongoose = require("mongoose");
const shortid = require("shortid");

const Codes = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: shortid.generate,
    },
    claimed: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        userId: {
            type: String,
            required: false,
            default: ""
        },
    },
    length_premium: {
        type: Date,
        required: false,
        default: ""
    },
    length_code: {
        type: Number,
        required: false,
        default: ""
    },
    creation: {
        type: Number,
        required: true,
        default: ""
    },
});

module.exports = mongoose.model("Codes", Codes);
