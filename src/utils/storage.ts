import { GameStats } from '../types/game';

const STATS_KEY = 'veiculooo-stats';
const GAME_STATE_KEY = 'veiculooo-game-state';
const LAST_PLAYED_KEY = 'veiculooo-last-played';

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
