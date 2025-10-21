import React, { useState } from 'react';
import { apiService } from '../services/api';
import { useTranslation } from '../i18n/i18n';
import LogoIcon from './icons/LogoIcon';
import LoginWave from './icons/LoginWave';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@issraedrive.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = async (emailToLogin: string, passwordToLogin: string) => {
    setIsLoading(true);
    setError('');
    try {
      const { user } = await apiService.login(emailToLogin, passwordToLogin);
      onLogin(user);
    } catch (err) {
      setError(t('login.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const handleDemoLogin = (role: 'admin' | 'secretary' | 'superadmin') => {
    let demoEmail = '';
    switch (role) {
        case 'admin':
            demoEmail = 'admin@issraedrive.com';
            break;
        case 'secretary':
            demoEmail = 'secretary@issraedrive.com';
            break;
        case 'superadmin':
            demoEmail = 'superadmin@issraedrive.com';
            break;
    }
    const demoPassword = 'password';

    setEmail(demoEmail);
    setPassword(demoPassword);
    performLogin(demoEmail, demoPassword);
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl flex rounded-xl shadow-2xl overflow-hidden">
        {/* Decorative Panel */}
        <div className="hidden lg:block w-1/2 bg-[rgb(var(--color-primary-900))] p-12 text-white relative">
          <LoginWave className="absolute top-0 right-0 h-full w-auto transform translate-x-1/2 opacity-50" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight">{t('login.welcomeTitle')}</h1>
            <p className="mt-4 text-[rgb(var(--color-primary-200))]">{t('login.welcomeDescription')}</p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 p-8 sm:p-12 flex items-center">
          <div className="w-full">
            <div className="text-center">
              <LogoIcon className="h-12 w-auto mx-auto text-[rgb(var(--color-primary-600))] dark:text-[rgb(var(--color-primary-400))]" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t('login.title')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t('login.subtitle')}
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('login.emailPlaceholder')}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('login.passwordPlaceholder')}
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))] disabled:bg-[rgb(var(--color-primary-400))] transition-colors"
                >
                  {isLoading ? t('login.signingInButton') : t('login.signInButton')}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {t('login.demoAccess')}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <div>
                  <button
                      type="button"
                      onClick={() => handleDemoLogin('superadmin')}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                      {t('login.demoSuperAdmin')}
                  </button>
                </div>
                <div>
                  <button
                      type="button"
                      onClick={() => handleDemoLogin('admin')}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))] disabled:opacity-50"
                  >
                      {t('login.demoAdmin')}
                  </button>
                </div>
                <div className="sm:col-span-2">
                  <button
                      type="button"
                      onClick={() => handleDemoLogin('secretary')}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))] disabled:opacity-50"
                  >
                      {t('login.demoSecretary')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;