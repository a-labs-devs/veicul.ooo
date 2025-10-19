import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Game from './components/Game/Game';
import MultiGame from './components/Game/MultiGame';
import HelpModal from './components/HelpModal/HelpModal';
import StatsModal from './components/StatsModal/StatsModal';
import { GameMode } from './types/game';
import { loadStats } from './utils/storage';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('termo');
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
  };

  return (
    <div className="app">
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        onShowStats={() => setShowStats(true)}
        onShowHelp={() => setShowHelp(true)}
      />
      
      <main className="main-content">
        {mode === 'termo' && <Game />}
        {mode === 'dueto' && <MultiGame gameCount={2} />}
        {mode === 'quarteto' && <MultiGame gameCount={4} />}
      </main>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} stats={loadStats()} />
      
      <footer className="footer">
        <p>VEÍCUL.OOO © 2025 - Um jogo de palavras sobre carros 🚗</p>
      </footer>
    </div>
  );
};

export default App;
