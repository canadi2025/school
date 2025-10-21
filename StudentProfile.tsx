import React, { useState, useEffect, useMemo } from 'react';
import { Student, StudentProgressDetails, Lesson, Exam } from '../types';
import { apiService } from '../services/api';
import { useTranslation } from '../i18n/i18n';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import LicenseIcon from './icons/LicenseIcon';
import CalendarIcon from './icons/CalendarIcon';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';

interface StudentProfileProps {
    studentId: string;
    onBack: () => void;
}

const TOTAL_LESSONS_TARGET = 10;
const LESSON_WEIGHT = 0.6;
const THEORY_WEIGHT = 0.2;
const PRACTICAL_WEIGHT = 0.2;

const StudentProfile: React.FC<StudentProfileProps> = ({ studentId, onBack }) => {
    const { t } = useTranslation();
    const [student, setStudent] = useState<Student | null>(null);
    const [progressData, setProgressData] = useState<StudentProgressDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [studentData, progressDetails] = await Promise.all([
                    apiService.getStudentById(studentId),
                    apiService.getStudentProgressDetails(studentId),
                ]);
                setStudent(studentData || null);
                setProgressData(progressDetails);
            } catch (error) {
                console.error("Failed to fetch student profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

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
            theoryExamStatus: theoryExam?.result || t('studentManagement.profile.notTaken'),
            practicalExamStatus: practicalExam?.result || t('studentManagement.profile.notTaken'),
        };
    }, [progressData, t]);

    const getStatusColorClass = (status: string) => {
        switch(status.toLowerCase()){
            case 'active':
            case 'completed':
            case 'passed':
                return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
            case 'inactive':
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

    const renderStatusBadge = (status: string) => (
        <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full capitalize ${getStatusColorClass(status)}`}>
            {status}
        </span>
    );


    if (loading) {
        return <div className="text-center p-10 dark:text-gray-300">{t('dataTable.loading')}</div>;
    }

    if (!student) {
        return <div className="text-center p-10 dark:text-gray-300">Student not found.</div>;
    }

    return (
        <div>
            <div className="bg-[rgb(var(--color-primary-600))] dark:bg-[rgb(var(--color-primary-800))] -mx-6 -mt-8 p-8 relative h-40">
                <div className="container mx-auto flex items-center">
                    <button onClick={onBack} className="flex items-center text-white opacity-80 hover:opacity-100">
                        <ArrowLeftIcon />
                        <span className="ml-2">{t('studentManagement.backToList')}</span>
                    </button>
                </div>
                <div className="container mx-auto mt-4">
                     <h1 className="text-3xl font-bold text-white">{t('studentManagement.profile.title')}</h1>
                     <p className="text-[rgb(var(--color-primary-200))]">{t('sidebar.students')} / {student.name}</p>
                </div>
            </div>

             <div className="relative -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                            <img 
                                src={`https://i.pravatar.cc/150?u=${student.id}`} 
                                alt={student.name} 
                                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200 dark:border-gray-700"
                            />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{student.name}</h2>
                            <div className="my-2">{renderStatusBadge(student.status)}</div>
                            <button className="w-full mt-2 px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-md hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))]">
                                {t('studentManagement.profile.editProfile')}
                            </button>
                             <div className="mt-6 text-left space-y-4">
                                <div className="flex items-center">
                                    <LicenseIcon />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentManagement.profile.licenseCategory')}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{student.licenseCategory}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <CalendarIcon />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentManagement.profile.joinDate')}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{student.joinDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <EmailIcon />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentManagement.columns.email')}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{student.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <PhoneIcon />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentManagement.columns.phone')}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{student.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                     <div className="lg:col-span-3 space-y-8">
                        {/* Progress and Milestones */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                           <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('studentManagement.profile.overallProgress')}</h3>
                            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-6">
                                <div className="bg-[rgb(var(--color-primary-600))] h-4 rounded-full text-center text-white text-xs" style={{ width: `${progressPercentage}%` }}>
                                    {progressPercentage}%
                                </div>
                            </div>
                             <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('studentManagement.profile.milestones')}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentManagement.profile.completedLessons')}</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{completedLessonsCount} / {TOTAL_LESSONS_TARGET}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentManagement.profile.theoryExam')}</p>
                                    <div className="mt-2">{renderStatusBadge(theoryExamStatus)}</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('studentManagement.profile.practicalExam')}</p>
                                    <div className="mt-2">{renderStatusBadge(practicalExamStatus)}</div>
                                </div>
                            </div>
                        </div>

                        {/* History */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('studentManagement.profile.lessonHistory')}</h3>
                                {progressData?.lessons.length > 0 ? (
                                    <div className="overflow-x-auto max-h-64">
                                        <ul className="divide-y dark:divide-gray-700">
                                            {progressData.lessons.map(lesson => (
                                                <li key={lesson.id} className="p-3 text-sm text-gray-700 dark:text-gray-400">
                                                    <div className="flex justify-between items-center">
                                                        <span>{lesson.date} - {lesson.trainerName}</span>
                                                        {renderStatusBadge(lesson.status)}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">{t('studentManagement.profile.noLessons')}</p>
                                )}
                            </div>
                             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('studentManagement.profile.examHistory')}</h3>
                                {progressData?.exams.length > 0 ? (
                                    <div className="overflow-x-auto max-h-64">
                                        <ul className="divide-y dark:divide-gray-700">
                                            {progressData.exams.map(exam => (
                                                <li key={exam.id} className="p-3 text-sm text-gray-700 dark:text-gray-400">
                                                    <div className="flex justify-between items-center">
                                                        <span className="capitalize">{exam.date} - {exam.type}</span>
                                                        {renderStatusBadge(exam.result)}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">{t('studentManagement.profile.noExams')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
