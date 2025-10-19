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

export interface GameConfig {
  highContrast: boolean;
  hardMode: boolean;
  hintsEnabled: boolean;
}

export interface GameMeta {
  startTime: number;
  endTime: number | null;
  curday: number;
}

export interface GameStateExtended {
  solution: string;
  normSolution: string;
  tries: string[][];
  invalids: string[];
  curRow: number;
  curTry: string[];
  gameOver: boolean;
  won: boolean | null;
  hintsUsed: number;
  revealedLetters: number[]; // índices das letras reveladas
}

export interface GameState {
  target: string;
  guesses: Guess[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  maxGuesses: number;
}

export interface FullGameData {
  config: GameConfig;
  meta: GameMeta;
  stats: GameStats;
  state: GameStateExtended[];
}

export type GameMode = 'termo' | 'dueto' | 'quarteto';
