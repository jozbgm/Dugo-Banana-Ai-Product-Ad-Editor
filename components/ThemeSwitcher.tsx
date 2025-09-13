import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface ThemeSwitcherProps {
    t: (key: string) => string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ t, theme, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-colors"
            aria-label={t(theme === 'dark' ? 'theme.switchToLight' : 'theme.switchToDark')}
        >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
    );
};