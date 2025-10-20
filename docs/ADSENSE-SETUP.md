# 🎯 Como Configurar Google AdSense no VEÍCUL.OOO

## 📋 Pré-requisitos

1. Site deve estar no ar com domínio próprio (veicul.ooo)
2. Ter conteúdo original e de qualidade
3. Ter tráfego (usuários visitando)
4. Ter política de privacidade

---

## ✅ Passo 1: Criar Conta no Google AdSense

1. Acesse: https://www.google.com/adsense/start/
2. Clique em "Começar"
3. Faça login com sua conta Google
4. Preencha as informações:
   - URL do site: `https://veicul.ooo`
   - País: Brasil
   - Aceite os termos

---

## ✅ Passo 2: Adicionar o Código de Verificação

O Google vai te dar um código como este:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossorigin="anonymous"></script>
```

### Onde adicionar:

**Arquivo: `index.html`**

Adicione no `<head>`, logo após o `<title>`:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VEÍCULO - Jogo de Palavras sobre Carros</title>
  
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-SEU_ID_AQUI"
       crossorigin="anonymous"></script>
  
</head>
```

---

## ✅ Passo 3: Fazer Deploy e Aguardar Aprovação

1. Commit as mudanças
2. Faça push para o GitHub
3. O site será atualizado automaticamente
4. Volte ao painel do AdSense e clique em "Já coloquei o código"
5. **Aguarde aprovação** (pode levar de 1 dia a 2 semanas)

---

## ✅ Passo 4: Criar Unidade de Anúncio (Após Aprovação)

1. No painel do AdSense, vá em **"Anúncios" → "Por unidade"**
2. Clique em **"Criar nova unidade de anúncio"**
3. Escolha **"Anúncio display"**
4. Configure:
   - **Nome**: "Banner Footer VEICUL.OOO"
   - **Tipo**: Horizontal
   - **Tamanho**: Responsivo
5. Clique em **"Criar"**
6. O Google vai te dar um código como este:

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210"
     data-ad-format="horizontal"></ins>
```

**ANOTE ESSES VALORES:**
- `data-ad-client`: **ca-pub-1234567890123456** ← Seu Client ID
- `data-ad-slot`: **9876543210** ← Seu Slot ID

---

## ✅ Passo 5: Adicionar no Código do Site

**Arquivo: `src/components/Game/Game.tsx`**

Localize esta parte:

```tsx
<AdBanner 
  // Quando você tiver o Google AdSense aprovado, adicione aqui:
  // adClient="ca-pub-SEU_ID_AQUI"
  // adSlot="SEU_SLOT_AQUI"
/>
```

**Substitua por:**

```tsx
<AdBanner 
  adClient="ca-pub-1234567890123456"
  adSlot="9876543210"
  adFormat="auto"
  responsive={true}
/>
```

---

## ✅ Passo 6: Deploy Final

1. Salve o arquivo
2. Commit: `git add . && git commit -m "Configurar Google AdSense"`
3. Push: `git push`
4. Aguarde o deploy automático
5. Teste no site: `https://veicul.ooo`

---

## 📊 Monitoramento

- Acesse o painel do AdSense regularmente
- Veja relatórios de ganhos
- Monitore CPM (custo por mil impressões)
- Acompanhe CTR (taxa de cliques)

---

## ⚠️ IMPORTANTE: Política de Privacidade

O Google AdSense **EXIGE** uma página de Política de Privacidade.

**Você precisa criar uma página explicando:**
- Que usa cookies
- Que usa Google AdSense
- Que coleta dados de navegação
- Como os usuários podem desativar anúncios personalizados

Ferramentas para gerar automaticamente:
- https://www.privacypolicygenerator.info/
- https://www.termsfeed.com/privacy-policy-generator/

Depois adicione um link no rodapé ou header do site.

---

## 🚨 Motivos Comuns de Reprovação

1. **Conteúdo insuficiente**: Adicione mais páginas (Sobre, Contato, etc)
2. **Falta de política de privacidade**
3. **Site não carrega corretamente**
4. **Conteúdo duplicado** (copiado de outros sites)
5. **Muito pouco tráfego** (espere ter alguns usuários)

---

## 💰 Expectativas Realistas

- **Primeiros meses**: Poucos centavos por dia
- **Precisa de 100 USD** para receber pagamento
- **CPM no Brasil**: $0.20 - $2.00 (por 1000 visualizações)
- **Depende muito do tráfego e engajamento**

---

## 🎯 Dicas para Maximizar Ganhos

1. **Posição importa**: Banner no footer tem menor taxa de clique que no topo
2. **Não clique nos próprios anúncios** (você será banido!)
3. **Não peça para amigos clicarem** (o Google detecta)
4. **Foque em aumentar tráfego orgânico**
5. **SEO**: Otimize para aparecer no Google
6. **Compartilhe nas redes sociais**

---

## 📞 Recursos

- **Central de Ajuda**: https://support.google.com/adsense
- **Políticas do AdSense**: https://support.google.com/adsense/answer/48182
- **Comunidade**: https://support.google.com/adsense/community

---

## ✅ Checklist Final

- [ ] Conta AdSense criada
- [ ] Código de verificação adicionado no `index.html`
- [ ] Site aprovado pelo Google
- [ ] Unidade de anúncio criada
- [ ] Client ID e Slot ID copiados
- [ ] Código atualizado em `Game.tsx`
- [ ] Deploy realizado
- [ ] Política de privacidade publicada
- [ ] Anúncios aparecendo no site

---

**Boa sorte! 🚀💰**
