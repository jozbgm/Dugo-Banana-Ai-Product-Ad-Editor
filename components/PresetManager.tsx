import React from 'react';
import type { Preset } from '../types';
import { SaveIcon } from './icons/SaveIcon';
import { DeleteIcon } from './icons/DeleteIcon';

interface PresetManagerProps {
    presets: Preset[];
    selectedPresetId: string;
    onLoadPreset: (id: string) => void;
    onDeletePreset: () => void;
    onOpenSaveModal: () => void;
    t: (key: string) => string;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
    presets,
    selectedPresetId,
    onLoadPreset,
    onDeletePreset,
    onOpenSaveModal,
    t
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="w-full sm:w-1/2 flex-grow">
                <select
                    value={selectedPresetId}
                    onChange={(e) => onLoadPreset(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    aria-label={t('presets.load')}
                >
                    <option value="">{t('presets.load')}</option>
                    {presets.map(preset => (
                        <option key={preset.id} value={preset.id}>{preset.name}</option>
                    ))}
                </select>
            </div>
            <div className="w-full sm:w-auto flex gap-2">
                <button
                    onClick={onOpenSaveModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                    title={t('presets.save')}
                >
                    <SaveIcon />
                    <span className="hidden sm:inline">{t('presets.save')}</span>
                </button>
                 <button
                    onClick={onDeletePreset}
                    disabled={!selectedPresetId}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-200 hover:bg-red-500/80 text-slate-800 hover:text-white dark:bg-slate-700 dark:hover:bg-red-500/80 dark:text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-200 dark:disabled:hover:bg-slate-700 disabled:hover:text-slate-800 dark:disabled:hover:text-white"
                    title={t('presets.delete')}
                >
                    <DeleteIcon />
                </button>
            </div>
        </div>
    );
};
