
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ForecastData } from '../types';

type ForecastHorizon = '1D' | '7D' | '30D' | '1Y' | '5Y';

interface ForecastViewProps {
  data: ForecastData[] | null;
  onHorizonChange: (horizon: ForecastHorizon) => void;
  loading: boolean;
}

export const ForecastView: React.FC<ForecastViewProps> = ({ data, onHorizonChange, loading }) => {
    const [activeHorizon, setActiveHorizon] = useState<ForecastHorizon>('1D');

    const handleButtonClick = (horizon: ForecastHorizon) => {
        setActiveHorizon(horizon);
        onHorizonChange(horizon);
    };

    const horizons: { id: ForecastHorizon; label: string }[] = [
        { id: '1D', label: '1 Day' },
        { id: '7D', label: '7 Days' },
        { id: '30D', label: '30 Days' },
        { id: '1Y', label: '1 Year' },
        { id: '5Y', label: '5 Years' },
    ];

    const chartData = data
    ? data.map(d => ({
        ...d,
        confidenceInterval: [d.lowerBound, d.upperBound],
      }))
    : [];

  return (
    <div className="space-y-6">
        <div className="bg-grid-panel p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-2">Demand Forecast</h2>
            <p className="text-grid-text-secondary mb-4">
                Predictive models forecasting Karnataka's electricity demand. This includes Linear Regression for long-term trends and KNN for short-term patterns.
            </p>
            <div className="flex flex-wrap gap-2">
                {horizons.map(h => (
                     <button
                        key={h.id}
                        onClick={() => handleButtonClick(h.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeHorizon === h.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-grid-text hover:bg-gray-600'
                        }`}
                    >
                        {h.label}
                    </button>
                ))}
            </div>
        </div>

      <div className="bg-grid-panel p-4 rounded-lg h-96">
        {loading ? (
             <div className="flex items-center justify-center h-full">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             </div>
        ) : chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorPredictedDemand" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis dataKey="date" stroke="#A0A0A0" fontSize={12} />
                <YAxis stroke="#A0A0A0" fontSize={12} unit=" GW"/>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(34, 34, 34, 0.9)',
                    borderColor: '#333333',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#E0E0E0' }}
                  formatter={(value: number | number[], name: string) => {
                      const nameMap: {[key: string]: string} = {
                          predictedDemand: 'Predicted Demand',
                          confidenceInterval: 'Confidence Interval'
                      };
                      if (Array.isArray(value)) {
                          return [`${value[0].toFixed(2)} - ${value[1].toFixed(2)} GW`, nameMap[name] || name];
                      }
                      return [`${(value as number).toFixed(2)} GW`, nameMap[name] || name]
                  }}
                />
                <Legend wrapperStyle={{fontSize: "14px"}}/>
                <Area type="monotone" dataKey="confidenceInterval" name="Confidence Interval"
                    stroke="none" fill="#A0A0A0" fillOpacity={0.2} 
                />
                <Area type="monotone" dataKey="predictedDemand" name="Predicted Demand" stroke="#3B82F6" fill="url(#colorPredictedDemand)" fillOpacity={1} />
              </AreaChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full text-grid-text-secondary">
                No forecast data available for this horizon.
            </div>
        )}
      </div>
    </div>
  );
};
