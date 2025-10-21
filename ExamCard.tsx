import React from 'react';
import { Exam } from '../types';
import { useTranslation } from '../i18n/i18n';
import TheoryExamIcon from './icons/TheoryExamIcon';
import PracticalExamIcon from './icons/PracticalExamIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import WhatsappIcon from './icons/WhatsappIcon';
import CalendarIcon from './icons/CalendarIcon';

interface ExamCardProps {
  exam: Exam;
  onEdit: (exam: Exam) => void;
  onDelete: (exam: Exam) => void;
  onShare: (exam: Exam) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onEdit, onDelete, onShare }) => {
  const { t } = useTranslation();

  const resultStyles = {
    passed: {
      bg: 'bg-green-100 dark:bg-green-900/50',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-500',
      iconBg: 'bg-green-500',
    },
    failed: {
      bg: 'bg-red-100 dark:bg-red-900/50',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-500',
      iconBg: 'bg-red-500',
    },
    pending: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/50',
      text: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-500',
      iconBg: 'bg-yellow-500',
    },
  };

  const styles = resultStyles[exam.result];
  const ExamIcon = exam.type === 'theory' ? TheoryExamIcon : PracticalExamIcon;
  const resultText = t(`examManagement.form.resultOptions.${exam.result}`);
  const typeText = t(`examManagement.form.typeOptions.${exam.type}`);

  return (
    <div className={`relative ${styles.bg} rounded-2xl shadow-lg border-l-8 ${styles.border} overflow-hidden transition-transform transform hover:scale-105`}>
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{exam.studentName}</p>
                <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${styles.bg} ${styles.text}`}>
                    {resultText}
                </div>
            </div>
            <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${styles.iconBg} flex items-center justify-center`}>
                <ExamIcon className="w-8 h-8 text-white" />
            </div>
        </div>

        <div className="my-4 flex-grow">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">{typeText} Exam</p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <CalendarIcon />
                <span className="ml-2">{exam.date}</span>
            </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-auto pt-3 flex items-center justify-end space-x-2">
            <button onClick={() => onShare(exam)} className="p-2 text-green-600 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50" title={t('dataTable.share')}>
                <WhatsappIcon />
            </button>
             <button onClick={() => onEdit(exam)} className="p-2 text-blue-600 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50" title={t('dataTable.actions')}>
                <EditIcon />
            </button>
            <button onClick={() => onDelete(exam)} className="p-2 text-red-600 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" title={t('dataTable.actions')}>
                <DeleteIcon />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;