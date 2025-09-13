import React from 'react';
import type { Language } from '../hooks/useTranslation';

interface LanguageSelectorProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
    const commonButtonClasses = "px-3 py-1.5 rounded-md text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-colors";
    
    return (
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
            <button
                onClick={() => setLanguage('en')}
                className={`${commonButtonClasses} ${language === 'en' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                aria-pressed={language === 'en'}
                aria-label="Switch to English"
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('it')}
                className={`${commonButtonClasses} ${language === 'it' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}
                aria-pressed={language === 'it'}
                aria-label="Passa all'italiano"
            >
                IT
            </button>
        </div>
    );
};