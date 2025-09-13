import { AspectRatio } from "../types";

export interface Base64File {
    base64: string;
    mimeType: string;
}

export const fileToBase64 = (file: File): Promise<Base64File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const [header, base64] = reader.result.split(',');
                const mimeTypeMatch = header.match(/:(.*?);/);
                if (!mimeTypeMatch || !base64) {
                    return reject(new Error('Invalid data URL format.'));
                }
                const mimeType = mimeTypeMatch[1];
                resolve({ base64, mimeType });
            } else {
                reject(new Error('Failed to read file as data URL.'));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

export const formatImageToAspectRatio = (file: File, targetAspectRatio: AspectRatio): Promise<Base64File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(img.src); // Clean up object URL
            const [arW, arH] = targetAspectRatio.split(':').map(Number);
            const targetRatio = arW / arH;

            const originalWidth = img.width;
            const originalHeight = img.height;
            const originalRatio = originalWidth / originalHeight;

            let canvasWidth = originalWidth;
            let canvasHeight = originalHeight;

            if (originalRatio > targetRatio) {
                // Original image is wider than target, so the new canvas needs to be taller
                canvasHeight = originalWidth / targetRatio;
            } else if (originalRatio < targetRatio) {
                // Original image is taller than target, so the new canvas needs to be wider
                canvasWidth = originalHeight * targetRatio;
            }

            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context.'));
            }

            // Fill background with white, which is a sensible default for product images
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Calculate coordinates to center the image
            const x = (canvasWidth - originalWidth) / 2;
            const y = (canvasHeight - originalHeight) / 2;

            ctx.drawImage(img, x, y, originalWidth, originalHeight);

            // Get the result as a Base64 string
            const dataUrl = canvas.toDataURL('image/png');
            const [header, base64] = dataUrl.split(',');
            const mimeTypeMatch = header.match(/:(.*?);/);

            if (!mimeTypeMatch || !base64) {
                return reject(new Error('Invalid data URL format after canvas conversion.'));
            }
            const mimeType = mimeTypeMatch[1];
            resolve({ base64, mimeType });
        };
        img.onerror = (error) => {
            URL.revokeObjectURL(img.src);
            reject(error);
        };
    });
};

export const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};