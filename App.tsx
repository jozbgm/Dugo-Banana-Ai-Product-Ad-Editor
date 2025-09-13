import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ControlPanel } from './components/ControlPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { History } from './components/History';
import { generatePromptForEditing, editImageWithNano, describeImageStyle, generateProductMask, describeProductComposition, generateInitialAdvertisingPrompt } from './services/geminiService';
import type { AspectRatio, CameraPerspective, StyleEmphasis, Preset, BackgroundStyle, LightTemperature, ShadowIntensity, ShotType } from './types';
import { AspectRatioOptions, CameraPerspectiveOptions, StyleEmphasisOptions, BackgroundStyleOptions, LightTemperatureOptions, ShadowIntensityOptions, ShotTypeOptions } from './constants';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { fileToBase64, formatImageToAspectRatio, dataUrlToFile } from './utils/fileUtils';
import { useTranslation } from './hooks/useTranslation';
import { MaskEditor } from './components/MaskEditor';
import { CollapsibleSection } from './components/CollapsibleSection';
import { useTheme } from './hooks/useTheme';
import { PresetManager } from './components/PresetManager';
import { SavePresetModal } from './components/SavePresetModal';
import { BackgroundPanel } from './components/BackgroundPanel';
import { DugoModeToggle } from './components/DugoModeToggle';

const defaultValues = {
    aspectRatio: AspectRatioOptions[0].value,
    lightTemperature: LightTemperatureOptions[0].value,
    shadowIntensity: ShadowIntensityOptions[0].value,
    cameraPerspective: CameraPerspectiveOptions[0].value,
    shotType: 'Full-shot' as ShotType,
    styleEmphasis: StyleEmphasisOptions[0].value,
    backgroundStyle: BackgroundStyleOptions[0].value,
    generatedPrompt: '',
    negativePrompt: '',
    isDugoMode: false,
    dugoKeywords: '',
};


