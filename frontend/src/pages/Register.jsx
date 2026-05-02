import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Always register as citizen from public page
        const result = await register({ name, email, password, role: 'citizen' });
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
                <h2 className="text-3xl font-bold text-center mb-6 text-primary">Create Account</h2>
                {error && <div className="bg-red-500/20 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-modern"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                        <label className="block text-sm font-medium text-secondary mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="input-modern"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-3 px-4 shadow-lg hover:shadow-cyan-500/30"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-cyan-500 hover:text-cyan-400">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
