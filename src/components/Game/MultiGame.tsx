import React, { useState, useEffect, useCallback } from 'react';
import './MultiGame.css';
import Grid from '../Grid/Grid';
import Keyboard from '../Keyboard/Keyboard';
import ToastContainer from '../Toast/ToastContainer';
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
  
  const [games, setGames] = useState<GameState[]>(() => {
    // Generate multiple target words
    const targets: string[] = [];
    const dailyWord = getDailyWord();
    targets.push(dailyWord);
    
    // Get other random words different from the daily word
    const availableWords = WORDS.filter(w => normalizeWord(w) !== normalizeWord(dailyWord));
    for (let i = 1; i < gameCount; i++) {
      const randomIndex = (i * 17 + targets.length) % availableWords.length;
      targets.push(availableWords[randomIndex]);
    }

    return targets.map(target => ({
      target,
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing' as const,
      maxGuesses,
    }));
  });

  const [currentGuess, setCurrentGuess] = useState('');
  const [allGuesses, setAllGuesses] = useState<Guess[]>([]);
  const wordLength = 5;

  const [extendedStates, setExtendedStates] = useState<GameStateExtended[]>(() => {
    return games.map(game => {
      const saved = loadGameStateExtended(game.target);
      if (saved && !saved.gameOver) {
        return saved;
      }
      return initializeGameStateExtended(game.target);
    });
  });

  // Salva os estados estendidos sempre que mudarem
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
        showError('Palavra não encontrada na lista!', 2000);
        
        // Adiciona às tentativas inválidas de todos os jogos
        setExtendedStates(prev => prev.map(state => ({
          ...state,
          invalids: [...state.invalids, currentGuess],
        })));
        return;
      }

      // Apply guess to all games
      const newGames = games.map((game, index) => {
        if (game.gameStatus !== 'playing') return game;

        const guess = createGuess(currentGuess, game.target);
        const newGuesses = [...game.guesses, guess];
        const isCorrect = normalizeWord(currentGuess) === normalizeWord(game.target);
        
        // Atualiza estado estendido deste jogo específico
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

      // Check if all games are now finished
      const nowAllFinished = newGames.every(g => g.gameStatus !== 'playing');
      if (nowAllFinished) {
        const allWon = newGames.every(g => g.gameStatus === 'won');
        updateStats(allWon, newAllGuesses.length);
        
        setTimeout(() => {
          if (allWon) {
            showSuccess('Parabéns! Você acertou todas as palavras! 🎉', 4000);
          } else {
            const lostGames = newGames.filter(g => g.gameStatus === 'lost');
            const words = lostGames.map(g => g.target.toUpperCase()).join(', ');
            showSuccess(`Palavras: ${words}`, 5000);
          }
        }, 500);
      }
      // Se errou mas ainda tem tentativas, apenas avança silenciosamente
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
      <div className={`games-container games-${gameCount}`}>
        {games.map((game, index) => (
          <div key={index} className={`game-board ${game.gameStatus === 'won' ? 'won' : ''}`}>
            <div className="game-number">Palavra {index + 1}</div>
            <Grid
              guesses={game.guesses}
              currentGuess={game.gameStatus === 'playing' ? currentGuess : ''}
              maxGuesses={maxGuesses}
              wordLength={wordLength}
            />
          </div>
        ))}
      </div>
      <Keyboard onKeyPress={handleKeyPress} guesses={allGuesses} />
    </div>
  );
};

export default MultiGame;
