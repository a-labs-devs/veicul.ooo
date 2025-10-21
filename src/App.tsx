import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import GameLoader from './components/Game/GameLoader';
import AdBanner from './components/AdBanner/AdBanner';
import HelpModal from './components/HelpModal/HelpModal';
import StatsModal from './components/StatsModal/StatsModal';
import { loadStats } from './utils/storage';

if (import.meta.env.DEV) {
  import('./utils/debug');
}

const App: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="app">
      <Header
        onShowStats={() => setShowStats(true)}
        onShowHelp={() => setShowHelp(true)}
      />
      
      <main className="main-content">
        <GameLoader />
      </main>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} stats={loadStats()} />
      
      <footer className="footer">
        <AdBanner 
          adClient="ca-pub-4799413484554608"
          adFormat="auto"
          responsive={true}
        />
      </footer>
    </div>
  );
};

export default App;
