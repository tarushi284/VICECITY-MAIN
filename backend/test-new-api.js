require('dotenv').config();

async function testNewAPIKey() {
    try {
        console.log('=== Testing New Google Gemma 3 27B API ===\n');

        // Check API key
        console.log('1. Checking New API Key...');
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error('❌ No API key found!');
            return;
        }
        console.log('✅ API Key:', apiKey.substring(0, 20) + '...');

        // Import SDK
        console.log('\n2. Importing OpenRouter SDK...');
        const { OpenRouter } = await import("@openrouter/sdk");
        console.log('✅ SDK imported');

        // Initialize
        console.log('\n3. Initializing client...');
        const openrouter = new OpenRouter({ apiKey });
        console.log('✅ Client initialized');

        // Test API call
        console.log('\n4. Testing API call with google/gemma-3-27b-it:free...');

        const completion = await openrouter.chat.send({
            model: "google/gemma-3-27b-it:free",
            messages: [
                {
                    role: "user",
                    content: "Hello! Please respond with 'Chatbot is working perfectly!' to confirm the connection."
                }
            ],
            stream: false
        });

        console.log('\n✅✅✅ SUCCESS! API call completed! ✅✅✅');
        console.log('\n=== Bot Response ===');
        console.log(completion.choices[0].message.content);
        console.log('\n=== Test Complete ===');
        console.log('✅ Chatbot is ready to use!');

    } catch (error) {
        console.error('\n❌ Error occurred:');
        console.error('Message:', error.message);
        console.error('Status:', error.response?.status);
        if (error.response?.status === 429) {
            console.error('⚠️  Rate limit error - API key may still be limited');
        }
    }
}

testNewAPIKey();
