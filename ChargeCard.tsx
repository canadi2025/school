import React from 'react';
import { Charge } from '../types';
import { useTranslation } from '../i18n/i18n';
import { CHARGE_CATEGORY_DETAILS } from '../constants';
import DocumentDownloadIcon from './icons/DocumentDownloadIcon';

interface ChargeCardProps {
    charge: Charge;
}

const ChargeCard: React.FC<ChargeCardProps> = ({ charge }) => {
    const { t } = useTranslation();
    const categoryDetails = CHARGE_CATEGORY_DETAILS[charge.category];
    const Icon = categoryDetails.icon;

    return (
        <div className={`font-inter bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-8 ${categoryDetails.color} ${categoryDetails.darkColor}`}>
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <Icon className="w-full h-full" />
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-800 dark:text-gray-100 font-poppins">{t(`chargeManagement.form.categories.${charge.category}`)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{charge.beneficiary}</p>
                        </div>
                    </div>
                    {charge.invoiceUrl && (
                        <a 
                            href="#"
                            onClick={(e) => { e.preventDefault(); alert(`Downloading ${charge.invoiceUrl}`); }}
                            className="p-2 text-gray-400 hover:text-[rgb(var(--color-primary-500))] dark:hover:text-[rgb(var(--color-primary-300))] transition-colors rounded-full"
                            aria-label={t('chargeManagement.viewInvoice')}
                            title={t('chargeManagement.viewInvoice')}
                        >
                            <DocumentDownloadIcon />
                        </a>
                    )}
                </div>
                
                <div className="mt-4 text-right">
                    <p className={`text-4xl font-bold font-roboto ${categoryDetails.textColor}`}>
                        {charge.amount.toFixed(2)} <span className="text-2xl opacity-80">DH</span>
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{charge.date}</p>
                </div>
            </div>
        </div>
    );
};

export default ChargeCard;
