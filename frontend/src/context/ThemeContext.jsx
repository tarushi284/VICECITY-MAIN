import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Get theme from localStorage or default to 'dark'
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    });

    useEffect(() => {
        // Apply theme to document root and body
        const root = window.document.documentElement;
        const body = window.document.body;

        // Remove both theme classes first
        root.classList.remove('light', 'dark');
        body.classList.remove('light', 'dark');

        // Add current theme class
        root.classList.add(theme);
        body.classList.add(theme);

        // Save to localStorage
        localStorage.setItem('theme', theme);

        console.log('Theme changed to:', theme); // Debug log
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
            console.log('Toggling theme from', prevTheme, 'to', newTheme); // Debug log
            return newTheme;
        });
    };

    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
