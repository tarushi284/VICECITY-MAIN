import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl glass-strong hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-6 h-6">
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'dark' ? 1 : 0,
                        rotate: theme === 'dark' ? 0 : 180,
                        opacity: theme === 'dark' ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <FaMoon className="text-yellow-300 text-xl" />
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === 'light' ? 1 : 0,
                        rotate: theme === 'light' ? 0 : -180,
                        opacity: theme === 'light' ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <FaSun className="text-yellow-500 text-xl" />
                </motion.div>
            </div>
        </motion.button>
    );
};

export default ThemeToggle;
