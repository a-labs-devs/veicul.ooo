import React, { useState, useEffect, useCallback } from 'react';
import './MultiGame.css';
import Grid from '../Grid/Grid';
import Keyboard from '../Keyboard/Keyboard';
import { GameState, Guess } from '../../types/game';
import { getDailyWord, isValidWord, normalizeWord, WORDS } from '../../data/words';
import { createGuess } from '../../utils/game';
import { updateStats } from '../../utils/storage';

interface MultiGameProps {
  gameCount: number;
  maxGuesses?: number;
}

const MultiGame: React.FC<MultiGameProps> = ({ gameCount, maxGuesses = 7 }) => {
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

  const allGamesFinished = games.every(g => g.gameStatus !== 'playing');

  const handleKeyPress = useCallback((key: string) => {
    if (allGamesFinished) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordLength) {
        alert(`A palavra deve ter ${wordLength} letras!`);
        return;
      }

      if (!isValidWord(currentGuess)) {
        alert('Palavra não encontrada na lista!');
        return;
      }

      // Apply guess to all games
      const newGames = games.map(game => {
        if (game.gameStatus !== 'playing') return game;

        const guess = createGuess(currentGuess, game.target);
        const newGuesses = [...game.guesses, guess];
        const isCorrect = normalizeWord(currentGuess) === normalizeWord(game.target);
        
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
            alert('Parabéns! Você acertou todas as palavras! 🎉');
          } else {
            const lostGames = newGames.filter(g => g.gameStatus === 'lost');
            alert(`Fim de jogo! Palavras não descobertas: ${lostGames.map(g => g.target).join(', ')}`);
          }
        }, 500);
      }
    } else if (key === '⌫' || key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < wordLength) {
      setCurrentGuess(prev => prev + key);
    }
  }, [games, currentGuess, allGuesses, wordLength, maxGuesses, allGamesFinished]);

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
