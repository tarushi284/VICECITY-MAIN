import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaRupeeSign, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { createPaymentOrder, initiatePayment } from '../utils/razorpay';

const Payment = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${eventId}`);
                setEvent(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError(err.response?.data?.message || 'Failed to load event details');
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    const handlePayment = async () => {
        if (!user) {
            alert('Please login to proceed with payment');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const orderData = await createPaymentOrder(event._id);

            initiatePayment(
                orderData,
                user,
                (verificationResult) => {
                    setIsProcessing(false);
                    setPaymentSuccess(true);
                    // Automatically redirect after short delay
                    setTimeout(() => {
                        navigate('/events');
                    }, 3000);
                },
                (error) => {
                    setIsProcessing(false);
                    console.error('Payment failed:', error);
                    setError(error.message || 'Payment failed. Please try again.');
                }
            );
        } catch (err) {
            setIsProcessing(false);
            console.error('Error initiating payment:', err);
            setError(err.response?.data?.message || 'Failed to initiate payment');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
                <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Error Loading Event</h2>
                <p className="text-secondary mb-6">{error}</p>
                <button
                    onClick={() => navigate('/events')}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                    <FaArrowLeft /> Back to Events
                </button>
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500/20 p-6 rounded-full mb-6"
                >
                    <FaCheckCircle className="text-green-500 text-6xl" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-secondary mb-6 text-lg">You have successfully registered for {event?.title}</p>
                <p className="text-sm text-gray-400">Redirecting to events...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/events')}
                className="flex items-center gap-2 text-secondary hover:text-white transition-colors mb-8"
            >
                <FaArrowLeft /> Back to Events
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-3 gap-8"
            >
                {/* Event Details Column */}
                <div className="md:col-span-2 space-y-6">
                    <div className="card-modern p-0 overflow-hidden">
                        {event.imageUrl && (
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                                <div className="absolute bottom-4 left-6">
                                    <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                                    <div className="flex items-center text-gray-300 text-sm">
                                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex items-center text-cyan-400 mb-4 font-bold text-lg">
                                <FaCalendarAlt className="mr-2" />
                                {new Date(event.date).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">About Event</h3>
                            <p className="text-secondary leading-relaxed mb-6">
                                {event.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Checkout Summary Column */}
                <div className="md:col-span-1">
                    <div className="card-modern p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaTicketAlt className="text-cyan-500" />
                            Order Summary
                        </h3>

                        <div className="space-y-4 mb-6 border-b border-white/10 pb-6">
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Ticket Price</span>
                                <span>₹{event.ticketPrice}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Quantity</span>
                                <span>1</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Taxes & Fees</span>
                                <span>₹0</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-white font-bold text-xl mb-8">
                            <span>Total</span>
                            <span className="flex items-center text-green-400">
                                <FaRupeeSign className="text-sm" />
                                {event.ticketPrice}
                            </span>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                                <FaExclamationCircle />
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] ${isProcessing
                                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-cyan-500/20'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Pay Now
                                </>
                            )}
                        </button>

                        <p className="text-center text-gray-500 text-xs mt-4">
                            Secure payment powered by Razorpay
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Payment;
