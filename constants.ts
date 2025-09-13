import type { AspectRatio, CameraPerspective, LightTemperature, ShadowIntensity, Option, StyleEmphasis, BackgroundStyle, ShotType, EnhancementLevel } from './types';

export const AspectRatioOptions: ReadonlyArray<Option<AspectRatio>> = [
    { labelKey: 'options.aspectRatio.1:1', value: '1:1' },
    { labelKey: 'options.aspectRatio.3:4', value: '3:4' },
    { labelKey: 'options.aspectRatio.4:3', value: '4:3' },
    { labelKey: 'options.aspectRatio.9:16', value: '9:16' },
    { labelKey: 'options.aspectRatio.16:9', value: '16:9' },
];

export const LightTemperatureOptions: ReadonlyArray<Option<LightTemperature>> = [
    { labelKey: 'options.lightTemperature.Warm', value: 'Warm' },
    { labelKey: 'options.lightTemperature.Neutral', value: 'Neutral' },
    { labelKey: 'options.lightTemperature.Cool', value: 'Cool' },
];

export const ShadowIntensityOptions: ReadonlyArray<Option<ShadowIntensity>> = [
    { labelKey: 'options.shadowIntensity.Soft', value: 'Soft' },
    { labelKey: 'options.shadowIntensity.Medium', value: 'Medium' },
    { labelKey: 'options.shadowIntensity.Hard', value: 'Hard' },
];

export const CameraPerspectiveOptions: ReadonlyArray<Option<CameraPerspective>> = [
    { labelKey: 'options.cameraPerspective.Eye-level', value: 'Eye-level' },
    { labelKey: 'options.cameraPerspective.Three-quarter', value: 'Three-quarter' },
    { labelKey: 'options.cameraPerspective.High-angle', value: 'High-angle' },
    { labelKey: 'options.cameraPerspective.Low-angle', value: 'Low-angle' },
    // FIX: Changed value from 'Worm\'s-eye' to 'Worms-eye' to match the CameraPerspective type.
    { labelKey: 'options.cameraPerspective.Worms-eye', value: 'Worms-eye' },
    { labelKey: 'options.cameraPerspective.Overhead', value: 'Overhead' },
    { labelKey: 'options.cameraPerspective.Dutch-angle', value: 'Dutch-angle' },
    { labelKey: 'options.cameraPerspective.Profile', value: 'Profile' },
    { labelKey: 'options.cameraPerspective.Wide-angle', value: 'Wide-angle' },
];

export const ShotTypeOptions: ReadonlyArray<Option<ShotType>> = [
    { labelKey: 'options.shotType.Long-shot', value: 'Long-shot' },
    { labelKey: 'options.shotType.Full-shot', value: 'Full-shot' },
    { labelKey: 'options.shotType.Mid-shot', value: 'Mid-shot' },
    { labelKey: 'options.shotType.Close-up', value: 'Close-up' },
    { labelKey: 'options.shotType.Extreme-close-up', value: 'Extreme-close-up' },
];


export const StyleEmphasisOptions: ReadonlyArray<Option<StyleEmphasis>> = [
    { labelKey: 'options.styleEmphasis.OVERALL', value: 'OVERALL' },
    { labelKey: 'options.styleEmphasis.COLOR', value: 'COLOR' },
    { labelKey: 'options.styleEmphasis.LIGHTING', value: 'LIGHTING' },
    { labelKey: 'options.styleEmphasis.TEXTURE', value: 'TEXTURE' },
    { labelKey: 'options.styleEmphasis.COMPOSITION', value: 'COMPOSITION' },
    { labelKey: 'options.styleEmphasis.BACKGROUND', value: 'BACKGROUND' },
    { labelKey: 'options.styleEmphasis.PRODUCT_DETAIL', value: 'PRODUCT_DETAIL' },
    { labelKey: 'options.styleEmphasis.COLOR_CORRECTION', value: 'COLOR_CORRECTION' },
];

export const BackgroundStyleOptions: ReadonlyArray<Option<BackgroundStyle>> = [
    { labelKey: 'options.backgroundStyle.None', value: 'None' },
    { labelKey: 'options.backgroundStyle.MinimalistStudio', value: 'Minimalist Studio' },
    { labelKey: 'options.backgroundStyle.OutdoorNature', value: 'Outdoor Nature' },
    { labelKey: 'options.backgroundStyle.UrbanScene', value: 'Urban Scene' },
    { labelKey: 'options.backgroundStyle.AbstractGradient', value: 'Abstract Gradient' },
    { labelKey: 'options.backgroundStyle.Custom', value: 'Custom' },
];

export const EnhancementLevelOptions: ReadonlyArray<Option<EnhancementLevel>> = [
    { labelKey: 'options.enhancementLevel.Realistic', value: 'Realistic' },
    { labelKey: 'options.enhancementLevel.Subtle', value: 'Subtle' },
    { labelKey: 'options.enhancementLevel.Artistic', value: 'Artistic' },
];