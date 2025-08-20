
import React, { useState, useEffect } from 'react';
import { LiveDashboardView } from './components/LiveDashboardView';
import { ForecastView } from './components/ForecastView';
import { Header } from './components/Header';
import { TabButton } from './components/TabButton';
import { PowerData, ForecastData } from './types';
import { fetchPowerData, fetchForecastData } from './services/powerService';

enum AppView {
  Live,
  Forecast,
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Live);
  const [powerData, setPowerData] = useState<PowerData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const getData = async () => {
    setLoading(true);
    try {
      const liveData = await fetchPowerData();
      // Only fetch 1D forecast initially to speed up load time
      const forecast = currentView === AppView.Forecast && forecastData ? forecastData : await fetchForecastData('1D');
      setPowerData(liveData);
      if (!forecastData || currentView === AppView.Live) {
         setForecastData(forecast);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    const interval = setInterval(getData, 15 * 60 * 1000); // Refresh every 15 minutes
    return () => clearInterval(interval);
  }, []);

  const handleForecastHorizonChange = async (horizon: '1D' | '7D' | '30D' | '1Y' | '5Y') => {
      setLoading(true);
      try {
        const forecast = await fetchForecastData(horizon);
        setForecastData(forecast);
      } catch (error) {
        console.error(`Failed to fetch ${horizon} forecast data`, error);
      } finally {
        setLoading(false);
      }
  };

  if (!powerData) {
    return (
      <div className="flex items-center justify-center h-screen bg-grid-bg text-grid-text">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading Karnataka Grid Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid-bg p-4 sm:p-6 md:p-8 font-sans">
      <Header />
      <div className="my-6">
        <div className="flex space-x-2 border-b border-grid-border">
          <TabButton
            label="Live Dashboard"
            isActive={currentView === AppView.Live}
            onClick={() => setCurrentView(AppView.Live)}
          />
          <TabButton
            label="Forecast"
            isActive={currentView === AppView.Forecast}
            onClick={() => setCurrentView(AppView.Forecast)}
          />
        </div>
      </div>

      <main>
        {currentView === AppView.Live && powerData ? (
          <LiveDashboardView data={powerData} />
        ) : (
          <ForecastView 
            data={forecastData} 
            onHorizonChange={handleForecastHorizonChange} 
            loading={loading}
          />
        )}
      </main>
      <footer className="text-center text-xs text-grid-text-secondary mt-12">
        <p>Last updated: {lastUpdated.toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default App;
