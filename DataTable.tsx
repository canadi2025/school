

import React, { useState, useMemo } from 'react';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import { useTranslation } from '../i18n/i18n';
import SortIcon from './icons/SortIcon';
import SortAscIcon from './icons/SortAscIcon';
import SortDescIcon from './icons/SortDescIcon';
import WhatsappIcon from './icons/WhatsappIcon';
import WrenchIcon from './icons/WrenchIcon';
import ProgressIcon from './icons/ProgressIcon';
import InspectionIcon from './icons/InspectionIcon';
import ViewProfileIcon from './icons/ViewProfileIcon';

interface Column<T> {
  key: keyof T;
  header: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onShare?: (item: T) => void;
  onViewMaintenance?: (item: T) => void;
  onViewProgress?: (item: T) => void;
  onViewInspection?: (item: T) => void;
  onViewProfile?: (item: T) => void;
}

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T | null;
  direction: SortDirection;
}

const DataTable = <T extends { id: string },>({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  onShare,
  onViewMaintenance,
  onViewProgress,
  onViewInspection,
  onViewProfile,
}: DataTableProps<T>) => {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({ key: null, direction: 'asc' });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        
        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <div className="text-center p-10 dark:text-gray-300">{t('dataTable.loading')}</div>;
  }

  const renderCell = (item: T, column: Column<T>) => {
    const value = item[column.key];
    if (typeof value === 'string' && (column.key as string).toLowerCase().includes('status')) {
        let colorClass = '';
        switch(value.toLowerCase()){
            case 'active':
            case 'available':
            case 'paid':
            case 'scheduled':
            case 'passed':
            case 'completed':
                colorClass = 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
                break;
            case 'inactive':
            case 'maintenance':
            case 'pending':
                colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
                break;
            case 'in_use':
            case 'overdue':
            case 'cancelled':
            case 'failed':
                colorClass = 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
                break;
            default:
                colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100';
        }
        return <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${colorClass}`}>{value}</span>
    }
    return String(value);
  }

  const getSortIcon = (columnKey: keyof T) => {
    if (sortConfig.key !== columnKey) {
      return <SortIcon />;
    }
    if (sortConfig.direction === 'asc') {
      return <SortAscIcon />;
    }
    return <SortDescIcon />;
  };

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-md bg-white dark:bg-gray-800">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-700">
              {columns.map(col => (
                <th key={String(col.key)} className="px-4 py-3">
                  <button onClick={() => requestSort(col.key)} className="flex items-center space-x-1 focus:outline-none" aria-label={`Sort by ${col.header}`}>
                    <span>{col.header}</span>
                    {getSortIcon(col.key)}
                  </button>
                </th>
              ))}
              {(onEdit || onDelete || onShare || onViewMaintenance || onViewProgress || onViewInspection || onViewProfile) && <th className="px-4 py-3">{t('dataTable.actions')}</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {sortedData.map(item => (
              <tr key={item.id} className="text-gray-700 dark:text-gray-400">
                {columns.map(col => (
                  <td key={`${item.id}-${String(col.key)}`} className="px-4 py-3 text-sm">
                    {renderCell(item, col)}
                  </td>
                ))}
                {(onEdit || onDelete || onShare || onViewMaintenance || onViewProgress || onViewInspection || onViewProfile) && (
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-4">
                      {onViewProfile && (
                        <button onClick={() => onViewProfile(item)} className="p-2 text-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('dataTable.viewProfile')}>
                          <ViewProfileIcon />
                        </button>
                      )}
                      {onViewProgress && (
                        <button onClick={() => onViewProgress(item)} className="p-2 text-purple-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('dataTable.viewProgress')}>
                          <ProgressIcon />
                        </button>
                      )}
                      {onViewMaintenance && (
                        <button onClick={() => onViewMaintenance(item)} className="p-2 text-blue-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('dataTable.viewMaintenance')}>
                          <WrenchIcon />
                        </button>
                      )}
                       {onViewInspection && (
                        <button onClick={() => onViewInspection(item)} className="p-2 text-teal-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('dataTable.viewInspection')}>
                          <InspectionIcon />
                        </button>
                      )}
                      {onShare && (
                        <button onClick={() => onShare(item)} className="p-2 text-green-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('dataTable.share')}>
                          <WhatsappIcon />
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={() => onEdit(item)} className="p-2 text-[rgb(var(--color-primary-600))] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={`Edit ${item.id}`}>
                          <EditIcon />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(item)} className="p-2 text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={`Delete ${item.id}`}>
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;