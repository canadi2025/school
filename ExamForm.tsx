import React, { useState } from 'react';
import { useTranslation } from '../i18n/i18n';
import { Exam, Student } from '../types';
import UserCircleIcon from './icons/UserCircleIcon';
import YearIcon from './icons/YearIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';

interface ExamFormProps {
    students: Student[];
    onSubmit: (data: Omit<Exam, 'id' | 'studentName'>) => void;
    onCancel: () => void;
}

const FormField: React.FC<{ id: string; label: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ id, label, icon, children }) => (
    <div>
        <label htmlFor={id} className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        {children}
    </div>
);

const ExamForm: React.FC<ExamFormProps> = ({ students, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [newExam, setNewExam] = useState({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        type: 'theory' as const,
        result: 'pending' as const,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewExam(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExam.studentId) {
            alert('Please select a student.');
            return;
        }
        onSubmit(newExam);
    };
    
    const inputClass = "mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200";

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-8 border-[rgb(var(--color-primary-500))]">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('examManagement.addExam')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField id="studentId" label={t('examManagement.form.student')} icon={<UserCircleIcon />}>
                    <select name="studentId" id="studentId" value={newExam.studentId} onChange={handleInputChange} required className={inputClass}>
                        <option value="">{t('examManagement.form.selectStudent')}</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </FormField>
                <FormField id="date" label={t('examManagement.form.date')} icon={<YearIcon />}>
                    <input type="date" name="date" id="date" value={newExam.date} onChange={handleInputChange} required className={inputClass} />
                </FormField>
                <FormField id="type" label={t('examManagement.form.type')} icon={<ClipboardListIcon />}>
                    <select name="type" id="type" value={newExam.type} onChange={handleInputChange} className={inputClass}>
                        <option value="theory">{t('examManagement.form.typeOptions.theory')}</option>
                        <option value="practical">{t('examManagement.form.typeOptions.practical')}</option>
                    </select>
                </FormField>
                <FormField id="result" label={t('examManagement.form.result')} icon={<ClipboardListIcon />}>
                    <select name="result" id="result" value={newExam.result} onChange={handleInputChange} className={inputClass}>
                        <option value="passed">{t('examManagement.form.resultOptions.passed')}</option>
                        <option value="failed">{t('examManagement.form.resultOptions.failed')}</option>
                        <option value="pending">{t('examManagement.form.resultOptions.pending')}</option>
                    </select>
                </FormField>
                <div className="flex justify-end pt-6 space-x-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200">{t('examManagement.form.cancel')}</button>
                    <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))] shadow-lg transition-all duration-200">{t('examManagement.form.submitAdd')}</button>
                </div>
            </form>
        </div>
    );
};

export default ExamForm;