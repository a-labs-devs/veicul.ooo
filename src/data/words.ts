import { generateVehicleWord } from '../services/openrouter';
import { isValidWord as validateWord } from '../services/validator';

export const normalizeLetter = (letter: string): string => {
  return letter
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
};

export const normalizeWord = (word: string): string => {
  return word.split('').map(normalizeLetter).join('');
};

export const isValidWord = async (word: string, wordLength?: number): Promise<boolean> => {
  return validateWord(word, wordLength);
};

export const getRandomWord = async (minLength: number = 3, maxLength: number = 10): Promise<string> => {
  return await generateVehicleWord(minLength, maxLength);
};

const DAILY_WORD_KEY = 'veiculooo_daily_word';

interface DailyWordCache {
  word: string;
  date: string;
}

export const getDailyWord = async (): Promise<string> => {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const cached = localStorage.getItem(DAILY_WORD_KEY);
    if (cached) {
      const data: DailyWordCache = JSON.parse(cached);
      if (data.date === today) {
        return data.word;
      }
    }
  } catch (error) {
  }
  
  // Busca palavra do servidor (API) - SEMPRE via IA
  const response = await fetch('/api/daily-word');
  
  if (!response.ok) {
    throw new Error('Falha ao buscar palavra do dia da API');
  }
  
  const data = await response.json();
  
  const cache: DailyWordCache = {
    word: data.word,
    date: data.date,
  };
  
  localStorage.setItem(DAILY_WORD_KEY, JSON.stringify(cache));
  return data.word;
};
