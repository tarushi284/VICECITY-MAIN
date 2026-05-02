import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaAmbulance, FaFireExtinguisher, FaShieldAlt, FaTrash, FaEdit } from 'react-icons/fa';
import Modal from '../components/Modal';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState(null);
    const [formData, setFormData] = useState({ name: '', number: '', type: 'general' });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const { data } = await api.get('/contacts');
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'police': return <FaShieldAlt className="text-blue-500" />;
            case 'ambulance': return <FaAmbulance className="text-red-500" />;
            case 'fire': return <FaFireExtinguisher className="text-orange-500" />;
            default: return <FaPhoneAlt className="text-green-500" />;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await api.delete(`/contacts/${id}`);
                setContacts(contacts.filter(c => c._id !== id));
            } catch (error) {
                console.error('Error deleting contact:', error);
                alert('Failed to delete contact');
            }
        }
    };

    const openEditModal = (contact) => {
        setCurrentContact(contact);
        setFormData({
            name: contact.name,
            number: contact.number,
            type: contact.type
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/contacts/${currentContact._id}`, formData);
            setContacts(contacts.map(c => c._id === currentContact._id ? data : c));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating contact:', error);
            alert('Failed to update contact');
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-8">Emergency Contacts</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {contacts.map((contact, index) => (
                    <motion.div
                        key={contact._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="card-modern rounded-xl p-6 border flex items-center space-x-4 relative group"
                    >
                        <div className="text-4xl bg-surface-elevated p-3 rounded-full shadow-sm">
                            {getIcon(contact.type)}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary capitalize">{contact.name}</h3>
                            <p className="text-secondary capitalize mb-1">{contact.type}</p>
                            <a href={`tel:${contact.number}`} className="text-2xl font-bold text-cyan-500 hover:text-cyan-400">
                                {contact.number}
                            </a>
                        </div>
                        {user?.role === 'admin' && (
                            <div className="flex flex-col space-y-2 ml-2">
                                <button
                                    onClick={() => openEditModal(contact)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors text-xs shadow-md"
                                    title="Edit"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(contact._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors text-xs shadow-md"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Contact">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-secondary mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-modern"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Number</label>
                        <input
                            type="text"
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            className="input-modern"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="input-modern"
                        >
                            <option value="general">General</option>
                            <option value="police">Police</option>
                            <option value="ambulance">Ambulance</option>
                            <option value="fire">Fire</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full btn-primary py-2 rounded transition-colors">
                        Update Contact
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Contacts;
