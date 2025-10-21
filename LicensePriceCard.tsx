import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../i18n/i18n';
import { apiService } from '../services/api';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import Modal from './Modal';

const LicensePriceCard: React.FC = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ name: string; price: number } | null>(null);
  const [formState, setFormState] = useState({ name: '', price: 0 });

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getLicensePrices();
      setPrices(data);
    } catch (error) {
      console.error("Failed to fetch license prices", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const handleAdd = () => {
    setEditingCategory(null);
    setFormState({ name: '', price: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (name: string, price: number) => {
    setEditingCategory({ name, price });
    setFormState({ name, price });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormState({ name: '', price: 0 });
  };

  const handleDelete = async (name: string, price: number) => {
    if (window.confirm(t('paymentManagement.licensePrices.deleteConfirm', { category: name }))) {
      try {
        await apiService.deleteLicensePrice(name, price);
        fetchPrices();
      } catch (error) {
        console.error(`Failed to delete category ${name}`, error);
        alert(error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || formState.price <= 0) {
      alert("Please provide a valid category name and price.");
      return;
    }
    
    try {
      if (editingCategory) {
        await apiService.updateLicensePrice(editingCategory.name, formState.price);
      } else {
        await apiService.addLicensePrice(formState.name, formState.price);
      }
      fetchPrices();
      handleCloseModal();
    } catch (error: any) {
        console.error("Failed to save category", error);
        alert(t('paymentManagement.licensePrices.errorExists', { category: formState.name }));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) || 0 : value
    }));
  };
  
  const sortedCategories = Object.keys(prices).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('paymentManagement.licensePricesTitle')}</h2>
          <button onClick={handleAdd} className="flex items-center text-sm px-3 py-1 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-600))]">
            <PlusIcon />
            <span className="ml-1">{t('paymentManagement.licensePrices.addCategory')}</span>
          </button>
        </div>
        
        {loading ? (
          <div className="text-center p-4 dark:text-gray-300">{t('dataTable.loading')}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sortedCategories.map(category => {
              const price = prices[category];
              return (
                <div key={category} className="relative bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center shadow group">
                  <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={() => handleEdit(category, price)} className="p-1 text-gray-500 dark:text-gray-400 hover:text-[rgb(var(--color-primary-600))] dark:hover:text-[rgb(var(--color-primary-400))] rounded-full focus:outline-none" aria-label={`Edit ${category}`}>
                      <EditIcon />
                    </button>
                    <button onClick={() => handleDelete(category, price)} className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full focus:outline-none" aria-label={`Delete ${category}`}>
                      <DeleteIcon />
                    </button>
                  </div>
                  <p className="font-bold text-lg text-[rgb(var(--color-primary-600))] dark:text-[rgb(var(--color-primary-400))] mt-4">{category}</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{price.toFixed(2)} DH</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingCategory ? t('paymentManagement.licensePrices.editTitle', { category: editingCategory.name }) : t('paymentManagement.licensePrices.addTitle')}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('paymentManagement.licensePrices.form.category')}</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formState.name} 
              onChange={handleFormChange}
              readOnly={!!editingCategory}
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 read-only:bg-gray-100 read-only:dark:bg-gray-600" 
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('paymentManagement.licensePrices.form.price')}</label>
            <input 
              type="number" 
              name="price" 
              id="price" 
              value={formState.price} 
              onChange={handleFormChange} 
              required 
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" 
            />
          </div>
          <div className="flex justify-end pt-4 space-x-2">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">{t('paymentManagement.licensePrices.form.cancel')}</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-500))]">{t('paymentManagement.licensePrices.form.save')}</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default LicensePriceCard;