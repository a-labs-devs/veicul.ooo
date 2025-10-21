# VEÍCUL.OOO 🚗

Jogo de palavras sobre carros inspirado no **Termo** (versão brasileira do Wordle).

## 🎮 Como Jogar

- Descubra a palavra relacionada a carros em **6 tentativas**
- Após cada tentativa, as cores indicam o quão perto você está:
  - 🟩 **Verde**: Letra correta na posição certa
  - 🟨 **Amarelo**: Letra existe mas está em outra posição
  - ⬜ **Cinza**: Letra não existe na palavra

## 🚀 Tecnologias

- React 19
- TypeScript
- Vite
- CSS Modules
- Vercel Functions (Serverless API)
- OpenRouter API (38 modelos de IA gratuitos)
- Groq API (10 modelos de IA)

## 🤖 Inteligência Artificial

A palavra do dia é gerada por **IA** usando 48 modelos diferentes:
- **38 modelos do OpenRouter** (primeira tentativa)
- **10 modelos do Groq** (fallback)
- Geração no servidor para garantir que todos os jogadores tenham a mesma palavra
- Renovação automática diariamente às 00:00
- Sistema de histórico para evitar repetição de palavras

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves de API

# Rodar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview da build
pnpm preview
```

### 🔑 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
VITE_OPENROUTER_API_KEY=sua-chave-aqui
VITE_GROQ_API_KEY=sua-chave-aqui
```

- OpenRouter: https://openrouter.ai/keys
- Groq: https://console.groq.com/keys

## 🚀 Deploy

Veja [DEPLOY.md](./DEPLOY.md) para instruções completas de deploy no Vercel.

## 📝 Palavras

A palavra do dia é gerada por IA e validada contra um dicionário de ~320.000 palavras em português.

Palavras relacionadas a:
- Modelos de carros
- Marcas automotivas
- Peças e componentes
- Termos automotivos

## 📊 Estatísticas

As estatísticas do jogador são salvas no localStorage do navegador.

---

Desenvolvido com ❤️ para amantes de carros e palavras!
