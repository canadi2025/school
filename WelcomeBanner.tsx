import React from 'react';
import { useTranslation } from '../i18n/i18n';

interface WelcomeBannerProps {
    userName?: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  const { t } = useTranslation();
  return (
    <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 dark:from-indigo-800 dark:to-purple-900 rounded-xl shadow-lg p-8 overflow-hidden mb-8">
      <div className="absolute inset-0 bg-repeat bg-center opacity-10" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"52\" height=\"26\" viewBox=\"0 0 52 26\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-white">{t('dashboard.welcome.hello', { adminName: userName || t('header.profileName') })}</h2>
        <p className="mt-2 text-white/90 text-lg">{t('dashboard.welcome.message')}</p>
      </div>
    </div>
  );
};

export default WelcomeBanner;