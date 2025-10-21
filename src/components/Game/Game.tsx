import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';
import Grid from '../Grid/Grid';
import Keyboard from '../Keyboard/Keyboard';
import ToastContainer from '../Toast/ToastContainer';
import GameOverModal from '../GameOverModal/GameOverModal';
import { GameState, GameStateExtended } from '../../types/game';
import { isValidWord, normalizeWord } from '../../data/words';
import { createGuess } from '../../utils/game';
import { updateStats, loadGameStateExtended, saveGameStateExtended, initializeGameStateExtended } from '../../utils/storage';
import { useToast } from '../../hooks/useToast';

interface GameProps {
  wordLength?: number;
  maxGuesses?: number;
  targetWord?: string;
}

const Game: React.FC<GameProps> = ({ 
  maxGuesses = 6,
  targetWord 
}) => {
  const { toasts, removeToast, showError } = useToast();
  const [shake, setShake] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const target = targetWord || '';
  const actualWordLength = target.length;
  
  const [extendedState, setExtendedState] = useState<GameStateExtended>(() => {
    const saved = loadGameStateExtended(target);
    
    if (saved && saved.solution === target) {
      return saved;
    }
    return initializeGameStateExtended(target);
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameStateExtended(target);
    if (saved && saved.solution === target && saved.tries.length > 0) {
      const guesses = saved.tries.map(tryWord => 
        createGuess(tryWord.join(''), target)
      );
      
      let status: 'playing' | 'won' | 'lost' = 'playing';
      if (saved.won === true) status = 'won';
      else if (saved.won === false && saved.gameOver) status = 'lost';
      
      return {
        target,
        guesses,
        currentGuess: saved.curTry.join(''),
        gameStatus: status,
        maxGuesses,
      };
    }
    
    return {
      target,
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      maxGuesses,
    };
  });

  useEffect(() => {
    saveGameStateExtended('termo', extendedState);
  }, [extendedState]);

  useEffect(() => {
    if (targetWord) {
      setGameState(prev => ({ ...prev, target: targetWord }));
      const saved = loadGameStateExtended(targetWord);
      if (saved && !saved.gameOver) {
        setExtendedState(saved);
      } else {
        setExtendedState(initializeGameStateExtended(targetWord));
      }
    }
  }, [targetWord]);

  const handleKeyPress = useCallback(async (key: string) => {
    if (gameState.gameStatus !== 'playing' || extendedState.gameOver) return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== actualWordLength) {
        showError(`A palavra deve ter ${actualWordLength} letras!`, 2000);
        return;
      }

      const normalizedGuess = normalizeWord(gameState.currentGuess);
      const normalizedTarget = normalizeWord(gameState.target);
      const isCorrectWord = normalizedGuess === normalizedTarget;
      let finalGuess = gameState.currentGuess;
      if (isCorrectWord && finalGuess !== gameState.target) {
        finalGuess = gameState.target;
      }
      if (!isCorrectWord) {
        const valid = await isValidWord(gameState.currentGuess, actualWordLength);
        if (!valid) {
          showError('Palavra inválida!', 2000);
          
          setShake(true);
          setTimeout(() => setShake(false), 500);
          
          setExtendedState(prev => ({
            ...prev,
            invalids: [...prev.invalids, gameState.currentGuess],
          }));
          return;
        }
      }

      const alreadyTried = gameState.guesses.some(g => 
        normalizeWord(g.word) === normalizedGuess
      );

      if (alreadyTried) {
        showError('Você já tentou essa palavra!', 2000);
        
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      const guess = createGuess(finalGuess, gameState.target);
      const newGuesses = [...gameState.guesses, guess];
      const isCorrect = normalizeWord(finalGuess) === normalizeWord(gameState.target);
      
      let newStatus: 'playing' | 'won' | 'lost' = gameState.gameStatus;
      if (isCorrect) {
        newStatus = 'won';
        updateStats(true, newGuesses.length);
      } else if (newGuesses.length >= maxGuesses) {
        newStatus = 'lost';
        updateStats(false, newGuesses.length);
      }

      const currentTry = finalGuess.split('');
      const isGameOver = isCorrect || newGuesses.length >= maxGuesses;
      
      setExtendedState(prev => ({
        ...prev,
        tries: [...prev.tries, currentTry],
        curRow: prev.curRow + 1,
        curTry: [],
        gameOver: isGameOver,
        won: isCorrect ? true : (newGuesses.length >= maxGuesses ? false : null),
      }));

      setGameState({
        ...gameState,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: newStatus,
      });

      if (newStatus === 'lost') {
        setTimeout(() => setShowGameOverModal(true), 800);
      }
    } else if (key === '⌫' || key === 'BACKSPACE') {
      const newGuess = gameState.currentGuess.slice(0, -1);
      setGameState({
        ...gameState,
        currentGuess: newGuess,
      });
      setExtendedState(prev => ({
        ...prev,
        curTry: newGuess.split(''),
      }));
    } else if (gameState.currentGuess.length < actualWordLength) {
      const newGuess = gameState.currentGuess + key;
      setGameState({
        ...gameState,
        currentGuess: newGuess,
      });
      setExtendedState(prev => ({
        ...prev,
        curTry: newGuess.split(''),
      }));
    }
  }, [gameState, extendedState, actualWordLength, maxGuesses, showError]);

  useEffect(() => {
    const handlePhysicalKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('⌫');
      } else if (/^[a-záàâãéêíóôõúçA-ZÁÀÂÃÉÊÍÓÔÕÚÇ]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="game">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <GameOverModal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        won={gameState.gameStatus === 'won'}
        targetWord={gameState.target}
      />
      <Grid
        guesses={gameState.guesses}
        currentGuess={gameState.currentGuess}
        maxGuesses={maxGuesses}
        wordLength={actualWordLength}
        shake={shake}
        gameStatus={gameState.gameStatus}
      />
      {/* <HintButton 
        onHint={handleHint}
        hintsUsed={extendedState.hintsUsed}
        maxHints={2}
        disabled={gameState.gameStatus !== 'playing'}
      /> */}
      <Keyboard onKeyPress={handleKeyPress} guesses={gameState.guesses} />
    </div>
  );
};

export default Game;
