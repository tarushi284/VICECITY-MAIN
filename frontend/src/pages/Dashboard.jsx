import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FaFileInvoiceDollar, FaExclamationTriangle, FaCalendarAlt, FaCheckCircle, FaClock, FaArrowRight, FaMapMarkedAlt, FaStar, FaInfoCircle, FaUserCircle, FaServer, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [bills, setBills] = useState([]);
    const [reports, setReports] = useState([]);
    const [events, setEvents] = useState([]);
    const [attractions, setAttractions] = useState([]); // Stats for managers
    const [users, setUsers] = useState([]); // Stats for admins
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Common fetch: Events
                const eventsRes = await api.get('/events');
                setEvents(eventsRes.data.slice(0, 3));

                if (user?.role === 'attraction_manager') {
                    // Attraction Manager specific data
                    const attractionsRes = await api.get('/attractions');
                    setAttractions(attractionsRes.data);
                } else if (user?.role === 'admin') {
                    // Admin specific data
                    // Use try-catch blocks for individual fetches so one failure doesn't stop others
                    try {
                        const usersRes = await api.get('/auth/users');
                        setUsers(usersRes.data);
                    } catch (e) {
                        setUsers([]);
                    }

                    try {
                        const reportsRes = await api.get('/reports');
                        setReports(reportsRes.data);
                    } catch (e) { }

                    try {
                        const attractionsRes = await api.get('/attractions');
                        setAttractions(attractionsRes.data);
                    } catch (e) { }

                } else {
                    // Citizen specific data
                    const billsRes = await api.get('/bills');
                    const pendingBills = billsRes.data.filter(b => b.status === 'pending');
                    setBills(pendingBills);

                    const reportsRes = await api.get('/reports');
                    const userReports = reportsRes.data.filter(r => r.user?._id === user._id || r.user === user._id);
                    setReports(userReports);

                    // Filter events for citizen
                    const myEvents = eventsRes.data.filter(event => event.attendees && event.attendees.includes(user._id));
                    if (myEvents.length > 0) setEvents(myEvents.slice(0, 3));
                }

            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    // --- ATTRACTION MANAGER DASHBOARD ---
    if (user?.role === 'attraction_manager') {
        return (
            <div className="min-h-screen pt-24 pb-10 px-4 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        Manager Dashboard
                    </h1>
                    <p className="text-secondary">Overview of city attractions and management tools.</p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* Stats Cards */}
                    <motion.div variants={itemVariants} className="card-modern p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-l-4 border-cyan-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-secondary uppercase tracking-wider">Total Attractions</p>
                                <h3 className="text-3xl font-bold text-primary mt-1">{attractions.length}</h3>
                            </div>
                            <div className="p-3 bg-cyan-500/20 text-cyan-500 rounded-lg">
                                <FaMapMarkedAlt className="text-xl" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="card-modern p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-secondary uppercase tracking-wider">Avg Rating</p>
                                <h3 className="text-3xl font-bold text-primary mt-1">
                                    {(attractions.reduce((acc, curr) => acc + (curr.rating || 0), 0) / (attractions.length || 1)).toFixed(1)}
                                </h3>
                            </div>
                            <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-lg">
                                <FaStar className="text-xl" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Action */}
                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2">
                        <div className="card-modern h-full flex flex-col justify-center items-start p-8 bg-gradient-to-r from-cyan-600 to-blue-600 text-white relative overflow-hidden group">
                            <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 transform translate-x-12"></div>
                            <h2 className="text-2xl font-bold mb-2 relative z-10">Manage Attractions</h2>
                            <p className="text-cyan-100 mb-6 relative z-10 max-w-md">Add new locations, update details, or manage existing listings in the city guide.</p>
                            <Link to="/attractions" className="px-6 py-3 bg-white text-cyan-600 font-bold rounded-xl shadow-lg hover:bg-cyan-50 transition-colors relative z-10 flex items-center gap-2">
                                Go to Attractions <FaArrowRight />
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Information Section */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-8">
                    <h2 className="text-2xl font-bold text-primary mb-6">Recent City Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event._id} className="card-modern group p-4 flex gap-4 items-center">
                                <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
                                <div>
                                    <h4 className="font-bold text-primary group-hover:text-cyan-500 transition-colors">{event.title}</h4>
                                    <p className="text-xs text-secondary">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- ADMIN CONTROL CENTER ---
    if (user?.role === 'admin') {
        const citizenCount = Array.isArray(users) ? users.filter(u => u.role === 'citizen').length : 0;
        const activeReports = Array.isArray(reports) ? reports.filter(r => r.status !== 'resolved').length : 0;
        const totalReports = Array.isArray(reports) ? reports.length : 0;
        const systemHealth = totalReports > 0 ? Math.round(((totalReports - activeReports) / totalReports) * 100) : 100;

        return (
            <div className="min-h-screen pt-24 pb-10 px-4 max-w-7xl mx-auto">

                {/* Control Center Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-end pb-6 border-b border-gray-200 dark:border-white/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 tracking-tight">
                                Admin Dashboard
                            </h1>
                        </div>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                        <div className="text-3xl font-mono font-bold text-primary tracking-widest">
                            {currentTime.toLocaleTimeString([], { hour12: false })}
                        </div>
                        <div className="text-secondary text-sm font-mono uppercase tracking-widest opacity-70">
                            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-12 gap-6"
                >
                    {/* Status Bar */}
                    <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaServer className="text-green-600 dark:text-green-500" />
                                <span className="text-sm font-mono text-green-700 dark:text-green-400">SERVER STATUS</span>
                            </div>
                            <span className="text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded animate-pulse">ONLINE</span>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaNetworkWired className="text-blue-600 dark:text-blue-500" />
                                <span className="text-sm font-mono text-blue-700 dark:text-blue-400">LATENCY</span>
                            </div>
                            <span className="text-xs font-bold text-blue-700 dark:text-white">24ms</span>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaShieldAlt className="text-purple-600 dark:text-purple-500" />
                                <span className="text-sm font-mono text-purple-700 dark:text-purple-400">SECURITY</span>
                            </div>
                            <span className="text-xs font-bold text-purple-700 dark:text-white">SECURE</span>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaExclamationTriangle className="text-orange-600 dark:text-orange-500" />
                                <span className="text-sm font-mono text-orange-700 dark:text-orange-400">ISSUES</span>
                            </div>
                            <span className="text-xs font-bold text-orange-700 dark:text-white">{activeReports} Pending</span>
                        </div>
                    </div>

                    {/* Left Column: Stats & Actions (8 cols) */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        {/* High Level Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.div variants={itemVariants} className="card-modern relative overflow-hidden group p-6">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaUserCircle className="text-6xl text-blue-500" />
                                </div>
                                <h3 className="text-secondary text-xs font-mono uppercase tracking-widest mb-1">Total Citizens</h3>
                                <div className="text-4xl font-bold text-primary">{citizenCount}</div>
                                <div className="mt-4 h-1 w-full bg-blue-500/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[75%]"></div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="card-modern relative overflow-hidden group p-6">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaMapMarkedAlt className="text-6xl text-green-500" />
                                </div>
                                <h3 className="text-secondary text-xs font-mono uppercase tracking-widest mb-1">Total Attractions</h3>
                                <div className="text-4xl font-bold text-primary">{attractions.length}</div>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-mono">
                                    Avg Rating: {(attractions.reduce((acc, curr) => acc + (curr.rating || 0), 0) / (attractions.length || 1)).toFixed(1)}
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="card-modern relative overflow-hidden group p-6">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaCalendarAlt className="text-6xl text-purple-500" />
                                </div>
                                <h3 className="text-secondary text-xs font-mono uppercase tracking-widest mb-1">Total Events</h3>
                                <div className="text-4xl font-bold text-primary">{events.length}</div>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-mono">Scheduled in city</p>
                            </motion.div>
                        </div>

                        {/* Console Actions */}
                        <h2 className="text-lg font-bold text-primary border-l-4 border-cyan-500 pl-3">Administrative Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link to="/bills" className="group relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:border-green-500/50 transition-all shadow-lg">
                                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <div className="w-12 h-12 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-500 mb-4 group-hover:scale-110 transition-transform">
                                            <FaFileInvoiceDollar className="text-2xl" />
                                        </div>
                                        <h3 className="text-xl font-bold text-primary">Billing Console</h3>
                                        <p className="text-secondary text-sm mt-1">Manage citizen invoices & process payments.</p>
                                    </div>
                                    <FaArrowRight className="text-gray-400 dark:text-gray-600 group-hover:text-green-500 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </Link>

                            <Link to="/reports" className="group relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:border-yellow-500/50 transition-all shadow-lg">
                                <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <div className="w-12 h-12 rounded-lg bg-yellow-500/10 dark:bg-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-500 mb-4 group-hover:scale-110 transition-transform">
                                            <FaExclamationTriangle className="text-2xl" />
                                        </div>
                                        <h3 className="text-xl font-bold text-primary">Report Center</h3>
                                        <p className="text-secondary text-sm mt-1">Triage and resolve citizen complaints.</p>
                                    </div>
                                    <FaArrowRight className="text-gray-400 dark:text-gray-600 group-hover:text-yellow-500 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Activity Feed (4 cols) */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="card-modern h-[500px] flex flex-col bg-white/50 dark:bg-opacity-50 backdrop-blur-md">
                            <div className="p-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-transparent rounded-t-2xl">
                                <h3 className="font-bold text-primary flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    LIVE FEED
                                </h3>
                                <div className="text-xs font-mono text-secondary">REALTIME</div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                                {reports.length > 0 ? (
                                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                                        {reports.map((report, idx) => (
                                            <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${report.status === 'resolved' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                                                        'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                                                        }`}>
                                                        {report.status.toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-mono">{new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                                    {report.type} reported at {report.location}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{report.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 font-mono text-sm">
                                        SYSTEM IDLE... NO REPORTS
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 rounded-b-2xl">
                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-mono uppercase">
                                    <span>System Health</span>
                                    <span>{systemHealth}%</span>
                                </div>
                                <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${systemHealth > 80 ? 'bg-green-500' : systemHealth > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${systemHealth}%` }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- DEFAULT CITIZEN DASHBOARD ---
    return (
        <div className="min-h-screen pt-24 pb-10 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-primary mb-2">
                    Welcome back, <span className="gradient-text">{user?.name}</span>
                </h1>
                <p className="text-secondary">Here's what's happening in your city today.</p>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. My Bills (Priority Action) */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-green-500/20 text-green-500"><FaFileInvoiceDollar /></span>
                            Pending Bills
                        </h2>
                        <Link to="/bills" className="text-sm text-cyan-500 hover:text-cyan-400 font-medium flex items-center gap-1">
                            View All <FaArrowRight />
                        </Link>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {bills.length > 0 ? (
                            bills.slice(0, 2).map((bill) => (
                                <div key={bill._id} className="card-modern group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-muted text-sm uppercase tracking-wide font-semibold">{bill.type} Bill</p>
                                            <h3 className="text-3xl font-bold text-primary mt-1">${bill.amount}</h3>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
                                            Due {new Date(bill.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Link to="/bills" className="block w-full py-3 text-center bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/25">
                                        Pay Now
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 card-modern text-center p-8">
                                <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3 opacity-50" />
                                <p className="text-secondary">All bills paid! You're all caught up.</p>
                            </div>
                        )}
                        {/* Quick link if no bills */}
                        {bills.length === 0 && (
                            <Link to="/bills" className="col-span-2 flex items-center justify-center gap-2 p-4 border border-dashed border-gray-500/30 rounded-xl text-muted hover:bg-surface-elevated hover:text-primary transition-all">
                                <FaFileInvoiceDollar /> View Payment History
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* 2. My Reports (Status Tracking) */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500"><FaExclamationTriangle /></span>
                            My Reports
                        </h2>
                        <Link to="/reports" className="text-sm text-cyan-500 hover:text-cyan-400 font-medium">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {reports.length > 0 ? (
                            reports.slice(0, 3).map((report) => (
                                <div key={report._id} className="card-modern p-4 flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${report.status === 'resolved' ? 'bg-green-500' :
                                        report.status === 'investigating' ? 'bg-orange-500' : 'bg-gray-500'
                                        }`}></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-primary font-semibold truncate">{report.type} at {report.location}</h4>
                                        <p className="text-muted text-xs truncate">{report.description}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${report.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                                        report.status === 'investigating' ? 'bg-orange-500/10 text-orange-500' : 'bg-gray-500/10 text-gray-400'
                                        }`}>
                                        {report.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted card-modern">
                                <p>No reports submitted.</p>
                                <Link to="/reports" className="text-cyan-500 text-sm mt-2 inline-block hover:underline">Report an Issue</Link>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* 3. Upcoming Events (Discovery) */}
                <motion.div variants={itemVariants} className="lg:col-span-3 mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-pink-500/20 text-pink-500"><FaCalendarAlt /></span>
                            {events.length > 0 && events[0].attendees?.includes(user?._id) ? "My Events" : "Suggested Events"}
                        </h2>
                        <Link to="/events" className="text-sm text-cyan-500 hover:text-cyan-400 font-medium flex items-center gap-1">
                            Calendar <FaArrowRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {events.slice(0, 3).map((event) => (
                            <div key={event._id} className="group relative overflow-hidden rounded-2xl aspect-video md:aspect-[4/3] cursor-pointer border border-white/10">
                                <img src={event.image || 'https://via.placeholder.com/400x300'} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent p-6 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="text-gray-300 text-xs flex items-center gap-1">
                                            <FaClock /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                                    <p className="text-gray-300 text-sm line-clamp-1">{event.location}</p>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <div className="col-span-3 text-center py-10 text-muted">No upcoming events found.</div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
