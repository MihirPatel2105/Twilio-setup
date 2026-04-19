const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const axios = require("axios");

const VoiceResponse = twilio.twiml.VoiceResponse;

const uploadToCloudinary = require("../services/cloudinary");
const speechToText = require("../services/grok");
const Call = require("../services/db");

// 📌 Step 1: Handle Call
router.post("/voice", (req, res) => {
    const twiml = new VoiceResponse();

    twiml.say("Please speak after the beep.");
    twiml.record({
        maxLength: 30,
        action: "/api/recording",
        method: "POST"
    });

    res.type("text/xml");
    res.send(twiml.toString());
});

// 📌 Step 2: Handle Recording
router.post("/recording", async (req, res) => {
    try {
        const recordingUrl = req.body.RecordingUrl + ".wav";

        // Download audio
        const response = await axios.get(recordingUrl, {
            responseType: "arraybuffer",
            auth: {
                username: process.env.TWILIO_ACCOUNT_SID,
                password: process.env.TWILIO_AUTH_TOKEN
            }
        });

        const buffer = Buffer.from(response.data);

        // Upload to Cloudinary
        const cloudUrl = await uploadToCloudinary(buffer);

        // Speech to Text
        const text = await speechToText(buffer);

        // Save to DB
        await Call.create({
            audio_url: cloudUrl,
            text: text
        });

        res.send("Recording processed successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing recording");
    }
});

module.exports = router;