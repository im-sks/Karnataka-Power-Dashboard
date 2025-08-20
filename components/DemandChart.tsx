
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyDemandPoint } from '../types';

interface DemandChartProps {
  data: HourlyDemandPoint[];
}

export const DemandChart: React.FC<DemandChartProps> = ({ data }) => {
  return (
    <div className="h-80">
      <h2 className="text-xl font-bold text-white mb-4">Today's Load Curve</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
           <defs>
              <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
          <XAxis 
            dataKey="hour" 
            stroke="#A0A0A0" 
            fontSize={12}
            label={{ value: 'Hour of Day', position: 'insideBottom', offset: -10, fill: '#A0A0A0' }}
            interval={3}
          />
          <YAxis 
            stroke="#A0A0A0" 
            fontSize={12} 
            unit=" GW"
            label={{ value: 'Demand (GW)', angle: -90, position: 'insideLeft', fill: '#A0A0A0' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(34, 34, 34, 0.9)',
              borderColor: '#333333',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#E0E0E0' }}
            formatter={(value: number) => [`${value.toFixed(2)} GW`, "Demand"]}
          />
          <Area type="monotone" dataKey="demand" stroke="#22C55E" fill="url(#colorDemand)" fillOpacity={1} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
