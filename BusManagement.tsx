import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Bus } from '../types';
import DataTable from './DataTable';
import PlusIcon from './icons/PlusIcon';
import { useTranslation } from '../i18n/i18n';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import BusForm from './BusForm';
import MaintenanceModal from './MaintenanceModal';

interface BusManagementProps {
  onBack: () => void;
}

const BusManagement: React.FC<BusManagementProps> = ({ onBack }) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBuses();
      setBuses(data);
    } catch (error) {
      console.error("Failed to fetch buses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      fetchBuses();
    }
  }, [view]);

  const columns: { key: keyof Bus; header: string }[] = [
    { key: 'id', header: t('busManagement.columns.id') },
    { key: 'make', header: t('busManagement.columns.make') },
    { key: 'model', header: t('busManagement.columns.model') },
    { key: 'year', header: t('busManagement.columns.year') },
    { key: 'licensePlate', header: t('busManagement.columns.licensePlate') },
    { key: 'capacity', header: t('busManagement.columns.capacity') },
    { key: 'status', header: t('busManagement.columns.status') },
  ];

  const handleEdit = (bus: Bus) => {
    alert(t('busManagement.editAlert', { make: bus.make, model: bus.model }));
  };

  const handleDelete = (bus: Bus) => {
    if (window.confirm(t('busManagement.deleteConfirm', { make: bus.make, model: bus.model }))) {
      alert(t('busManagement.deleteAlert', { make: bus.make, model: bus.model }));
    }
  };

  const handleAddBus = async (busData: Omit<Bus, 'id'>) => {
    try {
      await apiService.addBus(busData);
      setView('list');
    } catch (error) {
      console.error("Failed to add bus", error);
      alert("Failed to add bus.");
    }
  };

  const handleViewMaintenance = (bus: Bus) => {
    setSelectedBus(bus);
    setIsMaintenanceModalOpen(true);
  };
  
  const handleCloseMaintenanceModal = () => {
    setIsMaintenanceModalOpen(false);
    setSelectedBus(null);
  };

  const handleMaintenanceAdded = () => {
      fetchBuses();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('vehicleManagement.backToVehicles')}>
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('busManagement.title')}</h1>
        </div>
        {view === 'list' ? (
          <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow">
            <PlusIcon />
            <span className="ml-2">{t('busManagement.addBus')}</span>
          </button>
        ) : (
          <button onClick={() => setView('list')} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
            <ArrowLeftIcon />
            <span className="ml-2">{t('studentManagement.backToList')}</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <DataTable
          columns={columns}
          data={buses}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMaintenance={handleViewMaintenance}
        />
      ) : (
        <BusForm onSubmit={handleAddBus} onCancel={() => setView('list')} />
      )}

      {selectedBus && (
          <MaintenanceModal 
              isOpen={isMaintenanceModalOpen}
              onClose={handleCloseMaintenanceModal}
              vehicle={selectedBus}
              onSuccess={handleMaintenanceAdded}
          />
      )}
    </div>
  );
};

export default BusManagement;