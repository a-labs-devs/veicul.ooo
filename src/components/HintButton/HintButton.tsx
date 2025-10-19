import React from 'react';
import './HintButton.css';

interface HintButtonProps {
  onHint: () => void;
  hintsUsed: number;
  maxHints: number;
  disabled?: boolean;
}

const HintButton: React.FC<HintButtonProps> = ({ 
  onHint, 
  hintsUsed, 
  maxHints,
  disabled = false 
}) => {
  const hintsRemaining = maxHints - hintsUsed;
  
  return (
    <button
      className="hint-button"
      onClick={onHint}
      disabled={disabled || hintsRemaining <= 0}
      title={`Revelar uma letra (${hintsRemaining} dicas restantes)`}
    >
      <span className="hint-icon">💡</span>
      <span className="hint-text">Dica</span>
      <span className="hint-count">{hintsRemaining}/{maxHints}</span>
    </button>
  );
};

export default HintButton;

