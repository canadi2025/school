import React, { useState } from 'react';
import { useTranslation } from '../i18n/i18n';
import { Lesson, Student, Trainer, Car } from '../types';

interface LessonFormProps {
  students: Student[];
  trainers: Trainer[];
  cars: Car[];
  onSubmit: (data: Omit<Lesson, 'id'>) => void;
  onCancel: () => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ students, trainers, cars, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [newLesson, setNewLesson] = useState({
    studentId: '',
    trainerId: '',
    carId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    status: 'scheduled' as const,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLesson(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLesson.studentId || !newLesson.trainerId || !newLesson.carId) {
      alert('Please select a student, trainer, and car.');
      return;
    }
    onSubmit(newLesson);
  };

  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm text-gray-900 dark:text-gray-200";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">{t('lessonManagement.addLesson')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('lessonManagement.form.student')}</label>
          <select name="studentId" id="studentId" value={newLesson.studentId} onChange={handleInputChange} required className={inputClass}>
            <option value="">{t('lessonManagement.form.selectStudent')}</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="trainerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('lessonManagement.form.trainer')}</label>
          <select name="trainerId" id="trainerId" value={newLesson.trainerId} onChange={handleInputChange} required className={inputClass}>
            <option value="">{t('lessonManagement.form.selectTrainer')}</option>
            {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="carId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('lessonManagement.form.car')}</label>
          <select name="carId" id="carId" value={newLesson.carId} onChange={handleInputChange} required className={inputClass}>
            <option value="">{t('lessonManagement.form.selectCar')}</option>
            {cars.filter(c => c.status === 'available').map(c => <option key={c.id} value={c.id}>{c.make} {c.model} ({c.licensePlate})</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('lessonManagement.form.date')}</label>
          <input type="date" name="date" id="date" value={newLesson.date} onChange={handleInputChange} required className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('lessonManagement.form.startTime')}</label>
            <input type="time" name="startTime" id="startTime" value={newLesson.startTime} onChange={handleInputChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('lessonManagement.form.endTime')}</label>
            <input type="time" name="endTime" id="endTime" value={newLesson.endTime} onChange={handleInputChange} required className={inputClass} />
          </div>
        </div>
          <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('lessonManagement.form.status')}</label>
          <select name="status" id="status" value={newLesson.status} onChange={handleInputChange} className={inputClass}>
            <option value="scheduled">{t('lessonManagement.form.statusOptions.scheduled')}</option>
            <option value="completed">{t('lessonManagement.form.statusOptions.completed')}</option>
            <option value="cancelled">{t('lessonManagement.form.statusOptions.cancelled')}</option>
          </select>
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">{t('lessonManagement.form.cancel')}</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))]">{t('lessonManagement.form.submitAdd')}</button>
        </div>
      </form>
    </div>
  );
};

export default LessonForm;