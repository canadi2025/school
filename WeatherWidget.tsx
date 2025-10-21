import React from 'react';
import WeatherIcon from './icons/WeatherIcon';

const WeatherWidget: React.FC = () => {
  // Mock data for now
  const temperature = 24; 

  return (
    <div className="flex items-center text-gray-700 dark:text-gray-200">
      <WeatherIcon />
      <span className="ml-2 font-medium">{temperature}°C</span>
    </div>
  );
};

export default WeatherWidget;
