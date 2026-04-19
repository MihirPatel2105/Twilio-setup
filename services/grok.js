const axios = require("axios");

const speechToText = async (buffer) => {
    try {
        const response = await axios.post(
            "https://api.x.ai/grok/speech-to-text",
            buffer,
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
                    "Content-Type": "audio/wav"
                }
            }
        );

        return response.data.text;
    } catch (error) {
        console.error(error);
        return "Transcription failed";
    }
};

module.exports = speechToText;