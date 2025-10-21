import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Subscription } from '../types';
import { useTranslation } from '../i18n/i18n';
import CheckCircleIcon from './icons/CheckCircleIcon';
import Modal from './Modal';

const SubscriptionManagement: React.FC = () => {
    const { t } = useTranslation();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(null);
    const [formData, setFormData] = useState({ name: '', price: 0, features: '' });

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const data = await apiService.getSubscriptions();
            setSubscriptions(data);
        } catch (error) {
            console.error("Failed to fetch subscriptions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    useEffect(() => {
        if (selectedPlan) {
            setFormData({
                name: selectedPlan.name,
                price: selectedPlan.price,
                features: selectedPlan.features.join('\n'),
            });
        }
    }, [selectedPlan]);

    const handleEdit = (plan: Subscription) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;
        
        const updatedPlanData: Subscription = {
            ...selectedPlan,
            name: formData.name,
            price: Number(formData.price),
            features: formData.features.split('\n').filter(f => f.trim() !== ''),
        };

        try {
            await apiService.updateSubscription(updatedPlanData);
            handleCloseModal();
            fetchSubscriptions();
        } catch (error) {
            console.error("Failed to update subscription", error);
            alert("Failed to update plan.");
        }
    };


    if (loading) {
        return <div className="text-center p-10 dark:text-gray-300">{t('dataTable.loading')}</div>;
    }
    
    const inputClasses = "w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] focus:border-transparent outline-none";

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('subscriptionManagement.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {subscriptions.map((plan, index) => (
                    <div 
                        key={plan.id}
                        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col text-center
                            ${index === 1 ? 'border-4 border-[rgb(var(--color-primary-500))] transform scale-105' : ''}`
                        }
                    >
                        {index === 1 && (
                            <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-[rgb(var(--color-primary-500))] text-white text-xs font-bold px-3 py-1 rounded-full">
                                MOST POPULAR
                            </span>
                        )}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                        <p className="mt-4">
                            <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{plan.price} <span className="text-3xl">DH</span></span>
                            <span className="text-base font-medium text-gray-500 dark:text-gray-400">{t('subscriptionManagement.pricePerMonth')}</span>
                        </p>
                        <ul className="mt-8 space-y-4 text-left flex-grow">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                    <div className="flex-shrink-0 text-green-500">
                                        <CheckCircleIcon />
                                    </div>
                                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">{feature}</p>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleEdit(plan)}
                            className="mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium
                                text-white bg-gray-800 hover:bg-gray-900 dark:bg-[rgb(var(--color-primary-600))] dark:hover:bg-[rgb(var(--color-primary-700))]"
                        >
                            {t('subscriptionManagement.editPlan')}
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedPlan && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={t('subscriptionManagement.editModalTitle', { planName: selectedPlan.name })}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('subscriptionManagement.form.name')}</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('subscriptionManagement.form.price')}</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} required min="0" className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('subscriptionManagement.form.features')}</label>
                            <textarea name="features" id="features" value={formData.features} onChange={handleInputChange} required rows={5} className={inputClasses} />
                        </div>
                        <div className="flex justify-end pt-4 space-x-2">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">{t('subscriptionManagement.form.cancel')}</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))]">{t('subscriptionManagement.form.save')}</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default SubscriptionManagement;