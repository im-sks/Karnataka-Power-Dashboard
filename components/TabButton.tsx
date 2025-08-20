
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm sm:text-base font-semibold transition-colors duration-200 focus:outline-none rounded-t-md ${
        isActive
          ? 'bg-grid-panel text-white border-b-2 border-blue-500'
          : 'text-grid-text-secondary hover:bg-grid-panel/50'
      }`}
    >
      {label}
    </button>
  );
};
