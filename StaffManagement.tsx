import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { Staff } from '../types';
import PlusIcon from './icons/PlusIcon';
import { useTranslation } from '../i18n/i18n';
import StaffForm from './StaffForm';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import StaffCard from './StaffCard';
import StaffProfile from './StaffProfile';

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'form' | 'profile'>('list');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const data = await apiService.getStaff();
        setStaff(data);
      } catch (error) {
        console.error("Failed to fetch staff", error);
      } finally {
        setLoading(false);
      }
    };
    if (view === 'list') {
      fetchStaff();
    }
  }, [view]);
  
  const groupedStaff = useMemo(() => {
    return staff.reduce((acc, member) => {
      const role = member.role || 'Unassigned';
      (acc[role] = acc[role] || []).push(member);
      return acc;
    }, {} as Record<string, Staff[]>);
  }, [staff]);

  const handleAddStaff = async (staffData: Omit<Staff, 'id' | 'hireDate'>) => {
    try {
      await apiService.addStaff(staffData);
      setView('list');
    } catch (error) {
      console.error("Failed to add staff member", error);
      alert("Failed to add staff member.");
    }
  };
  
  const handleViewDetails = (id: string) => {
      setSelectedStaffId(id);
      setView('profile');
  };
  
  const handleBackToList = () => {
      setSelectedStaffId(null);
      setView('list');
  };

  const renderListView = () => {
    if (loading) {
      return <div className="text-center p-10 dark:text-gray-300">{t('dataTable.loading')}</div>;
    }
    
    return (
      <div className="space-y-8">
        {Object.keys(groupedStaff).sort((a, b) => a.localeCompare(b)).map(role => (
          <div key={role}>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b-2 border-[rgb(var(--color-primary-200))] dark:border-[rgb(var(--color-primary-700))]">{role}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groupedStaff[role].map(member => (
                <StaffCard key={member.id} staff={member} onViewDetails={handleViewDetails} />
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
              return <StaffForm onSubmit={handleAddStaff} onCancel={() => setView('list')} />;
          case 'profile':
              return selectedStaffId ? <StaffProfile staffId={selectedStaffId} onBack={handleBackToList} /> : renderListView();
          case 'list':
          default:
              return renderListView();
      }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('staffManagement.title')}</h1>
        {view === 'list' && (
          <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-600))] shadow">
            <PlusIcon />
            <span className="ml-2">{t('staffManagement.addStaff')}</span>
          </button>
        )}
        {view === 'form' && (
           <button onClick={() => setView('list')} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
            <ArrowLeftIcon />
            <span className="ml-2">{t('staffManagement.backToList')}</span>
          </button>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default StaffManagement;