import React, { useState } from 'react';
import { Lightbox } from './Lightbox';
import { EnhancerModal } from './EnhancerModal';
import { MagnifyingGlassPlusIcon } from './icons/MagnifyingGlassPlusIcon';
import { Tooltip } from './Tooltip';

interface ResultDisplayProps {
    generatedImage: string | null;
    isLoading: boolean;
    downloadFormat: 'png' | 'jpeg';
    setDownloadFormat: (format: 'png' | 'jpeg') => void;
    downloadQuality: number;
    setDownloadQuality: (quality: number) => void;
    onReiterate: (image: string) => void;
    onUpdateMainImage: (image: string) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}


const LoadingSpinner: React.FC<{ t: (key: string) => string }> = ({ t }) => (
    <div className="flex flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400" role="status" aria-label="Loading image">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-amber-500 dark:text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold">{t('results.loading')}</p>
        <p className="text-sm text-center">{t('results.loadingDescription')}</p>
    </div>
);

const Placeholder: React.FC<{ t: (key: string) => string }> = ({ t }) => (
    <div className="flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-500 text-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-bold text-slate-600 dark:text-white">{t('results.title')}</h3>
        <p className="max-w-xs">{t('results.description')}</p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
    generatedImage, 
    isLoading,
    downloadFormat,
    setDownloadFormat,
    downloadQuality,
    setDownloadQuality,
    onReiterate,
    onUpdateMainImage,
    t
}) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);

    const handleOpenLightbox = () => {
        if (generatedImage) {
            setIsLightboxOpen(true);
        }
    };

    const handleCloseLightbox = () => {
        setIsLightboxOpen(false);
    };

    const handleDownload = () => {
        if (!generatedImage) return;

        const fileName = `dugo-banana-edit.${downloadFormat}`;

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error("Could not get canvas context");
                return;
            }

            // Fill background with white before drawing, important for JPEG
            if (downloadFormat === 'jpeg') {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(img, 0, 0);

            const dataUrl = downloadFormat === 'jpeg'
                ? canvas.toDataURL('image/jpeg', downloadQuality)
                : canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        img.onerror = () => {
            console.error("Failed to load generated image for download.");
        };
        img.src = generatedImage;
    };
    
    const handleDownloadFromLightbox = () => {
        if (!generatedImage) return;
        const fileName = `dugo-banana-edit.png`;
        const link = document.createElement('a');
        link.href = generatedImage; // The generated image is already a PNG data URL
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReiterateAndClose = () => {
        if (generatedImage) {
            onReiterate(generatedImage);
            handleCloseLightbox();
        }
    };


    return (
        <>
            <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-200 dark:bg-slate-900 rounded-lg p-4">
                {isLoading ? (
                    <LoadingSpinner t={t} />
                ) : generatedImage ? (
                    <div className="w-full h-full flex flex-col gap-4 items-center">
                        <div className="w-full max-w-full relative">
                            <img 
                                src={generatedImage} 
                                alt={t('results.generatedAlt')}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg cursor-zoom-in"
                                onClick={handleOpenLightbox}
                            />
                             <button 
                                onClick={handleOpenLightbox} 
                                className="absolute top-2 right-2 bg-white/60 hover:bg-gray-200 text-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:text-white rounded-full p-2 transition-all cursor-zoom-in"
                                aria-label={t('results.zoom')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="mt-4 p-4 bg-slate-100/70 dark:bg-slate-800/70 rounded-lg w-full max-w-sm flex flex-col gap-4 border border-slate-200 dark:border-slate-700">
                             <h4 className="text-md font-semibold text-center text-slate-800 dark:text-slate-200">{t('results.downloadOptions')}</h4>
                             <div className={`grid ${downloadFormat === 'jpeg' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                <div>
                                    <label htmlFor="format-select" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('results.format')}</label>
                                    <select 
                                        id="format-select"
                                        value={downloadFormat}
                                        onChange={(e) => setDownloadFormat(e.target.value as 'png' | 'jpeg')}
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                                    >
                                        <option value="png">PNG</option>
                                        <option value="jpeg">JPEG</option>
                                    </select>
                                </div>
                                {downloadFormat === 'jpeg' && (
                                    <div className="flex flex-col justify-between">
                                        <label htmlFor="quality-slider" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('results.quality', { quality: Math.round(downloadQuality * 100) })}</label>
                                        <input
                                            id="quality-slider"
                                            type="range"
                                            min="0.1"
                                            max="1"
                                            step="0.01"
                                            value={downloadQuality}
                                            onChange={(e) => setDownloadQuality(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-amber-400"
                                        />
                                    </div>
                                )}
                             </div>
                             <div className="flex gap-2">
                                <button
                                    onClick={handleDownload}
                                    className="flex-grow w-full bg-slate-300 hover:bg-slate-400 text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    {t('results.downloadButton')}
                                </button>
                                <Tooltip text={t('tooltips.enhance')}>
                                     <button
                                        onClick={() => setIsEnhancerOpen(true)}
                                        className="p-2.5 bg-slate-300 hover:bg-slate-400 text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-bold rounded-lg transition-colors"
                                    >
                                        <MagnifyingGlassPlusIcon />
                                    </button>
                                </Tooltip>
                             </div>
                        </div>
                    </div>
                ) : (
                    <Placeholder t={t} />
                )}
            </div>
            {isLightboxOpen && generatedImage && (
                <Lightbox 
                    imageUrl={generatedImage} 
                    onClose={handleCloseLightbox} 
                    onDownload={handleDownloadFromLightbox}
                    onReiterate={handleReiterateAndClose}
                    t={t} 
                />
            )}
             {isEnhancerOpen && generatedImage && (
                <EnhancerModal
                    imageUrl={generatedImage}
                    onClose={() => setIsEnhancerOpen(false)}
                    onUpdateMainImage={(newImage) => {
                        onUpdateMainImage(newImage);
                        setIsEnhancerOpen(false);
                    }}
                    t={t}
                />
            )}
        </>
    );
};