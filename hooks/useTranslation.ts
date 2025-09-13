import { useState, useCallback } from 'react';
import { en } from '../locales/en';
import { it } from '../locales/it';

export type Language = 'en' | 'it';

const translations = { en, it };

// Utility to get a nested property from an object using a dot-separated path
const get = (obj: any, path: string): string | undefined => 
    path.split('.').reduce((acc, part) => acc && acc[part], obj);

export const useTranslation = () => {
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: string, params?: Record<string, string | number>) => {
        let translation = get(translations[language], key);

        if (translation === undefined) {
            // Fallback to English if the key is not found in the current language
            translation = get(translations.en, key);
            if (translation === undefined) {
                console.warn(`Translation key '${key}' not found in any language.`);
                return key;
            }
        }

        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                translation = (translation as string).replace(`{${paramKey}}`, String(paramValue));
            });
        }

        return translation;
    }, [language]);

    return { language, setLanguage, t };
};
