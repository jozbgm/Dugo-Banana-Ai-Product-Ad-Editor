import React, { useState, useRef, useCallback } from 'react';
import { MagnifyingGlassPlusIcon } from './icons/MagnifyingGlassPlusIcon';

interface ImageComparatorProps {
    beforeImage: string;
    afterImage: string;
    t: (key: string) => string;
    onZoom?: () => void;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ beforeImage, afterImage, t, onZoom }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPos(percent);
    }, []);
    
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
    };
    
    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
    }, []);
    
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging.current) {
            handleMove(e.clientX);
        }
    }, [handleMove]);
    
    const handleTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true;
    };
    
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (isDragging.current) {
            handleMove(e.touches[0].clientX);
        }
    }, [handleMove]);

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-full aspect-auto select-none overflow-hidden rounded-lg"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            onTouchCancel={handleMouseUp}
            onTouchMove={handleTouchMove}
        >
            <img 
                src={beforeImage} 
                alt={t('results.comparator.before')}
                className="block w-full h-auto pointer-events-none"
            />
            <div 
                className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none" 
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <img 
                    src={afterImage} 
                    alt={t('results.comparator.after')}
                    className="block w-full h-auto absolute top-0 left-0"
                />
            </div>
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white/50"
                style={{ left: `calc(${sliderPos}% - 1px)` }}
            >
                <div
                    className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm cursor-ew-resize"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                     <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                </div>
            </div>

            {onZoom && (
                <button 
                    onClick={onZoom} 
                    className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-all"
                    aria-label={t('results.zoom')}
                >
                    <MagnifyingGlassPlusIcon className="h-5 w-5"/>
                </button>
            )}

            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none">{t('results.comparator.before')}</div>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none">{t('results.comparator.after')}</div>
        </div>
    );
};