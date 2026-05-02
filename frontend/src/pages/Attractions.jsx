import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaTrash, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import Modal from '../components/Modal';

// Standard Card Component (Matching Landing Page)
const AttractionCard = ({ place, index, canManage, openEditModal, handleDelete }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-[450px] perspective-1000 group"
            style={{ perspective: '1000px' }}
        >
            <motion.div
                className="relative w-full h-full transition-transform duration-700 preserve-3d"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* FRONT FACE */}
                <div
                    className="absolute w-full h-full backface-hidden card-modern p-0 overflow-hidden flex flex-col border border-gray-200 dark:border-white/10"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="h-56 overflow-hidden relative">
                        <img
                            src={place.imageUrl || 'https://via.placeholder.com/400x300?text=Attraction'}
                            alt={place.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Rating Badge */}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <FaStar className="text-yellow-400" />
                            <span>{place.rating}</span>
                        </div>

                        {/* Admin Actions Overlay */}
                        {canManage && (
                            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(place);
                                    }}
                                    className="bg-blue-500/90 hover:bg-blue-600 text-white p-2 rounded-lg backdrop-blur-sm shadow-lg transition-transform hover:scale-105"
                                    title="Edit"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(place._id);
                                    }}
                                    className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg backdrop-blur-sm shadow-lg transition-transform hover:scale-105"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )}

                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white text-sm line-clamp-1 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-red-400" />
                                {place.location || 'City Center'}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-primary group-hover:text-cyan-500 transition-colors">{place.name}</h3>
                            <span className="text-cyan-500 font-bold text-sm bg-cyan-500/10 px-2 py-1 rounded">
                                {place.entryFee === 0 ? 'Free' : `$${place.entryFee}`}
                            </span>
                        </div>

                        <p className="text-secondary text-sm mb-4 line-clamp-3 flex-1">{place.description}</p>

                        <button
                            onClick={() => setIsFlipped(true)}
                            className="mt-auto block w-full py-3 text-center rounded-xl bg-surface-elevated hover:bg-cyan-500 hover:text-white transition-all duration-300 font-bold text-sm border border-transparent hover:border-cyan-400"
                        >
                            View Details
                        </button>
                    </div>
                </div>

                {/* BACK FACE */}
                <div
                    className="absolute w-full h-full backface-hidden card-modern p-6 overflow-hidden flex flex-col"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h3 className="text-xl font-bold text-primary truncate pr-4">{place.name}</h3>
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="p-2 rounded-full hover:bg-surface-elevated text-secondary hover:text-red-400 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-surface-elevated p-3 rounded-lg text-center">
                                <p className="text-xs text-secondary uppercase tracking-wider mb-1">Fee</p>
                                <p className="font-bold text-cyan-400">{place.entryFee === 0 ? 'Free' : `$${place.entryFee}`}</p>
                            </div>
                            <div className="bg-surface-elevated p-3 rounded-lg text-center">
                                <p className="text-xs text-secondary uppercase tracking-wider mb-1">Rating</p>
                                <div className="flex justify-center items-center gap-1 font-bold text-yellow-400">
                                    <FaStar /> {place.rating}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-red-400" /> Location
                            </h4>
                            <p className="text-sm text-secondary bg-surface-elevated p-3 rounded-lg">
                                {place.location}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-primary mb-2">About</h4>
                            <p className="text-sm text-secondary leading-relaxed">
                                {place.description}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsFlipped(false)}
                        className="mt-4 w-full py-3 text-center rounded-xl bg-surface-elevated hover:bg-cyan-500 hover:text-white transition-all duration-300 font-bold text-sm"
                    >
                        Back to Overview
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Attractions = () => {
    const [attractions, setAttractions] = useState([]);
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAttraction, setCurrentAttraction] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [formData, setFormData] = useState({ name: '', description: '', location: '', imageUrl: '', entryFee: 0 });

    useEffect(() => {
        fetchAttractions();
    }, []);

    const fetchAttractions = async () => {
        try {
            const { data } = await api.get('/attractions');
            setAttractions(data);
        } catch (error) {
            console.error('Error fetching attractions:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this attraction?')) {
            try {
                await api.delete(`/attractions/${id}`);
                setAttractions(attractions.filter(a => a._id !== id));
            } catch (error) {
                console.error('Error deleting attraction:', error);
                alert('Failed to delete attraction');
            }
        }
    };

    const openCreateModal = () => {
        setCurrentAttraction(null);
        setFormData({ name: '', description: '', location: '', imageUrl: '', entryFee: 0 });
        setModalMode('create');
        setIsModalOpen(true);
    };

    const openEditModal = (place) => {
        setCurrentAttraction(place);
        setFormData({
            name: place.name,
            description: place.description,
            location: place.location,
            imageUrl: place.imageUrl || '',
            entryFee: place.entryFee
        });
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                const { data } = await api.post('/attractions', formData);
                setAttractions([...attractions, data]);
                alert('Attraction created successfully!');
            } else {
                const { data } = await api.put(`/attractions/${currentAttraction._id}`, formData);
                setAttractions(attractions.map(a => a._id === currentAttraction._id ? data : a));
                alert('Attraction updated successfully!');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving attraction:', error);
            alert(`Failed to ${modalMode === 'create' ? 'create' : 'update'} attraction`);
        }
    };

    const canManage = user?.role === 'admin' || user?.role === 'attraction_manager' || user?.role === 'event_manager';

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">City Attractions</h1>
                {canManage && (
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                    >
                        <FaPlus /> Add Attraction
                    </button>
                )}
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {attractions.map((place, index) => (
                    <AttractionCard
                        key={place._id}
                        place={place}
                        index={index}
                        canManage={canManage}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                    />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Add New Attraction' : 'Edit Attraction'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-secondary mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-300 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-300 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 h-24 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-300 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-secondary mb-1">Entry Fee</label>
                            <input
                                type="number"
                                value={formData.entryFee}
                                onChange={(e) => setFormData({ ...formData, entryFee: Number(e.target.value) })}
                                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-300 dark:border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-secondary mb-1">Image URL</label>
                            <input
                                type="text"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-300 dark:border-gray-600"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 rounded transition-colors">
                        {modalMode === 'create' ? 'Create Attraction' : 'Update Attraction'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Attractions;
