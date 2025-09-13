import React from 'react';
import { Tooltip } from './Tooltip';

interface DugoModeToggleProps {
    isDugoMode: boolean;
    setIsDugoMode: (value: boolean) => void;
    dugoKeywords: string;
    setDugoKeywords: (value: string) => void;
    t: (key: string) => string;
}

export const DugoModeToggle: React.FC<DugoModeToggleProps> = ({ isDugoMode, setIsDugoMode, dugoKeywords, setDugoKeywords, t }) => {
    const toggleDugoMode = () => {
        setIsDugoMode(!isDugoMode);
    };

    return (
        <div className="flex flex-col gap-1 mt-2 p-3 bg-slate-200/50 dark:bg-slate-900/50 rounded-lg">
            <div className="flex items-center justify-between">
                <Tooltip text={t('tooltips.dugoMode')}>
                    <label htmlFor="dugo-mode-toggle" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-amber-300 cursor-help">
                        <span>🍌</span>
                        {t('dugoMode.title')}
                    </label>
                </Tooltip>
                <button
                    id="dugo-mode-toggle"
                    role="switch"
                    aria-checked={isDugoMode}
                    onClick={toggleDugoMode}
                    className={`${
                        isDugoMode ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'
                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-amber-400`}
                >
                    <span
                        className={`${
                            isDugoMode ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                </button>
            </div>
             <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isDugoMode ? 'max-h-40 pt-2' : 'max-h-0'}`}>
                <label htmlFor="dugo-keywords" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    {t('dugoMode.keywordsLabel')}
                </label>
                <input
                    id="dugo-keywords"
                    type="text"
                    value={dugoKeywords}
                    onChange={(e) => setDugoKeywords(e.target.value)}
                    placeholder={t('dugoMode.keywordsPlaceholder')}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    aria-label={t('dugoMode.keywordsLabel')}
                />
            </div>
        </div>
    );
};
