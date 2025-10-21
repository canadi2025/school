import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Standard, Student, Payment, User, Office } from '../types';
import StandardCard from './StandardCard';
import SearchIcon from './icons/SearchIcon';
import PlusIcon from './icons/PlusIcon';
import { useTranslation } from '../i18n/i18n';
import StudentForm from './StudentForm';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import StudentCategoryView from './StudentCategoryView';
import { useSchool } from '../contexts/SchoolContext';
import DataTable from './DataTable';
import ArchiveIcon from './icons/ArchiveIcon';

interface StudentFormData {
  studentData: Omit<Student, 'id' | 'archived'>;
  paymentData: Omit<Payment, 'id' | 'studentId' | 'studentName'>;
}

const StudentManagement: React.FC = () => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'form' | 'details' | 'archive'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [offices, setOffices] = useState<Office[]>([]);
  const [archivedStudents, setArchivedStudents] = useState<Student[]>([]);
  const { selectedOffice } = useSchool();

  const fetchGridData = async () => {
    const officeId = selectedOffice?.id;
    if (apiService.getCurrentUser()?.role === 'admin' && !officeId) return;
    try {
      setLoading(true);
      setCurrentUser(apiService.getCurrentUser());
      
      const [standardsData, officesData] = await Promise.all([
        apiService.getStandards(officeId),
        apiService.getCurrentUser()?.role === 'admin' ? apiService.getOffices() : Promise.resolve([]),
      ]);
      
      setStandards(standardsData);
      setOffices(officesData);
    } catch (error) {
      console.error("Failed to fetch initial data for student management", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedData = async () => {
    const officeId = selectedOffice?.id;
    if (apiService.getCurrentUser()?.role === 'admin' && !officeId) return;
    try {
        setLoading(true);
        const allStudents = await apiService.getStudents(officeId, true);
        setArchivedStudents(allStudents.filter(s => s.archived));
    } catch (error) {
        console.error("Failed to fetch archived students", error);
    } finally {
        setLoading(false);
    }
  };


  useEffect(() => {
    if (view === 'grid') {
      fetchGridData();
    }
    if (view === 'archive') {
      fetchArchivedData();
    }
  }, [view, selectedOffice]);

  const handleAddStudent = async ({ studentData, paymentData }: StudentFormData) => {
    try {
      const newStudent = await apiService.addStudent(studentData);
      await apiService.addPayment({
        ...paymentData,
        studentId: newStudent.id,
      });
      setView('grid');
    } catch (error) {
      console.error("Failed to add student", error);
      alert("Failed to add student.");
    }
  };

  const handleViewDetails = (category: string) => {
    setSelectedCategory(category);
    setView('details');
  };
  
  const handleBackToGrid = () => {
    setSelectedCategory(null);
    setView('grid');
  };

  if (view === 'form') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">{t('studentManagement.addStudent')}</h1>
          <button onClick={() => setView('grid')} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
            <ArrowLeftIcon />
            <span className="ml-2">{t('studentManagement.backToList')}</span>
          </button>
        </div>
        <StudentForm 
            onSubmit={handleAddStudent} 
            onCancel={() => setView('grid')}
            currentUser={currentUser}
            offices={offices}
            defaultOfficeId={selectedOffice?.id}
        />
      </div>
    );
  }

  if (view === 'details' && selectedCategory) {
      return <StudentCategoryView category={selectedCategory} onBack={handleBackToGrid} />
  }

  if (view === 'archive') {
    const archiveColumns = [
      { key: 'id', header: 'ID'},
      { key: 'name', header: 'Name'},
      { key: 'email', header: 'Email'},
      { key: 'phone', header: 'Phone'},
      { key: 'joinDate', header: 'Joined'},
      { key: 'licenseCategory', header: 'Category'}
    ];
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Archived Students</h1>
          <button onClick={() => setView('grid')} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
            <ArrowLeftIcon />
            <span className="ml-2">{t('studentManagement.backToList')}</span>
          </button>
        </div>
        <DataTable columns={archiveColumns as any} data={archivedStudents} loading={loading} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-500))]"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
        </div>
        <button 
          onClick={() => setView('archive')} 
          className="flex-shrink-0 flex items-center px-4 py-3 font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow"
        >
          <ArchiveIcon />
          <span className="ml-2">View Archive</span>
        </button>
        <button 
          onClick={() => setView('form')} 
          className="flex-shrink-0 flex items-center px-4 py-3 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-600))] shadow"
        >
          <PlusIcon />
          <span className="ml-2">{t('studentManagement.addStudent')}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center p-10 dark:text-gray-300">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {standards.map((standard) => (
            <StandardCard key={standard.id} standard={standard} onViewDetails={handleViewDetails} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentManagement;