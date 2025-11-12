'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface DashboardContextType {
  activeCompany: string;
  setActiveCompany: (company: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [activeCompany, setActiveCompany] = useState('GRUPO MATEX');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <DashboardContext.Provider
      value={{
        activeCompany,
        setActiveCompany,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardProvider');
  }
  return context;
};
