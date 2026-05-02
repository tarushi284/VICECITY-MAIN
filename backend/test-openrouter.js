require('dotenv').config();

async function testOpenRouterAPI() {
    try {
        console.log('=== Testing OpenRouter API ===\n');

        // Check API key
        console.log('1. Checking API Key...');
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error('❌ No API key found in environment!');
            return;
        }
        console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');

        // Import SDK
        console.log('\n2. Importing OpenRouter SDK...');
        const { OpenRouter } = await import("@openrouter/sdk");
        console.log('✅ SDK imported successfully');

        // Initialize client
        console.log('\n3. Initializing OpenRouter client...');
        const openrouter = new OpenRouter({ apiKey });
        console.log('✅ Client initialized');

        // Make API call
        console.log('\n4. Making API call to OpenRouter...');
        console.log('Model: google/gemini-2.0-flash-exp:free');
        console.log('Message: "Hello, this is a test"');

        const completion = await openrouter.chat.send({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                {
                    role: "user",
                    content: "Hello, this is a test. Please respond with 'Test successful!'"
                }
            ],
            stream: false
        });

        console.log('\n✅ API call successful!');
        console.log('\n=== Response ===');
        console.log('Response:', completion.choices[0].message.content);
        console.log('\n=== Full Response Object ===');
        console.log(JSON.stringify(completion, null, 2));

    } catch (error) {
        console.error('\n❌ Error occurred:');
        console.error('Message:', error.message);
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Response Data:', error.response?.data);
        console.error('\nFull error:', error);
    }
}

testOpenRouterAPI();
