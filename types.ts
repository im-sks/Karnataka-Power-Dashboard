
export interface KpiData {
  time: string;
  price: number;
  emissions: number;
  demand: number;
  generation: number;
  transfers: number;
}

export interface GenerationSource {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface GenerationCategory {
  title: string;
  percentage: number;
  sources: GenerationSource[];
  color: string;
}

export interface Interconnector {
  name: string;
  value: number;
  percentage: number;
  isImport: boolean;
}

export interface HourlyDemandPoint {
    hour: string; // e.g., "00:00", "01:00"
    demand: number; // in GW
}

export interface PowerData {
  kpis: KpiData;
  generation: {
    total: number;
    percentageOfDemand: number;
    categories: GenerationCategory[];
  };
  interconnectors: {
    total: number;
    connections: Interconnector[];
  };
  dailyLoadCurve: HourlyDemandPoint[];
}

export interface ForecastData {
    date: string;
    predictedDemand: number;
    lowerBound: number;
    upperBound: number;
}