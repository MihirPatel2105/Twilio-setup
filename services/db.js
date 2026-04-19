const mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
    audio_url: String,
    text: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Call", callSchema);