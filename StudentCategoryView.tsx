import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Student } from '../types';
import DataTable from './DataTable';
import { useTranslation } from '../i18n/i18n';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import StudentProfile from './StudentProfile';
import StudentProgressModal from './StudentProgressModal';
import { useSchool } from '../contexts/SchoolContext';

interface StudentCategoryViewProps {
  category: string;
  onBack: () => void;
}

const StudentCategoryView: React.FC<StudentCategoryViewProps> = ({ category, onBack }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedStudentForProgress, setSelectedStudentForProgress] = useState<Student | null>(null);
  const { t } = useTranslation();
  const { selectedOffice } = useSchool();

  useEffect(() => {
    const fetchStudents = async () => {
      const officeId = selectedOffice?.id;
      if (apiService.getCurrentUser()?.role === 'admin' && !officeId) return;

      try {
        setLoading(true);
        const allStudents = await apiService.getStudents(officeId);
        setStudents(allStudents.filter(s => s.licenseCategory === category));
      } catch (error) {
        console.error("Failed to fetch students for category", category, error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [category, selectedOffice]);

  const handleViewProfile = (student: Student) => {
    setSelectedStudentId(student.id);
  };
  
  const handleViewProgress = (student: Student) => {
    setSelectedStudentForProgress(student);
    setIsProgressModalOpen(true);
  };

  const handleCloseProgressModal = () => {
      setIsProgressModalOpen(false);
      setSelectedStudentForProgress(null);
  }

  if (selectedStudentId) {
    return <StudentProfile studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />;
  }
  
  const columns = [
    { key: 'id', header: t('studentManagement.columns.id') },
    { key: 'name', header: t('studentManagement.columns.name') },
    { key: 'email', header: t('studentManagement.columns.email') },
    { key: 'phone', header: t('studentManagement.columns.phone') },
    { key: 'joinDate', header: t('studentManagement.columns.joinDate') },
    { key: 'status', header: t('studentManagement.columns.status') },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          {t('sidebar.students')} - Category {category}
        </h1>
        <button onClick={onBack} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
          <ArrowLeftIcon />
          <span className="ml-2">{t('studentManagement.backToList')}</span>
        </button>
      </div>
      <DataTable
        columns={columns as any}
        data={students}
        loading={loading}
        onViewProfile={handleViewProfile}
        onViewProgress={handleViewProgress}
      />
      {selectedStudentForProgress && (
        <StudentProgressModal
            isOpen={isProgressModalOpen}
            onClose={handleCloseProgressModal}
            student={selectedStudentForProgress}
        />
      )}
    </div>
  );
};

export default StudentCategoryView;