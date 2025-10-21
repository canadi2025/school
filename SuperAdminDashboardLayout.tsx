import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useTranslation } from '../i18n/i18n';
import { apiService } from '../services/api';
import { User } from '../types';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminDashboardView from './SuperAdminDashboardView';
import SaaSSchoolManagement from './SaaSSchoolManagement';
import SubscriptionManagement from './SubscriptionManagement';

interface SuperAdminDashboardLayoutProps {
  onLogout: () => void;
  currentUser: User;
}

type ViewType = 'dashboard' | 'schools' | 'subscriptions';

const SuperAdminDashboardLayout: React.FC<SuperAdminDashboardLayoutProps> = ({ onLogout, currentUser }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const { t } = useTranslation();

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <SuperAdminDashboardView setActiveView={setActiveView} />;
      case 'schools':
        return <SaaSSchoolManagement />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      default:
        const capitalizedView = activeView.charAt(0).toUpperCase() + activeView.slice(1);
        return <div className="p-6 text-gray-700 dark:text-gray-300">{t('notImplemented', { view: capitalizedView })}</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <SuperAdminSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} userName={currentUser?.name} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboardLayout;
