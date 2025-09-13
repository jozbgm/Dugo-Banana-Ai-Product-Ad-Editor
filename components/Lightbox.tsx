import React, { useEffect } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface LightboxProps {
    imageUrl: string;
    onClose: () => void;
    onDownload: () => void;
    onReiterate: () => void;
    t: (key: string) => string;
}

export const Lightbox: React.FC<LightboxProps> = ({ imageUrl, onClose, onDownload, onReiterate, t }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
           window.removeEventListener('keydown', handleEsc);
           document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={t('results.lightboxAriaLabel')}
        >
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
            <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
                 <button
                    onClick={(e) => { e.stopPropagation(); onDownload(); }}
                    className="text-white hover:text-gray-300 transition-colors"
                    title={t('results.downloadButton')}
                    aria-label={t('results.downloadButton')}
                >
                    <DownloadIcon className="h-7 w-7" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onReiterate(); }}
                    className="text-white hover:text-gray-300 transition-colors"
                    title={t('results.reiterate')}
                    aria-label={t('results.reiterate')}
                >
                    <MagicWandIcon className="h-7 w-7" />
                </button>
                <button
                    onClick={onClose}
                    className="text-white text-5xl font-light hover:text-gray-300 transition-colors"
                    aria-label={t('results.closeLightboxAriaLabel')}
                >
                    &times;
                </button>
            </div>
            <div 
                className="relative max-w-full max-h-full flex items-center justify-center" 
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt={t('results.generatedAlt')}
                    className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
            </div>
        </div>
    );
};