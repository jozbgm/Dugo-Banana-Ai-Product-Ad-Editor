import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import type { CameraPerspective, StyleEmphasis, BackgroundStyle, LightTemperature, ShadowIntensity, ShotType, EnhancementLevel } from '../types';
import type { Base64File } from "../utils/fileUtils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getStyleDescriptionPrompt = (emphasis: StyleEmphasis): string => {
    switch (emphasis) {
        case 'COLOR':
            return "You are an expert color theorist. Describe the color palette of this image in extreme detail. Identify the dominant, secondary, and accent colors. Describe the saturation, brightness, and overall color harmony (e.g., analogous, complementary, monochromatic). Mention any specific color grading or tones.";
        case 'LIGHTING':
            return "You are a professional photographer. Describe the lighting in this image in extreme detail. Identify the type of light (natural, studio, etc.), its direction (front, side, back), its quality (hard, soft, diffused), and the nature of the shadows it creates. Describe the mood the lighting evokes.";
        case 'TEXTURE':
            return "Describe the textures and materials visible in this image in extreme detail. Focus on surfaces, fabrics, and finishes. Use descriptive words like glossy, matte, rough, smooth, woven, metallic, etc. Explain how light interacts with these textures.";
        case 'COMPOSITION':
            return "You are an expert in visual composition. Analyze and describe the composition of this image in detail. Discuss the rule of thirds, leading lines, framing, symmetry/asymmetry, depth of field, and the arrangement of elements within the frame.";
        case 'BACKGROUND':
            return "You are a professional set designer and background artist. Describe ONLY the background of this image in extreme detail. Ignore the main subject. Focus on the environment, texture of the surfaces, colors, lighting, and depth of field (e.g., 'a softly blurred, out-of-focus industrial loft with warm sunlight streaming through a window').";
        case 'PRODUCT_DETAIL':
            return "You are a macro product photographer. Describe ONLY the physical characteristics of the main subject in this image. Focus on the material finish (e.g., 'brushed aluminum with subtle specular highlights', 'matte-finish plastic', 'transparent glass with light refractions'), textures, and fine details. Ignore the background and overall composition.";
        case 'COLOR_CORRECTION':
            return "You are a professional colorist. Analyze and describe the color grading of this image in technical detail. Discuss the white balance (cool/warm), contrast level (high/low), saturation, and any specific color shifts in the highlights, midtones, and shadows (e.g., 'cool, cyan-tinted shadows and warm, slightly desaturated highlights for a cinematic look').";
        case 'OVERALL':
        default:
            return "You are a world-class art director and photographer. Describe the visual style of this image in extreme detail. Focus on the mood, color palette, lighting (type, direction, quality, shadows), composition, texture, and overall aesthetic. The description should be a comprehensive guide for an AI to replicate this style on a different photo.";
    }
};

/**
 * Generates a detailed description of an image's visual style.
 */
export const describeImageStyle = async (
    styleRefFile: Base64File,
    emphasis: StyleEmphasis
): Promise<string> => {
    const prompt = getStyleDescriptionPrompt(emphasis);
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: styleRefFile.mimeType, data: styleRefFile.base64 } }
            ]
        },
    });

    return response.text.trim();
};

/**
 * Generates a brief description of the main subject and its placement in an image.
 */
export const describeProductComposition = async (productFile: Base64File): Promise<string> => {
    const prompt = "Briefly and objectively describe the main subject and its immediate placement in this image, focusing on what it is and where it is. For example: 'a single red shoe on a concrete step', 'a watch on a person's wrist', 'a bottle of lotion on a marble countertop'. Do not describe the artistic style, lighting, or background details. Just describe the subject and its context.";
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: productFile.mimeType, data: productFile.base64 } }
            ]
        },
    });
    return response.text.trim();
};

interface PromptGenerationParams {
    lightTemperature: LightTemperature;
    shadowIntensity: ShadowIntensity;
    cameraPerspective: CameraPerspective;
    shotType: ShotType;
    styleDescription: string | null;
    productDescription: string | null;
    emphasis: StyleEmphasis;
    backgroundStyle: BackgroundStyle;
    isDugoMode: boolean;
    dugoKeywords?: string;
    basePromptTemplate?: string;
    t: (key: string, params?: Record<string, string | number>) => string;
}

/**
 * Generates a unique, creative, and cinematic prompt using AI for Dugo Mode.
 */
