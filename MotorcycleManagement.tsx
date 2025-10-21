import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Motorcycle } from '../types';
import DataTable from './DataTable';
import PlusIcon from './icons/PlusIcon';
import { useTranslation } from '../i18n/i18n';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import MotorcycleForm from './MotorcycleForm';
import MaintenanceModal from './MaintenanceModal';

interface MotorcycleManagementProps {
  onBack: () => void;
}

const MotorcycleManagement: React.FC<MotorcycleManagementProps> = ({ onBack }) => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
  
  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMotorcycles();
      setMotorcycles(data);
    } catch (error) {
      console.error("Failed to fetch motorcycles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      fetchMotorcycles();
    }
  }, [view]);

  const columns: { key: keyof Motorcycle; header: string }[] = [
    { key: 'id', header: t('motorcycleManagement.columns.id') },
    { key: 'make', header: t('motorcycleManagement.columns.make') },
    { key: 'model', header: t('motorcycleManagement.columns.model') },
    { key: 'year', header: t('motorcycleManagement.columns.year') },
    { key: 'licensePlate', header: t('motorcycleManagement.columns.licensePlate') },
    { key: 'engineDisplacement', header: t('motorcycleManagement.columns.engineDisplacement') },
    { key: 'status', header: t('motorcycleManagement.columns.status') },
  ];

  const handleEdit = (motorcycle: Motorcycle) => {
    alert(t('motorcycleManagement.editAlert', { make: motorcycle.make, model: motorcycle.model }));
  };

  const handleDelete = (motorcycle: Motorcycle) => {
    if (window.confirm(t('motorcycleManagement.deleteConfirm', { make: motorcycle.make, model: motorcycle.model }))) {
      alert(t('motorcycleManagement.deleteAlert', { make: motorcycle.make, model: motorcycle.model }));
    }
  };

  const handleAddMotorcycle = async (motorcycleData: Omit<Motorcycle, 'id'>) => {
    try {
      await apiService.addMotorcycle(motorcycleData);
      setView('list');
    } catch (error) {
      console.error("Failed to add motorcycle", error);
      alert("Failed to add motorcycle.");
    }
  };

  const handleViewMaintenance = (motorcycle: Motorcycle) => {
    setSelectedMotorcycle(motorcycle);
    setIsMaintenanceModalOpen(true);
  };
  
  const handleCloseMaintenanceModal = () => {
    setIsMaintenanceModalOpen(false);
    setSelectedMotorcycle(null);
  };

  const handleMaintenanceAdded = () => {
      fetchMotorcycles();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('vehicleManagement.backToVehicles')}>
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('motorcycleManagement.title')}</h1>
        </div>
        {view === 'list' ? (
          <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow">
            <PlusIcon />
            <span className="ml-2">{t('motorcycleManagement.addMotorcycle')}</span>
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
          data={motorcycles}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMaintenance={handleViewMaintenance}
        />
      ) : (
        <MotorcycleForm onSubmit={handleAddMotorcycle} onCancel={() => setView('list')} />
      )}

      {selectedMotorcycle && (
          <MaintenanceModal 
              isOpen={isMaintenanceModalOpen}
              onClose={handleCloseMaintenanceModal}
              vehicle={selectedMotorcycle}
              onSuccess={handleMaintenanceAdded}
          />
      )}
    </div>
  );
};

export default MotorcycleManagement;