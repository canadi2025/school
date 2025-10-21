import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../i18n/i18n';
import { apiService } from '../services/api';
import { Charge, ChargeCategory } from '../types';
import PlusIcon from './icons/PlusIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChargeForm from './ChargeForm';
import ChargeCard from './ChargeCard';
import { CHARGE_CATEGORIES } from '../constants';
import SortIcon from './icons/SortIcon';

type SortKey = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

const ChargeManagement: React.FC = () => {
    const { t } = useTranslation();
    const [charges, setCharges] = useState<Charge[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'form'>('list');
    const [filterCategory, setFilterCategory] = useState<ChargeCategory | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortKey>('date_desc');

    const fetchCharges = async () => {
        try {
            setLoading(true);
            const data = await apiService.getCharges();
            setCharges(data);
        } catch (error) {
            console.error("Failed to fetch charges", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchCharges();
        }
    }, [view]);

    const handleAddCharge = async (chargeData: Omit<Charge, 'id'>) => {
        try {
            await apiService.addCharge(chargeData);
            setView('list');
        } catch (error) {
            console.error("Failed to add charge", error);
            alert("Failed to add charge.");
        }
    };

    const sortedAndFilteredCharges = useMemo(() => {
        let processedCharges = [...charges];

        // Filtering
        if (filterCategory !== 'all') {
            processedCharges = processedCharges.filter(charge => charge.category === filterCategory);
        }

        // Sorting
        processedCharges.sort((a, b) => {
            switch (sortBy) {
                case 'date_desc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'date_asc':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'amount_desc':
                    return b.amount - a.amount;
                case 'amount_asc':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

        return processedCharges;
    }, [charges, filterCategory, sortBy]);

    if (view === 'form') {
        return (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold font-poppins text-gray-800 dark:text-gray-100">{t('chargeManagement.addCharge')}</h1>
                     <button onClick={() => setView('list')} className="flex items-center px-4 py-2 font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 shadow">
                        <ArrowLeftIcon />
                        <span className="ml-2">{t('studentManagement.backToList')}</span>
                    </button>
                </div>
                <ChargeForm onSubmit={handleAddCharge} onCancel={() => setView('list')} />
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold font-poppins text-gray-800 dark:text-gray-100">{t('chargeManagement.title')}</h1>
                <div className="flex flex-wrap items-center gap-4">
                    {/* Filter Dropdown */}
                    <div>
                        <label htmlFor="filterCategory" className="sr-only">{t('chargeManagement.filterByCategory')}</label>
                        <select
                            id="filterCategory"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value as ChargeCategory | 'all')}
                            className="text-sm rounded-lg border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))]"
                        >
                            <option value="all">{t('chargeManagement.allCategories')}</option>
                            {CHARGE_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{t(`chargeManagement.form.categories.${cat}`)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div>
                        <label htmlFor="sortBy" className="sr-only">{t('chargeManagement.sortBy')}</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            className="text-sm rounded-lg border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))]"
                        >
                            <option value="date_desc">{t('chargeManagement.sortOptions.dateDesc')}</option>
                            <option value="date_asc">{t('chargeManagement.sortOptions.dateAsc')}</option>
                            <option value="amount_desc">{t('chargeManagement.sortOptions.amountDesc')}</option>
                            <option value="amount_asc">{t('chargeManagement.sortOptions.amountAsc')}</option>
                        </select>
                    </div>

                    <button onClick={() => setView('form')} className="flex items-center px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-600))] shadow">
                        <PlusIcon />
                        <span className="ml-2">{t('chargeManagement.addCharge')}</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-10 dark:text-gray-300">{t('dataTable.loading')}</div>
            ) : sortedAndFilteredCharges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedAndFilteredCharges.map(charge => (
                        <ChargeCard key={charge.id} charge={charge} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-500 dark:text-gray-400">{t('chargeManagement.noChargesFound')}</p>
                </div>
            )}
        </div>
    );
};

export default ChargeManagement;