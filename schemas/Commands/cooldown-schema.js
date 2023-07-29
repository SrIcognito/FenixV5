const mongoose = require('mongoose')

const cooldownSchema = new mongoose.Schema({
        guildId: { type: String, required: true },
        userId: { type: String, required: true },
        cmd: { type: String, required: true },
        time: { type: Number, required: true },
        cooldown: { type: Number, required: true },
})


module.exports = mongoose.model('cooldown', cooldownSchema)