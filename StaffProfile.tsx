import React, { useState, useEffect } from 'react';
import { Staff } from '../types';
import { apiService } from '../services/api';
import { useTranslation } from '../i18n/i18n';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import CalendarIcon from './icons/CalendarIcon';
import IdCardIcon from './icons/IdCardIcon';
import LocationIcon from './icons/LocationIcon';
import WhatsappFormIcon from './icons/WhatsappFormIcon';
import MoneyIcon from './icons/MoneyIcon';

interface StaffProfileProps {
    staffId: string;
    onBack: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-center">
        <div className="text-gray-400">{icon}</div>
        <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-sm text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);


const StaffProfile: React.FC<StaffProfileProps> = ({ staffId, onBack }) => {
    const { t } = useTranslation();
    const [staff, setStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const staffData = await apiService.getStaffById(staffId);
                setStaff(staffData || null);
            } catch (error) {
                console.error("Failed to fetch staff profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [staffId]);
    
    if (loading) {
        return <div className="text-center p-10 dark:text-gray-300">{t('dataTable.loading')}</div>;
    }

    if (!staff) {
        return <div className="text-center p-10 dark:text-gray-300">Staff member not found.</div>;
    }

    const displaySalary = `${staff.salaryAmount.toFixed(2)} DH / ${t(`staffManagement.form.salaryTypeOptions.${staff.salaryType}`)}`;
    
    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
                    <ArrowLeftIcon />
                    <span className="ml-2">{t('staffManagement.backToList')}</span>
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:space-x-8">
                     <img 
                        src={staff.pictureUrl || `https://i.pravatar.cc/150?u=${staff.id}`} 
                        alt={staff.name} 
                        className="w-32 h-32 rounded-full mx-auto md:mx-0 mb-4 md:mb-0 border-4 border-gray-200 dark:border-gray-700"
                    />
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">{staff.name}</h1>
                        <p className="text-xl text-[rgb(var(--color-primary-600))] dark:text-[rgb(var(--color-primary-400))] mt-1">{staff.role}</p>
                    </div>
                </div>
                
                <hr className="my-8 border-gray-200 dark:border-gray-700" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InfoRow icon={<EmailIcon />} label={t('staffManagement.columns.email')} value={staff.email} />
                    <InfoRow icon={<PhoneIcon />} label={t('staffManagement.columns.phone')} value={staff.phone} />
                    <InfoRow icon={<WhatsappFormIcon />} label={t('staffManagement.form.whatsapp')} value={staff.whatsapp} />
                    <InfoRow icon={<IdCardIcon />} label={t('staffManagement.columns.cin')} value={staff.cin} />
                    <InfoRow icon={<CalendarIcon />} label={t('staffManagement.columns.hireDate')} value={staff.hireDate} />
                    <InfoRow icon={<MoneyIcon />} label={t('staffManagement.columns.salary')} value={displaySalary} />
                    <div className="sm:col-span-2 lg:col-span-3">
                         <InfoRow icon={<LocationIcon />} label={t('staffManagement.form.address')} value={staff.address} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;