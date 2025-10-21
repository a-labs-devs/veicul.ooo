/**
 * ========================================
 * 🐛 VEICULOOO DEBUG UTILITIES
 * ========================================
 * 
 * Este arquivo contém funções de debug e comandos úteis para o console.
 * APENAS ESTE ARQUIVO DEVE TER console.logs - NÃO coloque em produção!
 * 
 * COMANDOS DISPONÍVEIS NO CONSOLE DO NAVEGADOR:
 * 
 * ```javascript
 * // Ver palavra do dia atual
 * debug.logDailyWord();
 * 
 * // Resetar palavra do dia (gera nova)
 * debug.resetDailyWord();
 * 
 * // Ver palavras já usadas pela IA
 * debug.logUsedWords();
 * 
 * // Resetar histórico da IA (limpa palavras usadas)
 * debug.resetAIHistory();
 * 
 * // Ver histórico completo da IA
 * debug.logAIHistory();
 * 
 * // Testar geração de palavra
 * await debug.testGenerateWord(5, 7);
 * 
 * // Ver estatísticas do dicionário
 * debug.logDictionaryStats();
 * 
 * // Testar validação de palavra
 * await debug.testWordValidation('FUSCA');
 * 
 * // Limpar todos os caches
 * debug.clearAllCaches();
 * ```
 */

import { generateVehicleWord, resetAIHistory as resetAI, getUsedWords } from '../services/openrouter';
import { getPalavrasCount, getPalavrasCountByLength } from '../services/validator';
import { isValidWord } from '../data/words';

const AI_HISTORY_KEY = 'veiculooo_ai_history';
const DAILY_WORD_KEY = 'veiculooo_daily_word';

// ========================================
// DAILY WORD
// ========================================

export const logDailyWord = (): void => {
  console.group('📅 PALAVRA DO DIA');
  
  const cached = localStorage.getItem(DAILY_WORD_KEY);
  if (cached) {
    const data = JSON.parse(cached);
    console.log('Palavra:', data.word);
    console.log('Data:', data.date);
    console.log('Tamanho:', data.word.length, 'letras');
  } else {
    console.log('❌ Nenhuma palavra do dia no cache');
  }
  
  console.groupEnd();
};

export const resetDailyWord = (): void => {
  console.group('🔄 RESETAR PALAVRA DO DIA');
  localStorage.removeItem(DAILY_WORD_KEY);
  console.log('✅ Palavra do dia removida do cache');
  console.log('🔄 Recarregue a página para gerar nova palavra');
  console.groupEnd();
};

// ========================================
// IA / OpenRouter
// ========================================

export const logUsedWords = (): void => {
  console.group('📚 PALAVRAS JÁ USADAS PELA IA');
  
  const words = getUsedWords();
  
  if (words.length === 0) {
    console.log('❌ Nenhuma palavra usada ainda');
  } else {
    console.log(`Total: ${words.length} palavras`);
    console.table(words.map((w, i) => ({ index: i + 1, word: w, length: w.length })));
  }
  
  console.groupEnd();
};

export const resetAIHistory = (): void => {
  console.group('🔄 RESETAR HISTÓRICO DA IA');
  resetAI();
  console.log('✅ Histórico da IA resetado');
  console.log('ℹ️  A IA poderá repetir palavras anteriores');
  console.groupEnd();
};

export const logAIHistory = (): void => {
  console.group('💬 HISTÓRICO COMPLETO DA IA');
  
  const stored = localStorage.getItem(AI_HISTORY_KEY);
  
  if (!stored) {
    console.log('❌ Nenhum histórico encontrado');
  } else {
    const history = JSON.parse(stored);
    console.log('Mensagens:', history.messages.length);
    console.log('Palavras usadas:', history.usedWords.length);
    console.log('\n--- Conversação ---');
    history.messages.forEach((msg: any, i: number) => {
      console.log(`${i + 1}. [${msg.role}]: ${msg.content.substring(0, 100)}...`);
    });
    console.log('\n--- Palavras Usadas ---');
    console.log(history.usedWords.join(', '));
  }
  
  console.groupEnd();
};

export const testGenerateWord = async (minLength: number = 3, maxLength: number = 10): Promise<void> => {
  console.group(`🎲 TESTAR GERAÇÃO DE PALAVRA (${minLength}-${maxLength} letras)`);
  console.time('⏱️ Tempo de geração');
  
  try {
    const word = await generateVehicleWord(minLength, maxLength);
    console.timeEnd('⏱️ Tempo de geração');
    console.log('✅ Palavra gerada:', word);
    console.log('📏 Tamanho:', word.length, 'letras');
    console.log('🔤 Caracteres válidos:', /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]+$/.test(word) ? 'Sim' : 'Não');
  } catch (error) {
    console.timeEnd('⏱️ Tempo de geração');
    console.error('❌ Erro ao gerar palavra:', error);
  }
  
  console.groupEnd();
};