const App: React.FC = () => {
    const { language, setLanguage, t } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    // Image and Mask State
    const [productImage, setProductImage] = useState<File | null>(null);
    const [styleRefImage, setStyleRefImage] = useState<File | null>(null);
    const [mask, setMask] = useState<string | null>(null);
    const [customBackground, setCustomBackground] = useState<File | null>(null);

    // Control Panel State
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(defaultValues.aspectRatio);
    const [lightTemperature, setLightTemperature] = useState<LightTemperature>(defaultValues.lightTemperature);
    const [shadowIntensity, setShadowIntensity] = useState<ShadowIntensity>(defaultValues.shadowIntensity);
    const [cameraPerspective, setCameraPerspective] = useState<CameraPerspective>(defaultValues.cameraPerspective);
    const [shotType, setShotType] = useState<ShotType>(defaultValues.shotType);
    const [styleEmphasis, setStyleEmphasis] = useState<StyleEmphasis>(defaultValues.styleEmphasis);
    const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>(defaultValues.backgroundStyle);
    const [isDugoMode, setIsDugoMode] = useState<boolean>(defaultValues.isDugoMode);
    const [dugoKeywords, setDugoKeywords] = useState<string>(defaultValues.dugoKeywords);

    // Prompt State
    const [initialPromptTemplate, setInitialPromptTemplate] = useState<string>('');
    const [generatedPrompt, setGeneratedPrompt] = useState<string>(defaultValues.generatedPrompt);
    const [negativePrompt, setNegativePrompt] = useState<string>(defaultValues.negativePrompt);
    
    // Result State
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    // UI/Loading State
    const [isLoadingPrompt, setIsLoadingPrompt] = useState<boolean>(false);
    const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
    const [isMaskingLoading, setIsMaskingLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isMaskEditorOpen, setIsMaskEditorOpen] = useState<boolean>(false);

    // Download Settings
    const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg'>('png');
    const [downloadQuality, setDownloadQuality] = useState<number>(0.92);
    
    // Preset State
    const [presets, setPresets] = useState<Preset[]>([]);
    const [selectedPresetId, setSelectedPresetId] = useState<string>('');
    const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState<boolean>(false);

    // This runs once on mount to get the creative template
    useEffect(() => {
        const fetchInitialPrompt = async () => {
            setIsLoadingPrompt(true);
            try {
                const template = await generateInitialAdvertisingPrompt();
                setInitialPromptTemplate(template);
                setGeneratedPrompt(template); // Pre-fill the prompt text area
            } catch (err) {
                console.error("Failed to fetch initial prompt", err);
                const message = err instanceof Error ? err.message : String(err);
                setError(t('errors.initialPromptFailed', { message }));
            } finally {
                setIsLoadingPrompt(false);
            }
        };

        fetchInitialPrompt();
    }, [t]); // Add `t` dependency for error message translation

    // --- LocalStorage Effects for Presets ---
    useEffect(() => {
        try {
            const savedPresets = localStorage.getItem('dugo-banana-presets');
            if (savedPresets) {
                setPresets(JSON.parse(savedPresets));
            }
        } catch (error) {
            console.error("Failed to load presets from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('dugo-banana-presets', JSON.stringify(presets));
        } catch (error) {
            console.error("Failed to save presets to localStorage", error);
        }
    }, [presets]);


    // --- Core AI Functions ---
    const handleGeneratePrompt = useCallback(async () => {
        // If Dugo Mode is off and we don't have the base template yet, do nothing.
        // The initial useEffect will populate the prompt.
        if (!initialPromptTemplate && !isDugoMode) {
            setGeneratedPrompt('');
            return;
        }

        setIsLoadingPrompt(true);
        setError(null);
        try {
            let productDescription: string | null = null;
            if (productImage) {
                const productBase64 = await fileToBase64(productImage);
                productDescription = await describeProductComposition(productBase64);
            }

            let styleDescription: string | null = null;
            if (styleRefImage) {
                const styleRefFile = await fileToBase64(styleRefImage);
                styleDescription = await describeImageStyle(styleRefFile, styleEmphasis);
            }

            const prompt = await generatePromptForEditing({
                lightTemperature,
                shadowIntensity,
                cameraPerspective,
                shotType,
                styleDescription,
                productDescription,
                emphasis: styleEmphasis,
                backgroundStyle,
                isDugoMode,
                dugoKeywords,
                basePromptTemplate: initialPromptTemplate,
                t
            });
            setGeneratedPrompt(prompt);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(t('errors.promptFailed', { message }));
            setGeneratedPrompt('');
        } finally {
            setIsLoadingPrompt(false);
        }
    }, [productImage, styleRefImage, lightTemperature, shadowIntensity, cameraPerspective, shotType, styleEmphasis, backgroundStyle, isDugoMode, dugoKeywords, t, initialPromptTemplate]);
    
    // This effect automatically regenerates the prompt whenever a relevant setting changes.
    useEffect(() => {
        // Debounce the call to avoid rapid-fire API requests while user is adjusting settings.
        const handler = setTimeout(() => {
            if (!isLoadingPrompt) {
                handleGeneratePrompt();
            }
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [productImage, styleRefImage, lightTemperature, shadowIntensity, cameraPerspective, shotType, styleEmphasis, backgroundStyle, isDugoMode, dugoKeywords, handleGeneratePrompt]);

    const handleGenerateImage = async () => {
        if (!productImage || !generatedPrompt) {
            setError(t('errors.missingData'));
            return;
        }

        setIsLoadingImage(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const productFile = await formatImageToAspectRatio(productImage, aspectRatio);

            const maskFile = mask ? { base64: mask.split(',')[1], mimeType: 'image/png' } : undefined;
            
            let customBackgroundFile;
            if (customBackground && backgroundStyle === 'Custom') {
                customBackgroundFile = await fileToBase64(customBackground);
            }

            const newImage = await editImageWithNano(productFile, generatedPrompt, negativePrompt, maskFile, customBackgroundFile);
            setGeneratedImage(newImage);
            setHistory(prevHistory => [newImage, ...prevHistory]);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(t('errors.imageFailed', { message }));
        } finally {
            setIsLoadingImage(false);
        }
    };

    const handleAutoMask = async () => {
        if (!productImage) return;
        setIsMaskingLoading(true);
        setError(null);
        try {
            const productFile = await fileToBase64(productImage);
            const newMask = await generateProductMask(productFile);
            setMask(newMask);
        } catch (err) {
             const message = err instanceof Error ? err.message : String(err);
             setError(t('errors.maskFailed', { message }));
        } finally {
            setIsMaskingLoading(false);
        }
    };
    
    // --- Preset Management ---
    const handleSavePreset = (name: string) => {
        if (!name.trim()) return;
        const newPreset: Preset = {
            id: Date.now().toString(),
            name: name.trim(),
            settings: {
                aspectRatio,
                lightTemperature,
                shadowIntensity,
                cameraPerspective,
                shotType,
                styleEmphasis,
                backgroundStyle,
                isDugoMode,
                dugoKeywords,
                generatedPrompt,
                negativePrompt,
            }
        };
        const updatedPresets = [...presets, newPreset];
        setPresets(updatedPresets);
        setSelectedPresetId(newPreset.id);
        setIsSavePresetModalOpen(false);
    };

    const handleLoadPreset = (id: string) => {
        setSelectedPresetId(id);
        const preset = presets.find(p => p.id === id);
        if (preset) {
            const { settings } = preset;
            setAspectRatio(settings.aspectRatio);
            setLightTemperature(settings.lightTemperature);
            setShadowIntensity(settings.shadowIntensity);
            setCameraPerspective(settings.cameraPerspective);
            setShotType(settings.shotType ?? defaultValues.shotType);
            setStyleEmphasis(settings.styleEmphasis);
            setBackgroundStyle(settings.backgroundStyle);
            setIsDugoMode(settings.isDugoMode ?? false);
            setDugoKeywords(settings.dugoKeywords ?? '');
            setCustomBackground(null); // Custom background file is not saved in preset
            setGeneratedPrompt(settings.generatedPrompt);
            setNegativePrompt(settings.negativePrompt);
        }
    };

    const handleDeletePreset = () => {
        if (!selectedPresetId) return;
        const presetToDelete = presets.find(p => p.id === selectedPresetId);
        if (presetToDelete && window.confirm(t('presets.deleteConfirm', { name: presetToDelete.name }))) {
            setPresets(presets.filter(p => p.id !== selectedPresetId));
            setSelectedPresetId('');
        }
    };

    // --- Event Handlers ---
    const handleProductImageUpload = (file: File) => {
        setProductImage(file);
        setMask(null); // Reset mask if a new product image is uploaded
    };

    const handleSelectFromHistory = (image: string) => {
        setGeneratedImage(image);
    };

    const handleClearHistory = () => {
        setHistory([]);
    };
    
    const handleReset = () => {
        if (window.confirm(t('header.resetConfirm'))) {
            setProductImage(null);
            setStyleRefImage(null);
            setMask(null);
            setCustomBackground(null);
            setAspectRatio(defaultValues.aspectRatio);
            setLightTemperature(defaultValues.lightTemperature);
            setShadowIntensity(defaultValues.shadowIntensity);
            setCameraPerspective(defaultValues.cameraPerspective);
            setShotType(defaultValues.shotType);
            setStyleEmphasis(defaultValues.styleEmphasis);
            setBackgroundStyle(defaultValues.backgroundStyle);
            setIsDugoMode(defaultValues.isDugoMode);
            setDugoKeywords(defaultValues.dugoKeywords);
            setGeneratedPrompt(defaultValues.generatedPrompt);
            setNegativePrompt(defaultValues.negativePrompt);
            setGeneratedImage(null);
            setError(null);
            setSelectedPresetId('');
            // Also refetch the initial prompt
             const fetchInitialPrompt = async () => {
                setIsLoadingPrompt(true);
                try {
                    const template = await generateInitialAdvertisingPrompt();
                    setInitialPromptTemplate(template);
                    setGeneratedPrompt(template);
                } catch (err) {
                    const message = err instanceof Error ? err.message : String(err);
                    setError(t('errors.initialPromptFailed', { message }));
                } finally {
                    setIsLoadingPrompt(false);
                }
            };
            fetchInitialPrompt();
        }
    };
    
    const handleReiterate = async (image: string) => {
        if (!image) return;
        try {
            const file = await dataUrlToFile(image, `reiterated-image-${Date.now()}.png`);
            handleProductImageUpload(file);
        } catch (error) {
            console.error("Failed to reiterate image:", error);
            setError(t('errors.reiterateFailed'));
        }
    };

    const handleUpdateGeneratedImage = (newImage: string) => {
        setGeneratedImage(newImage);
        setHistory(prev => [newImage, ...prev]);
    };

    // Keyboard shortcut for generation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                if (productImage && generatedPrompt && !isLoadingImage) {
                    handleGenerateImage();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [productImage, generatedPrompt, isLoadingImage, handleGenerateImage]);

    return (
        <>
            <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <Header 
                        language={language} 
                        setLanguage={setLanguage} 
                        t={t} 
                        theme={theme}
                        toggleTheme={toggleTheme}
                        onReset={handleReset}
                    />
                    <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-6 bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <ImageUploader
                                    id="product-image"
                                    title={t('uploader.productTitle')}
                                    onImageUpload={handleProductImageUpload}
                                    imageFile={productImage}
                                    onClear={() => { setProductImage(null); setMask(null); }}
                                    t={t}
                                    onEditMask={() => setIsMaskEditorOpen(true)}
                                    onAutoMask={handleAutoMask}
                                    isMaskingLoading={isMaskingLoading}
                                    mask={mask}
                                />
                                <div className="flex flex-col">
                                    <ImageUploader
                                        id="style-ref-image"
                                        title={t('uploader.styleTitle')}
                                        onImageUpload={setStyleRefImage}
                                        imageFile={styleRefImage}
                                        onClear={() => { setStyleRefImage(null); setStyleEmphasis(StyleEmphasisOptions[0].value); }}
                                        t={t}
                                    />
                                    {styleRefImage && (
                                         <div className="mt-4 flex flex-col gap-4">
                                            <div>
                                                <label htmlFor="style-emphasis" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">{t('uploader.emphasisLabel')}</label>
                                                <select
                                                    id="style-emphasis"
                                                    value={styleEmphasis}
                                                    onChange={(e) => setStyleEmphasis(e.target.value as StyleEmphasis)}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                                                >
                                                    {StyleEmphasisOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <CollapsibleSection title={t('controls.title')}>
                                <ControlPanel
                                    aspectRatio={aspectRatio}
                                    setAspectRatio={setAspectRatio}
                                    lightTemperature={lightTemperature}
                                    setLightTemperature={setLightTemperature}
                                    shadowIntensity={shadowIntensity}
                                    setShadowIntensity={setShadowIntensity}
                                    cameraPerspective={cameraPerspective}
                                    setCameraPerspective={setCameraPerspective}
                                    shotType={shotType}
                                    setShotType={setShotType}
                                    t={t}
                                />
                            </CollapsibleSection>

                            <CollapsibleSection title={t('controls.backgroundTitle')}>
                                <BackgroundPanel
                                    backgroundStyle={backgroundStyle}
                                    setBackgroundStyle={(style) => {
                                        setBackgroundStyle(style);
                                        if (style !== 'Custom') {
                                            setCustomBackground(null);
                                        }
                                    }}
                                    customBackground={customBackground}
                                    setCustomBackground={setCustomBackground}
                                    t={t}
                                />
                            </CollapsibleSection>

                            <CollapsibleSection title={t('prompt.title')} defaultOpen={true}>
                                <div className="flex flex-col gap-4">
                                    <div>
                                         <div className="flex justify-between items-center mb-1.5">
                                            <label htmlFor="generated-prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                                                {mask ? t('prompt.maskedPromptLabel') : t('prompt.positivePromptLabel')}
                                            </label>
                                            {isLoadingPrompt && (
                                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                     <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>{t('prompt.loading')}</span>
                                                </div>
                                            )}
                                        </div>
                                        <textarea
                                            id="generated-prompt"
                                            value={generatedPrompt}
                                            onChange={(e) => setGeneratedPrompt(e.target.value)}
                                            placeholder={mask ? t('prompt.maskedPlaceholder') : t('prompt.placeholder')}
                                            className="w-full h-32 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                                            aria-live="polite"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="negative-prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">{t('prompt.negativePromptLabel')}</label>
                                        <textarea
                                            id="negative-prompt"
                                            value={negativePrompt}
                                            onChange={(e) => setNegativePrompt(e.target.value)}
                                            placeholder={t('prompt.negativePlaceholder')}
                                            className="w-full h-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                                        />
                                    </div>
                                    <DugoModeToggle
                                        isDugoMode={isDugoMode}
                                        setIsDugoMode={setIsDugoMode}
                                        dugoKeywords={dugoKeywords}
                                        setDugoKeywords={setDugoKeywords}
                                        t={t}
                                    />
                                </div>
                            </CollapsibleSection>

                            <CollapsibleSection title={t('presets.title')}>
                                <PresetManager
                                    presets={presets}
                                    selectedPresetId={selectedPresetId}
                                    onLoadPreset={handleLoadPreset}
                                    onDeletePreset={handleDeletePreset}
                                    onOpenSaveModal={() => setIsSavePresetModalOpen(true)}
                                    t={t}
                                />
                            </CollapsibleSection>

                            <button
                                onClick={handleGenerateImage}
                                disabled={!productImage || !generatedPrompt || isLoadingImage || isMaskingLoading}
                                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
                                title={t('generateButton.tooltip')}
                            >
                                {isLoadingImage ? t('generateButton.loading') : t('generateButton.default')}
                                <SparklesIcon />
                            </button>

                            {error && <p className="text-red-600 dark:text-red-400 text-center text-sm mt-2" role="alert">{error}</p>}
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-6">
                            <ResultDisplay
                                generatedImage={generatedImage}
                                isLoading={isLoadingImage}
                                downloadFormat={downloadFormat}
                                setDownloadFormat={setDownloadFormat}
                                downloadQuality={downloadQuality}
                                setDownloadQuality={setDownloadQuality}
                                onReiterate={handleReiterate}
                                onUpdateMainImage={handleUpdateGeneratedImage}
                                t={t}
                            />
                            <History history={history} onSelect={handleSelectFromHistory} onClear={handleClearHistory} t={t}/>
                        </div>
                    </main>
                </div>
            </div>
            {isMaskEditorOpen && productImage && (
                <MaskEditor
                    imageFile={productImage}
                    onClose={() => setIsMaskEditorOpen(false)}
                    onSave={(maskDataUrl) => {
                        setMask(maskDataUrl);
                        setIsMaskEditorOpen(false);
                    }}
                    t={t}
                    initialMask={mask}
                />
            )}
            {isSavePresetModalOpen && (
                <SavePresetModal
                    onClose={() => setIsSavePresetModalOpen(false)}
                    onSave={handleSavePreset}
                    t={t}
                />
            )}
        </>
    );
};

export default App;
