import { GameStats, GameConfig, FullGameData, GameStateExtended } from '../types/game';

const STATS_KEY = 'veiculooo-stats';
const GAME_STATE_KEY = 'veiculooo-game-state';
const LAST_PLAYED_KEY = 'veiculooo-last-played';
const FULL_GAME_DATA_KEY = 'veiculooo-full-data';
const CONFIG_KEY = 'veiculooo-config';

export const loadStats = (): GameStats => {
  const stored = localStorage.getItem(STATS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  };
};

export const saveStats = (stats: GameStats): void => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const updateStats = (won: boolean, guesses: number): void => {
  const stats = loadStats();
  stats.played++;
  
  if (won) {
    stats.won++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    if (guesses >= 1 && guesses <= 6) {
      stats.guessDistribution[guesses - 1]++;
    }
  } else {
    stats.currentStreak = 0;
  }
  
  saveStats(stats);
};

export const loadGameState = (mode: string): any => {
  const stored = localStorage.getItem(`${GAME_STATE_KEY}-${mode}`);
  return stored ? JSON.parse(stored) : null;
};

export const saveGameState = (mode: string, state: any): void => {
  localStorage.setItem(`${GAME_STATE_KEY}-${mode}`, JSON.stringify(state));
};

export const getLastPlayedDate = (): string | null => {
  return localStorage.getItem(LAST_PLAYED_KEY);
};

export const setLastPlayedDate = (date: string): void => {
  localStorage.setItem(LAST_PLAYED_KEY, date);
};

export const isNewDay = (): boolean => {
  const lastPlayed = getLastPlayedDate();
  const today = new Date().toDateString();
  return lastPlayed !== today;
};

export const loadConfig = (): GameConfig => {
  const stored = localStorage.getItem(CONFIG_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    highContrast: false,
    hardMode: false,
    hintsEnabled: true,
  };
};

export const saveConfig = (config: GameConfig): void => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const getCurrentDay = (): number => {
  const today = new Date();
  const start = new Date('2025-01-01');
  return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

export const loadFullGameData = (): FullGameData => {
  const stored = localStorage.getItem(FULL_GAME_DATA_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  return {
    config: loadConfig(),
    meta: {
      startTime: Date.now(),
      endTime: null,
      curday: getCurrentDay(),
    },
    stats: loadStats(),
    state: [],
  };
};

export const saveFullGameData = (data: FullGameData): void => {
  localStorage.setItem(FULL_GAME_DATA_KEY, JSON.stringify(data));
};

export const saveGameStateExtended = (_mode: string, state: GameStateExtended): void => {
  const fullData = loadFullGameData();
  
  const existingIndex = fullData.state.findIndex(s => s.solution === state.solution);
  if (existingIndex >= 0) {
    fullData.state[existingIndex] = state;
  } else {
    fullData.state.push(state);
  }
  
  fullData.meta.curday = getCurrentDay();
  saveFullGameData(fullData);
};

export const loadGameStateExtended = (solution: string): GameStateExtended | null => {
  const fullData = loadFullGameData();
  const state = fullData.state.find(s => s.solution === solution);
  return state || null;
};

export const initializeGameStateExtended = (solution: string): GameStateExtended => {
  return {
    solution,
    normSolution: solution.toUpperCase(),
    tries: [],
    invalids: [],
    curRow: 0,
    curTry: [],
    gameOver: false,
    won: null,
    hintsUsed: 0,
    revealedLetters: [],
  };
};
