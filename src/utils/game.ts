import { Letter, LetterState, Guess } from '../types/game';
import { normalizeWord } from '../data/words';

export const checkGuess = (guess: string, target: string): Letter[] => {
  const normalizedGuess = normalizeWord(guess);
  const normalizedTarget = normalizeWord(target);
  const letters: Letter[] = [];
  const targetLetters = normalizedTarget.split('');
  const targetLetterCount: { [key: string]: number } = {};

  targetLetters.forEach(letter => {
    targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
  });

  const guessLetters = normalizedGuess.split('');
  const states: LetterState[] = new Array(guessLetters.length).fill('absent');

  guessLetters.forEach((letter, i) => {
    if (letter === targetLetters[i]) {
      states[i] = 'correct';
      targetLetterCount[letter]--;
    }
  });

  guessLetters.forEach((letter, i) => {
    if (states[i] === 'absent' && targetLetterCount[letter] > 0) {
      states[i] = 'present';
      targetLetterCount[letter]--;
    }
  });

  guess.split('').forEach((char, i) => {
    letters.push({
      char: char.toUpperCase(),
      state: states[i],
    });
  });

  return letters;
};

export const createGuess = (word: string, target: string): Guess => {
  return {
    word: word.toUpperCase(),
    letters: checkGuess(word, target),
  };
};

export const getKeyboardLetterState = (
  letter: string,
  guesses: Guess[]
): LetterState => {
  let bestState: LetterState = 'empty';

  guesses.forEach(guess => {
    guess.letters.forEach(l => {
      if (normalizeWord(l.char) === normalizeWord(letter)) {
        if (l.state === 'correct') {
          bestState = 'correct';
        } else if (l.state === 'present' && bestState !== 'correct') {
          bestState = 'present';
        } else if (l.state === 'absent' && bestState === 'empty') {
          bestState = 'absent';
        }
      }
    });
  });

  return bestState;
};
