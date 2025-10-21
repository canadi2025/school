import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatCard from './StatCard';
import { apiService } from '../services/api';
import { useTranslation } from '../i18n/i18n';
import WelcomeBanner from './WelcomeBanner';
import StudentsIcon from './icons/StudentsIcon';
import LessonsIcon from './icons/LessonsIcon';
import PaymentsIcon from './icons/PaymentsIcon';
import CarsIcon from './icons/CarsIcon';
import { useTheme } from '../contexts/ThemeContext';
import ChargeIcon from './icons/ChargeIcon';
import StaffIcon from './icons/StaffIcon';
import SalaryIcon from './icons/charge-categories/SalaryIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import { useSchool } from '../contexts/SchoolContext';

interface DashboardStats {
  totalStudents: number;
  activeLessons: number;
  revenue: number;
  availableCars: number;
  totalCharges: number;
  totalStaff: number;
  chargeStaff: number;
  presentStaff: number;
  absentStaff: number;
  lessonData: { name: string; lessons: number }[];
  revenueData: { name: string; revenue: number }[];
}

interface DashboardViewProps {
    userName?: string;
}

const DashboardView: React.FC<DashboardViewProps> = ({ userName }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { selectedOffice } = useSchool();

  useEffect(() => {
    const fetchStats = async () => {
      // For secretaries, selectedOffice will be null, but apiService handles it
      // For admins, we must wait for an office to be selected
      const officeId = selectedOffice?.id;
      if (apiService.getCurrentUser()?.role === 'admin' && !officeId) return;

      try {
        setLoading(true);
        const data = await apiService.getDashboardStats(officeId);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedOffice]);

  const axisColor = theme === 'dark' ? '#9CA3AF' : '#6B7280'; // gray-400 dark, gray-500 light
  const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB'; // gray-700 dark, gray-200 light
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', // gray-800 dark, white light
    border: `1px solid ${theme === 'dark' ? '#4B5563' : '#D1D5DB'}`, // gray-600 dark, gray-300 light
    color: axisColor
  };

  if (loading || !stats) {
    return <div className="text-center p-10 dark:text-gray-300">{t('dashboard.loading')}</div>;
  }

  const handleDetailsClick = (cardTitle: string) => {
    alert(t('statCard.viewDetails', { card: cardTitle }));
  };

  return (
    <div>
      <WelcomeBanner userName={userName} />

      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">{selectedOffice?.name || t('dashboard.weeklyReports')}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<StudentsIcon />} title={t('dashboard.totalStudents')} value={stats.totalStudents.toString()} color="orange" onDetailsClick={() => handleDetailsClick(t('dashboard.totalStudents'))} />
        <StatCard icon={<LessonsIcon />} title={t('dashboard.scheduledLessons')} value={stats.activeLessons.toString()} color="pink" onDetailsClick={() => handleDetailsClick(t('dashboard.scheduledLessons'))} />
        <StatCard icon={<PaymentsIcon />} title={t('dashboard.totalRevenue')} value={`${stats.revenue.toLocaleString()} DH`} color="cyan" onDetailsClick={() => handleDetailsClick(t('dashboard.totalRevenue'))} />
        <StatCard icon={<CarsIcon />} title={t('dashboard.availableCars')} value={stats.availableCars.toString()} color="primary" onDetailsClick={() => handleDetailsClick(t('dashboard.availableCars'))} />
        <StatCard icon={<ChargeIcon />} title={t('dashboard.totalCharges')} value={`${stats.totalCharges.toLocaleString()} DH`} color="teal" onDetailsClick={() => handleDetailsClick(t('dashboard.totalCharges'))} />
        <StatCard icon={<StaffIcon />} title={t('dashboard.totalStaff')} value={stats.totalStaff.toString()} color="purple" onDetailsClick={() => handleDetailsClick(t('dashboard.totalStaff'))} />
        <StatCard icon={<SalaryIcon />} title={t('dashboard.chargeStaff')} value={`${stats.chargeStaff.toLocaleString()} DH`} color="green" onDetailsClick={() => handleDetailsClick(t('dashboard.chargeStaff'))} />
        <StatCard icon={<CheckCircleIcon />} title={t('dashboard.presentStaff')} value={stats.presentStaff.toString()} color="green" onDetailsClick={() => handleDetailsClick(t('dashboard.presentStaff'))} />
        <StatCard icon={<XCircleIcon />} title={t('dashboard.absentStaff')} value={stats.absentStaff.toString()} color="red" onDetailsClick={() => handleDetailsClick(t('dashboard.absentStaff'))} />
      </div>

      <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('dashboard.lessonsPerMonth')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.lessonData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisColor }} />
              <YAxis tick={{ fill: axisColor }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: theme === 'dark' ? 'rgba(113, 113, 122, 0.3)' : 'rgba(209, 213, 219, 0.3)'}} />
              <Legend wrapperStyle={{ color: axisColor }} />
              <Bar dataKey="lessons" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('dashboard.revenuePerMonth')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisColor }} />
              <YAxis tick={{ fill: axisColor }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: theme === 'dark' ? 'rgba(113, 113, 122, 0.3)' : 'rgba(209, 213, 219, 0.3)'}}/>
              <Legend wrapperStyle={{ color: axisColor }} />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;