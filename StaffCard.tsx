import React from 'react';
import { Staff } from '../types';
import { useTranslation } from '../i18n/i18n';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import ViewProfileIcon from './icons/ViewProfileIcon';

interface StaffCardProps {
    staff: Staff;
    onViewDetails: (id: string) => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, onViewDetails }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-105">
            <div className="flex items-center space-x-4">
                <img
                    src={staff.pictureUrl || `https://i.pravatar.cc/150?u=${staff.id}`}
                    alt={staff.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[rgb(var(--color-primary-200))] dark:border-[rgb(var(--color-primary-700))]"
                />
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{staff.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{staff.role}</p>
                </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <EmailIcon />
                    <span className="ml-2 truncate">{staff.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <PhoneIcon />
                    <span className="ml-2">{staff.phone}</span>
                </div>
            </div>
            <div className="mt-auto pt-4 flex justify-end">
                <button
                    onClick={() => onViewDetails(staff.id)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))]"
                >
                    <ViewProfileIcon />
                    <span className="ml-2">{t('dataTable.viewProfile')}</span>
                </button>
            </div>
        </div>
    );
};

export default StaffCard;