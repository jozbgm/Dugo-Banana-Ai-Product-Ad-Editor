import React from 'react';

interface HistoryProps {
    history: string[];
    onSelect: (image: string) => void;
    onClear: () => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

export const History: React.FC<HistoryProps> = ({ history, onSelect, onClear, t }) => {
    if (history.length === 0) {
        return null;
    }

    const handleClear = () => {
        if (window.confirm(t('history.clearConfirm'))) {
            onClear();
        }
    };

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-amber-500 dark:text-amber-300">{t('history.title')}</h3>
                 <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-red-500 rounded-md px-2 py-1"
                    aria-label={t('history.clear')}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {t('history.clear')}
                 </button>
            </div>
           
            <div className="flex gap-4 overflow-x-auto pb-3 -mb-3">
                {history.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(image)}
                        className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-amber-400 transition-transform hover:scale-105"
                        aria-label={t('history.itemAlt', { index: index + 1 })}
                    >
                        <img src={image} alt={`History item ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};