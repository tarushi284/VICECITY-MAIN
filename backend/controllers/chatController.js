const Chat = require('../models/Chat');

// @desc    Chat with bot
// @route   POST /api/chat
// @access  Public
const chatWithBot = async (req, res) => {
    const { message, userId } = req.body;
    console.log('Chat request received:', message);

    try {
        // Dynamic import for ESM-only package
        const { OpenRouter } = await import("@openrouter/sdk");

        // Initialize OpenRouter API
        const openrouter = new OpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY
        });

        // Context for the AI to act as a Smart City assistant
        const systemPrompt = `
            You are a helpful AI assistant for a Smart City application. 
            Your goal is to assist citizens, admins, and attraction managers with information about the city.
            
            Key Features of the App:
            - Bills: Pay electricity, water, gas bills.
            - Traffic: View real-time traffic alerts.
            - Weather: Check weather and AQI.
            - Reports: Report crimes or infrastructure issues.
            - News: Government schemes and awareness.
            - Attractions: Popular places to visit.
            - Events: Upcoming city events.
            - Emergency Contacts: Police, Ambulance, Fire.

            IMPORTANT: Provide responses in PLAIN TEXT format only. Do NOT use markdown formatting like asterisks (*), 
            bold (**), or bullet points. Use simple line breaks and dashes (-) for lists if needed.
            
            Provide a concise and helpful response. If the query is about specific data (like "what is the weather?"), 
            guide them to the relevant section of the app.
        `;

        const completion = await openrouter.chat.send({
            model: "google/gemma-3-27b-it:free",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message
                }
            ],
            stream: false
        });

        let response = completion.choices[0].message.content;

        // Remove markdown formatting
        response = response
            .replace(/\*\*/g, '')  // Remove bold markers
            .replace(/\*/g, '')    // Remove asterisks
            .replace(/#{1,6}\s/g, '') // Remove heading markers
            .replace(/`/g, '');    // Remove code backticks

        console.log('OpenRouter response:', response);

        // Save chat history
        if (userId) {
            const chat = new Chat({
                user: userId,
                message,
                response,
            });
            await chat.save();
        }

        res.json({ response });
    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ response: "I'm having trouble connecting to my brain right now. Please try again later." });
    }
};

module.exports = { chatWithBot };
