import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import StatCard from './StatCard';
import { apiService } from '../services/api';
import { useTranslation } from '../i18n/i18n';
import StudentsIcon from './icons/StudentsIcon';
import PaymentsIcon from './icons/PaymentsIcon';
import BuildingIcon from './icons/BuildingIcon';
import TrainersIcon from './icons/TrainersIcon';
import { useTheme } from '../contexts/ThemeContext';

interface SuperAdminStats {
  totalSchools: number;
  totalStudents: number;
  totalTrainers: number;
  totalRevenue: number;
  subscriptions: { name: string; value: number }[];
}

interface SuperAdminDashboardViewProps {
    setActiveView: (view: 'dashboard' | 'schools' | 'subscriptions') => void;
}

const SuperAdminDashboardView: React.FC<SuperAdminDashboardViewProps> = ({ setActiveView }) => {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSuperAdminDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch super admin dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    border: `1px solid ${theme === 'dark' ? '#4B5563' : '#D1D5DB'}`,
    color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
  };

  if (loading || !stats) {
    return <div className="text-center p-10 dark:text-gray-300">{t('dashboard.loading')}</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('superAdminDashboard.title')}</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<BuildingIcon />} title={t('superAdminDashboard.totalSchools')} value={stats.totalSchools.toString()} color="primary" onDetailsClick={() => setActiveView('schools')} />
        <StatCard icon={<StudentsIcon />} title={t('superAdminDashboard.totalStudents')} value={stats.totalStudents.toString()} color="orange" />
        <StatCard icon={<TrainersIcon />} title={t('superAdminDashboard.totalTrainers')} value={stats.totalTrainers.toString()} color="pink" />
        <StatCard icon={<PaymentsIcon />} title={t('superAdminDashboard.totalSaaSRevenue')} value={`${stats.totalRevenue.toLocaleString()} DH`} color="cyan" />
      </div>

      <div className="mt-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('superAdminDashboard.subscriptionDistribution')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.subscriptions}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.subscriptions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboardView;