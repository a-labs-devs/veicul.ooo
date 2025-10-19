import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';
import Grid from '../Grid/Grid';
import Keyboard from '../Keyboard/Keyboard';
import { GameState } from '../../types/game';
import { getDailyWord, isValidWord, normalizeWord } from '../../data/words';
import { createGuess } from '../../utils/game';
import { updateStats } from '../../utils/storage';

interface GameProps {
  wordLength?: number;
  maxGuesses?: number;
  targetWord?: string;
}

const Game: React.FC<GameProps> = ({ 
  wordLength = 5, 
  maxGuesses = 6,
  targetWord 
}) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    target: targetWord || getDailyWord(),
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    maxGuesses,
  }));

  useEffect(() => {
    if (targetWord) {
      setGameState(prev => ({ ...prev, target: targetWord }));
    }
  }, [targetWord]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== wordLength) {
        alert(`A palavra deve ter ${wordLength} letras!`);
        return;
      }

      if (!isValidWord(gameState.currentGuess)) {
        alert('Palavra não encontrada na lista!');
        return;
      }

      const guess = createGuess(gameState.currentGuess, gameState.target);
      const newGuesses = [...gameState.guesses, guess];
      const isCorrect = normalizeWord(gameState.currentGuess) === normalizeWord(gameState.target);
      
      let newStatus: 'playing' | 'won' | 'lost' = gameState.gameStatus;
      if (isCorrect) {
        newStatus = 'won';
        updateStats(true, newGuesses.length);
      } else if (newGuesses.length >= maxGuesses) {
        newStatus = 'lost';
        updateStats(false, newGuesses.length);
      }

      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: newStatus,
      });

      if (newStatus === 'won') {
        setTimeout(() => alert('Parabéns! Você acertou! 🎉'), 500);
      } else if (newStatus === 'lost') {
        setTimeout(() => alert(`Que pena! A palavra era: ${gameState.target}`), 500);
      }
    } else if (key === '⌫' || key === 'BACKSPACE') {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess.slice(0, -1),
      });
    } else if (gameState.currentGuess.length < wordLength) {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess + key,
      });
    }
  }, [gameState, wordLength, maxGuesses]);

  useEffect(() => {
    const handlePhysicalKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('⌫');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="game">
      <Grid
        guesses={gameState.guesses}
        currentGuess={gameState.currentGuess}
        maxGuesses={maxGuesses}
        wordLength={wordLength}
      />
      <Keyboard onKeyPress={handleKeyPress} guesses={gameState.guesses} />
    </div>
  );
};

export default Game;
