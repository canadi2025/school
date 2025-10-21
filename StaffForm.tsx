import React, { useState } from 'react';
import { useTranslation } from '../i18n/i18n';
import { Staff } from '../types';
import IdCardIcon from './icons/IdCardIcon';
import LocationIcon from './icons/LocationIcon';
import MoneyIcon from './icons/MoneyIcon';
import WhatsappFormIcon from './icons/WhatsappFormIcon';
import TagIcon from './icons/TagIcon';
import UserCircleIcon from './icons/UserCircleIcon';
import AtSymbolIcon from './icons/AtSymbolIcon';
import PhoneIconColorful from './icons/PhoneIconColorful';
import FileIcon from './icons/FileIcon';

interface StaffFormProps {
  onSubmit: (staffData: Omit<Staff, 'id' | 'hireDate'>) => void;
  onCancel: () => void;
}

const FormField: React.FC<{ id: string; label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ id, label, icon, children }) => (
    <div>
        <label htmlFor={id} className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        {children}
    </div>
);

const StaffForm: React.FC<StaffFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();

  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    cin: '',
    address: '',
    whatsapp: '',
    salaryType: 'monthly' as 'monthly' | 'hourly' | 'task_based',
    salaryAmount: 0,
    pictureUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    setNewStaff(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStaff(prev => ({ ...prev, pictureUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role || !newStaff.email || !newStaff.phone || !newStaff.cin || newStaff.salaryAmount <= 0) {
      alert('Please fill all fields with valid data.');
      return;
    }
    onSubmit(newStaff);
  };

  const getSalaryAmountLabel = () => {
    switch (newStaff.salaryType) {
      case 'hourly':
        return t('staffManagement.form.salaryAmountHourly');
      case 'task_based':
        return t('staffManagement.form.salaryAmountTask');
      case 'monthly':
      default:
        return t('staffManagement.form.salaryAmountMonthly');
    }
  };
  
  const inputClass = "mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200";

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-8 border-[rgb(var(--color-primary-500))]">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('staffManagement.addStaff')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField id="name" label={t('staffManagement.form.name')} icon={<UserCircleIcon />}>
                <input type="text" name="name" id="name" value={newStaff.name} onChange={handleInputChange} required className={inputClass} />
            </FormField>
            <FormField id="role" label={t('staffManagement.form.role')} icon={<TagIcon />}>
                <input type="text" name="role" id="role" value={newStaff.role} onChange={handleInputChange} required className={inputClass} />
            </FormField>
             <FormField id="cin" label={t('staffManagement.form.cin')} icon={<IdCardIcon />}>
                <input type="text" name="cin" id="cin" value={newStaff.cin} onChange={handleInputChange} required className={inputClass} />
            </FormField>
            <FormField id="address" label={t('staffManagement.form.address')} icon={<LocationIcon />}>
                <input type="text" name="address" id="address" value={newStaff.address} onChange={handleInputChange} required className={inputClass} />
            </FormField>
            <FormField id="email" label={t('staffManagement.form.email')} icon={<AtSymbolIcon />}>
                <input type="email" name="email" id="email" value={newStaff.email} onChange={handleInputChange} required className={inputClass} />
            </FormField>
            <FormField id="phone" label={t('staffManagement.form.phone')} icon={<PhoneIconColorful />}>
                <input type="tel" name="phone" id="phone" value={newStaff.phone} onChange={handleInputChange} required className={inputClass} />
            </FormField>
            <FormField id="whatsapp" label={t('staffManagement.form.whatsapp')} icon={<WhatsappFormIcon />}>
                <input type="tel" name="whatsapp" id="whatsapp" value={newStaff.whatsapp} onChange={handleInputChange} required className={inputClass} />
            </FormField>
            <FormField id="picture" label={t('staffManagement.form.picture')} icon={<FileIcon />}>
                <input type="file" name="picture" id="picture" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[rgba(var(--color-primary-50),1)] dark:file:bg-[rgba(var(--color-primary-900),0.5)] file:text-[rgb(var(--color-primary-700))] dark:file:text-[rgb(var(--color-primary-300))] hover:file:bg-[rgba(var(--color-primary-100),1)] dark:hover:file:bg-[rgba(var(--color-primary-800),0.5)]" />
            </FormField>
            <FormField id="salaryType" label={t('staffManagement.form.salaryType')} icon={<MoneyIcon />}>
                <select name="salaryType" id="salaryType" value={newStaff.salaryType} onChange={handleInputChange} className={inputClass}>
                    <option value="monthly">{t('staffManagement.form.salaryTypeOptions.monthly')}</option>
                    <option value="hourly">{t('staffManagement.form.salaryTypeOptions.hourly')}</option>
                    <option value="task_based">{t('staffManagement.form.salaryTypeOptions.task_based')}</option>
                </select>
            </FormField>
            <FormField id="salaryAmount" label={getSalaryAmountLabel()} icon={<MoneyIcon />}>
                <input type="number" name="salaryAmount" id="salaryAmount" value={newStaff.salaryAmount} onChange={handleInputChange} required min="0" step="0.01" className={inputClass} />
            </FormField>
        </div>
        <div className="flex justify-end pt-4 space-x-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200">{t('staffManagement.form.cancel')}</button>
          <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))] shadow-lg hover:shadow-indigo-500/50 transition-all duration-200">{t('staffManagement.form.submitAdd')}</button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;