import React from 'react';
import { Standard, StandardColor } from '../types';
import StudentsIcon from './icons/StudentsIcon';

interface StandardCardProps {
  standard: Standard;
  onViewDetails: (category: string) => void;
}

const colorMap: Record<StandardColor, string> = {
  teal: 'bg-[#008080]',
  blue: 'bg-[#0000FF]',
  red: 'bg-[#DC143C]',
  brown: 'bg-[#8B4513]',
  purple: 'bg-[#800080]',
  cyan: 'bg-[#008B8B]',
  orange: 'bg-[#FF8C00]',
  indigo: 'bg-[#4B0082]',
};

const StandardCard: React.FC<StandardCardProps> = ({ standard, onViewDetails }) => {
  const bgColorClass = colorMap[standard.color] || 'bg-gray-500';

  const nameParts = standard.name.split(' ');
  const title = nameParts[0];
  const subtitle = nameParts.slice(1).join(' ');

  return (
    <div className={`p-5 rounded-2xl text-white shadow-lg flex flex-col justify-between h-48 ${bgColorClass}`}>
      <div>
        <div className="flex justify-between items-start">
          <div className="font-bold text-2xl">
            <h2>{title}</h2>
            <h2 className="text-4xl font-black">{subtitle}</h2>
          </div>
        </div>
        <p className="text-sm opacity-80 mt-1">{standard.studentCount} Students</p>
      </div>

      <div className="flex justify-between items-end">
        <button 
          onClick={() => onViewDetails(standard.category)} 
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
          aria-label={`View students for category ${standard.category}`}
        >
          <StudentsIcon />
        </button>

        <div className="flex items-center -space-x-3">
          {standard.studentAvatars.slice(0, 3).map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Student ${index + 1}`}
              className="w-8 h-8 rounded-full border-2 border-white/50 dark:border-gray-800 object-cover"
            />
          ))}
          {standard.studentAvatars.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-xs font-semibold border-2 border-white/50">
              +{standard.studentAvatars.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandardCard;