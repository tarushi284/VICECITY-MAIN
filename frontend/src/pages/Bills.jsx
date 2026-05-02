import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaPlus, FaMoneyBillWave, FaCheckCircle, FaExclamationCircle, FaUser, FaArrowLeft, FaSearch } from 'react-icons/fa';
import Modal from '../components/Modal';

const Bills = () => {
    const [bills, setBills] = useState([]);
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Admin specific states
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({ userId: '', type: 'electricity', amount: '', dueDate: '' });

    // Fetch users for admin list
    useEffect(() => {
        if (user?.role === 'admin') {
            const fetchUsers = async () => {
                try {
                    const { data } = await api.get('/auth/users');
                    // Filter to show only 'citizen' role as requested
                    const citizens = data.filter(u => u.role === 'citizen');
                    setUsers(citizens);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };
            fetchUsers();
        }
    }, [user]);

    // Fetch bills when selectedUserId changes (for admin) or on mount (for user)
    useEffect(() => {
        const fetchBills = async () => {
            try {
                let url = '/bills';
                if (user?.role === 'admin') {
                    if (selectedUserId) {
                        url += `?userId=${selectedUserId}`;
                    } else {
                        return; // Don't fetch bills if no user selected as admin
                    }
                }

                const { data } = await api.get(url);
                setBills(data);
            } catch (error) {
                console.error('Error fetching bills:', error);
            }
        };

        fetchBills();
    }, [selectedUserId, user]);

    const handlePay = async (id) => {
        try {
            await api.put(`/bills/${id}/pay`);
            setBills(bills.map((bill) => (bill._id === id ? { ...bill, status: 'paid', paidAt: Date.now() } : bill)));
            alert('Bill paid successfully!');
        } catch (error) {
            console.error('Error paying bill:', error);
            alert('Failed to pay bill');
        }
    };

    const openCreateModal = () => {
        setFormData({
            userId: selectedUserId || '',
            type: 'electricity',
            amount: '',
            dueDate: ''
        });
        setIsModalOpen(true);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const userIdToUse = user.role === 'admin' ? selectedUserId : user._id;

            const { data } = await api.post('/bills', {
                userId: userIdToUse,
                type: formData.type,
                amount: Number(formData.amount),
                dueDate: formData.dueDate
            });

            setBills([...bills, data]);
            setIsModalOpen(false);
            alert('Bill created successfully!');
        } catch (error) {
            console.error('Error creating bill:', error);
            alert(error.response?.data?.message || 'Failed to create bill');
        }
    };

    const isAdmin = user?.role === 'admin';

    // Filter users based on search
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Render User Selection View for Admin
    if (isAdmin && !selectedUserId) {
        return (
            <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Manage Bills</h1>
                    <p className="text-secondary">Select a citizen to view and manage their bills</p>
                </div>

                <div className="mb-6 relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary" />
                    <input
                        type="text"
                        placeholder="Search citizens by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-surface-elevated rounded-xl outline-none text-primary focus:ring-2 focus:ring-cyan-500 transition-all border border-transparent focus:border-cyan-500/50"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUsers.map((u, index) => (
                        <motion.div
                            key={u._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedUserId(u._id)}
                            className="bg-surface-elevated p-6 rounded-2xl cursor-pointer hover:bg-surface-elevated-hover transition-all duration-300 group border border-transparent hover:border-cyan-500/30 shadow-lg hover:shadow-cyan-500/10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary group-hover:text-cyan-400 transition-colors">{u.name}</h3>
                                    <p className="text-sm text-secondary">{u.email}</p>
                                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-white/5 text-muted border border-white/10 capitalize">
                                        {u.role || 'Citizen'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="col-span-full text-center text-muted py-12">
                            No citizens found matching your search.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Render User Bills View (Admin or Regular User)
    const selectedUser = users.find(u => u._id === selectedUserId);

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <button
                            onClick={() => setSelectedUserId(null)}
                            className="p-2 rounded-lg bg-surface-elevated hover:bg-white/10 text-secondary hover:text-white transition-colors"
                            title="Back to User List"
                        >
                            <FaArrowLeft />
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-primary">
                            {isAdmin ? `Bills for ${selectedUser?.name || 'User'}` : 'My Bills'}
                        </h1>
                        {isAdmin && (
                            <p className="text-secondary text-sm mt-1">{selectedUser?.email}</p>
                        )}
                    </div>
                </div>

                {isAdmin && (
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 flex items-center gap-2"
                    >
                        <FaPlus /> Add Bill
                    </button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bills.map((bill) => (
                    <motion.div
                        key={bill._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-modern group hover:scale-[1.02]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-cyan-500 capitalize">{bill.type} Bill</h3>
                                <p className="text-secondary text-sm">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${bill.status === 'paid' ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-red-500/20 text-red-500 border border-red-500/20'}`}>
                                {bill.status === 'paid' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                {bill.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="text-4xl font-bold text-primary mb-6 flex items-center">
                            <span className="text-2xl mr-1">$</span>{bill.amount}
                        </div>

                        {!isAdmin && bill.status === 'pending' && (
                            <button
                                onClick={() => handlePay(bill._id)}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
                            >
                                <FaMoneyBillWave /> Pay Now
                            </button>
                        )}

                        {isAdmin && bill.status === 'pending' && (
                            <div className="text-center text-secondary font-medium py-2.5 flex items-center justify-center gap-2 border border-white/10 rounded-xl bg-white/5">
                                User needs to pay
                            </div>
                        )}

                        {bill.status === 'paid' && (
                            <div className="text-center text-green-500 font-medium py-2.5 flex items-center justify-center gap-2 border border-green-500/20 rounded-xl bg-green-500/5">
                                <FaCheckCircle />
                                Paid on {new Date(bill.paidAt).toLocaleDateString()}
                            </div>
                        )}
                    </motion.div>
                ))}
                {bills.length === 0 && (
                    <div className="col-span-full text-center text-muted py-10">
                        {isAdmin ? 'No bills found for this user. Add one to get started!' : 'No bills due. Great job!'}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Bill">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-secondary mb-1">Bill Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="input-modern"
                        >
                            <option value="electricity">Electricity</option>
                            <option value="water">Water</option>
                            <option value="gas">Gas</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Amount ($)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="input-modern"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary mb-1">Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="input-modern"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full">
                        Create Bill
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Bills;
