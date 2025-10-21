import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18n';
import { Trainer, Car, Truck, Bus, Motorcycle } from '../types';
import { apiService } from '../services/api';
import { ALL_LICENSE_TYPES } from '../constants';
import StudentsIcon from './icons/StudentsIcon';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import TagIcon from './icons/TagIcon';
import IdCardIcon from './icons/IdCardIcon';
import CalendarIcon from './icons/CalendarIcon';
import LicenseIcon from './icons/LicenseIcon';
import FileIcon from './icons/FileIcon';
import VehiclesIcon from './icons/VehiclesIcon';

interface TrainerFormProps {
  onSubmit: (trainerData: Omit<Trainer, 'id' | 'hireDate'>) => void;
  onCancel: () => void;
}

const FormField: React.FC<{ id: string; label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ id, label, icon, children }) => (
    <div>
        <label htmlFor={id} className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        {children}
    </div>
);


const TrainerForm: React.FC<TrainerFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);

  const [newTrainer, setNewTrainer] = useState({
    name: '', email: '', phone: '', specialty: '',
    licenseDDate: '', cin: '', 
    pictureUrl: '', diplomaUrl: '',
    licenseTypes: [] as string[],
    associatedCarIds: [] as string[],
    associatedTruckIds: [] as string[],
    associatedBusIds: [] as string[],
    associatedMotorcycleIds: [] as string[],
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const [carsData, trucksData, busesData, motorcyclesData] = await Promise.all([
          apiService.getCars(),
          apiService.getTrucks(),
          apiService.getBuses(),
          apiService.getMotorcycles(),
        ]);
        setCars(carsData);
        setTrucks(trucksData);
        setBuses(busesData);
        setMotorcycles(motorcyclesData);
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
      }
    };
    fetchVehicles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTrainer(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const listName = name as 'licenseTypes' | 'associatedCarIds' | 'associatedTruckIds' | 'associatedBusIds' | 'associatedMotorcycleIds';
    
    setNewTrainer(prev => {
        const list = prev[listName] as string[] || [];
        if (checked) {
            return { ...prev, [listName]: [...list, value] };
        } else {
            return { ...prev, [listName]: list.filter((item: string) => item !== value) };
        }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      // In a real app, you'd handle the file upload here.
      // For this mock, we just store the filename.
      if (name === 'picture') {
        setNewTrainer(prev => ({ ...prev, pictureUrl: fileName }));
      } else if (name === 'diploma') {
        setNewTrainer(prev => ({ ...prev, diplomaUrl: fileName }));
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainer.name || !newTrainer.email || !newTrainer.phone || !newTrainer.specialty || !newTrainer.cin || !newTrainer.licenseDDate) {
      alert('Please fill all required fields.');
      return;
    }
    onSubmit(newTrainer);
  };
  
  const renderCheckboxes = (
    title: string,
    name: 'associatedCarIds' | 'associatedTruckIds' | 'associatedBusIds' | 'associatedMotorcycleIds',
    items: { id: string, make: string, model: string, licensePlate: string }[]
  ) => (
     <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{title}</h4>
        <div className="mt-1 max-h-24 overflow-y-auto border dark:border-gray-600 rounded-md p-2 space-y-1">
          {items.map(item => (
            <label key={item.id} className="flex items-center space-x-2">
              <input type="checkbox" name={name} value={item.id} onChange={handleCheckboxChange} className="rounded text-indigo-600 focus:ring-indigo-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{item.make} {item.model} ({item.licensePlate})</span>
            </label>
          ))}
        </div>
      </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-l-8 border-purple-500">
       <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('trainerManagement.addTrainer')}</h2>
       <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <FormField id="name" label={t('trainerManagement.form.name')} icon={<StudentsIcon />}>
                    <input type="text" name="name" id="name" value={newTrainer.name} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                </FormField>
                <FormField id="email" label={t('trainerManagement.form.email')} icon={<EmailIcon />}>
                    <input type="email" name="email" id="email" value={newTrainer.email} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                </FormField>
                <FormField id="phone" label={t('trainerManagement.form.phone')} icon={<PhoneIcon />}>
                    <input type="tel" name="phone" id="phone" value={newTrainer.phone} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                </FormField>
                <FormField id="specialty" label={t('trainerManagement.form.specialty')} icon={<TagIcon />}>
                    <input type="text" name="specialty" id="specialty" value={newTrainer.specialty} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                </FormField>
            </div>
            <div className="space-y-6">
              <FormField id="cin" label={t('trainerManagement.form.cin')} icon={<IdCardIcon />}>
                <input type="text" name="cin" id="cin" value={newTrainer.cin} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
              </FormField>
              <FormField id="licenseDDate" label={t('trainerManagement.form.licenseDDate')} icon={<CalendarIcon />}>
                <input type="date" name="licenseDDate" id="licenseDDate" value={newTrainer.licenseDDate} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
              </FormField>
               <FormField id="licenseTypes" label={t('trainerManagement.form.licenseTypes')} icon={<LicenseIcon />}>
                <div className="mt-2 grid grid-cols-4 gap-2 border dark:border-gray-600 rounded-md p-2">
                  {ALL_LICENSE_TYPES.map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input type="checkbox" name="licenseTypes" value={type} onChange={handleCheckboxChange} className="rounded text-purple-600 focus:ring-purple-500" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t dark:border-gray-700">
             <FormField id="associatedVehicles" label={t('trainerManagement.form.associatedVehicles')} icon={<VehiclesIcon />}>
                 <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderCheckboxes(t('trainerManagement.form.associatedCars'), 'associatedCarIds', cars)}
                    {renderCheckboxes(t('trainerManagement.form.associatedTrucks'), 'associatedTruckIds', trucks)}
                    {renderCheckboxes(t('trainerManagement.form.associatedBuses'), 'associatedBusIds', buses)}
                    {renderCheckboxes(t('trainerManagement.form.associatedMotorcycles'), 'associatedMotorcycleIds', motorcycles)}
                 </div>
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t dark:border-gray-700">
            <FormField id="picture" label={t('trainerManagement.form.picture')} icon={<FileIcon />}>
                <input type="file" name="picture" id="picture" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/50 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-800/50" />
            </FormField>
            <FormField id="diploma" label={t('trainerManagement.form.diploma')} icon={<FileIcon />}>
                <input type="file" name="diploma" id="diploma" onChange={handleFileChange} accept=".pdf,.doc,.docx,image/*" className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/50 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-800/50" />
            </FormField>
          </div>
          <div className="flex justify-end pt-4 space-x-4">
            <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200">{t('trainerManagement.form.cancel')}</button>
            <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg hover:shadow-purple-500/50 transition-all duration-200">{t('trainerManagement.form.submitAdd')}</button>
          </div>
        </form>
    </div>
  );
};

export default TrainerForm;