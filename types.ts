export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type LightTemperature = 'Warm' | 'Neutral' | 'Cool';
export type ShadowIntensity = 'Soft' | 'Medium' | 'Hard';
export type CameraPerspective = 'Eye-level' | 'High-angle' | 'Low-angle' | 'Overhead' | 'Dutch-angle' | 'Three-quarter' | 'Profile' | 'Worms-eye' | 'Wide-angle';
export type ShotType = 'Full-shot' | 'Mid-shot' | 'Close-up' | 'Extreme-close-up' | 'Long-shot';
export type StyleEmphasis = 'OVERALL' | 'COLOR' | 'LIGHTING' | 'TEXTURE' | 'COMPOSITION' | 'BACKGROUND' | 'PRODUCT_DETAIL' | 'COLOR_CORRECTION';
export type BackgroundStyle = 'None' | 'Minimalist Studio' | 'Outdoor Nature' | 'Urban Scene' | 'Abstract Gradient' | 'Custom';
export type EnhancementLevel = 'Subtle' | 'Realistic' | 'Artistic';

export interface Option<T> {
    labelKey: string;
    value: T;
}

export interface Preset {
    id: string;
    name: string;
    settings: {
        aspectRatio: AspectRatio;
        lightTemperature: LightTemperature;
        shadowIntensity: ShadowIntensity;
        cameraPerspective: CameraPerspective;
        shotType: ShotType;
        styleEmphasis: StyleEmphasis;
        backgroundStyle: BackgroundStyle;
        isDugoMode: boolean;
        dugoKeywords: string;
        generatedPrompt: string;
        negativePrompt: string;
    }
}
