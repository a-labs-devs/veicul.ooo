import React from 'react';
import './Row.css';
import { Guess } from '../../types/game';
import Tile from './Tile';

interface RowProps {
  guess: Guess | null;
  wordLength: number;
  isCurrentRow?: boolean;
  isFutureRow?: boolean;
  currentGuessLength?: number;
  shake?: boolean;
}

const Row: React.FC<RowProps> = ({ 
  guess, 
  wordLength, 
  isCurrentRow = false, 
  isFutureRow = false,
  currentGuessLength = 0,
  shake = false
}) => {
  const tiles = [];

  if (guess) {
    const isCompleted = guess.letters.some(l => l.state !== 'empty');
    
    for (let i = 0; i < wordLength; i++) {
      const letter = guess.letters[i];
      const isActive = isCurrentRow && !isCompleted && i === currentGuessLength;
      const isFirstActive = isActive && i === 0;
      
      tiles.push(
        <Tile
          key={i}
          letter={letter?.char || ''}
          state={letter?.state || 'empty'}
          isCurrentRow={isCurrentRow}
          isActive={isActive}
          isFirstActive={isFirstActive}
        />
      );
    }
    
    const rowClass = `row ${isCompleted ? 'row-completed' : (isCurrentRow ? 'row-current' : '')} ${shake ? 'shake' : ''}`.trim();
    return <div className={rowClass}>{tiles}</div>;
  } else {
    for (let i = 0; i < wordLength; i++) {
      const isActive = isCurrentRow && i === currentGuessLength;
      const isFirstActive = isActive && i === 0;
      
      tiles.push(
        <Tile 
          key={i} 
          letter="" 
          state="empty" 
          isCurrentRow={isCurrentRow}
          isActive={isActive}
          isFirstActive={isFirstActive}
        />
      );
    }
  }

  const rowClass = isFutureRow ? 'row row-future' : (isCurrentRow ? 'row row-current' : 'row');
  return <div className={rowClass}>{tiles}</div>;
};

export default Row;
