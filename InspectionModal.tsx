import React, { useState, useEffect, useCallback } from 'react';
import { Car, Inspection } from '../types';
import { apiService } from '../services/api';
import { useTranslation } from '../i18n/i18n';
import Modal from './Modal';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
}

const InspectionModal: React.FC<InspectionModalProps> = ({ isOpen, onClose, car }) => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    inspectorName: '',
    notes: '',
    result: 'pending' as const,
  });

  const fetchRecords = useCallback(async () => {
    if (!car) return;
    try {
      setLoading(true);
      const data = await apiService.getInspectionsForCar(car.id);
      setRecords(data);
    } catch (error) {
      console.error(`Failed to fetch inspections for car ${car.id}`, error);
    } finally {
      setLoading(false);
    }
  }, [car]);

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen, fetchRecords]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.inspectorName || !newRecord.notes) {
      alert('Please fill all fields.');
      return;
    }
    try {
        await apiService.addInspection({ carId: car.id, ...newRecord });
        setNewRecord({
            date: new Date().toISOString().split('T')[0],
            inspectorName: '',
            notes: '',
            result: 'pending' as const,
        });
        fetchRecords(); // Refresh the list
    } catch (error) {
        console.error("Failed to add inspection record", error);
        alert("Failed to add record.");
    }
  };

  const renderResult = (result: 'passed' | 'failed' | 'pending') => {
    let colorClass = '';
    switch(result) {
        case 'passed':
            colorClass = 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
            break;
        case 'failed':
            colorClass = 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
            break;
        case 'pending':
            colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
            break;
    }
    return <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${colorClass}`}>{result}</span>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('inspectionModal.title', { carName: `${car.make} ${car.model}` })}>
      <div className="space-y-6">
        {/* Add new inspection form */}
        <div className="p-4 border rounded-lg dark:border-gray-600">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('inspectionModal.addTitle')}</h4>
            <form onSubmit={handleAddRecord} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('inspectionModal.form.date')}</label>
                        <input type="date" name="date" id="date" value={newRecord.date} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                    </div>
                    <div>
                        <label htmlFor="inspectorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('inspectionModal.form.inspectorName')}</label>
                        <input type="text" name="inspectorName" id="inspectorName" value={newRecord.inspectorName} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                    </div>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('inspectionModal.form.notes')}</label>
                    <textarea name="notes" id="notes" value={newRecord.notes} onChange={handleInputChange} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"></textarea>
                </div>
                <div>
                    <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('inspectionModal.form.result')}</label>
                    <select name="result" id="result" value={newRecord.result} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm text-gray-900 dark:text-gray-200">
                        <option value="passed">{t('inspectionModal.form.resultOptions.passed')}</option>
                        <option value="failed">{t('inspectionModal.form.resultOptions.failed')}</option>
                        <option value="pending">{t('inspectionModal.form.resultOptions.pending')}</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-md hover:bg-[rgb(var(--color-primary-500))]">{t('inspectionModal.form.submitAdd')}</button>
                </div>
            </form>
        </div>

        {/* Existing records list */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('inspectionModal.existingRecords')}</h4>
          <div className="w-full overflow-hidden rounded-lg shadow-xs border dark:border-gray-700">
            <div className="w-full overflow-x-auto">
              {loading ? (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">{t('inspectionModal.loading')}</p>
              ) : records.length > 0 ? (
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600">
                      <th className="px-4 py-3">{t('inspectionModal.columns.date')}</th>
                      <th className="px-4 py-3">{t('inspectionModal.columns.inspectorName')}</th>
                      <th className="px-4 py-3">{t('inspectionModal.columns.notes')}</th>
                      <th className="px-4 py-3">{t('inspectionModal.columns.result')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {records.map(record => (
                      <tr key={record.id} className="text-gray-700 dark:text-gray-400">
                        <td className="px-4 py-3 text-sm">{record.date}</td>
                        <td className="px-4 py-3 text-sm">{record.inspectorName}</td>
                        <td className="px-4 py-3 text-sm whitespace-normal">{record.notes}</td>
                        <td className="px-4 py-3 text-sm">{renderResult(record.result)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">{t('inspectionModal.noRecords')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InspectionModal;