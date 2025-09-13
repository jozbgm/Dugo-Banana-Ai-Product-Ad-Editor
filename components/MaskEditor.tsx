import React, { useRef, useEffect, useState } from 'react';

interface MaskEditorProps {
    imageFile: File;
    initialMask: string | null;
    onClose: () => void;
    onSave: (maskDataUrl: string) => void;
    t: (key: string) => string;
}

export const MaskEditor: React.FC<MaskEditorProps> = ({ imageFile, initialMask, onClose, onSave, t }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(40);
    const imageRef = useRef<HTMLImageElement>(new Image());
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const img = imageRef.current;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                img.src = e.target.result as string;
                img.onload = () => setImageLoaded(true);
            }
        };
        reader.readAsDataURL(imageFile);
    }, [imageFile]);

    useEffect(() => {
        if (!imageLoaded || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Scale canvas to fit the image
        const img = imageRef.current;
        const MAX_WIDTH = window.innerWidth * 0.8;
        const MAX_HEIGHT = window.innerHeight * 0.7;
        let { width, height } = img;
        
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (initialMask) {
            const maskImg = new Image();
            maskImg.src = initialMask;
            maskImg.onload = () => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                if(!tempCtx) return;
                tempCtx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);
                const imageData = tempCtx.getImageData(0,0, canvas.width, canvas.height);
                for (let i = 0; i < imageData.data.length; i += 4) {
                    if (imageData.data[i] === 255) { // If it's a white pixel on the mask
                        imageData.data[i] = 255;
                        imageData.data[i + 1] = 0;
                        imageData.data[i + 2] = 128;
                        imageData.data[i + 3] = 128; // semi-transparent magenta
                    } else {
                        imageData.data[i+3] = 0; // transparent
                    }
                }
                ctx.putImageData(imageData, 0, 0);
            }
        }

    }, [imageLoaded, initialMask]);

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.beginPath();
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const { x, y } = getMousePos(e);
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(255, 0, 128, 0.5)'; // semi-transparent magenta
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const maskData = new ImageData(width, height);

        for (let i = 0; i < imageData.data.length; i += 4) {
            // Check for magenta color used for drawing
            const isMasked = imageData.data[i] === 255 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 128;
            if (isMasked) {
                maskData.data[i] = 255;     // R
                maskData.data[i + 1] = 255; // G
                maskData.data[i + 2] = 255; // B
                maskData.data[i + 3] = 255; // A (white)
            } else {
                maskData.data[i] = 0;       // R
                maskData.data[i + 1] = 0;   // G
                maskData.data[i + 2] = 0;   // B
                maskData.data[i + 3] = 255; // A (black)
            }
        }
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;
        tempCtx.putImageData(maskData, 0, 0);

        onSave(tempCanvas.toDataURL('image/png'));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mask-editor-title"
        >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700 w-full max-w-4xl flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 id="mask-editor-title" className="text-2xl font-bold text-amber-500 dark:text-amber-300">{t('maskEditor.title')}</h2>
                     <button onClick={onClose} aria-label={t('maskEditor.close')} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">&times;</button>
                </div>
                 <p className="text-slate-600 dark:text-slate-400 text-sm">{t('maskEditor.instructions')}</p>

                <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        onMouseMove={draw}
                        className="cursor-crosshair rounded-md"
                    />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <label htmlFor="brush-size" className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('maskEditor.brushSize')}:</label>
                        <input
                            id="brush-size"
                            type="range"
                            min="5"
                            max="100"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="w-48 accent-amber-500 dark:accent-amber-400"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleClear} className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">{t('maskEditor.clear')}</button>
                        <button onClick={handleSave} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors">{t('maskEditor.save')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};