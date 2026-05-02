import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { FaBars, FaTimes, FaUserCircle, FaCity } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/traffic', label: 'Traffic' },
        { to: '/weather', label: 'Weather' },
        { to: '/attractions', label: 'Attractions' },
        { to: '/events', label: 'Events' },
        { to: '/news', label: 'News' },
        { to: '/reports', label: 'Reports' },
        // Show Bills only to citizens and admins, hide from managers
        ...((!user || user.role === 'citizen' || user.role === 'admin') ? [{ to: '/bills', label: 'Bills' }] : []),
        ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : [])
    ];

    return (
        <nav className="fixed w-full z-50 bg-white/70 dark:bg-black/40 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                        <div className="relative">
                            <FaCity className="text-3xl md:text-4xl gradient-text " />
                            <div className="absolute inset-0 blur-xl bg-cyan-500/30 group-hover:bg-cyan-500/50 transition-all duration-300"></div>
                        </div>
                        <span className="text-xl md:text-2xl font-bold gradient-text">
                            ViceCity
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-white font-medium transition-all duration-300 group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-violet-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {user ? (
                            <div className="flex items-center gap-3 ml-4">
                                <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
                                    <FaUserCircle className="text-cyan-400 text-xl" />
                                    <span className="text-sm font-medium text-primary">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-4">
                                <Link
                                    to="/login"
                                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-white font-semibold rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 text-gray-700 dark:text-white"
                    >
                        {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-white/10"
                    >
                        <div className="px-4 py-4 space-y-2 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={toggleMenu}
                                    className="block px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 font-medium transition-all duration-300 active:scale-95"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {user ? (
                                <div className="pt-2 mt-2 border-t border-white/10 space-y-3">
                                    <div className="flex items-center gap-3 px-4 py-3 glass rounded-xl mx-2">
                                        <FaUserCircle className="text-cyan-400 text-2xl" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-secondary">Signed in as</span>
                                            <span className="text-sm font-bold text-primary">{user.name}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { handleLogout(); toggleMenu(); }}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl transition-all duration-300 active:scale-95 mx-auto block max-w-[calc(100%-1rem)]"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 gap-3">
                                    <Link
                                        to="/login"
                                        onClick={toggleMenu}
                                        className="px-4 py-3 rounded-xl text-secondary hover:text-white hover:bg-white/5 font-medium transition-all duration-300 text-center border border-white/10"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={toggleMenu}
                                        className="block px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-xl transition-all duration-300 text-center"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
