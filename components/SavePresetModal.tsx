import React, { useState, useEffect, useRef } from 'react';

interface SavePresetModalProps {
    onClose: () => void;
    onSave: (name: string) => void;
    t: (key: string) => string;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({ onClose, onSave, t }) => {
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
            if (e.key === 'Enter' && name.trim()) {
                onSave(name);
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, onSave, name]);

    const handleSaveClick = () => {
        if (name.trim()) {
            onSave(name);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-preset-title"
        >
            <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700 w-full max-w-sm flex flex-col gap-4">
                <h2 id="save-preset-title" className="text-xl font-bold text-amber-500 dark:text-amber-300">{t('presets.modalTitle')}</h2>
                <div>
                    <label htmlFor="preset-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('presets.modalNameLabel')}
                    </label>
                    <input
                        ref={inputRef}
                        id="preset-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={onClose}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        {t('presets.modalCancelButton')}
                    </button>
                    <button
                        onClick={handleSaveClick}
                        disabled={!name.trim()}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {t('presets.modalSaveButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};
