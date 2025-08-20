
import React from 'react';
import { PowerData } from '../types';
import { KpiCard } from './KpiCard';
import { GenerationDonutChart } from './GenerationDonutChart';
import { SourceBreakdown } from './SourceBreakdown';
import { Interconnectors } from './Interconnectors';
import { DemandChart } from './DemandChart';

interface LiveDashboardViewProps {
  data: PowerData;
}

export const LiveDashboardView: React.FC<LiveDashboardViewProps> = ({ data }) => {
  const { kpis, generation, interconnectors, dailyLoadCurve } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard label="Time" value={kpis.time} unit="" isLarge={false} />
        <KpiCard label="Price" value={`₹${kpis.price.toFixed(2)}`} unit="/MWh" isLarge={false} />
        <KpiCard label="Emissions" value={kpis.emissions} unit="g/kWh" isLarge={false} />
        <KpiCard label="Demand" value={kpis.demand.toFixed(1)} unit="GW" isLarge={true} />
        <div className="col-span-2 sm:col-span-1 bg-grid-panel p-4 rounded-lg flex-1 text-center">
            <div className="text-sm text-grid-text-secondary flex items-center justify-center">Generation + Transfers</div>
             <div className="flex items-center justify-center mt-1">
                <span className="font-bold text-white text-2xl">{generation.total.toFixed(1)}GW</span>
                <span className="text-xl mx-1 text-grid-text-secondary">+</span>
                <span className="font-bold text-white text-2xl">{kpis.transfers.toFixed(1)}GW</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GenerationDonutChart
            categories={generation.categories}
            totalGeneration={generation.total}
            percentageOfDemand={generation.percentageOfDemand}
          />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {generation.categories.map(cat => (
            <SourceBreakdown key={cat.title} category={cat} />
          ))}
          <Interconnectors connections={interconnectors.connections} />
        </div>
      </div>
      
      <div className="bg-grid-panel p-4 rounded-lg">
        <DemandChart data={dailyLoadCurve} />
      </div>

    </div>
  );
};