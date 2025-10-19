import React from 'react';
import './Header.css';
import { GameMode } from '../../types/game';

interface HeaderProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onShowStats: () => void;
  onShowHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, onModeChange, onShowStats, onShowHelp }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-button" onClick={onShowHelp} title="Como jogar">
          ❓
        </button>
      </div>
      
      <div className="header-center">
        <h1 className="title">VEÍCUL.OOO</h1>
        <div className="mode-selector">
          <button
            className={`mode-button ${mode === 'termo' ? 'active' : ''}`}
            onClick={() => onModeChange('termo')}
          >
            Termo
          </button>
          <button
            className={`mode-button ${mode === 'dueto' ? 'active' : ''}`}
            onClick={() => onModeChange('dueto')}
          >
            Dueto
          </button>
          <button
            className={`mode-button ${mode === 'quarteto' ? 'active' : ''}`}
            onClick={() => onModeChange('quarteto')}
          >
            Quarteto
          </button>
        </div>
      </div>
      
      <div className="header-right">
        <button className="icon-button" onClick={onShowStats} title="Estatísticas">
          📊
        </button>
      </div>
    </header>
  );
};

export default Header;
