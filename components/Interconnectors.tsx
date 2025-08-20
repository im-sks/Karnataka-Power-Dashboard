
import React from 'react';
import { Interconnector } from '../types';

interface InterconnectorsProps {
  connections: Interconnector[];
}

export const Interconnectors: React.FC<InterconnectorsProps> = ({ connections }) => {
  return (
    <div className="bg-grid-panel p-4 rounded-lg">
      <h3 className="text-lg font-bold text-white mb-3">Interconnectors</h3>
      <ul>
        {connections.map(conn => (
          <li key={conn.name} className="flex justify-between items-center py-1 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-sm mr-2 bg-interconnector"></span>
              <span className="text-grid-text">{conn.name}</span>
            </div>
            <div className="text-right">
              <span className={`font-semibold ${conn.isImport ? 'text-green-400' : 'text-red-400'}`}>
                {conn.value.toFixed(2)}GW
              </span>
              <span className="text-grid-text-secondary ml-2 w-12 inline-block">{conn.percentage.toFixed(1)}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
