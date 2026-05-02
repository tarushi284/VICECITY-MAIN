require('dotenv').config();

async function validateAPIKey() {
    try {
        console.log('=== Validating API Key ===\n');

        const apiKey = process.env.OPENROUTER_API_KEY;
        console.log('API Key from .env:', apiKey);
        console.log('Key length:', apiKey?.length);
        console.log('Key starts with:', apiKey?.substring(0, 15));

        console.log('\n=== Testing with Gemma 3 27B ===');
        const { OpenRouter } = await import("@openrouter/sdk");
        const openrouter = new OpenRouter({ apiKey });

        const completion = await openrouter.chat.send({
            model: "google/gemma-3-27b-it:free",
            messages: [
                {
                    role: "user",
                    content: "Say 'API key is valid' if you can read this."
                }
            ],
            stream: false
        });

        console.log('\n✅ SUCCESS!');
        console.log('Response:', completion.choices[0].message.content);

    } catch (error) {
        console.error('\n❌ ERROR:');
        console.error('Status:', error.response?.status);
        console.error('Message:', error.error?.message || error.message);
        console.error('Code:', error.error?.code);

        if (error.error?.code === 401) {
            console.error('\n⚠️  API KEY IS INVALID OR EXPIRED');
            console.error('Please check:');
            console.error('1. API key is correct');
            console.error('2. API key has not expired');
            console.error('3. Account is active on OpenRouter');
        }
    }
}

validateAPIKey();