// ========================================
// DICIONÁRIO / VALIDAÇÃO
// ========================================

export const logDictionaryStats = (): void => {
  console.group('📊 ESTATÍSTICAS DO DICIONÁRIO');
  
  const total = getPalavrasCount();
  console.log(`Total de palavras: ${total.toLocaleString()}`);
  
  console.log('\nPalavras por tamanho:');
  for (let i = 3; i <= 10; i++) {
    const count = getPalavrasCountByLength(i);
    if (count > 0) {
      const bar = '█'.repeat(Math.floor(count / 1000));
      console.log(`  ${i} letras: ${count.toLocaleString().padStart(8)} ${bar}`);
    }
  }
  
  console.groupEnd();
};

export const testWordValidation = async (word: string): Promise<void> => {
  console.group(`🔍 VALIDAR PALAVRA: "${word}"`);
  console.time('⏱️ Tempo de validação');
  
  const isValid = await isValidWord(word, word.length);
  
  console.timeEnd('⏱️ Tempo de validação');
  console.log(isValid ? '✅ Palavra VÁLIDA' : '❌ Palavra INVÁLIDA');
  console.log('📏 Tamanho:', word.length, 'letras');
  
  console.groupEnd();
};

// ========================================
// CACHE / STORAGE
// ========================================

export const clearAllCaches = (): void => {
  console.group('🗑️ LIMPAR TODOS OS CACHES');
  
  localStorage.removeItem(DAILY_WORD_KEY);
  console.log('✅ Palavra do dia removida');
  
  localStorage.removeItem(AI_HISTORY_KEY);
  console.log('✅ Histórico da IA removido');
  
  const gameKeys = Object.keys(localStorage).filter(k => k.startsWith('game_'));
  gameKeys.forEach(k => localStorage.removeItem(k));
  console.log(`✅ ${gameKeys.length} estados de jogo removidos`);
  
  console.log('\n🔄 Recarregue a página para aplicar as mudanças');
  console.groupEnd();
};

export const logAllStorage = (): void => {
  console.group('💾 TODO O LOCALSTORAGE');
  
  console.log(`Total de itens: ${localStorage.length}`);
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      const size = new Blob([value || '']).size;
      console.log(`\n📦 ${key}`);
      console.log(`   Tamanho: ${size} bytes`);
      console.log(`   Preview: ${value?.substring(0, 100)}...`);
    }
  }
  
  console.groupEnd();
};

// ========================================
// GAME STATE
// ========================================

export const logGameState = (target: string): void => {
  console.group(`🎮 ESTADO DO JOGO: "${target}"`);
  
  const gameKey = `game_${target}`;
  const stored = localStorage.getItem(gameKey);
  
  if (!stored) {
    console.log('❌ Nenhum estado de jogo encontrado');
  } else {
    const state = JSON.parse(stored);
    console.log('Palavra alvo:', state.solution);
    console.log('Tentativas:', state.tries.length);
    console.log('Status:', state.gameOver ? (state.won ? 'GANHOU' : 'PERDEU') : 'JOGANDO');
    console.log('Palavras inválidas tentadas:', state.invalids.length);
    
    if (state.tries.length > 0) {
      console.log('\nTentativas:');
      state.tries.forEach((try_: string[], i: number) => {
        console.log(`  ${i + 1}. ${try_.join('')}`);
      });
    }
  }
  
  console.groupEnd();
};

// ========================================
// INFO
// ========================================

export const showHelp = (): void => {
  console.log(`
%c========================================
🐛 VEICULOOO DEBUG UTILITIES
========================================

COMANDOS DISPONÍVEIS:

📅 Palavra do Dia:
  debug.logDailyWord()         - Ver palavra atual
  debug.resetDailyWord()       - Resetar e gerar nova

🤖 IA / OpenRouter:
  debug.logUsedWords()         - Ver palavras já usadas
  debug.resetAIHistory()       - Limpar histórico
  debug.logAIHistory()         - Ver histórico completo
  debug.testGenerateWord()     - Testar geração

📚 Dicionário:
  debug.logDictionaryStats()   - Estatísticas
  debug.testWordValidation('FUSCA') - Validar palavra

💾 Cache / Storage:
  debug.clearAllCaches()       - Limpar tudo
  debug.logAllStorage()        - Ver tudo no localStorage
  debug.logGameState('FUSCA')  - Ver estado do jogo

ℹ️ Ajuda:
  debug.showHelp()             - Mostrar esta ajuda

========================================
  `, 'color: #4CAF50; font-weight: bold;');
};

// Exporta tudo como objeto window.debug
if (typeof window !== 'undefined') {
  (window as any).debug = {
    logDailyWord,
    resetDailyWord,
    logUsedWords,
    resetAIHistory,
    logAIHistory,
    testGenerateWord,
    logDictionaryStats,
    testWordValidation,
    clearAllCaches,
    logAllStorage,
    logGameState,
    showHelp,
  };
  
  // Mostra ajuda automaticamente
  showHelp();
}
