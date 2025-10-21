let palavrasCache: Set<string> | null = null;
let palavrasPorTamanho: Map<number, Set<string>> = new Map();

export const normalizeLetter = (letter: string): string => {
  return letter
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
};

export const normalizeWord = (word: string): string => {
  return word.split('').map(normalizeLetter).join('');
};

const loadPalavras = async (): Promise<Set<string>> => {
  if (palavrasCache) {
    return palavrasCache;
  }

  try {
    const response = await fetch('/palavras.txt');
    const text = await response.text();
    
    const palavras = text
      .split('\n')
      .map(p => p.trim().toUpperCase())
      .filter(p => {
        if (!p || p.includes('-') || /\d/.test(p)) {
          return false;
        }
        return true;
      });

    palavrasCache = new Set(palavras);
    
    palavras.forEach(palavra => {
      const tamanho = palavra.length;
      if (!palavrasPorTamanho.has(tamanho)) {
        palavrasPorTamanho.set(tamanho, new Set());
      }
      palavrasPorTamanho.get(tamanho)!.add(palavra);
    });

    return palavrasCache;
  } catch (error) {
    return new Set();
  }
};

export const isValidWord = async (word: string, wordLength?: number): Promise<boolean> => {
  const palavras = await loadPalavras();
  
  const normalized = normalizeWord(word);
  
  if (wordLength && palavrasPorTamanho.has(wordLength)) {
    const palavrasFiltradas = palavrasPorTamanho.get(wordLength)!;
    return Array.from(palavrasFiltradas).some(p => normalizeWord(p) === normalized);
  }
  
  return Array.from(palavras).some(p => normalizeWord(p) === normalized);
};

export const preloadPalavras = async (): Promise<void> => {
  await loadPalavras();
};

export const getPalavrasCount = (): number => {
  return palavrasCache?.size || 0;
};

export const getPalavrasCountByLength = (length: number): number => {
  return palavrasPorTamanho.get(length)?.size || 0;
};
