// Lista de palavras relacionadas a carros (5 letras)
export const WORDS = [
  // Modelos de carros
  'FUSCA', 'CIVIC', 'CORSA', 'PALIO', 'GOLFE', 'CELTA', 'KOMBI',
  'ONIX', 'TUCSON', 'KICKS', 'ARGO', 'MOBI', 'SPIN', 'COBALT',
  'VERSA', 'MARCH', 'LOGAN', 'DUSTER', 'TORO', 'STRADA',
  
  // Marcas (5 letras)
  'VOLVO', 'HONDA', 'LEXUS', 'TESLA', 'SMART', 'DODGE',
  
  // Partes e termos relacionados
  'FREIO', 'PNEUS', 'MOTOR', 'BANCO', 'VIDRO', 'PORTA',
  'FAROL', 'CAPOT', 'TANQUE', 'VOLANTE', 'PEDAL', 'BUZINA',
  'LIXA', 'CHAVE', 'OLEO', 'FILTRO', 'DISCO', 'CINTO',
  'BANCOS', 'PORTAS', 'RODAS', 'RAIOS', 'TRAVA', 'TURBO',
  'TUCHO', 'VELAS', 'BOMBA', 'SONDA', 'VALVULA', 'PISTAO',
  'BIELA', 'JUNTA', 'MOLA', 'EIXO', 'CAMBIO', 'EMBREAGEM',
  'MARCHA', 'ALAVANCA', 'PAINEL', 'RADIO', 'ANTENA', 'FACHO',
  'SETA', 'PISCA', 'LANTERNA', 'GRADE', 'PARALAMA', 'PARA',
  'CHOQUE', 'PLACA', 'CHASSI', 'CARRO', 'AUTO', 'SEDAN',
  'HATCH', 'COUPE', 'WAGON', 'JEEP', 'PICAPE', 'UTILITARIO',
  'PISTA', 'CURVA', 'RETA', 'ESTRADA', 'ASFALTO', 'GARAGEM',
  'VAGA', 'POSTO', 'LAVAGEM', 'OFICINA', 'MECANICA', 'PINTURA',
];

export const getRandomWord = (): string => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};

export const getDailyWord = (): string => {
  const today = new Date();
  const start = new Date('2025-01-01');
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const index = diff % WORDS.length;
  return WORDS[index];
};

export const normalizeLetter = (letter: string): string => {
  return letter
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
};

export const normalizeWord = (word: string): string => {
  return word.split('').map(normalizeLetter).join('');
};

export const isValidWord = (word: string): boolean => {
  const normalized = normalizeWord(word);
  return WORDS.some(w => normalizeWord(w) === normalized);
};
