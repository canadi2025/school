import React from 'react';
import { Notification } from '../types';
import { useTranslation } from '../i18n/i18n';
import CheckCircleIcon from './icons/CheckCircleIcon';
import StudentsIcon from './icons/StudentsIcon';

interface NotificationPanelProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const { t } = useTranslation();
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-50">
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                {unreadCount > 0 && (
                     <button onClick={onMarkAllAsRead} className="text-sm text-[rgb(var(--color-primary-600))] dark:text-[rgb(var(--color-primary-400))] hover:underline">
                        Mark all as read
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} className={`p-4 flex items-start space-x-3 transition-colors ${!notif.read ? 'bg-blue-50 dark:bg-gray-700/50' : ''}`}>
                            <div className="flex-shrink-0 pt-1">
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ${notif.type === 'payment_due' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                    <StudentsIcon className="h-5 w-5 text-white" />
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timeSince(new Date(notif.date))}</p>
                            </div>
                            {!notif.read && (
                                <div className="flex-shrink-0 pt-1">
                                    <button onClick={() => onMarkAsRead(notif.id)} title="Mark as read" className="text-gray-400 hover:text-green-500">
                                        <CheckCircleIcon />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-sm text-gray-500 dark:text-gray-400">
                        You have no notifications.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;