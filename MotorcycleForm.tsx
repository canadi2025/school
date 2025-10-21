import React, { useState } from 'react';
import { useTranslation } from '../i18n/i18n';
import { Motorcycle } from '../types';
import MakeIcon from './icons/MakeIcon';
import ModelIcon from './icons/ModelIcon';
import YearIcon from './icons/YearIcon';
import LicensePlateIcon from './icons/LicensePlateIcon';
import StatusIcon from './icons/StatusIcon';
import EngineIcon from './icons/EngineIcon';

interface MotorcycleFormProps {
  onSubmit: (data: Omit<Motorcycle, 'id'>) => void;
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

const MotorcycleForm: React.FC<MotorcycleFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [newMotorcycle, setNewMotorcycle] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    status: 'available' as const,
    engineDisplacement: 150,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMotorcycle(prev => ({ ...prev, [name]: name === 'year' || name === 'engineDisplacement' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMotorcycle.make || !newMotorcycle.model || !newMotorcycle.licensePlate) {
      alert('Please fill all fields.');
      return;
    }
    onSubmit(newMotorcycle);
  };
  
  const inputClass = "mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200";

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-8 border-[rgb(var(--color-primary-500))]">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('motorcycleManagement.addMotorcycle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField id="make" label={t('motorcycleManagement.form.make')} icon={<MakeIcon />}>
            <input type="text" name="make" id="make" value={newMotorcycle.make} onChange={handleInputChange} required className={inputClass} />
          </FormField>
          <FormField id="model" label={t('motorcycleManagement.form.model')} icon={<ModelIcon />}>
            <input type="text" name="model" id="model" value={newMotorcycle.model} onChange={handleInputChange} required className={inputClass} />
          </FormField>
          <FormField id="year" label={t('motorcycleManagement.form.year')} icon={<YearIcon />}>
            <input type="number" name="year" id="year" value={newMotorcycle.year} onChange={handleInputChange} required className={inputClass} />
          </FormField>
          <FormField id="licensePlate" label={t('motorcycleManagement.form.licensePlate')} icon={<LicensePlateIcon />}>
            <input type="text" name="licensePlate" id="licensePlate" value={newMotorcycle.licensePlate} onChange={handleInputChange} required className={inputClass} />
          </FormField>
          <FormField id="engineDisplacement" label={t('motorcycleManagement.form.engineDisplacement')} icon={<EngineIcon />}>
            <input type="number" name="engineDisplacement" id="engineDisplacement" value={newMotorcycle.engineDisplacement} onChange={handleInputChange} required className={inputClass} />
          </FormField>
          <FormField id="status" label={t('motorcycleManagement.form.status')} icon={<StatusIcon />}>
            <select name="status" id="status" value={newMotorcycle.status} onChange={handleInputChange} className={`${inputClass} bg-gray-50 dark:bg-gray-700`}>
              <option value="available">{t('motorcycleManagement.form.statusOptions.available')}</option>
              <option value="in_use">{t('motorcycleManagement.form.statusOptions.in_use')}</option>
              <option value="maintenance">{t('motorcycleManagement.form.statusOptions.maintenance')}</option>
            </select>
          </FormField>
        </div>
        <div className="flex justify-end pt-4 space-x-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200">{t('motorcycleManagement.form.cancel')}</button>
          <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))] shadow-lg transition-all duration-200">{t('motorcycleManagement.form.submitAdd')}</button>
        </div>
      </form>
    </div>
  );
};

export default MotorcycleForm;