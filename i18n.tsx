import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enResponse, frResponse] = await Promise.all([
          fetch('/i18n/locales/en.json'),
          fetch('/i18n/locales/fr.json')
        ]);
        if (!enResponse.ok || !frResponse.ok) {
          throw new Error('Failed to fetch translation files');
        }
        const en = await enResponse.json();
        const fr = await frResponse.json();
        setTranslations({ en, fr });
      } catch (error) {
        console.error("Failed to load translations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTranslations();
  }, []);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    if (!translations) {
      return key; // Return key as fallback during load or if fetch fails
    }
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key; 
      }
    }
    
    let strResult = String(result);
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            const regex = new RegExp(`{${rKey}}`, 'g');
            strResult = strResult.replace(regex, String(replacements[rKey]));
        });
    }

    return strResult;
  }, [language, translations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading translations...</div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};