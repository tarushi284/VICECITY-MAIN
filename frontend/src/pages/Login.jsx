import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminSecretKey, setAdminSecretKey] = useState('');
    const [managerSecretKey, setManagerSecretKey] = useState('');
    const [loginRole, setLoginRole] = useState('citizen'); // 'citizen', 'admin', 'attraction_manager'
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(
            email.toLowerCase().trim(),
            password,
            loginRole === 'admin' ? adminSecretKey.trim() : null,
            loginRole === 'attraction_manager' ? managerSecretKey.trim() : null
        );
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full card-modern p-8 relative z-10"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-primary">Welcome Back</h2>
                {error && <div className="bg-red-500/20 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="input-modern"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="input-modern"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-3">Login As</label>
                        <div className="bg-gray-100 p-1 rounded-xl flex relative dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                            {/* Animated Background Pill */}
                            <motion.div
                                className="absolute top-1 bottom-1 bg-white dark:bg-gray-600 rounded-lg shadow-sm z-0"
                                layoutId="activeTab"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                style={{
                                    width: 'calc((100% - 8px) / 3)',
                                    left: loginRole === 'citizen' ? '4px' : loginRole === 'attraction_manager' ? 'calc((100% - 8px) / 3 + 4px)' : 'calc((100% - 8px) * 2 / 3 + 4px)'
                                }}
                            />

                            {/* Toggle Options */}
                            <button
                                type="button"
                                onClick={() => setLoginRole('citizen')}
                                className={`flex-1 text-sm font-medium py-2 relative z-10 transition-colors duration-200 
                                    ${loginRole === 'citizen' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Citizen
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginRole('attraction_manager')}
                                className={`flex-1 text-sm font-medium py-2 relative z-10 transition-colors duration-200 
                                    ${loginRole === 'attraction_manager' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Manager
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginRole('admin')}
                                className={`flex-1 text-sm font-medium py-2 relative z-10 transition-colors duration-200 
                                    ${loginRole === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    {loginRole === 'admin' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <label className="block text-sm font-medium text-purple-500 mb-1">Admin Secret Key</label>
                            <input
                                type="password"
                                required
                                className="input-modern border-purple-500 focus:border-purple-400"
                                placeholder="Enter Admin Key"
                                value={adminSecretKey}
                                onChange={(e) => setAdminSecretKey(e.target.value)}
                            />
                        </motion.div>
                    )}

                    {loginRole === 'attraction_manager' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <label className="block text-sm font-medium text-purple-500 mb-1">Manager Secret Key</label>
                            <input
                                type="password"
                                required
                                className="input-modern border-purple-500 focus:border-purple-400"
                                placeholder="Enter Manager Key"
                                value={managerSecretKey}
                                onChange={(e) => setManagerSecretKey(e.target.value)}
                            />
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className="w-full btn-primary py-3 px-4 shadow-lg hover:shadow-cyan-500/30"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-secondary">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-cyan-500 hover:text-cyan-400">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
