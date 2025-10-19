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
  guessDistribution: number[];
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
  revealedLetters: number[];
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
