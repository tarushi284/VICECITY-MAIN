const axios = require('axios');

async function testChat() {
    try {
        console.log('Testing chat endpoint...');
        const response = await axios.post('http://localhost:5000/api/chat', {
            message: 'What features does this app have?'
        });
        console.log('Success! Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('Full error:', error);
    }
}

testChat();
