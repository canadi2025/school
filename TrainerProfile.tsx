import React, { useState, useEffect, useMemo } from 'react';
import { Trainer, Car, Truck, Bus, Motorcycle, Lesson } from '../types';
import { apiService } from '../services/api';
import { useTranslation } from '../i18n/i18n';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import LicenseIcon from './icons/LicenseIcon';
import CalendarIcon from './icons/CalendarIcon';
import EmailIcon from './icons/EmailIcon';
import PhoneIcon from './icons/PhoneIcon';
import CarCardIcon from './icons/CarCardIcon';
import TrucksIcon from './icons/TrucksIcon';
import BusesIcon from './icons/BusesIcon';
import MotorcyclesIcon from './icons/MotorcyclesIcon';

interface TrainerProfileProps {
    trainerId: string;
    onBack: () => void;
}

const TrainerProfile: React.FC<TrainerProfileProps> = ({ trainerId, onBack }) => {
    const { t } = useTranslation();
    const [trainer, setTrainer] = useState<Trainer | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [vehicles, setVehicles] = useState<{ cars: Car[], trucks: Truck[], buses: Bus[], motorcycles: Motorcycle[] }>({ cars: [], trucks: [], buses: [], motorcycles: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [trainerData, lessonsData, carsData, trucksData, busesData, motorcyclesData] = await Promise.all([
                    apiService.getTrainerById(trainerId),
                    apiService.getLessonsForTrainer(trainerId),
                    apiService.getCars(),
                    apiService.getTrucks(),
                    apiService.getBuses(),
                    apiService.getMotorcycles(),
                ]);
                setTrainer(trainerData || null);
                setLessons(lessonsData);
                setVehicles({ cars: carsData, trucks: trucksData, buses: busesData, motorcycles: motorcyclesData });
            } catch (error) {
                console.error("Failed to fetch trainer profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [trainerId]);
    
    const associatedVehiclesList = useMemo(() => {
        if (!trainer) return [];

        const getVehicleDetails = (ids: string[] | undefined, vehicleList: any[], type: string, icon: React.ReactNode) => {
            if (!ids) return [];
            return ids.map(id => {
                const vehicle = vehicleList.find(v => v.id === id);
                return vehicle ? { ...vehicle, type, icon } : null;
            }).filter(Boolean);
        };
        
        return [
            ...getVehicleDetails(trainer.associatedCarIds, vehicles.cars, 'Car', <CarCardIcon />),
            ...getVehicleDetails(trainer.associatedTruckIds, vehicles.trucks, 'Truck', <TrucksIcon />),
            ...getVehicleDetails(trainer.associatedBusIds, vehicles.buses, 'Bus', <BusesIcon />),
            ...getVehicleDetails(trainer.associatedMotorcycleIds, vehicles.motorcycles, 'Motorcycle', <MotorcyclesIcon />),
        ];
    }, [trainer, vehicles]);

    if (loading) {
        return <div className="text-center p-10 dark:text-gray-300">{t('dataTable.loading')}</div>;
    }

    if (!trainer) {
        return <div className="text-center p-10 dark:text-gray-300">Trainer not found.</div>;
    }
    
    return (
        <div>
            <div className="bg-[rgb(var(--color-primary-600))] dark:bg-[rgb(var(--color-primary-800))] -mx-6 -mt-8 p-8 relative h-40">
                <div className="container mx-auto flex items-center">
                    <button onClick={onBack} className="flex items-center text-white opacity-80 hover:opacity-100">
                        <ArrowLeftIcon />
                        <span className="ml-2">{t('trainerManagement.backToList')}</span>
                    </button>
                </div>
                <div className="container mx-auto mt-4">
                     <h1 className="text-3xl font-bold text-white">{t('trainerManagement.profile.title')}</h1>
                     <p className="text-[rgb(var(--color-primary-200))]">{t('sidebar.trainers')} / {trainer.name}</p>
                </div>
            </div>

            <div className="relative -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                            <img 
                                src={`https://i.pravatar.cc/150?u=${trainer.id}`} 
                                alt={trainer.name} 
                                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200 dark:border-gray-700"
                            />
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{trainer.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{trainer.specialty}</p>
                            <button className="w-full px-4 py-2 font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-md hover:bg-[rgb(var(--color-primary-700))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary-500))]">
                                {t('trainerManagement.profile.editProfile')}
                            </button>
                            <div className="mt-6 text-left space-y-4">
                                <div className="flex items-center">
                                    <LicenseIcon />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('trainerManagement.profile.licenses')}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{trainer.licenseTypes?.join(', ')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <CalendarIcon />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('trainerManagement.profile.hireDate')}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{trainer.hireDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <EmailIcon />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('trainerManagement.columns.email')}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{trainer.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <PhoneIcon />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('trainerManagement.columns.phone')}</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{trainer.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('trainerManagement.profile.associatedVehicles')}</h3>
                            {associatedVehiclesList.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {associatedVehiclesList.map((v: any) => (
                                        <div key={v.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md flex items-center">
                                            <div className="text-[rgb(var(--color-primary-500))] w-8 h-8 flex-shrink-0">{v.icon}</div>
                                            <div className="ml-3">
                                                <p className="font-semibold text-gray-700 dark:text-gray-200">{v.make} {v.model}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{v.licensePlate} ({v.type})</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">{t('trainerManagement.profile.noVehicles')}</p>
                            )}
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                             <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('trainerManagement.profile.upcomingLessons')}</h3>
                             {lessons.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">{t('trainerManagement.profile.student')}</th>
                                                <th scope="col" className="px-6 py-3">{t('trainerManagement.profile.car')}</th>
                                                <th scope="col" className="px-6 py-3">{t('trainerManagement.profile.date')}</th>
                                                <th scope="col" className="px-6 py-3">{t('trainerManagement.profile.time')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lessons.map(lesson => (
                                                <tr key={lesson.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{lesson.studentName}</td>
                                                    <td className="px-6 py-4">{lesson.carName}</td>
                                                    <td className="px-6 py-4">{lesson.date}</td>
                                                    <td className="px-6 py-4">{lesson.startTime} - {lesson.endTime}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             ) : (
                                <p className="text-gray-500 dark:text-gray-400">{t('trainerManagement.profile.noLessons')}</p>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerProfile;