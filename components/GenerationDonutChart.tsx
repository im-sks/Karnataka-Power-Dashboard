
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GenerationCategory } from '../types';

interface GenerationDonutChartProps {
  categories: GenerationCategory[];
  totalGeneration: number;
  percentageOfDemand: number;
}

export const GenerationDonutChart: React.FC<GenerationDonutChartProps> = ({ categories, totalGeneration, percentageOfDemand }) => {
  const chartData = categories.flatMap(cat => cat.sources);

  return (
    <div className="bg-grid-panel p-4 rounded-lg h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white">Generation</h2>
      <div className="relative flex-grow w-full h-64 md:h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius="60%"
              outerRadius="100%"
              fill="#8884d8"
              dataKey="value"
              stroke="#222222"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
             <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(34, 34, 34, 0.9)',
                borderColor: '#333333',
                borderRadius: '0.5rem',
              }}
              formatter={(value: number, name: string) => [`${value.toFixed(2)} GW`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-grid-text-secondary text-sm">Generation</p>
          <p className="text-white text-3xl font-bold">{totalGeneration.toFixed(1)}GW</p>
          <p className="text-grid-text-secondary text-sm">{percentageOfDemand.toFixed(1)}%</p>
        </div>
      </div>
        <p className="text-xs text-grid-text-secondary mt-4 text-center">
            Note: percentages are relative to demand, so will exceed 100% if power is being exported.
        </p>
    </div>
  );
};
