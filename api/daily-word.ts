import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ConversationHistory {
  messages: ChatMessage[];
  usedWords: string[];
}

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

let serverCache: {
  word: string;
  date: string;
  history: ConversationHistory;
} | null = null;

const callOpenRouter = async (
  messages: ChatMessage[],
  modelIndex: number = 0
): Promise<string> => {
  if (modelIndex >= FREE_MODELS.length) {
    throw new Error('OPENROUTER_FAILED');
  }

  const model = FREE_MODELS[modelIndex];
  const apiKey = process.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('API Key do OpenRouter não configurada');
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
  const apiKey = process.env.VITE_GROQ_API_KEY;

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

const generateVehicleWord = async (minLength: number = 3, maxLength: number = 8): Promise<string> => {
  const history: ConversationHistory = serverCache?.history || { messages: [], usedWords: [] };
  
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `Você é um especialista em veículos e deve escolher UMA palavra em português relacionado a carros, veículos, peças, marcas ou conceitos automotivos.

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

  try {
    const word = await callOpenRouter(messages);
    
    const cleanWord = word
      .replace(/[^a-záàâãéêíóôõúçA-ZÁÀÂÃÉÊÍÓÔÕÚÇ]/g, '')
      .toUpperCase()
      .trim();

    if (cleanWord.length < minLength || cleanWord.length > maxLength) {
      return generateVehicleWord(minLength, maxLength);
    }

    history.messages.push({ role: 'user', content: userMessage.content });
    history.messages.push({ role: 'assistant', content: cleanWord });
    if (!history.usedWords.includes(cleanWord)) {
      history.usedWords.push(cleanWord);
    }

    if (serverCache) {
      serverCache.history = history;
    }

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

        history.messages.push({ role: 'user', content: userMessage.content });
        history.messages.push({ role: 'assistant', content: cleanWord });
        if (!history.usedWords.includes(cleanWord)) {
          history.usedWords.push(cleanWord);
        }

        if (serverCache) {
          serverCache.history = history;
        }

        return cleanWord;
      } catch (groqError) {
        throw groqError;
      }
    }
    throw error;
  }
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    
    if (serverCache && serverCache.date === today) {
      return res.status(200).json({
        word: serverCache.word,
        date: serverCache.date,
        cached: true,
      });
    }

    const oldHistory = serverCache?.history || { messages: [], usedWords: [] };
    serverCache = null;
    
    const word = await generateVehicleWord(5, 7);
    
    serverCache = {
      word,
      date: today,
      history: oldHistory,
    };

    return res.status(200).json({
      word,
      date: today,
      cached: false,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Falha ao gerar palavra',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}
