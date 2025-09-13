import React, { useState, useEffect, useRef } from 'react';
import type { BackgroundStyle, Option } from '../types';
import { BackgroundStyleOptions } from '../constants';
import { Tooltip } from './Tooltip';

interface BackgroundPanelProps {
    backgroundStyle: BackgroundStyle;
    setBackgroundStyle: (value: BackgroundStyle) => void;
    customBackground: File | null;
    setCustomBackground: (file: File | null) => void;
    t: (key: string) => string;
}

const SelectControl = <T extends string>({ label, value, onChange, options, t }: { label: string, value: T, onChange: (v: T) => void, options: ReadonlyArray<Option<T>>, t: (key: string) => string }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
            ))}
        </select>
    </div>
);

const CustomBackgroundUploader: React.FC<{
    onImageUpload: (file: File) => void;
    onClear: () => void;
    imageFile: File | null;
    t: (key: string) => string;
}> = ({ onImageUpload, onClear, imageFile, t }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(imageFile);
        } else {
            setImagePreview(null);
        }
    }, [imageFile]);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            onImageUpload(files[0]);
        }
    };

    const handleClearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClear();
    };

    return (
        <div className="w-full">
            {imagePreview ? (
                <div className="relative group w-full h-24 rounded-lg">
                    <img src={imagePreview} alt="Background Preview" className="object-cover h-full w-full rounded-lg" />
                    <button
                        onClick={handleClearClick}
                        className="absolute top-1 right-1 bg-white/70 hover:bg-gray-200 text-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:text-white rounded-full p-1.5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label={t('uploader.clearAlt')}
                    >
                        <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <>
                    <label htmlFor="custom-bg-upload" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">{t('uploader.customBackgroundTitle')}</label>
                    <input
                        id="custom-bg-upload"
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-900/40 dark:file:text-amber-200 dark:hover:file:bg-amber-900/60"
                        accept="image/png, image/jpeg, image/webp"
                    />
                </>
            )}
        </div>
    );
};

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({
    backgroundStyle, setBackgroundStyle,
    customBackground, setCustomBackground,
    t
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
            <SelectControl
                label="Style"
                value={backgroundStyle}
                onChange={setBackgroundStyle}
                options={BackgroundStyleOptions}
                t={t}
            />
            {backgroundStyle === 'Custom' && (
                <CustomBackgroundUploader
                    imageFile={customBackground}
                    onImageUpload={setCustomBackground}
                    onClear={() => setCustomBackground(null)}
                    t={t}
                />
            )}
        </div>
    );
};
