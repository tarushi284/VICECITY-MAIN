// Simple test to check if OpenRouter SDK can be imported
async function testImport() {
    try {
        console.log('Testing OpenRouter SDK import...');
        const { OpenRouter } = await import("@openrouter/sdk");
        console.log('✅ OpenRouter SDK imported successfully!');
        console.log('OpenRouter class:', typeof OpenRouter);

        // Test initialization
        const openrouter = new OpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY || 'test-key'
        });
        console.log('✅ OpenRouter instance created successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

testImport();
