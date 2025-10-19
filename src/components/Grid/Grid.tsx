import React from 'react';
import './Grid.css';
import { Guess } from '../../types/game';
import Row from './Row';

interface GridProps {
  guesses: Guess[];
  currentGuess: string;
  maxGuesses: number;
  wordLength: number;
}

const Grid: React.FC<GridProps> = ({ guesses, currentGuess, maxGuesses, wordLength }) => {
  const emptyRows = maxGuesses - guesses.length - (currentGuess ? 1 : 0);

  return (
    <div className="grid">
      {guesses.map((guess, i) => (
        <Row key={i} guess={guess} wordLength={wordLength} />
      ))}
      {currentGuess && (
        <Row 
          key="current" 
          guess={{ 
            word: currentGuess, 
            letters: currentGuess.split('').map(char => ({ char, state: 'empty' })) 
          }} 
          wordLength={wordLength}
        />
      )}
      {Array.from({ length: emptyRows }).map((_, i) => (
        <Row key={`empty-${i}`} guess={null} wordLength={wordLength} />
      ))}
    </div>
  );
};

export default Grid;
