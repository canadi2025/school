import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from './DashboardView';
import StudentManagement from './StudentManagement';
import TrainerManagement from './TrainerManagement';
import VehicleManagement from './VehicleManagement';
import LessonManagement from './LessonManagement';
import PaymentManagement from './PaymentManagement';
import ExamManagement from './ExamManagement';
import { useTranslation } from '../i18n/i18n';
import ChargeManagement from './ChargeManagement';
import StaffManagement from './StaffManagement';
import SettingsPage from './SettingsPage';
import { apiService } from '../services/api';
import { SchoolProfile, User } from '../types';
import { useSchool } from '../contexts/SchoolContext';
import SchoolSelection from './SchoolSelection';
import CalendarView from './CalendarView';

interface DashboardLayoutProps {
  onLogout: () => void;
  currentUser: User;
  schoolProfile: SchoolProfile | null;
  onProfileUpdate: (profile: SchoolProfile) => void;
}

type ViewType = 'dashboard' | 'students' | 'trainers' | 'staff' | 'vehicles' | 'lessons' | 'calendar' | 'payments' | 'exams' | 'charge' | 'settings';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout, currentUser, schoolProfile, onProfileUpdate }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const { t } = useTranslation();

  const { offices, setOffices, selectedOffice, selectOffice } = useSchool();
  const [loadingOffices, setLoadingOffices] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            setLoadingOffices(true);
            const officesData = await apiService.getOffices();
            setOffices(officesData);
            if (officesData.length === 1) {
                selectOffice(officesData[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        } finally {
            setLoadingOffices(false);
        }
    };

    fetchInitialData();
  }, [setOffices, selectOffice]);


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView userName={currentUser?.name} />;
      case 'students':
        return <StudentManagement />;
      case 'trainers':
        return <TrainerManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'lessons':
        return <LessonManagement />;
      case 'calendar':
        return <CalendarView />;
      case 'payments':
        return <PaymentManagement />;
      case 'exams':
        return <ExamManagement />;
      case 'charge':
        return <ChargeManagement />;
      case 'settings':
        return <SettingsPage onProfileUpdate={onProfileUpdate} />;
      default:
        const capitalizedView = activeView.charAt(0).toUpperCase() + activeView.slice(1);
        return <div className="p-6 text-gray-700 dark:text-gray-300">{t('notImplemented', { view: capitalizedView })}</div>;
    }
  };

  if (loadingOffices) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">Loading Configuration...</div>
      </div>
    );
  }

  if (!selectedOffice && offices.length > 1) {
    return <SchoolSelection />;
  }

  if (offices.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-4">
          <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No schools found.</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Please add a school in the settings to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} userName={currentUser?.name} showSchoolSwitcher showNotifications />
        
        <div className="relative flex-1">
          {/* Background Logo Watermark */}
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
              {selectedOffice ? renderContent() : null}
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

export default DashboardLayout;