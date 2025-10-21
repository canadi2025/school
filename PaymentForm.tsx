import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18n';
import { Payment, Student } from '../types';
import { LICENSE_CATEGORY_PRICES } from '../constants';
import UserCircleIcon from './icons/UserCircleIcon';
import PriceTagIcon from './icons/PriceTagIcon';
import YearIcon from './icons/YearIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import StatusIcon from './icons/StatusIcon';


interface PaymentFormProps {
    students: Student[];
    onSubmit: (data: Omit<Payment, 'id' | 'studentName'>) => void;
    onCancel: () => void;
}

const FormField: React.FC<{ id: string; label: string; icon: React.ReactNode; children: React.ReactNode; isReadOnly?: boolean }> = ({ id, label, icon, children }) => (
    <div>
        <label htmlFor={id} className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        {children}
    </div>
);

const PaymentForm: React.FC<PaymentFormProps> = ({ students, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [totalAmount, setTotalAmount] = useState(0);
    const [newPayment, setNewPayment] = useState({
      studentId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'paid' as const,
      method: 'card' as const,
    });

    useEffect(() => {
        const selectedStudent = students.find(s => s.id === newPayment.studentId);
        if (selectedStudent) {
            const price = LICENSE_CATEGORY_PRICES[selectedStudent.licenseCategory] || 0;
            setTotalAmount(price);
            setNewPayment(prev => ({...prev, amount: 0}));
        } else {
            setTotalAmount(0);
        }
    }, [newPayment.studentId, students]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'amount') {
            let advanceAmount = Number(value);
            if (advanceAmount > totalAmount) {
                advanceAmount = totalAmount;
            }
            if (advanceAmount < 0) {
                advanceAmount = 0;
            }
            setNewPayment(prev => ({ ...prev, amount: advanceAmount }));
        } else {
            setNewPayment(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPayment.studentId || newPayment.amount < 0) {
            alert('Please select a student and ensure amount is valid.');
            return;
        }
        onSubmit(newPayment);
    };
    
    const inputClass = "mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200";
    const readOnlyInputClass = `${inputClass} bg-gray-100 dark:bg-gray-600 cursor-not-allowed`;


    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-8 border-[rgb(var(--color-primary-500))]">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('paymentManagement.addPayment')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2">
                         <FormField id="studentId" label={t('paymentManagement.form.student')} icon={<UserCircleIcon />}>
                            <select name="studentId" id="studentId" value={newPayment.studentId} onChange={handleInputChange} required className={inputClass}>
                                <option value="">{t('paymentManagement.form.selectStudent')}</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.licenseCategory})</option>)}
                            </select>
                        </FormField>
                    </div>
                   
                    <FormField id="totalAmount" label={t('paymentManagement.form.totalAmount')} icon={<PriceTagIcon />}>
                        <input type="number" name="totalAmount" id="totalAmount" value={totalAmount} readOnly className={readOnlyInputClass} />
                    </FormField>
                    <FormField id="amount" label={t('paymentManagement.form.advanceAmount')} icon={<PriceTagIcon />}>
                        <input type="number" name="amount" id="amount" value={newPayment.amount} onChange={handleInputChange} required className={inputClass} />
                    </FormField>
                    <FormField id="remainingAmount" label={t('paymentManagement.form.remainingAmount')} icon={<PriceTagIcon />}>
                        <input type="number" name="remainingAmount" id="remainingAmount" value={totalAmount - newPayment.amount} readOnly className={readOnlyInputClass} />
                    </FormField>
                    <FormField id="date" label={t('paymentManagement.form.date')} icon={<YearIcon />}>
                        <input type="date" name="date" id="date" value={newPayment.date} onChange={handleInputChange} required className={inputClass} />
                    </FormField>
                    <FormField id="method" label={t('paymentManagement.form.method')} icon={<CreditCardIcon />}>
                        <select name="method" id="method" value={newPayment.method} onChange={handleInputChange} className={inputClass}>
                            <option value="card">{t('paymentManagement.form.methodOptions.card')}</option>
                            <option value="cash">{t('paymentManagement.form.methodOptions.cash')}</option>
                            <option value="transfer">{t('paymentManagement.form.methodOptions.transfer')}</option>
                        </select>
                    </FormField>
                    <FormField id="status" label={t('paymentManagement.form.status')} icon={<StatusIcon />}>
                        <select name="status" id="status" value={newPayment.status} onChange={handleInputChange} className={inputClass}>
                            <option value="paid">{t('paymentManagement.form.statusOptions.paid')}</option>
                            <option value="pending">{t('paymentManagement.form.statusOptions.pending')}</option>
                            <option value="overdue">{t('paymentManagement.form.statusOptions.overdue')}</option>
                        </select>
                    </FormField>
                </div>
                <div className="flex justify-end pt-6 space-x-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200">{t('paymentManagement.form.cancel')}</button>
                    <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))] shadow-lg transition-all duration-200">{t('paymentManagement.form.submitAdd')}</button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;