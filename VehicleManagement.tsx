import React, { useState } from 'react';
import { useTranslation } from '../i18n/i18n';
import CarManagement from './CarManagement';
import TruckManagement from './TruckManagement';
import BusManagement from './BusManagement';
import MotorcycleManagement from './MotorcycleManagement';
import CarCardIcon from './icons/CarCardIcon';
import TrucksIcon from './icons/TrucksIcon';
import BusesIcon from './icons/BusesIcon';
import MotorcyclesIcon from './icons/MotorcyclesIcon';

type VehicleView = 'hub' | 'cars' | 'trucks' | 'buses' | 'motorcycles';

const VehicleCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    buttonText: string;
}> = ({ icon, title, description, onClick, buttonText }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 h-10">{description}</p>
        <button
            onClick={onClick}
            className="w-full mt-auto px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            {buttonText}
        </button>
    </div>
);

const VehicleManagement: React.FC = () => {
    const [view, setView] = useState<VehicleView>('hub');
    const { t } = useTranslation();

    const renderHub = () => (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">{t('vehicleManagement.title')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <VehicleCard
                    icon={<CarCardIcon />}
                    title={t('vehicleManagement.carsCardTitle')}
                    description={t('vehicleManagement.carsCardDescription')}
                    onClick={() => setView('cars')}
                    buttonText={t('vehicleManagement.manageButton')}
                />
                <VehicleCard
                    icon={<TrucksIcon />}
                    title={t('vehicleManagement.trucksCardTitle')}
                    description={t('vehicleManagement.trucksCardDescription')}
                    onClick={() => setView('trucks')}
                    buttonText={t('vehicleManagement.manageButton')}
                />
                <VehicleCard
                    icon={<BusesIcon />}
                    title={t('vehicleManagement.busesCardTitle')}
                    description={t('vehicleManagement.busesCardDescription')}
                    onClick={() => setView('buses')}
                    buttonText={t('vehicleManagement.manageButton')}
                />
                <VehicleCard
                    icon={<MotorcyclesIcon />}
                    title={t('vehicleManagement.motorcyclesCardTitle')}
                    description={t('vehicleManagement.motorcyclesCardDescription')}
                    onClick={() => setView('motorcycles')}
                    buttonText={t('vehicleManagement.manageButton')}
                />
            </div>
        </div>
    );

    switch (view) {
        case 'cars':
            return <CarManagement onBack={() => setView('hub')} />;
        case 'trucks':
            return <TruckManagement onBack={() => setView('hub')} />;
        case 'buses':
            return <BusManagement onBack={() => setView('hub')} />;
        case 'motorcycles':
            return <MotorcycleManagement onBack={() => setView('hub')} />;
        case 'hub':
        default:
            return renderHub();
    }
};

export default VehicleManagement;