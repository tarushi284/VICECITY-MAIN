import { useState, useRef, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';

const Chat = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Smart City Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { user } = useContext(AuthContext);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        try {
            const { data } = await api.post('/chat', { message: input, userId: user?._id });
            const botMessage = { text: data.response, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' }]);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-10 max-w-4xl mx-auto flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
                <FaRobot className="mr-3 text-cyan-400" /> AI Assistant
            </h1>

            <div className="flex-1 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col h-[70vh]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-md px-6 py-3 rounded-2xl text-lg ${msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-gray-900 border-t border-gray-700 flex items-center space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about bills, traffic, events..."
                        className="flex-1 bg-gray-800 text-white rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg"
                    />
                    <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-full transition-colors shadow-lg hover:shadow-cyan-500/50"
                    >
                        <FaPaperPlane size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
