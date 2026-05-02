import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaTrash, FaEdit, FaPlus, FaUsers, FaTicketAlt, FaRupeeSign } from 'react-icons/fa';
import Modal from '../components/Modal';
import { createPaymentOrder, initiatePayment } from '../utils/razorpay';

const Events = () => {
    const [events, setEvents] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        imageUrl: '',
        ticketPrice: 0,
        maxAttendees: ''
    });
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                setEvents(events.filter(e => e._id !== id));
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event');
            }
        }
    };

    const openCreateModal = () => {
        setCurrentEvent(null);
        setFormData({
            title: '',
            description: '',
            location: '',
            date: '',
            imageUrl: '',
            ticketPrice: 0,
            maxAttendees: ''
        });
        setModalMode('create');
        setIsModalOpen(true);
    };

    const openEditModal = (event) => {
        setCurrentEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            location: event.location,
            date: new Date(event.date).toISOString().split('T')[0],
            imageUrl: event.imageUrl || '',
            ticketPrice: event.ticketPrice || 0,
            maxAttendees: event.maxAttendees || ''
        });
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                ticketPrice: Number(formData.ticketPrice),
                maxAttendees: formData.maxAttendees ? Number(formData.maxAttendees) : null
            };

            if (modalMode === 'create') {
                const { data } = await api.post('/events', submitData);
                setEvents([...events, data]);
                alert('Event created successfully!');
            } else {
                const { data } = await api.put(`/events/${currentEvent._id}`, submitData);
                setEvents(events.map(e => e._id === currentEvent._id ? data : e));
                alert('Event updated successfully!');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving event:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save event';
            alert(errorMessage);
        }
    };

    const handleRegister = async (event) => {
        if (!user) {
            alert('Please login to register for events');
            return;
        }

        if (event.isPaid && event.ticketPrice > 0) {
            handlePaidRegistration(event);
        } else {
            handleFreeRegistration(event._id);
        }
    };

    const handleFreeRegistration = async (eventId) => {
        try {
            const { data } = await api.post(`/events/${eventId}/register`);
            setEvents(events.map(e => e._id === eventId ? data : e));
            alert('Successfully registered for event!');
        } catch (error) {
            console.error('Error registering for event:', error);
            alert(error.response?.data?.message || 'Failed to register for event');
        }
    };

    const handlePaidRegistration = (event) => {
        navigate(`/payment/${event._id}`);
    };

    const handleUnregister = async (eventId) => {
        try {
            const { data } = await api.delete(`/events/${eventId}/register`);
            setEvents(events.map(e => e._id === eventId ? data : e));
            alert('Successfully unregistered from event');
        } catch (error) {
            console.error('Error unregistering from event:', error);
            alert('Failed to unregister from event');
        }
    };

    const canManage = user?.role === 'admin' || user?.role === 'attraction_manager';

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Upcoming Events</h1>
                {canManage && (
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 flex items-center gap-2"
                    >
                        <FaPlus /> Add Event
                    </button>
                )}
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event, index) => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card-modern group hover:scale-[1.02] relative p-0 overflow-hidden"
                    >
                        {event.isPaid && (
                            <div className="absolute top-3 left-3 glass-strong px-3 py-1.5 rounded-xl text-sm font-bold z-10 flex items-center gap-1 shadow-glow text-white">
                                <FaTicketAlt /> Paid Event
                            </div>
                        )}
                        {event.imageUrl && (
                            <div className="h-48 overflow-hidden">
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex items-center text-cyan-500 mb-2 font-bold">
                                <FaCalendarAlt className="mr-2" />
                                {new Date(event.date).toLocaleDateString()}
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-2 line-clamp-1">{event.title}</h2>
                            <div className="flex items-center text-secondary mb-4 text-sm">
                                <FaMapMarkerAlt className="mr-1 text-red-500" />
                                {event.location}
                            </div>
                            <p className="text-muted mb-4 line-clamp-2">{event.description}</p>

                            {/* Ticket Price Display */}
                            {event.isPaid && (
                                <div className="flex items-center text-green-500 mb-3 font-bold text-lg">
                                    <FaRupeeSign className="mr-1" />
                                    {event.ticketPrice} per ticket
                                </div>
                            )}

                            <div className="flex items-center text-secondary mb-4 text-sm">
                                <FaUsers className="mr-2 text-cyan-500" />
                                {event.attendees?.length || 0}
                                {event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attendees
                            </div>

                            <div className="flex space-x-2">
                                {user && !canManage && (
                                    event.attendees?.some(attendeeId => attendeeId === user._id) ? (
                                        <button
                                            onClick={() => handleUnregister(event._id)}
                                            className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold py-2 rounded-lg transition-all"
                                        >
                                            Unregister
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleRegister(event)}
                                            disabled={isProcessingPayment || (event.maxAttendees && event.attendees?.length >= event.maxAttendees)}
                                            className={`flex-1 ${event.maxAttendees && event.attendees?.length >= event.maxAttendees
                                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                                : event.isPaid
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                                                } text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2`}
                                        >
                                            {isProcessingPayment ? (
                                                'Processing...'
                                            ) : event.maxAttendees && event.attendees?.length >= event.maxAttendees ? (
                                                'Event Full'
                                            ) : event.isPaid ? (
                                                <>
                                                    <FaRupeeSign /> Buy Ticket
                                                </>
                                            ) : (
                                                'Register Now'
                                            )}
                                        </button>
                                    )
                                )}
                                {!user && (
                                    <button
                                        disabled
                                        className="flex-1 bg-gray-500 text-gray-200 font-bold py-2 rounded-lg cursor-not-allowed"
                                    >
                                        Login to Register
                                    </button>
                                )}
                                {canManage && (
                                    <>
                                        <button
                                            onClick={() => openEditModal(event)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Add New Event' : 'Edit Event'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-secondary mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input-modern"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="input-modern"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="input-modern"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-modern h-24"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-secondary mb-1">Ticket Price (₹)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.ticketPrice}
                                onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                                className="input-modern"
                                placeholder="0 for free event"
                            />
                        </div>
                        <div>
                            <label className="block text-secondary mb-1">Max Attendees</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxAttendees}
                                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                                className="input-modern"
                                placeholder="Leave empty for unlimited"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Image URL</label>
                        <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="input-modern"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                        {modalMode === 'create' ? 'Create Event' : 'Update Event'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Events;
