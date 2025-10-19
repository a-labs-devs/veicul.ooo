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

  const currentRowIndex = guesses.length;
  
  return (
    <div className="grid">
      {guesses.map((guess, i) => (
        <Row 
          key={i} 
          guess={guess} 
          wordLength={wordLength} 
          isCurrentRow={false}
          isFutureRow={false}
          currentGuessLength={0}
        />
      ))}
      {currentGuess && (
        <Row 
          key={`current-${currentRowIndex}`}
          guess={{ 
            word: currentGuess, 
            letters: currentGuess.split('').map(char => ({ char, state: 'empty' })) 
          }} 
          wordLength={wordLength}
          isCurrentRow={true}
          isFutureRow={false}
          currentGuessLength={currentGuess.length}
        />
      )}
      {Array.from({ length: emptyRows }).map((_, i) => (
        <Row 
          key={`empty-${currentRowIndex + i + 1}`} 
          guess={null} 
          wordLength={wordLength} 
          isCurrentRow={false}
          isFutureRow={true}
          currentGuessLength={0}
        />
      ))}
    </div>
  );
};

export default Grid;
