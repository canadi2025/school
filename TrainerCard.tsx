import React from 'react';
import { Trainer } from '../types';
import { useTranslation } from '../i18n/i18n';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import ViewProfileIcon from './icons/ViewProfileIcon';

interface TrainerCardProps {
    trainer: Trainer;
    onViewProfile: (id: string) => void;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, onViewProfile }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-105">
            <div className="flex items-center space-x-4">
                <img
                    src={trainer.pictureUrl || `https://i.pravatar.cc/150?u=${trainer.id}`}
                    alt={trainer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[rgb(var(--color-primary-200))] dark:border-[rgb(var(--color-primary-700))]"
                />
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{trainer.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{trainer.specialty}</p>
                </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <EmailIcon />
                    <span className="ml-2 truncate">{trainer.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <PhoneIcon />
                    <span className="ml-2">{trainer.phone}</span>
                </div>
            </div>
            <div className="mt-auto pt-4 flex justify-end">
                <button
                    onClick={() => onViewProfile(trainer.id)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))]"
                >
                    <ViewProfileIcon />
                    <span className="ml-2">{t('dataTable.viewProfile')}</span>
                </button>
            </div>
        </div>
    );
};

export default TrainerCard;