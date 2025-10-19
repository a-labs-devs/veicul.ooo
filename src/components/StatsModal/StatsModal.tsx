import React from 'react';
import Modal from '../Modal/Modal';
import './StatsModal.css';
import { GameStats } from '../../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  const winPercentage = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxGuesses = Math.max(...stats.guessDistribution, 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Estatísticas">
      <div className="stats-content">
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-value">{stats.played}</div>
            <div className="stat-label">Jogadas</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{winPercentage}%</div>
            <div className="stat-label">Vitórias</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Sequência Atual</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.maxStreak}</div>
            <div className="stat-label">Melhor Sequência</div>
          </div>
        </div>

        <div className="guess-distribution">
          <h3>Distribuição de Tentativas</h3>
          {stats.guessDistribution.map((count, index) => (
            <div key={index} className="distribution-row">
              <div className="distribution-label">{index + 1}</div>
              <div className="distribution-bar-container">
                <div
                  className="distribution-bar"
                  style={{
                    width: `${maxGuesses > 0 ? (count / maxGuesses) * 100 : 0}%`,
                    minWidth: count > 0 ? '20px' : '0',
                  }}
                >
                  {count > 0 && <span className="distribution-count">{count}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default StatsModal;
