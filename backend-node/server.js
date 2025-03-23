const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Enable CORS so frontend can connect
app.use(cors({
    origin: "https://brilliant-toffee-2f8b07.netlify.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(express.json());

// ✅ Load Google Gemini API key
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error('❌ Missing Google API Key!');
    process.exit(1);
}

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });  // latest fast Gemini model

// ✅ API Route to chat with Gemini
app.post('/chat', async (req, res) => {
    try {
        console.log("🔹 Received request:", req.body);

        const { message, summarize = true } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });

        const prompt = summarize
            ? `Provide a short and clear response: ${message}`
            : message;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { max_output_tokens: 150 }
        });

        let responseText = "Sorry, I couldn't generate a response.";
        if (result && result.response &&
            Array.isArray(result.response.candidates) &&
            result.response.candidates[0] &&
            result.response.candidates[0].content &&
            Array.isArray(result.response.candidates[0].content.parts) &&
            result.response.candidates[0].content.parts[0] &&
            result.response.candidates[0].content.parts[0].text) {

            responseText = result.response.candidates[0].content.parts[0].text;
        }

        console.log("✅ Gemini AI Response:", responseText);

        res.setHeader("Access-Control-Allow-Origin", "https://brilliant-toffee-2f8b07.netlify.app");
        res.setHeader("Access-Control-Allow-Credentials", 'true');
        res.json({ response: responseText });

    } catch (error) {
        console.error("❌ Chatbot Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
