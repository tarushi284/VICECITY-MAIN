const dns = require('dns');

async function testConnectivity() {
    console.log("1. Testing DNS resolution for generativelanguage.googleapis.com...");
    dns.lookup('generativelanguage.googleapis.com', (err, address, family) => {
        if (err) {
            console.error('DNS Lookup Failed:', err);
        } else {
            console.log('DNS Lookup Success:', address);
        }
    });

    console.log("\n2. Testing basic fetch to Google...");
    try {
        const res = await fetch('https://www.google.com');
        console.log('Fetch Google Success:', res.status);
    } catch (error) {
        console.error('Fetch Google Failed:', error.message);
    }

    console.log("\n3. Testing fetch to Gemini API endpoint (expecting 404 or 400, but not fetch failed)...");
    try {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
        console.log('Fetch API Success:', res.status);
        const data = await res.json();
        console.log('API Response Preview:', JSON.stringify(data).substring(0, 100));
    } catch (error) {
        console.error('Fetch API Failed:', error.cause || error.message);
    }
}

testConnectivity();
