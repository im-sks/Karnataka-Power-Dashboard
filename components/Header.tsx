
import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Karnataka Grid: Live</h1>
      <p className="text-grid-text-secondary mt-2">
        Real-time electricity transmission network for Karnataka
      </p>
      <div className="mt-2 text-sm text-grid-text-secondary">
        {currentTime.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}{' '}
        | {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </div>
    </header>
  );
};
