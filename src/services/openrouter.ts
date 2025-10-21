const FREE_MODELS = [
  'deepseek/deepseek-chat-v3.1:free',
  'deepseek/deepseek-r1-0528:free',
  'deepseek/deepseek-r1-0528-qwen3-8b:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'mistralai/devstral-small-2505:free',
  'mistralai/mistral-7b-instruct:free',
  'mistralai/mixtral-8x7b-instruct:free',
  'meta-llama/llama-3.3-8b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'meta-llama/llama-3.2-1b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'meta-llama/llama-3-8b-instruct:free',
  'google/gemma-3n-e4b-it:free',
  'google/gemma-3n-e2b-it:free',
  'google/gemma-2-9b-it:free',
  'google/gemini-flash-1.5:free',
  'google/gemini-flash-1.5-8b:free',
  'qwen/qwen3-coder:free',
  'qwen/qwen3-4b:free',
  'qwen/qwen-2.5-7b-instruct:free',
  'qwen/qwen-2-7b-instruct:free',
  'moonshotai/kimi-k2:free',
  'moonshotai/kimi-dev-72b:free',
  'tencent/hunyuan-a13b-instruct:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'meituan/longcat-flash-chat:free',
  'alibaba/tongyi-deepresearch-30b-a3b:free',
  'z-ai/glm-4.5-air:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  'tngtech/deepseek-r1t2-chimera:free',
  'openai/gpt-oss-20b:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'microsoft/phi-3-medium-128k-instruct:free',
  'huggingfaceh4/zephyr-7b-beta:free',
  'openchat/openchat-7b:free',
  'gryphe/mythomist-7b:free',
  'undi95/toppy-m-7b:free',
  'nousresearch/nous-capybara-7b:free',
];

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'moonshotai/kimi-k2-instruct',
  'moonshotai/kimi-k2-instruct-0905',
  'qwen/qwen3-32b',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'meta-llama/llama-4-maverick-17b-128e-instruct',
  'llama-3.1-8b-instant',
  'allam-2-7b',
];

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ConversationHistory {
  messages: ChatMessage[];
  usedWords: string[];
}

const STORAGE_KEY = 'veiculooo_ai_history';

const loadHistory = (): ConversationHistory => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
  }
  
  return {
    messages: [],
    usedWords: [],
  };
};

const saveHistory = (history: ConversationHistory): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
  }
};

const addWordToHistory = (word: string): void => {
  const history = loadHistory();
  if (!history.usedWords.includes(word.toUpperCase())) {
    history.usedWords.push(word.toUpperCase());
    saveHistory(history);
  }
};

const addMessageToHistory = (role: 'user' | 'assistant', content: string): void => {
  const history = loadHistory();
  history.messages.push({ role, content });
  
  if (history.messages.length > 50) {
    history.messages = history.messages.slice(-50);
  }
  
  saveHistory(history);
};

const callOpenRouter = async (
  messages: ChatMessage[],
  modelIndex: number = 0
): Promise<string> => {
  if (modelIndex >= FREE_MODELS.length) {
    throw new Error('OPENROUTER_FAILED');
  }

  const model = FREE_MODELS[modelIndex];
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('API Key do OpenRouter não configurada');
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Veiculooo',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      return callOpenRouter(messages, modelIndex + 1);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return callOpenRouter(messages, modelIndex + 1);
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    return callOpenRouter(messages, modelIndex + 1);
  }
};

const callGroq = async (
  messages: ChatMessage[],
  modelIndex: number = 0
): Promise<string> => {
  if (modelIndex >= GROQ_MODELS.length) {
    throw new Error('Todos os modelos falharam. Tente novamente mais tarde.');
  }

  const model = GROQ_MODELS[modelIndex];
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('API Key do Groq não configurada');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      return callGroq(messages, modelIndex + 1);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return callGroq(messages, modelIndex + 1);
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    return callGroq(messages, modelIndex + 1);
  }
};

export const generateVehicleWord = async (minLength: number = 3, maxLength: number = 8): Promise<string> => {
  const history = loadHistory();
  
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `Você é um especialista em veículos e deve escolher UMA palavra em português relacionada a carros, veículos, peças, marcas ou conceitos automotivos.

REGRAS OBRIGATÓRIAS:
- A palavra deve ter entre ${minLength} e ${maxLength} letras
- Apenas letras (SEM números, SEM traços, SEM espaços)
- Uma palavra válida em português
- Relacionada a veículos/carros/automoveis
- Responda APENAS com a palavra, nada mais

${history.usedWords.length > 0 ? `\nPalavras já usadas (NÃO use novamente): ${history.usedWords.join(', ')}` : ''}`,
  };

  const userMessage: ChatMessage = {
    role: 'user',
    content: `Escolha uma palavra de veículo com ${minLength} a ${maxLength} letras. Responda apenas a palavra.`,
  };

  const messages: ChatMessage[] = [systemMessage];
  
  if (history.messages.length > 0) {
    messages.push(...history.messages.slice(-10));
  }
  
  messages.push(userMessage);

  addMessageToHistory('user', userMessage.content);

  try {
    const word = await callOpenRouter(messages);
    
    const cleanWord = word
      .replace(/[^a-záàâãéêíóôõúçA-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/g, '')
      .toUpperCase()
      .trim();

    if (cleanWord.length < minLength || cleanWord.length > maxLength) {
      return generateVehicleWord(minLength, maxLength);
    }

    addMessageToHistory('assistant', cleanWord);
    addWordToHistory(cleanWord);

    return cleanWord;
  } catch (error) {
    if (error instanceof Error && error.message === 'OPENROUTER_FAILED') {
      try {
        const word = await callGroq(messages);
        
        const cleanWord = word
          .replace(/[^a-záàâãéêíóôõúçA-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/g, '')
          .toUpperCase()
          .trim();

        if (cleanWord.length < minLength || cleanWord.length > maxLength) {
          return generateVehicleWord(minLength, maxLength);
        }

        addMessageToHistory('assistant', cleanWord);
        addWordToHistory(cleanWord);

        return cleanWord;
      } catch (groqError) {
        throw groqError;
      }
    }
    throw error;
  }
};

export const resetAIHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getUsedWords = (): string[] => {
  const history = loadHistory();
  return history.usedWords;
};
