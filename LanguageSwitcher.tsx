
import React from 'react';
import { useTranslation } from '../i18n/i18n';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 text-sm font-semibold rounded-md focus:outline-none transition-colors duration-200 ${
          language === 'en'
            ? 'bg-white text-indigo-600 shadow dark:bg-gray-600 dark:text-white'
            : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('fr')}
        className={`px-3 py-1 text-sm font-semibold rounded-md focus:outline-none transition-colors duration-200 ${
          language === 'fr'
            ? 'bg-white text-indigo-600 shadow dark:bg-gray-600 dark:text-white'
            : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600'
        }`}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;