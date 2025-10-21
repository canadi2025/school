import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Payment, Student } from '../types';
import DataTable from './DataTable';
import PlusIcon from './icons/PlusIcon';
import { useTranslation } from '../i18n/i18n';
import LicensePriceCard from './LicensePriceCard';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import PaymentForm from './PaymentForm';
import { useSchool } from '../contexts/SchoolContext';

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'form'>('list');
  const { selectedOffice } = useSchool();

  useEffect(() => {
    const fetchData = async () => {
      const officeId = selectedOffice?.id;
      if (apiService.getCurrentUser()?.role === 'admin' && !officeId) return;

      try {
        setLoading(true);
        const [paymentsData, studentsData] = await Promise.all([
          apiService.getPayments(officeId),
          apiService.getStudents(officeId),
        ]);
        setPayments(paymentsData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch payment management data", error);
      } finally {
        setLoading(false);
      }
    };
    if (view === 'list') {
        fetchData();
    }
  }, [view, selectedOffice]);

  const columns: { key: keyof Payment; header: string }[] = [
    { key: 'id', header: t('paymentManagement.columns.id') },
    { key: 'studentName', header: t('paymentManagement.columns.studentName') },
    { key: 'amount', header: t('paymentManagement.columns.amount') },
    { key: 'date', header: t('paymentManagement.columns.date') },
    { key: 'method', header: t('paymentManagement.columns.method') },
    { key: 'status', header: t('paymentManagement.columns.status') },
  ];

  const handleEdit = (payment: Payment) => {
    alert(t('paymentManagement.editAlert', { id: payment.id }));
  };

  const handleDelete = (payment: Payment) => {
    if (window.confirm(t('paymentManagement.deleteConfirm', { id: payment.id }))) {
      alert(t('paymentManagement.deleteAlert', { id: payment.id }));
    }
  };

  const handleAddPayment = async (paymentData: Omit<Payment, 'id' | 'studentName'>) => {
    try {
      await apiService.addPayment(paymentData);
      setView('list');
    } catch (error) {
      console.error("Failed to add payment", error);
      alert("Failed to add payment.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('paymentManagement.title')}</h1>
        {view === 'list' ? (
          <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-600))] shadow">
            <PlusIcon />
            <span className="ml-2">{t('paymentManagement.addPayment')}</span>
          </button>
        ) : (
          <button onClick={() => setView('list')} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
            <ArrowLeftIcon />
            <span className="ml-2">{t('studentManagement.backToList')}</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <>
          <LicensePriceCard />
          <div className="mt-8">
            <DataTable
              columns={columns}
              data={payments}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </>
      ) : (
        <PaymentForm 
          students={students}
          onSubmit={handleAddPayment}
          onCancel={() => setView('list')}
        />
      )}
    </div>
  );
};

export default PaymentManagement;