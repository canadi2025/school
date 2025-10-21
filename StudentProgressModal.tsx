import React, { useState, useEffect, useMemo } from 'react';
import { Student, StudentProgressDetails, Lesson, Exam } from '../types';
import { apiService } from '../services/api';
import { useTranslation } from '../i18n/i18n';
import Modal from './Modal';

interface StudentProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

const TOTAL_LESSONS_TARGET = 10;
const LESSON_WEIGHT = 0.6;
const THEORY_WEIGHT = 0.2;
const PRACTICAL_WEIGHT = 0.2;

const StudentProgressModal: React.FC<StudentProgressModalProps> = ({ isOpen, onClose, student }) => {
  const { t } = useTranslation();
  const [progressData, setProgressData] = useState<StudentProgressDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && student) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const data = await apiService.getStudentProgressDetails(student.id);
          setProgressData(data);
        } catch (error) {
          console.error(`Failed to fetch progress for student ${student.id}`, error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, student]);

  const {
    progressPercentage,
    completedLessonsCount,
    theoryExamStatus,
    practicalExamStatus
  } = useMemo(() => {
    if (!progressData) {
      return { progressPercentage: 0, completedLessonsCount: 0, theoryExamStatus: 'notTaken', practicalExamStatus: 'notTaken' };
    }

    const completedLessons = progressData.lessons.filter(l => l.status === 'completed');
    const lessonsRatio = Math.min(completedLessons.length / TOTAL_LESSONS_TARGET, 1);

    const theoryExam = progressData.exams.find(e => e.type === 'theory' && e.result !== 'pending');
    const practicalExam = progressData.exams.find(e => e.type === 'practical' && e.result !== 'pending');

    const theoryScore = theoryExam?.result === 'passed' ? 1 : 0;
    const practicalScore = practicalExam?.result === 'passed' ? 1 : 0;

    const totalProgress = (lessonsRatio * LESSON_WEIGHT) + (theoryScore * THEORY_WEIGHT) + (practicalScore * PRACTICAL_WEIGHT);
    
    return {
      progressPercentage: Math.round(totalProgress * 100),
      completedLessonsCount: completedLessons.length,
      theoryExamStatus: theoryExam?.result || t('studentProgressModal.notTaken'),
      practicalExamStatus: practicalExam?.result || t('studentProgressModal.notTaken'),
    };
  }, [progressData, t]);
  
  const getStatusColorClass = (status: string) => {
    switch(status.toLowerCase()){
      case 'completed':
      case 'passed':
        return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
      case 'scheduled':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
    }
  }

  const renderStatus = (status: string) => (
    <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full capitalize ${getStatusColorClass(status)}`}>
        {status}
    </span>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('studentProgressModal.title', { studentName: student.name })}>
      {loading ? (
        <div className="text-center p-10 dark:text-gray-300">{t('studentProgressModal.loading')}</div>
      ) : (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('studentProgressModal.overallProgress')}</h4>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
              <div
                className="bg-indigo-600 h-4 rounded-full text-center text-white text-xs"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage}%
              </div>
            </div>
          </div>

          {/* Key Milestones */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('studentProgressModal.milestones')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentProgressModal.completedLessons')}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{completedLessonsCount} / {TOTAL_LESSONS_TARGET}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentProgressModal.theoryExam')}</p>
                <div className="mt-2">{renderStatus(theoryExamStatus)}</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentProgressModal.practicalExam')}</p>
                <div className="mt-2">{renderStatus(practicalExamStatus)}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lesson History */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('studentProgressModal.lessonHistory')}</h4>
              <div className="w-full max-h-48 overflow-y-auto rounded-lg border dark:border-gray-700">
                {progressData?.lessons.length > 0 ? (
                    <ul className="divide-y dark:divide-gray-700">
                        {progressData.lessons.map(lesson => (
                            <li key={lesson.id} className="p-3 text-sm text-gray-700 dark:text-gray-400">
                                <div className="flex justify-between items-center">
                                    <span>{lesson.date} - {lesson.trainerName}</span>
                                    {renderStatus(lesson.status)}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-4 text-center text-gray-500 dark:text-gray-400">{t('studentProgressModal.noLessons')}</p>
                )}
              </div>
            </div>

            {/* Exam History */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('studentProgressModal.examHistory')}</h4>
              <div className="w-full max-h-48 overflow-y-auto rounded-lg border dark:border-gray-700">
                {progressData?.exams.length > 0 ? (
                    <ul className="divide-y dark:divide-gray-700">
                        {progressData.exams.map(exam => (
                            <li key={exam.id} className="p-3 text-sm text-gray-700 dark:text-gray-400">
                                <div className="flex justify-between items-center">
                                    <span className="capitalize">{exam.date} - {exam.type}</span>
                                    {renderStatus(exam.result)}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-4 text-center text-gray-500 dark:text-gray-400">{t('studentProgressModal.noExams')}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </Modal>
  );
};

export default StudentProgressModal;
