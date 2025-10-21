import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/i18n';
import HomeIcon from './icons/HomeIcon';
import CameraIcon from './icons/CameraIcon';
import RefreshIcon from './icons/RefreshIcon';
import MailIcon from './icons/MailIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import FlagIcon from './icons/FlagIcon';
import PhoneIcon from './icons/PhoneIcon';
import { SchoolProfile } from '../types';
import { apiService } from '../services/api';

interface SchoolProfileProps {
    onProfileUpdate: (profile: SchoolProfile) => void;
}

const FormLabel: React.FC<{ htmlFor: string, text: string, required?: boolean }> = ({ htmlFor, text, required }) => (
  <label htmlFor={htmlFor} className="inline-block text-xs font-semibold text-white px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-1">
    {text}{required && '*'}
  </label>
);

const SchoolProfileComponent: React.FC<SchoolProfileProps> = ({ onProfileUpdate }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await apiService.getSchoolProfile();
            setProfile(data);
        } catch (error) {
            console.error("Failed to fetch school profile", error);
        } finally {
            setLoading(false);
        }
    };
    fetchProfile();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => (prev ? { ...prev, logo: reader.result as string } : null));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!profile) return;
    setIsUpdating(true);
    try {
        const updatedProfile = await apiService.updateSchoolProfile(profile);
        onProfileUpdate(updatedProfile);
        alert('Profile updated successfully!');
    } catch (error) {
        console.error("Failed to update profile", error);
        alert('Failed to update profile.');
    } finally {
        setIsUpdating(false);
    }
  };
  
  const inputClasses = "w-full px-4 py-2 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] focus:border-transparent outline-none transition-all duration-200";

  if (loading) {
    return <div className="text-center p-10 dark:text-gray-300">Loading Profile...</div>;
  }

  if (!profile) {
    return <div className="text-center p-10 dark:text-gray-300">Could not load profile.</div>;
  }


  return (
    <div>
        {/* Breadcrumb and Title */}
        <div className="mb-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <HomeIcon />
                <span className="mx-2">/</span>
                <span>{t('settings.schoolProfile.breadcrumb')}</span>
                <span className="mx-2">/</span>
                <span className="text-gray-800 dark:text-gray-200">{t('settings.tabs.profile')}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.schoolProfile.title')}</h2>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                            <span className="h-2 w-2 bg-purple-500 rounded-full mr-1.5"></span> {t('settings.schoolProfile.required')}*
                        </div>
                        <div className="flex items-center">
                            <span className="h-2 w-2 bg-gray-400 rounded-full mr-1.5"></span> {t('settings.schoolProfile.optional')}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Left Column: Form */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Section */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center space-y-4">
                        <FormLabel htmlFor="logo" text={t('settings.schoolProfile.form.logo')} required />
                        <div className="relative">
                            <img src={profile.logo} alt="School Logo" className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700" />
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        <button type="button" onClick={handleLogoClick} className="flex items-center text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-opacity">
                            <CameraIcon />
                            <span className="ml-2">{t('settings.schoolProfile.form.changeLogo')}</span>
                        </button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <div>
                            <FormLabel htmlFor="phone" text={t('settings.schoolProfile.form.phone')} required />
                            <input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleInputChange} placeholder={t('settings.schoolProfile.form.phonePlaceholder')} className={inputClasses} />
                        </div>
                        <div>
                            <FormLabel htmlFor="email" text={t('settings.schoolProfile.form.email')} required />
                            <input type="email" id="email" name="email" value={profile.email} onChange={handleInputChange} placeholder={t('settings.schoolProfile.form.emailPlaceholder')} className={inputClasses} />
                        </div>
                        <div>
                            <FormLabel htmlFor="website" text={t('settings.schoolProfile.form.website')} />
                            <input type="url" id="website" name="website" value={profile.website} onChange={handleInputChange} placeholder={t('settings.schoolProfile.form.websitePlaceholder')} className={inputClasses} />
                        </div>
                    </div>
                </div>

                {/* Other Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <FormLabel htmlFor="name" text={t('settings.schoolProfile.form.name')} required />
                        <input type="text" id="name" name="name" value={profile.name} onChange={handleInputChange} placeholder={t('settings.schoolProfile.form.namePlaceholder')} className={inputClasses} />
                    </div>
                    <div>
                        <FormLabel htmlFor="adminName" text={t('settings.schoolProfile.form.adminName')} required />
                        <input type="text" id="adminName" name="adminName" value={profile.adminName} onChange={handleInputChange} placeholder={t('settings.schoolProfile.form.adminNamePlaceholder')} className={inputClasses} />
                    </div>
                    <div>
                        <FormLabel htmlFor="targetLine" text={t('settings.schoolProfile.form.targetLine')} required />
                        <input type="text" id="targetLine" name="targetLine" value={profile.targetLine} onChange={handleInputChange} placeholder={t('settings.schoolProfile.form.targetLinePlaceholder')} className={inputClasses} />
                    </div>
                    <div>
                        <FormLabel htmlFor="address" text={t('settings.schoolProfile.form.address')} required />
                        <input type="text" id="address" name="address" value={profile.address} onChange={handleInputChange} placeholder={t('settings.schoolProfile.form.addressPlaceholder')} className={inputClasses} />
                    </div>
                    <div>
                        <FormLabel htmlFor="country" text={t('settings.schoolProfile.form.country')} required />
                        <select id="country" name="country" value={profile.country} onChange={handleInputChange} className={inputClasses}>
                            <option>Morocco</option>
                            <option>France</option>
                            <option>USA</option>
                            <option>Canada</option>
                        </select>
                    </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-end">
                    <button onClick={handleUpdateProfile} disabled={isUpdating} type="button" className="flex items-center justify-center font-semibold text-white bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl shadow-lg transition-colors disabled:bg-amber-400 disabled:cursor-not-allowed">
                        <RefreshIcon className={isUpdating ? 'animate-spin' : ''} />
                        <span className="ml-2">{isUpdating ? t('settings.schoolProfile.form.updatingButton') : t('settings.schoolProfile.form.updateButton')}</span>
                    </button>
                </div>
            </div>

            {/* Right Column: Preview */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-full">
                    <div className="inline-block text-xs font-bold text-white bg-green-500 px-3 py-1 rounded-full mb-6">
                        {t('settings.schoolProfile.preview.title')}
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <img src={profile.logo} alt="Logo Preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-md" />
                        <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{profile.name || 'Your School Name'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{profile.targetLine || 'School Target Line'}</p>
                    </div>
                    <hr className="my-6 border-gray-200 dark:border-gray-700" />
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center">
                            <PhoneIcon />
                            <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">{t('settings.schoolProfile.preview.phone')}:</span>
                            <span className="ml-auto text-gray-800 dark:text-gray-200 truncate">{profile.phone || '----------'}</span>
                        </div>
                        <div className="flex items-center">
                            <MailIcon />
                            <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">{t('settings.schoolProfile.preview.email')}:</span>
                            <span className="ml-auto text-gray-800 dark:text-gray-200 truncate">{profile.email || '----------'}</span>
                        </div>
                        <div className="flex items-center">
                            <GlobeAltIcon />
                            <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">{t('settings.schoolProfile.preview.website')}:</span>
                            <span className="ml-auto text-gray-800 dark:text-gray-200 truncate">{profile.website || '----------'}</span>
                        </div>
                        <div className="flex items-center">
                            <LocationMarkerIcon />
                            <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">{t('settings.schoolProfile.preview.address')}:</span>
                            <span className="ml-auto text-gray-800 dark:text-gray-200 truncate">{profile.address || '----------'}</span>
                        </div>
                         <div className="flex items-center">
                            <FlagIcon />
                            <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">{t('settings.schoolProfile.preview.country')}:</span>
                            <span className="ml-auto text-gray-800 dark:text-gray-200 truncate">{profile.country || '----------'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SchoolProfileComponent;
