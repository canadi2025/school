import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18n';
import { useAppearance } from '../contexts/AppearanceContext';
import PaletteIcon from './icons/PaletteIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import DocumentDownloadIcon from './icons/DocumentDownloadIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import SparklesIcon from './icons/SparklesIcon';
import SchoolProfileComponent from './InstituteProfile';
import IdCardIcon from './icons/IdCardIcon';
import { apiService } from '../services/api';
import { Office, User, SchoolProfile } from '../types';
import DeleteIcon from './icons/DeleteIcon';
import HomeIcon from './icons/HomeIcon';

type SettingsTab = 'profile' | 'appearance' | 'users' | 'data';

interface SettingsPageProps {
    onProfileUpdate: (profile: SchoolProfile) => void;
}

const SettingsCard: React.FC<{ icon: React.ReactNode; title: string; description: string; children: React.ReactNode; }> = ({ icon, title, description, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex items-start">
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
        <div className="mt-6">{children}</div>
    </div>
);

const AppearanceSettings: React.FC = () => {
    const { t } = useTranslation();
    const { accentColor, setAccentColor, fontFamily, setFontFamily } = useAppearance();
    
    const accentColors = [
        { name: 'indigo', color: 'bg-indigo-500' },
        { name: 'blue', color: 'bg-blue-500' },
        { name: 'rose', color: 'bg-rose-500' },
        { name: 'green', color: 'bg-green-500' },
    ] as const;

    const fontFamilies = [ 'inter', 'poppins', 'roboto' ] as const;

    return (
         <SettingsCard
            icon={<PaletteIcon />}
            title={t('settings.appearance.title')}
            description={t('settings.appearance.description')}
        >
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.appearance.accentColor')}</label>
                    <div className="mt-2 flex space-x-3">
                        {accentColors.map(item => (
                            <button
                                key={item.name}
                                onClick={() => setAccentColor(item.name)}
                                className={`w-8 h-8 rounded-full ${item.color} ${accentColor === item.name ? 'ring-2 ring-offset-2 ring-[rgb(var(--color-primary-500))] dark:ring-offset-gray-800' : ''}`}
                                aria-label={`Set accent color to ${item.name}`}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="font-family" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.appearance.fontFamily')}</label>
                    <select
                        id="font-family"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value as typeof fontFamily)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                        {fontFamilies.map(font => (
                            <option key={font} value={font} className="capitalize">{font.charAt(0).toUpperCase() + font.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>
        </SettingsCard>
    )
}

const UserManagementSettings: React.FC = () => {
    const { t } = useTranslation();
    const [secretaries, setSecretaries] = useState<User[]>([]);
    const [offices, setOffices] = useState<Office[]>([]);
    const [newSecretary, setNewSecretary] = useState({ name: '', email: '', password: '', officeId: '' });
    const [newOffice, setNewOffice] = useState({ name: '', address: '', phone: '' });

    const fetchData = async () => {
        try {
            const [secs, offs] = await Promise.all([
                apiService.getSecretaries(),
                apiService.getOffices(),
            ]);
            setSecretaries(secs);
            setOffices(offs);
        } catch (error) {
            console.error("Failed to fetch user management data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSecretaryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewSecretary(prev => ({ ...prev, [name]: value }));
    };
    
    const handleOfficeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewOffice(prev => ({ ...prev, [name]: value }));
    };

    const handleAddOffice = async (e: React.FormEvent) => {
        e.preventDefault();
        if(newOffice.name && newOffice.address && newOffice.phone) {
            await apiService.addOffice(newOffice);
            setNewOffice({ name: '', address: '', phone: '' });
            fetchData();
        } else {
            alert('Please fill all office fields.');
        }
    };

    const handleAddSecretary = async (e: React.FormEvent) => {
      e.preventDefault();
      if(newSecretary.name && newSecretary.email && newSecretary.password && newSecretary.officeId) {
        // Exclude password from the data sent to the API, as per User interface
        const { password, ...secretaryData } = newSecretary;
        await apiService.addSecretary(secretaryData);
        setNewSecretary({ name: '', email: '', password: '', officeId: '' });
        fetchData();
      } else {
        alert('Please fill all fields for the new secretary.');
      }
    };

    const handleDeleteSecretary = async (secretary: User) => {
        if (window.confirm(t('settings.userManagement.deleteSecretaryConfirm', { name: secretary.name }))) {
            await apiService.deleteSecretary(secretary.id);
            fetchData();
        }
    };
    
    const getOfficeName = (officeId?: string) => {
        return offices.find(o => o.id === officeId)?.name || 'N/A';
    };
    
    const inputClasses = "block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-[rgb(var(--color-primary-500))] focus:border-[rgb(var(--color-primary-500))] shadow-sm";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Office Management */}
            <SettingsCard
                icon={<HomeIcon />}
                title={t('settings.userManagement.manageOffices')}
                description=""
            >
                <form onSubmit={handleAddOffice} className="space-y-4">
                    <input type="text" name="name" placeholder={t('settings.userManagement.officeName')} value={newOffice.name} onChange={handleOfficeInputChange} className={inputClasses} required />
                    <input type="text" name="address" placeholder={t('settings.userManagement.officeAddress')} value={newOffice.address} onChange={handleOfficeInputChange} className={inputClasses} required />
                    <input type="tel" name="phone" placeholder={t('settings.userManagement.officePhone')} value={newOffice.phone} onChange={handleOfficeInputChange} className={inputClasses} required />
                    <button type="submit" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-md hover:bg-[rgb(var(--color-primary-700))]">
                        <UserPlusIcon />
                        <span className="ml-2">{t('settings.userManagement.addOffice')}</span>
                    </button>
                </form>
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('settings.userManagement.existingOffices')}</h4>
                    <ul className="mt-2 divide-y dark:divide-gray-700">
                    {offices.length > 0 ? offices.map((office) => (
                        <li key={office.id} className="py-2">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{office.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{office.address} | {office.phone}</p>
                        </li>
                    )) : <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.userManagement.noOffices')}</p>}
                    </ul>
                </div>
            </SettingsCard>

            {/* Secretary Management */}
            <SettingsCard
                icon={<ShieldCheckIcon />}
                title={t('settings.userManagement.manageSecretaries')}
                description={t('settings.userManagement.description')}
            >
                <form onSubmit={handleAddSecretary} className="space-y-4">
                    <input type="text" name="name" placeholder={t('settings.userManagement.name')} value={newSecretary.name} onChange={handleSecretaryInputChange} className={inputClasses} required />
                    <input type="email" name="email" placeholder={t('settings.userManagement.email')} value={newSecretary.email} onChange={handleSecretaryInputChange} className={inputClasses} required />
                    <input type="password" name="password" placeholder={t('settings.userManagement.password')} value={newSecretary.password} onChange={handleSecretaryInputChange} className={inputClasses} required />
                    <select name="officeId" value={newSecretary.officeId} onChange={handleSecretaryInputChange} className={inputClasses} required>
                        <option value="">{t('settings.userManagement.selectOffice')}</option>
                        {offices.map(office => <option key={office.id} value={office.id}>{office.name}</option>)}
                    </select>
                    <button type="submit" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-600))] rounded-md hover:bg-[rgb(var(--color-primary-700))]">
                        <UserPlusIcon />
                        <span className="ml-2">{t('settings.userManagement.addSecretary')}</span>
                    </button>
                </form>
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('settings.userManagement.existingSecretaries')}</h4>
                    <div className="w-full overflow-hidden rounded-lg shadow-xs mt-2">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full whitespace-no-wrap">
                                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                {secretaries.map((user) => (
                                    <tr key={user.id} className="text-gray-700 dark:text-gray-400">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center text-sm">
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{getOfficeName(user.officeId)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end text-sm">
                                                <button onClick={() => handleDeleteSecretary(user)} className="p-2 text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={`Delete ${user.name}`}>
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
}

const DataExportSettings: React.FC = () => {
    const { t } = useTranslation();
    return (
        <SettingsCard
            icon={<DocumentDownloadIcon />}
            title={t('settings.dataExport.title')}
            description={t('settings.dataExport.description')}
        >
            <div className="relative p-4 border border-dashed rounded-md dark:border-gray-600">
                <div className="absolute top-2 right-2 flex items-center px-2 py-1 text-xs font-bold text-yellow-800 bg-yellow-200 rounded-full dark:bg-yellow-700 dark:text-yellow-100">
                    <SparklesIcon />
                    <span className="ml-1">{t('settings.dataExport.businessFeature')}</span>
                </div>
                <div className="opacity-50">
                    <label htmlFor="data-type" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.dataExport.dataType')}</label>
                    <select id="data-type" disabled className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 cursor-not-allowed">
                        <option>All Data</option>
                        <option>Students</option>
                        <option>Trainers</option>
                        <option>Payments</option>
                    </select>
                    <button disabled className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-[rgb(var(--color-primary-400))] rounded-md cursor-not-allowed">
                        {t('settings.dataExport.exportButton')}
                    </button>
                </div>
            </div>
        </SettingsCard>
    );
}


const SettingsPage: React.FC<SettingsPageProps> = ({ onProfileUpdate }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
        { id: 'profile', label: t('settings.tabs.profile'), icon: <IdCardIcon /> },
        { id: 'appearance', label: t('settings.tabs.appearance'), icon: <PaletteIcon /> },
        { id: 'users', label: t('settings.tabs.users'), icon: <ShieldCheckIcon /> },
        { id: 'data', label: t('settings.tabs.data'), icon: <DocumentDownloadIcon /> },
    ];
    
    const renderContent = () => {
        switch(activeTab) {
            case 'profile': return <SchoolProfileComponent onProfileUpdate={onProfileUpdate} />;
            case 'appearance': return <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><AppearanceSettings /></div>;
            case 'users': return <UserManagementSettings />;
            case 'data': return <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><DataExportSettings /></div>;
            default: return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('settings.title')}</h1>
            
            <div className="mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                    ? 'border-[rgb(var(--color-primary-500))] text-[rgb(var(--color-primary-600))] dark:text-[rgb(var(--color-primary-400))]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <span className="mr-2 h-5 w-5">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsPage;
