
import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit: string;
  children?: React.ReactNode;
  isLarge?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, unit, children, isLarge = false }) => {
  return (
    <div className={`bg-grid-panel p-4 rounded-lg flex-1 text-center ${isLarge ? 'col-span-2 sm:col-span-1' : ''}`}>
      <div className="text-sm text-grid-text-secondary flex items-center justify-center">
        <span>{label}</span>
        <div className="relative group ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
           <span className="absolute bottom-full mb-2 w-48 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none left-1/2 -translate-x-1/2">
             {label} data based on latest system readings.
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center mt-1">
        <span className={`font-bold text-white ${isLarge ? 'text-4xl' : 'text-2xl'}`}>{value}</span>
        <span className={`text-grid-text-secondary ml-1 ${isLarge ? 'text-lg' : 'text-base'}`}>{unit}</span>
      </div>
      {children}
    </div>
  );
};
