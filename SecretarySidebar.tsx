import React from 'react';
import DashboardIcon from './icons/DashboardIcon';
import StudentsIcon from './icons/StudentsIcon';
import LessonsIcon from './icons/LessonsIcon';
import PaymentsIcon from './icons/PaymentsIcon';
import { useTranslation } from '../i18n/i18n';
import AttendanceIcon from './icons/AttendanceIcon';
import CalendarViewIcon from './icons/CalendarViewIcon';

type ViewType = 'dashboard' | 'students' | 'lessons' | 'calendar' | 'payments' | 'attendance';

interface SecretarySidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const NavLink: React.FC<{
  view: ViewType;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => {
  const isActive = activeView === view;
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setActiveView(view);
      }}
      className={`flex items-center px-4 py-2.5 my-1 transition-colors duration-200 transform rounded-lg ${
        isActive 
        ? 'bg-white text-[rgb(var(--color-primary-800))] font-semibold shadow dark:bg-gray-700 dark:text-white' 
        : 'text-indigo-100 hover:bg-[rgb(var(--color-primary-800))] hover:text-white dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      <span className="mx-4">{label}</span>
    </a>
  );
};

const SecretarySidebar: React.FC<SecretarySidebarProps> = ({ activeView, setActiveView }) => {
    const { t } = useTranslation();
    const navItems: { view: ViewType; icon: React.ReactNode; label: string }[] = [
        { view: 'dashboard', icon: <DashboardIcon />, label: t('sidebar.dashboard') },
        { view: 'students', icon: <StudentsIcon />, label: t('sidebar.students') },
        { view: 'lessons', icon: <LessonsIcon />, label: t('sidebar.lessons') },
        { view: 'calendar', icon: <CalendarViewIcon />, label: t('sidebar.calendar') },
        { view: 'payments', icon: <PaymentsIcon />, label: t('sidebar.payments') },
        { view: 'attendance', icon: <AttendanceIcon />, label: 'Attendance' },
    ];

  return (
    <div className="flex flex-col w-64 bg-[rgb(var(--color-primary-900))] dark:bg-gray-800 shadow-xl">
      <div className="flex items-center justify-center h-20 border-b border-[rgb(var(--color-primary-800))] dark:border-gray-700">
        <h1 className="text-3xl font-bold text-white">{t('sidebar.brand')}</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        {navItems.map(item => (
            <NavLink key={item.view} {...item} activeView={activeView} setActiveView={setActiveView} />
        ))}
      </nav>
    </div>
  );
};

export default SecretarySidebar;