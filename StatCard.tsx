import React from 'react';
import EllipsisIcon from './icons/EllipsisIcon';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: 'orange' | 'pink' | 'cyan' | 'primary' | 'green' | 'teal' | 'purple' | 'red';
  onDetailsClick?: () => void;
}

const colorClasses = {
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
    pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400',
    cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400',
    primary: 'bg-[rgb(var(--color-primary-100))] text-[rgb(var(--color-primary-600))] dark:bg-[rgb(var(--color-primary-900)/.5)] dark:text-[rgb(var(--color-primary-400))]',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, onDetailsClick }) => {
  return (
    <div className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      {onDetailsClick && (
        <button 
          onClick={onDetailsClick} 
          className="absolute top-4 right-4 p-1 text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-[rgb(var(--color-primary-500))]"
          aria-label="View details"
        >
          <EllipsisIcon />
        </button>
      )}
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${colorClasses[color]}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  );
};

export default StatCard;