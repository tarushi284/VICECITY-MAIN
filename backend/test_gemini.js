require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("Testing Gemini API Key...");
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        console.error("No API Key found in .env");
        console.error(error.message);
        if (error.response) {
            console.error("API Response:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini();
