import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Game from './components/Game/Game';
import HelpModal from './components/HelpModal/HelpModal';
import StatsModal from './components/StatsModal/StatsModal';
import { loadStats } from './utils/storage';

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
        <Game />
      </main>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} stats={loadStats()} />
      
      <div className="footer"></div>
    </div>
  );
};

export default App;
