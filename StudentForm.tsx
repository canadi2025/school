import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18n';
import { Student, Payment, User, Office } from '../types';
import { LICENSE_CATEGORY_PRICES } from '../constants';
import UserCircleIcon from './icons/UserCircleIcon';
import AtSymbolIcon from './icons/AtSymbolIcon';
import PhoneIconColorful from './icons/PhoneIconColorful';
import YearIcon from './icons/YearIcon';
import LicenseIconColorful from './icons/LicenseIconColorful';
import StatusIcon from './icons/StatusIcon';
import PriceTagIcon from './icons/PriceTagIcon';
import HomeIcon from './icons/HomeIcon';

const LICENSE_CATEGORIES = ['A', 'A1', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE'];

interface StudentFormData {
  studentData: Omit<Student, 'id'>;
  paymentData: Omit<Payment, 'id' | 'studentId' | 'studentName'>;
}

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  currentUser: User | null;
  offices: Office[];
  defaultOfficeId?: string;
}

const FormField: React.FC<{ id: string; label: string; icon: React.ReactNode; children: React.ReactNode; isReadOnly?: boolean }> = ({ id, label, icon, children, isReadOnly }) => (
    <div>
        <label htmlFor={id} className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        {children}
    </div>
);

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, onCancel, currentUser, offices, defaultOfficeId }) => {
  const { t } = useTranslation();
  
  const initialCategory = 'B';
  const initialPrice = LICENSE_CATEGORY_PRICES[initialCategory];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as const,
    licenseCategory: initialCategory,
    joinDate: new Date().toISOString().split('T')[0],
    actualPrice: initialPrice,
    advancePayment: 0,
    officeId: defaultOfficeId || '',
  });

  const [categoryPrice, setCategoryPrice] = useState(initialPrice);
  const [remainingAmount, setRemainingAmount] = useState(initialPrice);

  useEffect(() => {
    const price = LICENSE_CATEGORY_PRICES[formData.licenseCategory] || 0;
    setCategoryPrice(price);
    setFormData(prev => ({ ...prev, actualPrice: price, advancePayment: 0 }));
  }, [formData.licenseCategory]);

  useEffect(() => {
    const remaining = formData.actualPrice - formData.advancePayment;
    setRemainingAmount(remaining < 0 ? 0 : remaining);
  }, [formData.actualPrice, formData.advancePayment]);
  
  useEffect(() => {
    if (currentUser?.role === 'secretary' && currentUser.officeId) {
      setFormData(prev => ({ ...prev, officeId: currentUser.officeId! }));
    }
  }, [currentUser]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number = value;
    if (type === 'number') {
        parsedValue = value === '' ? 0 : parseFloat(value);
        if (parsedValue < 0) parsedValue = 0;
    }
    
    setFormData(prev => {
        const newFormData = { ...prev, [name]: parsedValue };
        
        if (name === 'advancePayment' && parsedValue > newFormData.actualPrice) {
            newFormData.advancePayment = newFormData.actualPrice;
        }

        return newFormData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const officeId = defaultOfficeId || (currentUser?.role === 'secretary' ? currentUser.officeId : formData.officeId);

    if (!formData.name || !formData.email || !formData.phone || !formData.licenseCategory || !officeId) {
      alert('Please fill all required fields, including office.');
      return;
    }
    const { name, email, phone, status, licenseCategory, joinDate, actualPrice, advancePayment } = formData;
    const studentData = { name, email, phone, status, licenseCategory, joinDate, officeId };
    
    const paymentStatus = advancePayment >= actualPrice ? 'paid' : 'pending';
  
    const paymentData = {
        amount: advancePayment,
        date: joinDate,
        status: paymentStatus,
        method: 'cash' as const,
    };

    onSubmit({ studentData, paymentData });
  };
  
  const inputClass = "mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200";
  const readOnlyInputClass = `${inputClass} bg-gray-100 dark:bg-gray-600 cursor-not-allowed`;


  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-8 border-blue-500">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('studentManagement.addStudent')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField id="name" label={t('studentManagement.form.name')} icon={<UserCircleIcon />}>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className={inputClass} />
          </FormField>
          <FormField id="email" label={t('studentManagement.form.email')} icon={<AtSymbolIcon />}>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className={inputClass} />
          </FormField>
          <FormField id="phone" label={t('studentManagement.form.phone')} icon={<PhoneIconColorful />}>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} required className={inputClass} />
          </FormField>
           <FormField id="joinDate" label={t('studentManagement.form.inscriptionDate')} icon={<YearIcon />}>
            <input type="date" name="joinDate" id="joinDate" value={formData.joinDate} onChange={handleInputChange} required className={inputClass} />
          </FormField>
          <FormField id="licenseCategory" label={t('studentManagement.form.licenseCategory')} icon={<LicenseIconColorful />}>
            <select name="licenseCategory" id="licenseCategory" value={formData.licenseCategory} onChange={handleInputChange} className={inputClass}>
              {LICENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </FormField>
           <FormField id="status" label={t('studentManagement.form.status')} icon={<StatusIcon />}>
            <select name="status" id="status" value={formData.status} onChange={handleInputChange} className={inputClass}>
              <option value="active">{t('studentManagement.form.statusOptions.active')}</option>
              <option value="inactive">{t('studentManagement.form.statusOptions.inactive')}</option>
              <option value="completed">{t('studentManagement.form.statusOptions.completed')}</option>
            </select>
          </FormField>

          {currentUser?.role === 'admin' && !defaultOfficeId && (
            <FormField id="officeId" label={t('studentManagement.form.office')} icon={<HomeIcon />}>
              <select name="officeId" id="officeId" value={formData.officeId} onChange={handleInputChange} className={inputClass} required>
                <option value="">Select an office</option>
                {offices.map(office => <option key={office.id} value={office.id}>{office.name}</option>)}
              </select>
            </FormField>
          )}

          <div className="md:col-span-2 my-4 border-t border-gray-200 dark:border-gray-700"></div>
          <FormField id="categoryPrice" label={t('studentManagement.form.categoryPrice')} icon={<PriceTagIcon />}>
            <input type="text" name="categoryPrice" id="categoryPrice" value={`${categoryPrice.toFixed(2)} DH`} readOnly className={readOnlyInputClass} />
          </FormField>
          <FormField id="actualPrice" label={t('studentManagement.form.actualPrice')} icon={<PriceTagIcon />}>
            <input type="number" name="actualPrice" id="actualPrice" value={formData.actualPrice} onChange={handleInputChange} required min="0" className={inputClass} />
          </FormField>
          <FormField id="advancePayment" label={t('studentManagement.form.advancePayment')} icon={<PriceTagIcon />}>
            <input type="number" name="advancePayment" id="advancePayment" value={formData.advancePayment} onChange={handleInputChange} required min="0" className={inputClass} />
          </FormField>
          <FormField id="remainingAmount" label={t('studentManagement.form.remainingAmount')} icon={<PriceTagIcon />}>
            <input type="text" name="remainingAmount" id="remainingAmount" value={`${remainingAmount.toFixed(2)} DH`} readOnly className={readOnlyInputClass} />
          </FormField>
        </div>
        <div className="flex justify-end pt-6 space-x-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200">{t('studentManagement.form.cancel')}</button>
          <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-blue-500/50 transition-all duration-200">{t('studentManagement.form.submitAdd')}</button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;