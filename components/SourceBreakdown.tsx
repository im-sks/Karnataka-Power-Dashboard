
import React from 'react';
import { GenerationCategory } from '../types';

interface SourceBreakdownProps {
  category: GenerationCategory;
}

export const SourceBreakdown: React.FC<SourceBreakdownProps> = ({ category }) => {
  return (
    <div className={`bg-grid-panel p-4 rounded-lg`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold" style={{ color: category.color }}>{category.percentage.toFixed(1)}% {category.title}</h3>
      </div>
      <ul>
        {category.sources.map(source => (
          <li key={source.name} className="flex justify-between items-center py-1 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: source.color }}></span>
              <span className="text-grid-text">{source.name}</span>
               <div className="relative group ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-grid-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute bottom-full mb-2 w-48 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none left-1/2 -translate-x-1/2">
                    Live generation data for {source.name} plants.
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-semibold text-white">{source.value.toFixed(2)}GW</span>
              <span className="text-grid-text-secondary ml-2 w-12 inline-block">{source.percentage.toFixed(1)}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
