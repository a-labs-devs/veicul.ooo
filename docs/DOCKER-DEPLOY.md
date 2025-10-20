# 🚀 Deploy com Docker + SSL (Certbot)

## 📋 Pré-requisitos

1. **Docker instalado** ✅
2. **Domínio configurado**: `veicul.ooo` apontando para seu IP público
3. **Portas abertas no roteador**:
   - `80 → IP_LOCAL_DO_SERVIDOR:80`
   - `443 → IP_LOCAL_DO_SERVIDOR:443`

---

## ⚙️ Configuração Inicial

### 1. Edite o `docker-compose.yml`

Abra o arquivo e **substitua** `SEU_EMAIL@EXEMPLO.COM` pelo seu email real:

```yaml
command: certonly --webroot --webroot-path=/var/www/html --email SEU_EMAIL@EXEMPLO.COM ...
```

---

## 🚀 Primeira Execução (Obter Certificado SSL)

### 1. Primeiro, suba apenas com HTTP (sem SSL):

```powershell
# Use o nginx.conf básico primeiro
docker-compose up -d --build
```

### 2. Obtenha o certificado SSL:

```powershell
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/html --email SEU_EMAIL@AQUI.COM --agree-tos --no-eff-email -d veicul.ooo -d www.veicul.ooo
```

### 3. Pare e reconfigure para usar HTTPS:

```powershell
docker-compose down
```

Edite `docker-compose.yml` e **descomente** a linha do `nginx-ssl.conf`

### 4. Suba novamente com HTTPS:

```powershell
docker-compose up -d --build
```

---

## 🔄 Uso Diário

### Iniciar:
```powershell
docker-compose up -d
```

### Ver logs:
```powershell
docker-compose logs -f veiculooo
```

### Parar:
```powershell
docker-compose down
```

### Atualizar site (após mudanças no código):
```powershell
git pull
docker-compose up -d --build
```

---

## 🔒 Renovação SSL

Certificados Let's Encrypt **expiram em 90 dias**.

### Renovar manualmente:
```powershell
.\renew-ssl.bat
```

### Renovar automaticamente (Windows Task Scheduler):

1. Abra "Agendador de Tarefas"
2. Criar Tarefa Básica
3. Nome: "Renovar SSL Veicul.ooo"
4. Gatilho: **Mensal** (dia 1)
5. Ação: **Iniciar programa**
   - Programa: `C:\Users\rrodr\Documents\GitHub\veicul.ooo\renew-ssl.bat`
6. Salvar

---

## ✅ Verificar se está funcionando

1. Acesse: `https://veicul.ooo`
2. Verifique o cadeado 🔒 no navegador
3. Teste SSL: https://www.ssllabs.com/ssltest/

---

## 🐛 Troubleshooting

### Erro: "Connection refused"
- Verifique portas abertas no roteador
- Confirme que domínio aponta para IP correto: `nslookup veicul.ooo`

### Erro: "Certificate not found"
- Certifique-se que executou o passo 2 (certbot) antes de usar nginx-ssl.conf

### Site sem HTTPS
- Verifique se porta 443 está aberta
- Confirme que `nginx-ssl.conf` está sendo usado

---

## 📞 Comandos Úteis

```powershell
# Ver status dos containers
docker ps

# Ver logs do Nginx
docker logs veiculooo

# Ver logs do Certbot
docker logs certbot

# Reiniciar apenas o Nginx
docker-compose restart veiculooo

# Rebuild completo
docker-compose down
docker-compose up -d --build --force-recreate
```
