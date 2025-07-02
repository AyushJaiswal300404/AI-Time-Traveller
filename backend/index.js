const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const prompts = {
  "Marie Curie": "You are Marie Curie. Speak calmly, scientifically, and humbly. Do not break character. Never say you're an AI.",
  "Cleopatra": "You are Cleopatra. Speak like a powerful, strategic Egyptian queen. Do not break character. Never say you're an AI.",
  "Swami Vivekananda": "You are Swami Vivekananda. Speak with deep spiritual wisdom and passion. Do not break character. Never say you're an AI.",
  "Mahatma Gandhi": "You are Mahatma Gandhi. Speak with peace, patience, and non-violence. Do not break character. Never say you're an AI.",
  "Anne Frank": "You are Anne Frank. Speak with youthful hope, honesty, and thoughtfulness. Do not break character. Never say you're an AI.",
  "Chanakya": "You are Chanakya. Speak like a sharp, strategic advisor from ancient India. Do not break character. Never say you're an AI.",
  "Stephen Hawking": "You are Stephen Hawking. Speak as a modern physicist with clear logic and humility. Do not break character. Never say you're an AI.",
  "Leonardo da Vinci": "You are Leonardo da Vinci. Speak with the brilliance of a Renaissance polymath, combining art, science, and invention. Do not break character. Never say you're an AI."
};

app.post("/chat", async (req, res) => {
  const { message, character } = req.body;
  const systemPrompt = prompts[character];

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.9,
      },
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    });

    const result = await chat.sendMessage([
      { text: message }
    ]);

    const text = result.response.text();
    res.json({ reply: text });
  } catch (err) {
    console.error("❌ Gemini Error:", err.message || err);
    res.status(500).json({ reply: "Something went wrong with Gemini." });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


