require('dotenv').config();

async function testOpenRouter() {
    console.log("Testing OpenRouter API...");
    const key = process.env.OPENROUTER_API_KEY;

    if (!key) {
        console.error("No API Key found.");
        return;
    }

    try {
        // Dynamic import for ESM package
        const { OpenRouter } = await import("@openrouter/sdk");

        const openrouter = new OpenRouter({
            apiKey: key
        });

        console.log("OpenRouter instance created.");
        console.log("Sending request...");

        // Use chat.send with stream: false for non-streaming response
        const completion = await openrouter.chat.send({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                {
                    role: "user",
                    content: "Say hello in one word"
                }
            ],
            stream: false
        });

        console.log("Full response:", JSON.stringify(completion, null, 2));

        if (completion.choices && completion.choices[0]) {
            console.log("Message content:", completion.choices[0].message.content);
        }

    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

testOpenRouter();