const generateDugoModePrompt = async (productDescription: string, keywords?: string): Promise<string> => {
    let prompt = `You are a world-class creative director for a high-end advertising agency. Your task is to generate a single, highly creative, and cinematic prompt for a professional product photoshoot.

The subject is: "${productDescription}".`;

    if (keywords && keywords.trim() !== '') {
        prompt += `\n\nThe generated scene MUST incorporate the following theme or keywords: "${keywords.trim()}".`;
    }

    prompt += `\n\nThe prompt must describe a stunning, unique, and visually striking scene where the product is the hero. Be imaginative, bold, and avoid generic clichés like 'on a table' or 'in a studio'. Think epic, luxurious, natural, or futuristic.

Here are some examples of the desired style and quality:
- "An epic shot of the product resting on a floating ice shard in a serene glacial lagoon, with the aurora borealis glowing faintly in the sky."
- "The product sits on a wet asphalt street at night, reflecting the vibrant neon lights of a futuristic, bustling cityscape in the background."
- "A luxurious macro shot focusing on the product, surrounded by a delicate swirl of colored smoke or powder against a dark, elegant backdrop."
- "A stunning photo of the product partially buried in fine, golden desert sand at sunset, with long, elegant shadows stretching across the dunes."

Your output must be ONLY the generated prompt itself, ready to be used by an image generation AI. Do not add any extra text, titles, or quotation marks around the output.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }] },
        config: {
            // Higher temperature encourages more creative and varied outputs.
            temperature: 1.0,
        }
    });

    // Clean up the response to ensure it's just the prompt.
    let cleanText = response.text.trim();
    // Remove potential markdown like quotes or asterisks.
    cleanText = cleanText.replace(/^["']|["']$/g, '');
    return cleanText;
};

/**
 * Generates a random, creative advertising prompt template to be used on app load.
 */
export const generateInitialAdvertisingPrompt = async (): Promise<string> => {
    const prompt = `You are a world-class creative director for a high-end advertising agency. Your task is to generate a single, highly creative, and cinematic prompt for a professional product photoshoot. The prompt should describe a stunning, unique, and visually striking scene.

IMPORTANT: The prompt MUST be written to apply to any generic product. Use the exact placeholder '[PRODUCT]' where the product name or description should go.

Here are some examples of the desired style and quality:
- "An epic, cinematic shot of [PRODUCT] resting on a floating ice shard in a serene glacial lagoon, with the aurora borealis glowing faintly in the sky."
- "[PRODUCT] sits on a wet asphalt street at night, its form reflecting the vibrant neon lights of a futuristic, bustling cityscape in the background."
- "A luxurious macro shot focusing on [PRODUCT], surrounded by a delicate swirl of colored smoke or powder against a dark, elegant backdrop."
- "A stunning photo of [PRODUCT] partially buried in fine, golden desert sand at sunset, with long, elegant shadows stretching across the dunes."

Your output must be ONLY the generated prompt itself, containing the '[PRODUCT]' placeholder. Do not add any extra text, titles, or quotation marks around the output.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }] },
        config: {
            temperature: 1.0,
        }
    });
    let cleanText = response.text.trim();
    cleanText = cleanText.replace(/^["']|["']$/g, '');
    
    // Ensure the placeholder is present, fallback if not
    if (!cleanText.includes('[PRODUCT]')) {
        return "A professional, cinematic, high-resolution photo of [PRODUCT].";
    }
    
    return cleanText;
};


/**
 * Generates a detailed prompt for image editing based on user-selected styles.
 */
export const generatePromptForEditing = async ({
    lightTemperature,
    shadowIntensity,
    cameraPerspective,
    shotType,
    styleDescription,
    productDescription,
    emphasis,
    backgroundStyle,
    isDugoMode,
    dugoKeywords,
    basePromptTemplate,
    t
}: PromptGenerationParams): Promise<string> => {
    
    // Dugo Mode now generates a unique, creative, cinematic scene with AI.
    if (isDugoMode) {
        const subject = productDescription || "the product"; // Use a generic fallback
        let scenePrompt = await generateDugoModePrompt(subject, dugoKeywords);

        if (styleDescription) {
             scenePrompt += ` The overall visual aesthetic, colors, and lighting should also be heavily inspired by this description: "${styleDescription}".`;
        }
        return scenePrompt;
    }
    
    const promptParts: string[] = [];
    const subject = productDescription || "[PRODUCT]";
    
    // Use the base template ONLY if there is no style reference image provided.
    if (basePromptTemplate && !isDugoMode && !styleDescription) {
        // If we have a template, Dugo mode is off, and no style ref, use it as the base.
        const base = basePromptTemplate.replace(/\[PRODUCT\]/g, subject);
        promptParts.push(base);
    } else {
        // Otherwise (if a style ref exists, or no template is available), build from scratch.
        switch (shotType) {
            case 'Long-shot':
                promptParts.push(`A professional, cinematic, high-resolution long-shot of ${subject}, showing it within a wider environment.`);
                break;
            case 'Full-shot':
                promptParts.push(`A professional, cinematic, high-resolution full-shot of ${subject}, ensuring the entire item is visible.`);
                break;
            case 'Mid-shot':
                promptParts.push(`A professional, cinematic, high-resolution mid-shot of ${subject}, framed from a medium distance to show key features.`);
                break;
            case 'Close-up':
                promptParts.push(`A professional, cinematic, high-resolution close-up shot of ${subject}, highlighting its main details and form.`);
                break;
            case 'Extreme-close-up':
                promptParts.push(`A professional, cinematic, high-resolution extreme close-up macro shot, focusing on a specific texture or intricate detail of ${subject}.`);
                break;
            default:
                 promptParts.push(`A professional, cinematic, high-resolution photo of ${subject}.`);
        }
    }


    promptParts.push(`The camera angle is ${cameraPerspective.toLowerCase().replace('-', ' ')}.`);
    promptParts.push(`The lighting has a ${lightTemperature.toLowerCase()} temperature, creating ${shadowIntensity.toLowerCase()} shadows.`);

    if (backgroundStyle !== 'None' && backgroundStyle !== 'Custom') {
        promptParts.push(`The product is set against a beautiful ${backgroundStyle.toLowerCase()} background.`);
    } else if (backgroundStyle === 'Custom') {
        // This specific instruction is for the compositing task
        promptParts.push(`Seamlessly composite the product onto the provided custom background image. Realistically match the product's lighting, shadows, and reflections to the new environment. Do not alter the background itself.`);
    } else {
         promptParts.push(`The background is neutral, clean, and minimalist to ensure the product is the absolute main focus.`);
    }

    if (styleDescription) {
        const emphasisText = t(`options.styleEmphasis.${emphasis}`).toLowerCase();
        let styleInstruction = '';
        switch (emphasis) {
            case 'BACKGROUND':
                styleInstruction = `The background MUST be replaced with one that perfectly matches this detailed description: "${styleDescription}". Integrate the product into this new scene realistically.`;
                break;
            case 'PRODUCT_DETAIL':
                styleInstruction = `The material, texture, and finish of the product itself must be altered to match these physical properties: "${styleDescription}".`;
                break;
            case 'COLOR_CORRECTION':
                styleInstruction = `The entire image should be color graded to match this specific aesthetic: "${styleDescription}".`;
                break;
            default:
                styleInstruction = `The overall visual style, especially the ${emphasisText}, must be heavily inspired by this description: "${styleDescription}".`;
                break;
        }
        promptParts.push(styleInstruction);
    }

    return promptParts.join(' ');
};

/**
 * Edits an image using the Gemini Nano Banana model with the provided prompt and images.
 */
export const editImageWithNano = async (
    productFile: Base64File,
    prompt: string,
    negativePrompt?: string,
    mask?: Base64File,
    customBackgroundFile?: Base64File
): Promise<string> => {
    let fullPrompt = prompt;
    if (negativePrompt && negativePrompt.trim() !== '') {
        fullPrompt += `\n\nIMPORTANT: Do not include the following elements: ${negativePrompt.trim()}`;
    }

    const parts: any[] = [
        {
            inlineData: {
                data: productFile.base64,
                mimeType: productFile.mimeType,
            },
        },
    ];

    if (customBackgroundFile) {
        parts.push({
            inlineData: {
                data: customBackgroundFile.base64,
                mimeType: customBackgroundFile.mimeType,
            },
        });
    }

    parts.push({ text: fullPrompt });

    if (mask) {
        parts.push({
            inlineData: {
                data: mask.base64,
                mimeType: mask.mimeType,
            }
        });
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("No image was generated by the model.");
};

/**
 * Generates a black and white mask for the main product in an image.
 */
export const generateProductMask = async (productFile: Base64File): Promise<string> => {
    const prompt = "Analyze the provided image and identify the main product. Generate a black and white segmentation mask for it. The main product must be completely solid white (#FFFFFF) and everything else (background, shadows, etc.) must be completely solid black (#000000). The output must be an image, not code or text.";

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: productFile.mimeType, data: productFile.base64 } }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("The model failed to generate a product mask.");
};


/**
 * Takes an existing image and enhances its details using a generative model.
 */
export const enhanceImageDetails = async (
    imageFile: Base64File,
    level: EnhancementLevel
): Promise<string> => {
    let prompt = '';
    switch (level) {
        case 'Subtle':
            prompt = 'Analyze this image. Redraw it, preserving the original composition and subject perfectly, but with subtly refined details. Clean up any minor visual artifacts and slightly increase the overall sharpness and clarity. The goal is a gentle, clean enhancement.';
            break;
        case 'Artistic':
            prompt = 'Use this image as a base. Re-render it with an artistic touch. Dramatically enhance the colors, deepen the contrast, and refine the lighting to be more cinematic and impactful. Add fine, stylized details to the textures while keeping the core subject and composition intact.';
            break;
        case 'Realistic':
        default:
            prompt = 'This is a good image, but it needs a final enhancement. Redraw this image with hyper-realistic details. Significantly increase the level of fine detail in the textures, refine the lighting to be more natural and crisp, and enhance the overall sharpness and definition. The composition and subject must remain identical. The goal is photorealism.';
            break;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: imageFile.mimeType, data: imageFile.base64 } }
            ]
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("The model failed to enhance the image.");
};