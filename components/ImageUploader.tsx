import React, { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { MaskIcon } from './icons/MaskIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface ImageUploaderProps {
    id: string;
    title: string;
    onImageUpload: (file: File) => void;
    onClear: () => void;
    imageFile: File | null;
    t: (key: string, params?: Record<string, string | number>) => string;
    onEditMask?: () => void;
    onAutoMask?: () => void;
    isMaskingLoading?: boolean;
    mask?: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageUpload, onClear, imageFile, t, onEditMask, onAutoMask, isMaskingLoading, mask }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let isCancelled = false;
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (!isCancelled) {
                    setImagePreview(reader.result as string);
                }
            };
            reader.readAsDataURL(imageFile);
        } else {
            setImagePreview(null);
        }
        return () => {
            isCancelled = true;
        };
    }, [imageFile]);


    const handleFileChange = useCallback((files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            onImageUpload(file);
        }
    }, [onImageUpload]);

    const handleDragEvent = (e: DragEvent<HTMLLabelElement>, isEntering: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(isEntering);
    };
    
    const handleDrop = useCallback((e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    }, [handleFileChange]);

    const handleClearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent label from triggering file input
        e.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
        onClear();
    };

    const handleEditMaskClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onEditMask?.();
    }
    
    const handleAutoMaskClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onAutoMask?.();
    }


    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-amber-500 dark:text-amber-300 min-h-[56px] flex items-center">{title}</h3>
            <label
                htmlFor={id}
                onDragEnter={(e) => handleDragEvent(e, true)}
                onDragOver={(e) => handleDragEvent(e, true)}
                onDragLeave={(e) => handleDragEvent(e, false)}
                onDrop={handleDrop}
                className={`relative group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                    ${isDragging ? 'border-amber-400 bg-amber-500/10' : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:bg-slate-900 dark:hover:bg-slate-800/60'}`}
                role="button"
                aria-label={title}
            >
                {imagePreview ? (
                    <>
                        <img src={imagePreview} alt="Preview" className="object-contain h-full w-full rounded-lg" />
                         {mask && (
                            <div className="absolute inset-0 bg-amber-400/30 rounded-lg flex items-center justify-center pointer-events-none">
                                <MaskIcon className="w-10 h-10 text-white opacity-80" />
                            </div>
                        )}
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                            <button 
                                onClick={handleClearClick}
                                className="bg-white/70 hover:bg-gray-200 text-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:text-white rounded-full p-1.5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-amber-400"
                                aria-label={t('uploader.clearAlt')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                             {onEditMask && (
                                <button
                                    onClick={handleEditMaskClick}
                                    className="flex items-center gap-1.5 bg-white/70 hover:bg-gray-200 text-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:text-white rounded-full p-1.5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-amber-400"
                                    aria-label={t('uploader.editMask')}
                                >
                                    <MaskIcon className="h-4 w-4" />
                                </button>
                            )}
                            {onAutoMask && (
                                <button
                                    onClick={handleAutoMaskClick}
                                    disabled={isMaskingLoading}
                                    className="flex items-center gap-1.5 bg-white/70 hover:bg-gray-200 text-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:text-white rounded-full p-1.5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-wait"
                                    aria-label={t('uploader.autoMask')}
                                >
                                    {isMaskingLoading ? (
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <MagicWandIcon className="h-4 w-4" />
                                    )}
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <svg className="w-8 h-8 mb-4 text-slate-400 dark:text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">{t('uploader.dropzone.cta')}</span>{t('uploader.dropzone.or')}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-500">{t('uploader.dropzone.fileTypes')}</p>
                    </div>
                )}
                <input
                    id={id}
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
            </label>
        </div>
    );
};