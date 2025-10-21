import React, { useState, useEffect, useRef } from 'react';
import LogoutIcon from './icons/LogoutIcon';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/i18n';
import ThemeSwitcher from './ThemeSwitcher';
import WeatherWidget from './WeatherWidget';
import { useSchool } from '../contexts/SchoolContext';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { Notification } from '../types';
import { apiService } from '../services/api';
import NotificationIcon from './icons/NotificationIcon';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  onLogout: () => void;
  userName?: string;
  showSchoolSwitcher?: boolean;
  showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, userName, showSchoolSwitcher, showNotifications }) => {
  const { t } = useTranslation();
  const { offices, selectedOffice, selectOffice } = useSchool();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if(showNotifications) {
      const notifs = await apiService.getNotifications();
      setNotifications(notifs);
    }
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll for new notifications
    return () => clearInterval(interval);
  }, [showNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSchoolChange = (officeId: string) => {
    selectOffice(officeId);
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    await apiService.markNotificationAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await apiService.markAllNotificationsAsRead();
    fetchNotifications();
  };


  return (
    <header className="flex items-center justify-between h-20 px-6 py-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center">
        {showSchoolSwitcher && offices.length > 1 && selectedOffice && (
            <div className="relative">
              <select 
                 value={selectedOffice.id} 
                 onChange={(e) => handleSchoolChange(e.target.value)}
                 className="appearance-none w-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))]"
                 aria-label="Select a school"
              >
                 {offices.map(office => (
                   <option key={office.id} value={office.id}>{office.name}</option>
                 ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-400">
                 <ChevronDownIcon />
              </div>
            </div>
        )}
      </div>
      <div className="flex items-center">
        <div className="mr-4">
            <WeatherWidget />
        </div>
        <div className="mr-4">
            <ThemeSwitcher />
        </div>
        <div className="mr-4">
            <LanguageSwitcher />
        </div>
        
        {showNotifications && (
            <div ref={notificationRef} className="relative mr-4">
                <button 
                    onClick={() => setShowNotificationPanel(prev => !prev)}
                    className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))]"
                >
                    <NotificationIcon />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
                        </span>
                    )}
                </button>
                {showNotificationPanel && (
                    <NotificationPanel 
                        notifications={notifications} 
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAllAsRead={handleMarkAllAsRead}
                    />
                )}
            </div>
        )}

        <div className="flex items-center mr-4">
            <img className="w-10 h-10 rounded-full object-cover" src="https://i.pravatar.cc/100?u=admin" alt="User Avatar" />
            <span className="ml-2 font-semibold text-gray-700 dark:text-gray-200">{userName || t('header.profileName')}</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))]"
          aria-label={t('header.logout')}
        >
          <LogoutIcon />
          <span className="ml-2 text-sm font-medium">{t('header.logout')}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;