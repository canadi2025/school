import React, { useState, useEffect, useCallback } from 'react';
import { Car, Maintenance, Truck, Bus, Motorcycle } from '../types';
import { apiService } from '../services/api';
import { useTranslation } from '../i18n/i18n';
import Modal from './Modal';

type Vehicle = Car | Truck | Bus | Motorcycle;

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onSuccess: () => void;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose, vehicle, onSuccess }) => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    cost: 0,
    status: 'scheduled' as const,
  });

  const fetchRecords = useCallback(async () => {
    if (!vehicle) return;
    try {
      setLoading(true);
      const data = await apiService.getMaintenanceForVehicle(vehicle.id);
      setRecords(data);
    } catch (error) {
      console.error(`Failed to fetch maintenance for vehicle ${vehicle.id}`, error);
    } finally {
      setLoading(false);
    }
  }, [vehicle]);

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen, fetchRecords]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: name === 'cost' ? parseFloat(value) : value }));
  };
  
  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.description || newRecord.cost <= 0) {
      alert('Please fill all fields with valid data.');
      return;
    }
    try {
        await apiService.addMaintenance({ vehicleId: vehicle.id, ...newRecord });
        setNewRecord({
            date: new Date().toISOString().split('T')[0],
            description: '',
            cost: 0,
            status: 'scheduled' as const,
        });
        fetchRecords(); // Refresh the list in the modal
        onSuccess(); // Refresh the vehicle list in the parent component
    } catch (error) {
        console.error("Failed to add maintenance record", error);
        alert("Failed to add record.");
    }
  };

  const renderStatus = (status: 'scheduled' | 'completed') => {
    const colorClass = status === 'completed' 
        ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    return <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${colorClass}`}>{status}</span>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('maintenanceModal.title', { vehicleName: `${vehicle.make} ${vehicle.model}` })}>
      <div className="space-y-6">
        {/* Add new record form */}
        <div className="p-4 border rounded-lg dark:border-gray-600">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('maintenanceModal.addTitle')}</h4>
            <form onSubmit={handleAddRecord} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('maintenanceModal.form.date')}</label>
                        <input type="date" name="date" id="date" value={newRecord.date} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                    </div>
                    <div>
                        <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('maintenanceModal.form.cost')}</label>
                        <input type="number" name="cost" id="cost" value={newRecord.cost} onChange={handleInputChange} min="0" step="0.01" required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('maintenanceModal.form.description')}</label>
                    <input type="text" name="description" id="description" value={newRecord.description} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('maintenanceModal.form.status')}</label>
                    <select name="status" id="status" value={newRecord.status} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm text-gray-900 dark:text-gray-200">
                        <option value="scheduled">{t('maintenanceModal.form.statusOptions.scheduled')}</option>
                        <option value="completed">{t('maintenanceModal.form.statusOptions.completed')}</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-md hover:bg-[rgb(var(--color-primary-500))]">{t('maintenanceModal.form.submitAdd')}</button>
                </div>
            </form>
        </div>

        {/* Existing records list */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('maintenanceModal.existingRecords')}</h4>
          <div className="w-full overflow-hidden rounded-lg shadow-xs border dark:border-gray-700">
            <div className="w-full overflow-x-auto">
              {loading ? (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">{t('maintenanceModal.loading')}</p>
              ) : records.length > 0 ? (
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600">
                      <th className="px-4 py-3">{t('maintenanceModal.columns.date')}</th>
                      <th className="px-4 py-3">{t('maintenanceModal.columns.description')}</th>
                      <th className="px-4 py-3">{t('maintenanceModal.columns.cost')}</th>
                      <th className="px-4 py-3">{t('maintenanceModal.columns.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {records.map(record => (
                      <tr key={record.id} className="text-gray-700 dark:text-gray-400">
                        <td className="px-4 py-3 text-sm">{record.date}</td>
                        <td className="px-4 py-3 text-sm">{record.description}</td>
                        <td className="px-4 py-3 text-sm">{record.cost.toFixed(2)} DH</td>
                        <td className="px-4 py-3 text-sm">{renderStatus(record.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">{t('maintenanceModal.noRecords')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MaintenanceModal;