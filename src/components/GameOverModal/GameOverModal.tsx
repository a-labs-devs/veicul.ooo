import React from 'react';
import Modal from '../Modal/Modal';
import './GameOverModal.css';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  won: boolean;
  targetWord: string;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ 
  isOpen, 
  onClose, 
  won, 
  targetWord
}) => {
  if (won) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="gameover-content">
        <p className="gameover-message">Todas as tentativas foram usadas!</p>
        <p className="gameover-word-label">A palavra correta era:</p>
        <p className="gameover-word">{targetWord.toUpperCase()}</p>
      </div>
    </Modal>
  );
};

export default GameOverModal;
