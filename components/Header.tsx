import React from 'react';
import { LanguageSelector } from './LanguageSelector';
import type { Language } from '../hooks/useTranslation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ResetIcon } from './icons/ResetIcon';

const DugoBananaIcon = () => (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hidden">
        {/* Light mode icon */}
        <path d="M52 38.5C52 49.27 43.27 58 32.5 58C21.73 58 13 49.27 13 38.5C13 27.73 21.73 19 32.5 19C43.27 19 52 27.73 52 38.5Z" fill="#A1A1AA"/>
        <ellipse cx="32.5" cy="42.5" rx="10" ry="8" fill="#D4D4D8"/>
        <path d="M33 24C38.3333 27.8333 39.8 36.1 34.5 39.5C29.2 42.9 23.6667 38.1667 25 33C26.3333 27.8333 27.6667 20.1667 33 24Z" fill="#FACC15"/>
        <path d="M33.0416 23.9999C32.2222 22.6666 33.3416 21.1666 34.6855 21.5891C36.0294 22.0116 35.8611 23.8333 34.7083 24.4999C33.5555 25.1666 33.8611 25.3333 33.0416 23.9999Z" fill="#A16207"/>
        <path d="M22 32C17.3333 34.5 16.2 43.3 22.5 44.5C28.8 45.7 29.8333 35.1667 22 32Z" fill="#D4D4D8"/>
        <path d="M43 32C47.6667 34.5 48.8 43.3 42.5 44.5C36.2 45.7 35.1667 35.1667 43 32Z" fill="#D4D4D8"/>
        <circle cx="28" cy="37" r="1.5" fill="#27272A"/>
        <circle cx="37" cy="37" r="1.5" fill="#27272A"/>
        <path d="M30 43C30 44.1046 30.8954 45 32 45" stroke="#27272A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M35 43C35 44.1046 34.1046 45 33 45" stroke="#27272A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const DugoBananaIconDark = () => (
     <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden dark:block">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <path d="M52 38.5C52 49.27 43.27 58 32.5 58C21.73 58 13 49.27 13 38.5C13 27.73 21.73 19 32.5 19C43.27 19 52 27.73 52 38.5Z" fill="#94A3B8"/>
        <ellipse cx="32.5" cy="42.5" rx="10" ry="8" fill="#BCC8D6"/>
        <g filter="url(#glow)">
            <path d="M33 24C38.3333 27.8333 39.8 36.1 34.5 39.5C29.2 42.9 23.6667 38.1667 25 33C26.3333 27.8333 27.6667 20.1667 33 24Z" fill="#FDE047"/>
            <path d="M33.0416 23.9999C32.2222 22.6666 33.3416 21.1666 34.6855 21.5891C36.0294 22.0116 35.8611 23.8333 34.7083 24.4999C33.5555 25.1666 33.8611 25.3333 33.0416 23.9999Z" fill="#A16207"/>
        </g>
        <path d="M22 32C17.3333 34.5 16.2 43.3 22.5 44.5C28.8 45.7 29.8333 35.1667 22 32Z" fill="#BCC8D6"/>
        <path d="M43 32C47.6667 34.5 48.8 43.3 42.5 44.5C36.2 45.7 35.1667 35.1667 43 32Z" fill="#BCC8D6"/>
        <circle cx="28" cy="37" r="1.5" fill="#1E293B"/>
        <circle cx="37" cy="37" r="1.5" fill="#1E293B"/>
        <path d="M30 43C30 44.1046 30.8954 45 32 45" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M35 43C35 44.1046 34.1046 45 33 45" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);


interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage, t, theme, toggleTheme, onReset }) => {
    return (
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <DugoBananaIcon />
                <DugoBananaIconDark />
                <div>
                    <h1 className="text-3xl font-bold text-amber-500 dark:text-amber-300">Dugo Banana</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('header.subtitle')}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <p className="hidden md:block text-right text-sm text-slate-500 max-w-xs">
                    {t('header.description')}
                </p>
                <button
                    onClick={onReset}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-colors"
                    title={t('header.reset')}
                >
                    <ResetIcon className="h-5 w-5" />
                </button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                <LanguageSelector language={language} setLanguage={setLanguage} />
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                <ThemeSwitcher t={t} theme={theme} toggleTheme={toggleTheme} />
            </div>
        </header>
    );
};