import React, { useState, useEffect, useRef } from 'react';
import type { EnhancementLevel } from '../types';
import { EnhancementLevelOptions } from '../constants';
import { enhanceImageDetails } from '../services/geminiService';
import { fileToBase64, Base64File } from '../utils/fileUtils';
import { ImageComparator } from './ImageComparator';
import { DownloadIcon } from './icons/DownloadIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface EnhancerModalProps {
    imageUrl: string;
    onClose: () => void;
    onUpdateMainImage: (newImage: string) => void;
    t: (key: string) => string;
}

const dataUrlToUploadFile = (dataUrl: string): Base64File => {
    const [header, base64] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)![1];
    return { base64, mimeType };
};


export const EnhancerModal: React.FC<EnhancerModalProps> = ({ imageUrl, onClose, onUpdateMainImage, t }) => {
    const [level, setLevel] = useState<EnhancementLevel>('Realistic');
    const [isLoading, setIsLoading] = useState(false);
    const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isComparatorZoomed, setIsComparatorZoomed] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isComparatorZoomed) {
                    setIsComparatorZoomed(false);
                } else {
                    onClose();
                }
            }
        };
        const handleClickOutside = (e: MouseEvent) => {
            if (isComparatorZoomed) return;
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [onClose, isComparatorZoomed]);

    const handleEnhance = async () => {
        setIsLoading(true);
        setError(null);
        setEnhancedImage(null);
        try {
            const imageFile = dataUrlToUploadFile(imageUrl);
            const result = await enhanceImageDetails(imageFile, level);
            setEnhancedImage(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!enhancedImage) return;
        const link = document.createElement('a');
        link.href = enhancedImage;
        link.download = `dugo-banana-enhanced.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="enhancer-title"
            >
                <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700 w-full max-w-4xl flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 id="enhancer-title" className="text-2xl font-bold text-amber-500 dark:text-amber-300">{t('enhancer.title')}</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('enhancer.description')}</p>
                        </div>
                        <button onClick={onClose} aria-label={t('maskEditor.close')} className="text-3xl font-light text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">&times;</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Controls */}
                        <div className="flex flex-col gap-4 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                            <div>
                                <label htmlFor="enhancement-level" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">{t('enhancer.levelLabel')}</label>
                                <select
                                    id="enhancement-level"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value as EnhancementLevel)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                                >
                                    {EnhancementLevelOptions.map(option => (
                                        <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleEnhance}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors"
                            >
                                {isLoading ? t('enhancer.enhancingButton') : t('enhancer.startButton')}
                            </button>
                        </div>

                        {/* Image Display */}
                        <div className="w-full min-h-[300px] flex items-center justify-center bg-slate-200 dark:bg-slate-900 rounded-lg p-2">
                            {isLoading && !enhancedImage && (
                                <div className="flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                                    <svg className="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>{t('enhancer.enhancingButton')}</span>
                                </div>
                            )}
                            {!isLoading && enhancedImage && (
                                <ImageComparator 
                                    beforeImage={imageUrl} 
                                    afterImage={enhancedImage} 
                                    t={t} 
                                    onZoom={() => setIsComparatorZoomed(true)}
                                />
                            )}
                            {!isLoading && !enhancedImage && (
                                <img src={imageUrl} alt="Original" className="max-w-full max-h-[40vh] object-contain rounded-md" />
                            )}
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    {enhancedImage && (
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                            <button onClick={handleDownload} className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                <DownloadIcon className="h-5 w-5" />
                                {t('enhancer.downloadEnhancedButton')}
                            </button>
                            <button onClick={() => onUpdateMainImage(enhancedImage)} className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors">
                                <MagicWandIcon className="h-5 w-5" />
                                {t('enhancer.useThisImageButton')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isComparatorZoomed && enhancedImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
                    onClick={() => setIsComparatorZoomed(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('results.lightboxAriaLabel')}
                >
                    <style>{`
                        @keyframes fade-in {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        .animate-fade-in { animation: fade-in 0.2s ease-out; }
                    `}</style>
                     <button
                        onClick={() => setIsComparatorZoomed(false)}
                        className="absolute top-4 right-4 text-white text-5xl font-light hover:text-gray-300 transition-colors z-[70]"
                        aria-label={t('results.closeLightboxAriaLabel')}
                    >
                        &times;
                    </button>
                    <div 
                        className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ImageComparator
                            beforeImage={imageUrl}
                            afterImage={enhancedImage}
                            t={t}
                        />
                    </div>
                </div>
            )}
        </>
    );
};