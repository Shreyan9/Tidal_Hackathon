import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Enable CORS for frontend connection
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(express.json());

// ✅ Initialize Google Gemini AI
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error('❌ Missing Google API Key!');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });  // ✅ Use latest Gemini model

// ✅ Chat API Route
app.post('/chat', async (req, res) => {
    try {
        console.log("🔹 Received request:", req.body);

        const { message, summarize = true } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });

        // ✅ Modify prompt to encourage concise responses
        const prompt = summarize
            ? `Provide a short and clear response: ${message}`
            : message;

        // ✅ Set max tokens to prevent long responses
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { max_output_tokens: 150 } // ✅ Control response length
        });

        if (!result || !result.response || !result.response.candidates) {
            throw new Error("Invalid response from Gemini AI");
        }

        const responseText = result.response.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response.";

        console.log("✅ Gemini AI Response:", responseText);

        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.json({ response: responseText });

    } catch (error) {
        console.error("❌ Chatbot Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});