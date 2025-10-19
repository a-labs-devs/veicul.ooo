import React, { useState, useEffect, useCallback } from 'react';
import './MultiGame.css';
import Grid from '../Grid/Grid';
import Keyboard from '../Keyboard/Keyboard';
import ToastContainer from '../Toast/ToastContainer';
import GameOverModal from '../GameOverModal/GameOverModal';
import { GameState, Guess, GameStateExtended } from '../../types/game';
import { getDailyWord, isValidWord, normalizeWord, WORDS } from '../../data/words';
import { createGuess } from '../../utils/game';
import { updateStats, loadGameStateExtended, saveGameStateExtended, initializeGameStateExtended } from '../../utils/storage';
import { useToast } from '../../hooks/useToast';

interface MultiGameProps {
  gameCount: number;
  maxGuesses?: number;
}

const MultiGame: React.FC<MultiGameProps> = ({ gameCount, maxGuesses = 7 }) => {
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  
  const wordLength = 5;

  const [games, setGames] = useState<GameState[]>(() => {
    const targets: string[] = [];
    const dailyWord = getDailyWord();
    targets.push(dailyWord);
    
    const availableWords = WORDS.filter(w => normalizeWord(w) !== normalizeWord(dailyWord));
    for (let i = 1; i < gameCount; i++) {
      const randomIndex = (i * 17 + targets.length) % availableWords.length;
      targets.push(availableWords[randomIndex]);
    }

    return targets.map(target => {
      const saved = loadGameStateExtended(target);
      
      if (saved && saved.tries.length > 0) {
        const guesses = saved.tries.map(tryWord => 
          createGuess(tryWord.join(''), target)
        );
        
        let status: 'playing' | 'won' | 'lost' = 'playing';
        if (saved.won === true) status = 'won';
        else if (saved.won === false && saved.gameOver) status = 'lost';
        
        return {
          target,
          guesses,
          currentGuess: '',
          gameStatus: status,
          maxGuesses,
        };
      }
      
      return {
        target,
        guesses: [],
        currentGuess: '',
        gameStatus: 'playing' as const,
        maxGuesses,
      };
    });
  });

  const [extendedStates, setExtendedStates] = useState<GameStateExtended[]>(() => {
    return games.map(game => {
      const saved = loadGameStateExtended(game.target);
      if (saved) {
        return saved;
      }
      return initializeGameStateExtended(game.target);
    });
  });

  const [currentGuess, setCurrentGuess] = useState('');
  const [allGuesses, setAllGuesses] = useState<Guess[]>(() => {
    const firstGame = games[0];
    if (firstGame && firstGame.guesses.length > 0) {
      return firstGame.guesses;
    }
    return [];
  });

  useEffect(() => {
    extendedStates.forEach(state => {
      saveGameStateExtended('multi', state);
    });
  }, [extendedStates]);

  const allGamesFinished = games.every(g => g.gameStatus !== 'playing');

  const handleKeyPress = useCallback((key: string) => {
    if (allGamesFinished) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordLength) {
        showError(`A palavra deve ter ${wordLength} letras!`, 2000);
        return;
      }

      if (!isValidWord(currentGuess)) {
        showError('Palavra inválida!', 2000);
        
        setExtendedStates(prev => prev.map(state => ({
          ...state,
          invalids: [...state.invalids, currentGuess],
        })));
        return;
      }

      const normalizedGuess = normalizeWord(currentGuess);
      const alreadyTried = allGuesses.some(g => 
        normalizeWord(g.word) === normalizedGuess
      );

      if (alreadyTried) {
        showError('Você já tentou essa palavra!', 2000);
        return;
      }

      const newGames = games.map((game, index) => {
        if (game.gameStatus !== 'playing') return game;

        const guess = createGuess(currentGuess, game.target);
        const newGuesses = [...game.guesses, guess];
        const isCorrect = normalizeWord(currentGuess) === normalizeWord(game.target);
        
        const currentTry = currentGuess.split('');
        setExtendedStates(prev => {
          const newStates = [...prev];
          newStates[index] = {
            ...newStates[index],
            tries: [...newStates[index].tries, currentTry],
            curRow: newStates[index].curRow + 1,
            curTry: [],
            gameOver: isCorrect || newGuesses.length >= maxGuesses,
            won: isCorrect ? true : (newGuesses.length >= maxGuesses ? false : null),
          };
          return newStates;
        });
        
        let newStatus: 'playing' | 'won' | 'lost' = game.gameStatus;
        if (isCorrect) {
          newStatus = 'won';
        } else if (newGuesses.length >= maxGuesses) {
          newStatus = 'lost';
        }

        return {
          ...game,
          guesses: newGuesses,
          gameStatus: newStatus,
        };
      });

      const guess = createGuess(currentGuess, games[0].target);
      const newAllGuesses = [...allGuesses, guess];

      setGames(newGames);
      setAllGuesses(newAllGuesses);
      setCurrentGuess('');

      const nowAllFinished = newGames.every(g => g.gameStatus !== 'playing');
      if (nowAllFinished) {
        const allWon = newGames.every(g => g.gameStatus === 'won');
        updateStats(allWon, newAllGuesses.length);
        
        if (!allWon) {
          setTimeout(() => setShowGameOverModal(true), 800);
        }
      }
    } else if (key === '⌫' || key === 'BACKSPACE') {
      const newGuess = currentGuess.slice(0, -1);
      setCurrentGuess(newGuess);
      setExtendedStates(prev => prev.map(state => ({
        ...state,
        curTry: newGuess.split(''),
      })));
    } else if (currentGuess.length < wordLength) {
      const newGuess = currentGuess + key;
      setCurrentGuess(newGuess);
      setExtendedStates(prev => prev.map(state => ({
        ...state,
        curTry: newGuess.split(''),
      })));
    }
  }, [games, currentGuess, allGuesses, wordLength, maxGuesses, allGamesFinished, showSuccess, showError]);

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
    <div className="multi-game">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <GameOverModal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        won={games.every(g => g.gameStatus === 'won')}
        targetWords={games.map(g => g.target)}
        guessCount={allGuesses.length}
      />
      <div className={`games-container games-${gameCount}`}>
        {games.map((game, index) => (
          <div key={index} className={`game-board ${game.gameStatus === 'won' ? 'won' : ''}`}>
            <div className="game-number">Palavra {index + 1}</div>
            <Grid
              guesses={game.guesses}
              currentGuess={game.gameStatus === 'playing' ? currentGuess : ''}
              maxGuesses={maxGuesses}
              wordLength={wordLength}
              gameStatus={game.gameStatus}
            />
          </div>
        ))}
      </div>
      <Keyboard onKeyPress={handleKeyPress} guesses={allGuesses} />
    </div>
  );
};

export default MultiGame;
