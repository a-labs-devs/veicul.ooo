import React from 'react';
import './Tile.css';
import { LetterState } from '../../types/game';

interface TileProps {
  letter: string;
  state: LetterState;
  isCurrentRow?: boolean;
  isActive?: boolean;
  isFirstActive?: boolean;
}

const Tile: React.FC<TileProps> = ({ 
  letter, 
  state, 
  isCurrentRow = false, 
  isActive = false,
  isFirstActive = false
}) => {
  const hasLetter = letter !== '';
  const isSubmitted = state !== 'empty';
  
  const classes = [
    'tile',
    `tile-${state}`,
    isCurrentRow ? 'tile-current-row' : '',
    isCurrentRow && hasLetter && !isSubmitted ? 'tile-has-letter' : '',
    isActive ? 'tile-active' : '',
    isFirstActive ? 'tile-active-first' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {letter}
    </div>
  );
};

export default Tile;
