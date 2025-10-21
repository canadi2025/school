import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Office } from '../types';

interface SchoolContextType {
  offices: Office[];
  setOffices: (offices: Office[]) => void;
  selectedOffice: Office | null;
  selectOffice: (officeId: string | null) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);

  const selectedOffice = useMemo(() => {
    if (!selectedOfficeId) return null;
    return offices.find(o => o.id === selectedOfficeId) || null;
  }, [offices, selectedOfficeId]);

  const selectOffice = (officeId: string | null) => {
    setSelectedOfficeId(officeId);
  };

  return (
    <SchoolContext.Provider value={{ offices, setOffices, selectedOffice, selectOffice }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
