import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Truck } from '../types';
import DataTable from './DataTable';
import PlusIcon from './icons/PlusIcon';
import { useTranslation } from '../i18n/i18n';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import TruckForm from './TruckForm';
import MaintenanceModal from './MaintenanceModal';

interface TruckManagementProps {
  onBack: () => void;
}

const TruckManagement: React.FC<TruckManagementProps> = ({ onBack }) => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTrucks();
      setTrucks(data);
    } catch (error) {
      console.error("Failed to fetch trucks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      fetchTrucks();
    }
  }, [view]);

  const columns: { key: keyof Truck; header: string }[] = [
    { key: 'id', header: t('truckManagement.columns.id') },
    { key: 'make', header: t('truckManagement.columns.make') },
    { key: 'model', header: t('truckManagement.columns.model') },
    { key: 'year', header: t('truckManagement.columns.year') },
    { key: 'licensePlate', header: t('truckManagement.columns.licensePlate') },
    { key: 'type', header: t('truckManagement.columns.type') },
    { key: 'status', header: t('truckManagement.columns.status') },
  ];

  const handleEdit = (truck: Truck) => {
    alert(t('truckManagement.editAlert', { make: truck.make, model: truck.model }));
  };

  const handleDelete = (truck: Truck) => {
    if (window.confirm(t('truckManagement.deleteConfirm', { make: truck.make, model: truck.model }))) {
      alert(t('truckManagement.deleteAlert', { make: truck.make, model: truck.model }));
    }
  };

  const handleAddTruck = async (truckData: Omit<Truck, 'id'>) => {
    try {
      await apiService.addTruck(truckData);
      setView('list');
    } catch (error) {
      console.error("Failed to add truck", error);
      alert("Failed to add truck.");
    }
  };

  const handleViewMaintenance = (truck: Truck) => {
    setSelectedTruck(truck);
    setIsMaintenanceModalOpen(true);
  };
  
  const handleCloseMaintenanceModal = () => {
    setIsMaintenanceModalOpen(false);
    setSelectedTruck(null);
  };

  const handleMaintenanceAdded = () => {
      fetchTrucks();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('vehicleManagement.backToVehicles')}>
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('truckManagement.title')}</h1>
        </div>
        {view === 'list' ? (
          <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow">
            <PlusIcon />
            <span className="ml-2">{t('truckManagement.addTruck')}</span>
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
          data={trucks}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMaintenance={handleViewMaintenance}
        />
      ) : (
        <TruckForm onSubmit={handleAddTruck} onCancel={() => setView('list')} />
      )}

      {selectedTruck && (
          <MaintenanceModal 
              isOpen={isMaintenanceModalOpen}
              onClose={handleCloseMaintenanceModal}
              vehicle={selectedTruck}
              onSuccess={handleMaintenanceAdded}
          />
      )}
    </div>
  );
};

export default TruckManagement;