import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
    // Check for server-side rendering or lack of localStorage support.
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'dark';
    }
    // Get theme from localStorage. If it doesn't exist, default to 'dark'.
    const storedTheme = window.localStorage.getItem('theme') as Theme | null;
    return storedTheme || 'dark';
};


export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error("Failed to set theme in localStorage", error);
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);

    return { theme, toggleTheme };
};