import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import { apiService } from './services/api';
import { LanguageProvider } from './i18n/i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppearanceProvider } from './contexts/AppearanceContext';
import { User, SchoolProfile } from './types';
import SecretaryDashboardLayout from './components/SecretaryDashboardLayout';
import { SchoolProvider } from './contexts/SchoolContext';
import SuperAdminDashboardLayout from './components/SuperAdminDashboardLayout';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    apiService.getSchoolProfile().then(setSchoolProfile);
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
  };

  const handleProfileUpdate = (updatedProfile: SchoolProfile) => {
    setSchoolProfile(updatedProfile);
    if (currentUser?.role === 'admin') {
      const updatedUser = { ...currentUser, name: updatedProfile.adminName };
      setCurrentUser(updatedUser);
      // also update localStorage to persist name change on refresh
      localStorage.setItem('issraedrive_user', JSON.stringify(updatedUser));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AppearanceProvider>
        <LanguageProvider>
          <div>
            {currentUser ? (
              <SchoolProvider>
                {currentUser.role === 'superadmin' ? (
                  <SuperAdminDashboardLayout onLogout={handleLogout} currentUser={currentUser} />
                ) : currentUser.role === 'admin' ? (
                  <DashboardLayout
                    onLogout={handleLogout}
                    currentUser={currentUser}
                    schoolProfile={schoolProfile}
                    onProfileUpdate={handleProfileUpdate}
                  />
                ) : (
                  <SecretaryDashboardLayout
                    onLogout={handleLogout}
                    currentUser={currentUser}
                    schoolProfile={schoolProfile}
                  />
                )}
              </SchoolProvider>
            ) : (
              <LoginPage onLogin={handleLogin} />
            )}
          </div>
        </LanguageProvider>
      </AppearanceProvider>
    </ThemeProvider>
  );
};

export default App;
