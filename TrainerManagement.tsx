import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { Trainer } from '../types';
import PlusIcon from './icons/PlusIcon';
import { useTranslation } from '../i18n/i18n';
import TrainerForm from './TrainerForm';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import TrainerCard from './TrainerCard';
import TrainerProfile from './TrainerProfile';

const TrainerManagement: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'form' | 'profile'>('list');
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTrainers();
        setTrainers(data);
      } catch (error) {
        console.error("Failed to fetch trainers", error);
      } finally {
        setLoading(false);
      }
    };
    if (view === 'list') {
      fetchTrainers();
    }
  }, [view]);

  const groupedTrainers = useMemo(() => {
    return trainers.reduce((acc, member) => {
      const specialty = member.specialty || 'Unassigned';
      (acc[specialty] = acc[specialty] || []).push(member);
      return acc;
    }, {} as Record<string, Trainer[]>);
  }, [trainers]);

  const handleAddTrainer = async (trainerData: Omit<Trainer, 'id' | 'hireDate'>) => {
    try {
      await apiService.addTrainer(trainerData);
      setView('list');
    } catch (error) {
      console.error("Failed to add trainer", error);
      alert("Failed to add trainer.");
    }
  };

  const handleViewProfile = (id: string) => {
    setSelectedTrainerId(id);
    setView('profile');
  };

  const handleBackToList = () => {
    setSelectedTrainerId(null);
    setView('list');
  };

  const renderListView = () => {
    if (loading) {
      return <div className="text-center p-10 dark:text-gray-300">{t('dataTable.loading')}</div>;
    }
    
    return (
      <div className="space-y-8">
        {Object.keys(groupedTrainers).sort((a, b) => a.localeCompare(b)).map(specialty => (
          <div key={specialty}>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b-2 border-[rgb(var(--color-primary-200))] dark:border-[rgb(var(--color-primary-700))]">{specialty}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groupedTrainers[specialty].map(member => (
                <TrainerCard key={member.id} trainer={member} onViewProfile={handleViewProfile} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderContent = () => {
      switch(view) {
          case 'form':
              return <TrainerForm onSubmit={handleAddTrainer} onCancel={() => setView('list')} />;
          case 'profile':
              return selectedTrainerId ? <TrainerProfile trainerId={selectedTrainerId} onBack={handleBackToList} /> : renderListView();
          case 'list':
          default:
              return renderListView();
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('trainerManagement.title')}</h1>
        {view === 'list' && (
          <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-600))] shadow">
            <PlusIcon />
            <span className="ml-2">{t('trainerManagement.addTrainer')}</span>
          </button>
        )}
        {view !== 'list' && (
           <button onClick={handleBackToList} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
            <ArrowLeftIcon />
            <span className="ml-2">{t('trainerManagement.backToList')}</span>
          </button>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default TrainerManagement;