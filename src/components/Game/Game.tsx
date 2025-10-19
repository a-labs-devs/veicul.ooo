import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';
import Grid from '../Grid/Grid';
import Keyboard from '../Keyboard/Keyboard';
import ToastContainer from '../Toast/ToastContainer';
import HintButton from '../HintButton/HintButton';
import { GameState, GameStateExtended } from '../../types/game';
import { getDailyWord, isValidWord, normalizeWord } from '../../data/words';
import { createGuess } from '../../utils/game';
import { updateStats, loadGameStateExtended, saveGameStateExtended, initializeGameStateExtended } from '../../utils/storage';
import { useToast } from '../../hooks/useToast';

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
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();
  
  const [gameState, setGameState] = useState<GameState>(() => ({
    target: targetWord || getDailyWord(),
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    maxGuesses,
  }));

  const [extendedState, setExtendedState] = useState<GameStateExtended>(() => {
    const target = targetWord || getDailyWord();
    const saved = loadGameStateExtended(target);
    if (saved && !saved.gameOver) {
      return saved;
    }
    return initializeGameStateExtended(target);
  });

  // Salva o estado estendido sempre que mudar
  useEffect(() => {
    saveGameStateExtended('termo', extendedState);
  }, [extendedState]);

  // Restaura o estado do jogo a partir do estado estendido
  useEffect(() => {
    if (extendedState.tries.length > 0) {
      const guesses = extendedState.tries.map(tryWord => 
        createGuess(tryWord.join(''), gameState.target)
      );
      
      let status: 'playing' | 'won' | 'lost' = 'playing';
      if (extendedState.won === true) status = 'won';
      else if (extendedState.won === false && extendedState.gameOver) status = 'lost';
      
      setGameState(prev => ({
        ...prev,
        guesses,
        currentGuess: extendedState.curTry.join(''),
        gameStatus: status,
      }));
    }
  }, []);

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

  const handleHint = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;
    if (extendedState.hintsUsed >= 2) {
      showError('Você já usou todas as dicas!', 2000);
      return;
    }

    const target = gameState.target.toUpperCase();
    const availableIndices = [];
    
    for (let i = 0; i < target.length; i++) {
      if (!extendedState.revealedLetters.includes(i)) {
        availableIndices.push(i);
      }
    }

    if (availableIndices.length === 0) {
      showError('Todas as letras já foram reveladas!', 2000);
      return;
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const letter = target[randomIndex];
    
    setExtendedState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      revealedLetters: [...prev.revealedLetters, randomIndex],
    }));

    showInfo(`💡 Posição ${randomIndex + 1}: ${letter}`, 4000);
  }, [gameState, extendedState, showError, showInfo]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== wordLength) {
        showError(`A palavra deve ter ${wordLength} letras!`, 2000);
        return;
      }

      if (!isValidWord(gameState.currentGuess)) {
        showError('Palavra não encontrada na lista!', 2000);
        
        // Adiciona às tentativas inválidas
        setExtendedState(prev => ({
          ...prev,
          invalids: [...prev.invalids, gameState.currentGuess],
        }));
        return;
      }

      const guess = createGuess(gameState.currentGuess, gameState.target);
      const newGuesses = [...gameState.guesses, guess];
      const isCorrect = normalizeWord(gameState.currentGuess) === normalizeWord(gameState.target);
      
      // Atualiza estado estendido
      const currentTry = gameState.currentGuess.split('');
      setExtendedState(prev => ({
        ...prev,
        tries: [...prev.tries, currentTry],
        curRow: prev.curRow + 1,
        curTry: [],
        gameOver: isCorrect || newGuesses.length >= maxGuesses,
        won: isCorrect ? true : (newGuesses.length >= maxGuesses ? false : null),
      }));
      
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

      // Toast apenas para vitória ou derrota final
      if (newStatus === 'won') {
        setTimeout(() => showSuccess('Parabéns! Você acertou! 🎉', 4000), 500);
      } else if (newStatus === 'lost') {
        setTimeout(() => showSuccess(`A palavra era: ${gameState.target.toUpperCase()}`, 4000), 500);
      }
      // Se errou mas ainda tem tentativas, apenas avança silenciosamente
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
    } else if (gameState.currentGuess.length < wordLength) {
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
  }, [gameState, extendedState, wordLength, maxGuesses, showSuccess, showError]);

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
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Grid
        guesses={gameState.guesses}
        currentGuess={gameState.currentGuess}
        maxGuesses={maxGuesses}
        wordLength={wordLength}
      />
      <HintButton 
        onHint={handleHint}
        hintsUsed={extendedState.hintsUsed}
        maxHints={2}
        disabled={gameState.gameStatus !== 'playing'}
      />
      <Keyboard onKeyPress={handleKeyPress} guesses={gameState.guesses} />
    </div>
  );
};

export default Game;
