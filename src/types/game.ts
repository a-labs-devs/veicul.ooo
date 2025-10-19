export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface Letter {
  char: string;
  state: LetterState;
}

export interface Guess {
  word: string;
  letters: Letter[];
}

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[]; // [1-guess wins, 2-guess wins, ..., 6-guess wins]
}

export interface GameState {
  target: string;
  guesses: Guess[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  maxGuesses: number;
}

export type GameMode = 'termo' | 'dueto' | 'quarteto';
