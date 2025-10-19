import React from 'react';
import './Header.css';

interface HeaderProps {
  onShowStats: () => void;
  onShowHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowStats, onShowHelp }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-button" onClick={onShowHelp} title="Como jogar">
          ❓
        </button>
      </div>
      
      <div className="header-center">
        <h1 className="title">VEÍCULO</h1>
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
