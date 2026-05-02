import { useState, useRef, useEffect, useContext } from 'react';
import { FaPaperPlane, FaTimes, FaMinus } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Smart City assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useContext(AuthContext);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setIsLoading(true);

        try {
            const { data } = await api.post('/chat', {
                message: userMessage,
                userId: user?._id
            });

            setMessages(prev => [...prev, { text: data.response, isBot: true }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                text: "I'm having trouble connecting right now. Please try again later.",
                isBot: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <RiRobot2Fill className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Smart City Assistant</h3>
                                    <span className="text-xs text-cyan-100 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <FaMinus size={12} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50 dark:bg-black/20">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.isBot
                                            ? 'bg-white dark:bg-surface-elevated text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-white/5 shadow-sm'
                                            : 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-surface-elevated p-3 rounded-2xl rounded-tl-none border border-gray-200 dark:border-white/5 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white dark:bg-surface border-t border-gray-200 dark:border-white/5">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-gray-100 dark:bg-black/20 border border-transparent dark:border-white/10 text-gray-900 dark:text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaPaperPlane size={14} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-colors ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500'
                    }`}
            >
                {isOpen ? <FaTimes size={24} /> : <RiRobot2Fill size={28} />}
            </motion.button>
        </div>
    );
};

export default Chatbot;
