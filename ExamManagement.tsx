import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import { Exam, Student } from '../types';
import PlusIcon from './icons/PlusIcon';
import { useTranslation } from '../i18n/i18n';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ExamForm from './ExamForm';
import ExamCard from './ExamCard';
import { useSchool } from '../contexts/SchoolContext';

type SortKey = 'date_desc' | 'date_asc';

const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [view, setView] = useState<'list' | 'form'>('list');
  
  const [filterResult, setFilterResult] = useState<'all' | 'passed' | 'failed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('date_desc');
  const { selectedOffice } = useSchool();

  useEffect(() => {
    const fetchData = async () => {
      const officeId = selectedOffice?.id;
      if (apiService.getCurrentUser()?.role === 'admin' && !officeId) return;

      try {
        setLoading(true);
        const [examsData, studentsData] = await Promise.all([
          apiService.getExams(officeId),
          apiService.getStudents(officeId),
        ]);
        setExams(examsData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch exam data", error);
      } finally {
        setLoading(false);
      }
    };
    if (view === 'list') {
      fetchData();
    }
  }, [view, selectedOffice]);

  const handleEdit = (exam: Exam) => {
    alert(t('examManagement.editAlert', { id: exam.id }));
  };

  const handleDelete = (exam: Exam) => {
    if (window.confirm(t('examManagement.deleteConfirm', { id: exam.id }))) {
      alert(t('examManagement.deleteAlert', { id: exam.id }));
    }
  };

  const handleShare = (exam: Exam) => {
    const resultText = t(`examManagement.form.resultOptions.${exam.result}`);
    const typeText = t(`examManagement.form.typeOptions.${exam.type}`);
    const message = t('examManagement.shareMessage', {
        studentName: exam.studentName,
        result: resultText,
        type: typeText,
        date: exam.date
    });
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddExam = async (examData: Omit<Exam, 'id' | 'studentName'>) => {
    const studentExams = exams.filter(ex => ex.studentId === examData.studentId && ex.type === 'theory');
    const lastTheoryExam = studentExams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (lastTheoryExam && lastTheoryExam.result === 'failed') {
      const lastExamDate = new Date(lastTheoryExam.date);
      const newExamDate = new Date(examData.date);
      const diffTime = newExamDate.getTime() - lastExamDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 15) {
        const nextAvailableDate = new Date(lastExamDate);
        nextAvailableDate.setDate(lastExamDate.getDate() + 15);
        alert(t('examManagement.failedTheoryCooldown', { 
            lastDate: lastTheoryExam.date, 
            nextDate: nextAvailableDate.toISOString().split('T')[0] 
        }));
        return;
      }
    }

    try {
      await apiService.addExam(examData);
      setView('list');
    } catch (error) {
      console.error("Failed to add exam", error);
      alert("Failed to add exam.");
    }
  };

  const sortedAndFilteredExams = useMemo(() => {
    let processedExams = [...exams];

    if (filterResult !== 'all') {
      processedExams = processedExams.filter(exam => exam.result === filterResult);
    }

    processedExams.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'date_desc' ? dateB - dateA : dateA - dateB;
    });

    return processedExams;
  }, [exams, filterResult, sortBy]);


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {view === 'list' ? t('examManagement.title') : t('examManagement.addExam')}
        </h1>
        {view === 'list' ? (
          <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-600))] shadow">
            <PlusIcon />
            <span className="ml-2">{t('examManagement.addExam')}</span>
          </button>
        ) : (
          <button onClick={() => setView('list')} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
            <ArrowLeftIcon />
            <span className="ml-2">{t('studentManagement.backToList')}</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <>
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div>
                    <label htmlFor="filterResult" className="sr-only">{t('examManagement.filterByResult')}</label>
                    <select
                        id="filterResult"
                        value={filterResult}
                        onChange={(e) => setFilterResult(e.target.value as 'all' | 'passed' | 'failed' | 'pending')}
                        className="text-sm rounded-lg border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))]"
                    >
                        <option value="all">{t('examManagement.filterOptions.all')}</option>
                        <option value="passed">{t('examManagement.filterOptions.passed')}</option>
                        <option value="failed">{t('examManagement.filterOptions.failed')}</option>
                        <option value="pending">{t('examManagement.filterOptions.pending')}</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="sortBy" className="sr-only">{t('examManagement.sortBy')}</label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortKey)}
                        className="text-sm rounded-lg border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))]"
                    >
                        <option value="date_desc">{t('examManagement.sortOptions.dateDesc')}</option>
                        <option value="date_asc">{t('examManagement.sortOptions.dateAsc')}</option>
                    </select>
                </div>
            </div>
            {loading ? (
                <div className="text-center p-10 dark:text-gray-300">{t('dataTable.loading')}</div>
            ) : sortedAndFilteredExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedAndFilteredExams.map(exam => (
                        <ExamCard 
                            key={exam.id} 
                            exam={exam}
                            onShare={handleShare}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-500 dark:text-gray-400">{t('examManagement.noExamsFound')}</p>
                </div>
            )}
        </>
      ) : (
        <ExamForm 
          students={students}
          onSubmit={handleAddExam}
          onCancel={() => setView('list')}
        />
      )}
    </div>
  );
};

export default ExamManagement;