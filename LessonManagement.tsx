import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Lesson, Student, Trainer, Car } from '../types';
import DataTable from './DataTable';
import PlusIcon from './icons/PlusIcon';
import { useTranslation } from '../i18n/i18n';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import LessonForm from './LessonForm';
import { useSchool } from '../contexts/SchoolContext';

const LessonManagement: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
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
        const [lessonsData, studentsData, trainersData, carsData] = await Promise.all([
          apiService.getLessons(officeId),
          apiService.getStudents(officeId),
          apiService.getTrainers(),
          apiService.getCars(),
        ]);
        setLessons(lessonsData);
        setStudents(studentsData);
        setTrainers(trainersData);
        setCars(carsData);
      } catch (error) {
        console.error("Failed to fetch lesson management data", error);
      } finally {
        setLoading(false);
      }
    };
    if (view === 'list') {
      fetchData();
    }
  }, [view, selectedOffice]);

  const columns: { key: keyof Lesson; header: string }[] = [
    { key: 'id', header: t('lessonManagement.columns.id') },
    { key: 'studentName', header: t('lessonManagement.columns.studentName') },
    { key: 'trainerName', header: t('lessonManagement.columns.trainerName') },
    { key: 'carName', header: t('lessonManagement.columns.carName') },
    { key: 'date', header: t('lessonManagement.columns.date') },
    { key: 'startTime', header: t('lessonManagement.columns.startTime') },
    { key: 'status', header: t('lessonManagement.columns.status') },
  ];

  const handleEdit = (lesson: Lesson) => {
    alert(t('lessonManagement.editAlert', { id: lesson.id }));
  };

  const handleDelete = (lesson: Lesson) => {
    if (window.confirm(t('lessonManagement.deleteConfirm', { id: lesson.id }))) {
      alert(t('lessonManagement.deleteAlert', { id: lesson.id }));
    }
  };

  const handleAddLesson = async (lessonData: Omit<Lesson, 'id'>) => {
    try {
      await apiService.addLesson(lessonData);
      setView('list');
    } catch (error) {
      console.error("Failed to add lesson", error);
      alert("Failed to add lesson.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">{t('lessonManagement.title')}</h1>
        {view === 'list' ? (
          <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-600))] shadow">
            <PlusIcon />
            <span className="ml-2">{t('lessonManagement.addLesson')}</span>
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
          data={lessons}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <LessonForm 
            students={students}
            trainers={trainers}
            cars={cars}
            onSubmit={handleAddLesson}
            onCancel={() => setView('list')}
        />
      )}
    </div>
  );
};

export default LessonManagement;