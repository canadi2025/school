import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Office, Student, Subscription } from '../types';
import DataTable from './DataTable';
import { useTranslation } from '../i18n/i18n';
import PlusIcon from './icons/PlusIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const SaaSSchoolManagement: React.FC = () => {
    const { t } = useTranslation();
    const [offices, setOffices] = useState<Office[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'form'>('list');
    const [newOffice, setNewOffice] = useState({ 
        name: '', 
        address: '', 
        phone: '', 
        subscriptionPlan: 'basic' as 'basic' | 'business' | 'enterprise'
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [officesData, studentsData] = await Promise.all([
                apiService.getOffices(),
                apiService.getStudents(), // Fetch all students to calculate counts
            ]);
            setOffices(officesData);
            setStudents(studentsData);
        } catch (error) {
            console.error("Failed to fetch school data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchData();
        }
        if (view === 'form') {
            apiService.getSubscriptions().then(setSubscriptions);
        }
    }, [view]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewOffice(prev => ({ ...prev, [name]: value as any }));
    };
    
    const handleAddOffice = async (e: React.FormEvent) => {
        e.preventDefault();
        if(newOffice.name && newOffice.address && newOffice.phone && newOffice.subscriptionPlan) {
            await apiService.addOffice(newOffice);
            setNewOffice({ name: '', address: '', phone: '', subscriptionPlan: 'basic' });
            setView('list');
        } else {
            alert('Please fill all fields.');
        }
    };

    const dataWithStudentCount = offices.map(office => ({
        ...office,
        studentCount: students.filter(s => s.officeId === office.id).length,
    }));

    const columns = [
        { key: 'name', header: t('schoolManagementSaaS.columns.name') },
        { key: 'address', header: t('schoolManagementSaaS.columns.address') },
        { key: 'phone', header: t('schoolManagementSaaS.columns.phone') },
        { key: 'subscriptionPlan', header: t('schoolManagementSaaS.columns.subscription') },
        { key: 'studentCount', header: t('schoolManagementSaaS.columns.students') },
    ];
    
    if (view === 'form') {
        const inputClasses = "w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] focus:border-transparent outline-none";
        return (
             <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('schoolManagementSaaS.addSchool')}</h1>
                    <button onClick={() => setView('list')} className="flex items-center text-sm px-3 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500">
                        <ArrowLeftIcon />
                        <span className="ml-2">Back to List</span>
                    </button>
                </div>
                <form onSubmit={handleAddOffice} className="space-y-4">
                    <input type="text" name="name" placeholder={t('schoolManagementSaaS.form.name')} value={newOffice.name} onChange={handleInputChange} className={inputClasses} required />
                    <input type="text" name="address" placeholder={t('schoolManagementSaaS.form.address')} value={newOffice.address} onChange={handleInputChange} className={inputClasses} required />
                    <input type="tel" name="phone" placeholder={t('schoolManagementSaaS.form.phone')} value={newOffice.phone} onChange={handleInputChange} className={inputClasses} required />
                    <div>
                        <label htmlFor="subscriptionPlan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('schoolManagementSaaS.form.subscriptionPack')}</label>
                        <select name="subscriptionPlan" id="subscriptionPlan" value={newOffice.subscriptionPlan} onChange={handleInputChange} className={inputClasses} required>
                            {subscriptions.map(sub => (
                                <option key={sub.id} value={sub.id.replace('sub_', '')}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                         <button type="button" onClick={() => setView('list')} className="px-4 py-2 font-medium bg-gray-200 dark:bg-gray-600 rounded-md">{t('schoolManagementSaaS.form.cancel')}</button>
                         <button type="submit" className="px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-md hover:bg-[rgb(var(--color-primary-700))]">{t('schoolManagementSaaS.form.submit')}</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('schoolManagementSaaS.title')}</h1>
                <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-600))] shadow">
                    <PlusIcon />
                    <span className="ml-2">{t('schoolManagementSaaS.addSchool')}</span>
                </button>
            </div>
            <DataTable
                columns={columns as any}
                data={dataWithStudentCount}
                loading={loading}
            />
        </div>
    );
};

export default SaaSSchoolManagement;