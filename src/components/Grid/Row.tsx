import React from 'react';
import './Row.css';
import { Guess } from '../../types/game';
import Tile from './Tile';

interface RowProps {
  guess: Guess | null;
  wordLength: number;
}

const Row: React.FC<RowProps> = ({ guess, wordLength }) => {
  const tiles = [];

  if (guess) {
    for (let i = 0; i < wordLength; i++) {
      const letter = guess.letters[i];
      tiles.push(
        <Tile
          key={i}
          letter={letter?.char || ''}
          state={letter?.state || 'empty'}
        />
      );
    }
  } else {
    for (let i = 0; i < wordLength; i++) {
      tiles.push(<Tile key={i} letter="" state="empty" />);
    }
  }

  return <div className="row">{tiles}</div>;
};

export default Row;
