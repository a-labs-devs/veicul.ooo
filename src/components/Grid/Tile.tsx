import React from 'react';
import './Tile.css';
import { LetterState } from '../../types/game';

interface TileProps {
  letter: string;
  state: LetterState;
}

const Tile: React.FC<TileProps> = ({ letter, state }) => {
  return (
    <div className={`tile tile-${state}`}>
      {letter}
    </div>
  );
};

export default Tile;
