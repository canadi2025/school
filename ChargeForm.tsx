import React, { useState } from 'react';
import { useTranslation } from '../i18n/i18n';
import { Charge, ChargeCategory } from '../types';
import { CHARGE_CATEGORIES } from '../constants';
import TagIcon from './icons/TagIcon';
import MoneyIcon from './icons/MoneyIcon';
import UserCircleIcon from './icons/UserCircleIcon';
import CalendarIcon from './icons/CalendarIcon';
import FileIcon from './icons/FileIcon';

interface ChargeFormProps {
  onSubmit: (data: Omit<Charge, 'id'>) => void;
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

const ChargeForm: React.FC<ChargeFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [newCharge, setNewCharge] = useState<Omit<Charge, 'id'>>({
    category: 'other',
    amount: 0,
    beneficiary: '',
    date: new Date().toISOString().split('T')[0],
    invoiceUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCharge(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, this would involve uploading the file and getting a URL.
      // For this mock, we'll just use the file name.
      setNewCharge(prev => ({ ...prev, invoiceUrl: e.target.files![0].name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCharge.amount <= 0 || !newCharge.beneficiary) {
      alert('Please fill all required fields with valid data.');
      return;
    }
    onSubmit(newCharge);
  };

  const inputClass = "mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200";

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-8 border-[rgb(var(--color-primary-500))]">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('chargeManagement.addCharge')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField id="category" label={t('chargeManagement.form.category')} icon={<TagIcon />}>
                <select name="category" id="category" value={newCharge.category} onChange={handleInputChange} className={inputClass}>
                    {CHARGE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{t(`chargeManagement.form.categories.${cat}`)}</option>
                    ))}
                </select>
            </FormField>
             <FormField id="amount" label={t('chargeManagement.form.amount')} icon={<MoneyIcon />}>
                <input type="number" name="amount" id="amount" value={newCharge.amount} onChange={handleInputChange} required min="0.01" step="0.01" className={inputClass} />
            </FormField>
            <FormField id="beneficiary" label={t('chargeManagement.form.beneficiary')} icon={<UserCircleIcon />}>
                <input type="text" name="beneficiary" id="beneficiary" value={newCharge.beneficiary} onChange={handleInputChange} required className={inputClass} />
            </FormField>
            <FormField id="date" label={t('chargeManagement.form.date')} icon={<CalendarIcon />}>
                <input type="date" name="date" id="date" value={newCharge.date} onChange={handleInputChange} required className={inputClass} />
            </FormField>
            <div className="md:col-span-2">
                <FormField id="invoice" label={t('chargeManagement.form.invoice')} icon={<FileIcon />}>
                    <input type="file" name="invoice" id="invoice" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[rgba(var(--color-primary-50),1)] dark:file:bg-[rgba(var(--color-primary-900),0.5)] file:text-[rgb(var(--color-primary-700))] dark:file:text-[rgb(var(--color-primary-300))] hover:file:bg-[rgba(var(--color-primary-100),1)] dark:hover:file:bg-[rgba(var(--color-primary-800),0.5)]" />
                </FormField>
            </div>
        </div>
        <div className="flex justify-end pt-4 space-x-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200">{t('chargeManagement.form.cancel')}</button>
          <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))] shadow-lg hover:shadow-indigo-500/50 transition-all duration-200">{t('chargeManagement.form.submitAdd')}</button>
        </div>
      </form>
    </div>
  );
};

export default ChargeForm;