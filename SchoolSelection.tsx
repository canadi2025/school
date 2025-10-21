import React, { useEffect, useState } from 'react';
import { Office, Student } from '../types';
import { useSchool } from '../contexts/SchoolContext';
import { apiService } from '../services/api';
import HomeIcon from './icons/HomeIcon';
import StudentsIcon from './icons/StudentsIcon';

const SchoolSelection: React.FC = () => {
  const { offices, selectOffice } = useSchool();
  const [students, setStudents] = useState<Student[]>([]);
  
  useEffect(() => {
    // Fetch all students to show counts per office.
    // In a real app, this might be an aggregated API call.
    apiService.getStudents().then(setStudents);
  }, []);

  const getStudentCount = (officeId: string) => {
    return students.filter(s => s.officeId === officeId).length;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Welcome, Admin!</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Please select a school to manage.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {offices.map(office => (
          <button 
            key={office.id} 
            onClick={() => selectOffice(office.id)}
            className="group text-left p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-transparent hover:border-[rgb(var(--color-primary-500))]"
          >
            <div className="flex items-start justify-between">
                <div className="p-3 bg-[rgb(var(--color-primary-100))] dark:bg-[rgb(var(--color-primary-900)/.5)] rounded-lg">
                    <HomeIcon />
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <StudentsIcon />
                    <span className="ml-2 font-medium">{getStudentCount(office.id)} students</span>
                </div>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[rgb(var(--color-primary-600))] dark:group-hover:text-[rgb(var(--color-primary-400))] transition-colors">{office.name}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{office.address}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{office.phone}</p>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">This multi-school selection is a Business Plan feature.</p>
    </div>
  );
};

export default SchoolSelection;
