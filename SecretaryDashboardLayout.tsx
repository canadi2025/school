import React, { useState, useEffect } from 'react';
import SecretarySidebar from './SecretarySidebar';
import Header from './Header';
import DashboardView from './DashboardView';
import StudentManagement from './StudentManagement';
import LessonManagement from './LessonManagement';
import PaymentManagement from './PaymentManagement';
import { useTranslation } from '../i18n/i18n';
import { apiService } from '../services/api';
import { SchoolProfile, User } from '../types';
import { useSchool } from '../contexts/SchoolContext';
import AttendanceManagement from './AttendanceManagement';
import CalendarView from './CalendarView';

interface SecretaryDashboardLayoutProps {
  onLogout: () => void;
  currentUser: User;
  schoolProfile: SchoolProfile | null;
}

type ViewType = 'dashboard' | 'students' | 'lessons' | 'calendar' | 'payments' | 'attendance';

const SecretaryDashboardLayout: React.FC<SecretaryDashboardLayoutProps> = ({ onLogout, currentUser, schoolProfile }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const { t } = useTranslation();
  const { setOffices, selectOffice } = useSchool();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
          if (currentUser?.officeId) {
            const allOffices = await apiService.getOffices();
            const myOffice = allOffices.find(o => o.id === currentUser.officeId);
            if (myOffice) {
              setOffices([myOffice]);
              selectOffice(myOffice.id);
            }
          }
        } catch (error) {
          console.error("Failed to fetch initial data for secretary", error);
        } finally {
            setLoading(false);
        }
    };
    fetchInitialData();
  }, [currentUser, setOffices, selectOffice]);


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView userName={currentUser?.name} />;
      case 'students':
        return <StudentManagement />;
      case 'lessons':
        return <LessonManagement />;
      case 'calendar':
        return <CalendarView />;
      case 'payments':
        return <PaymentManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      default:
        const capitalizedView = activeView.charAt(0).toUpperCase() + activeView.slice(1);
        return <div className="p-6 text-gray-700 dark:text-gray-300">{t('notImplemented', { view: capitalizedView })}</div>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">Loading Configuration...</div>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <SecretarySidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} userName={currentUser?.name} />
        
        <div className="relative flex-1">
          {schoolProfile?.logo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <img
                src={schoolProfile.logo}
                alt="School Logo Watermark"
                className="w-72 h-72 opacity-5"
              />
            </div>
          )}
          
          <main className="absolute inset-0 overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto px-6 pt-8 pb-16">
              {renderContent()}
            </div>
          </main>
        </div>

        <footer className="absolute bottom-0 left-0 p-4 z-20">
            <a href="mailto:canadi205@gmail.com" className="text-xs text-gray-500 dark:text-gray-400 hover:text-[rgb(var(--color-primary-600))] dark:hover:text-[rgb(var(--color-primary-400))] transition-colors">
                IssraeDrive copyright
            </a>
        </footer>
      </div>
    </div>
  );
};

export default SecretaryDashboardLayout;