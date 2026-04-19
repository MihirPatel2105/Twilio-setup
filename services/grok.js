const { GoogleGenerativeAI } = require("@google/generative-ai");

const speechToText = async (buffer) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-1.5-flash which has multimodal capabilities including audio
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const audioPart = {
            inlineData: {
                // Convert audio buffer to base64 for Gemini
                data: buffer.toString("base64"),
                mimeType: "audio/wav"
            }
        };

        const prompt = "Please explicitly transcribe the provided audio accurately. Supply ONLY the transcription text output.";
        const result = await model.generateContent([prompt, audioPart]);
        
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Transcription failed";
    }
};

module.exports = speechToText;