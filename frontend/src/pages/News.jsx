import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import Modal from '../components/Modal';

const News = () => {
    const [news, setNews] = useState([]);
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [formData, setFormData] = useState({ title: '', content: '', category: 'general', imageUrl: '' });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const { data } = await api.get('/news');
            setNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                await api.delete(`/news/${id}`);
                setNews(news.filter(item => item._id !== id));
            } catch (error) {
                console.error('Error deleting news:', error);
                alert('Failed to delete news');
            }
        }
    };

    const openCreateModal = () => {
        setCurrentNews(null);
        setFormData({ title: '', content: '', category: 'general', imageUrl: '' });
        setModalMode('create');
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setCurrentNews(item);
        setFormData({
            title: item.title,
            content: item.content,
            category: item.category,
            imageUrl: item.imageUrl || ''
        });
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                const { data } = await api.post('/news', formData);
                setNews([data, ...news]);
                alert('News created successfully!');
            } else {
                const { data } = await api.put(`/news/${currentNews._id}`, formData);
                setNews(news.map(n => n._id === currentNews._id ? data : n));
                alert('News updated successfully!');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving news:', error);
            alert(`Failed to ${modalMode === 'create' ? 'create' : 'update'} news`);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-primary">News & Schemes</h1>
                {user?.role === 'admin' && (
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 flex items-center gap-2"
                    >
                        <FaPlus /> Add News
                    </button>
                )}
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                {news.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card-modern group hover:scale-[1.02] p-0 overflow-hidden"
                    >
                        {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.category === 'scheme' ? 'bg-purple-900/20 text-purple-500 border border-purple-500/20' :
                                    item.category === 'awareness' ? 'bg-green-900/20 text-green-500 border border-green-500/20' :
                                        'bg-blue-900/20 text-blue-500 border border-blue-500/20'
                                    }`}>
                                    {item.category}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-muted text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    {user?.role === 'admin' && (
                                        <>
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors text-xs"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors text-xs"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-3">{item.title}</h2>
                            <p className="text-secondary leading-relaxed">{item.content}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Add New News' : 'Edit News'}>
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
                        <label className="block text-secondary mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="input-modern"
                        >
                            <option value="general">General</option>
                            <option value="scheme">Scheme</option>
                            <option value="awareness">Awareness</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="input-modern h-32"
                            required
                        />
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
                        {modalMode === 'create' ? 'Create News' : 'Update News'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default News;
