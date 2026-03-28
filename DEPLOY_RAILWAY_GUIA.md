# 🚀 GUIA COMPLETO: Deploy Evolution API no Railway

## 📋 Visão Geral

Este guia te leva do zero até ter a Evolution API funcionando com:
- ✅ Painel web para escanear QR Code
- ✅ API funcionando na nuvem
- ✅ WhatsApp conectado e pronto para uso

---

## 🎯 PASSO 1: Criar Conta no Railway

1. Acesse: **https://railway.app**
2. Clique em **"Login"** ou **"Start a New Project"**
3. Faça login com sua conta **GitHub** (recomendado)
4. Confirme seu email se necessário

> 💡 **Dica:** Railway oferece $5 de crédito gratuito por mês, suficiente para testes.

---

## 🎯 PASSO 2: Criar Novo Projeto

1. No dashboard do Railway, clique em **"New Project"**
2. Selecione **"Empty Project"** (projeto vazio)
3. O projeto será criado - você verá uma tela em branco

---

## 🎯 PASSO 3: Adicionar PostgreSQL (Banco de Dados)

A Evolution API precisa de um banco de dados PostgreSQL.

1. Dentro do projeto, clique em **"+ New"** (botão roxo)
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. Aguarde a criação (30 segundos)

### Copiar Credenciais do Banco:
1. Clique no serviço **PostgreSQL** criado
2. Vá na aba **"Variables"**
3. Copie e guarde o valor de **`DATABASE_URL`** (vai precisar depois)
   - Exemplo: `postgresql://postgres:SENHA@HOST:5432/railway`

---

## 🎯 PASSO 4: Adicionar Redis (Cache)

1. Clique em **"+ New"** novamente
2. Selecione **"Database"**
3. Escolha **"Add Redis"**
4. Aguarde a criação

### Copiar Credenciais do Redis:
1. Clique no serviço **Redis** criado
2. Vá na aba **"Variables"**
3. Copie e guarde o valor de **`REDIS_URL`**
   - Exemplo: `redis://default:SENHA@HOST:6379`

---

## 🎯 PASSO 5: Adicionar Evolution API

1. Clique em **"+ New"**
2. Selecione **"Docker Image"**
3. Digite a imagem: **`atendai/evolution-api:v2.2.3`**
4. Pressione Enter para confirmar
5. Aguarde o download e deploy inicial

---

## 🎯 PASSO 6: Configurar Variáveis de Ambiente

Esta é a parte mais importante! Configure todas as variáveis corretamente.

1. Clique no serviço da **Evolution API**
2. Vá na aba **"Variables"**
3. Clique em **"Raw Editor"** (canto superior direito)
4. Cole TODAS as variáveis abaixo (substituindo os valores marcados):

```env
# ═══════════════════════════════════════════════════════════
# SERVIDOR
# ═══════════════════════════════════════════════════════════
SERVER_TYPE=http
SERVER_PORT=8080
SERVER_URL=https://SEU-PROJETO.up.railway.app

# ═══════════════════════════════════════════════════════════
# AUTENTICAÇÃO (MUITO IMPORTANTE!)
# ═══════════════════════════════════════════════════════════
# Gere uma chave segura (pode usar: https://www.uuidgenerator.net/)
AUTHENTICATION_TYPE=apikey
AUTHENTICATION_API_KEY=SUA-CHAVE-API-SEGURA-AQUI
AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true

# ═══════════════════════════════════════════════════════════
# BANCO DE DADOS (Cole a URL do PostgreSQL do Passo 3)
# ═══════════════════════════════════════════════════════════
DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=COLE_A_DATABASE_URL_DO_POSTGRESQL_AQUI
DATABASE_CONNECTION_CLIENT_NAME=evolution_api
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_MESSAGE_UPDATE=true
DATABASE_SAVE_DATA_CONTACTS=true
DATABASE_SAVE_DATA_CHATS=true
DATABASE_SAVE_DATA_LABELS=true
DATABASE_SAVE_DATA_HISTORIC=true

# ═══════════════════════════════════════════════════════════
# CACHE REDIS (Cole a URL do Redis do Passo 4)
# ═══════════════════════════════════════════════════════════
CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=COLE_A_REDIS_URL_AQUI
CACHE_REDIS_PREFIX_KEY=evolution
CACHE_REDIS_SAVE_INSTANCES=false
CACHE_LOCAL_ENABLED=false

# ═══════════════════════════════════════════════════════════
# CONFIGURAÇÕES GERAIS
# ═══════════════════════════════════════════════════════════
DEL_INSTANCE=false
LOG_LEVEL=ERROR,WARN,DEBUG,INFO,LOG
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE
CORS_CREDENTIALS=true
LANGUAGE=pt-BR

# ═══════════════════════════════════════════════════════════
# QR CODE
# ═══════════════════════════════════════════════════════════
QRCODE_LIMIT=30
QRCODE_COLOR=#175197

# ═══════════════════════════════════════════════════════════
# CONFIGURAÇÕES DE SESSÃO
# ═══════════════════════════════════════════════════════════
CONFIG_SESSION_PHONE_CLIENT=Evolution API
CONFIG_SESSION_PHONE_NAME=Chrome

# ═══════════════════════════════════════════════════════════
# INTEGRAÇÕES (Desabilitadas por padrão)
# ═══════════════════════════════════════════════════════════
TYPEBOT_ENABLED=false
CHATWOOT_ENABLED=false
OPENAI_ENABLED=false
DIFY_ENABLED=false
RABBITMQ_ENABLED=false
WEBSOCKET_ENABLED=false
S3_ENABLED=false
```

5. Clique em **"Save"** ou **"Update Variables"**
6. O serviço vai reiniciar automaticamente

---

## 🎯 PASSO 7: Configurar Domínio Público

1. Ainda no serviço Evolution API, vá na aba **"Settings"**
2. Role até **"Networking"** ou **"Domains"**
3. Clique em **"Generate Domain"**
4. Anote a URL gerada (exemplo: `evolution-api-production.up.railway.app`)

### IMPORTANTE: Atualizar SERVER_URL

1. Volte nas **Variables**
2. Atualize `SERVER_URL` com a URL gerada:
   ```
   SERVER_URL=https://evolution-api-production.up.railway.app
   ```
3. Salve as variáveis

---

## 🎯 PASSO 8: Verificar se Está Funcionando

1. Acesse a URL do seu projeto no navegador:
   ```
   https://SEU-PROJETO.up.railway.app
   ```

2. Você deve ver uma resposta JSON como:
   ```json
   {
     "status": 200,
     "message": "Welcome to Evolution API, it is working!",
     "version": "2.2.3",
     "documentation": "https://doc.evolution-api.com"
   }
   ```

---

## 🎯 PASSO 9: Acessar o Painel Manager (QR Code)

A Evolution API v2 já vem com o **Evolution Manager** integrado!

1. Acesse:
   ```
   https://SEU-PROJETO.up.railway.app/manager
   ```

2. Faça login com sua **API Key** configurada no `AUTHENTICATION_API_KEY`

3. Você verá o painel para gerenciar instâncias

---

## 🎯 PASSO 10: Criar Primeira Instância

No painel Manager:

1. Clique em **"Create Instance"** ou **"Nova Instância"**

2. Preencha:
   - **Instance Name:** `minha-instancia` (sem espaços ou caracteres especiais)
   - **Token:** deixe em branco (vai gerar automaticamente)
   - **Webhook URL:** deixe em branco por enquanto

3. Clique em **"Create"** / **"Criar"**

4. O **QR Code** será exibido!

---

## 🎯 PASSO 11: Conectar seu WhatsApp

1. Abra o **WhatsApp** no seu celular

2. Vá em:
   - **Android:** Menu (⋮) → Aparelhos conectados → Conectar aparelho
   - **iPhone:** Configurações → Aparelhos conectados → Conectar aparelho

3. Escaneie o **QR Code** exibido no Manager

4. Aguarde a conexão (alguns segundos)

5. Status mudará para **"Connected"** ✅

---

## 🎯 PASSO 12: Testar Envio de Mensagem

Agora você pode testar via API! Use o Postman, Insomnia, ou curl:

### Exemplo com curl:

```bash
curl -X POST "https://SEU-PROJETO.up.railway.app/message/sendText/minha-instancia" \
  -H "Content-Type: application/json" \
  -H "apikey: SUA-API-KEY" \
  -d '{
    "number": "5541999999999",
    "text": "Olá! Teste da Evolution API 🚀"
  }'
```

### Endpoints Importantes:

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/instance/connectionState/{instance}` | GET | Verificar status da conexão |
| `/message/sendText/{instance}` | POST | Enviar texto |
| `/message/sendMedia/{instance}` | POST | Enviar imagem/documento |
| `/message/sendButtons/{instance}` | POST | Enviar com botões |
| `/instance/qrcode/{instance}` | GET | Obter QR Code (base64) |

---

## 📝 RESUMO DAS CREDENCIAIS

Guarde essas informações:

| Item | Valor |
|------|-------|
| **URL da API** | https://SEU-PROJETO.up.railway.app |
| **URL do Manager** | https://SEU-PROJETO.up.railway.app/manager |
| **API Key** | (a que você configurou em AUTHENTICATION_API_KEY) |
| **Nome da Instância** | minha-instancia |

---

## ⚠️ TROUBLESHOOTING

### ❌ Erro 401 - Unauthorized
- Verifique se está passando o header `apikey` corretamente
- Confira se a API Key está correta

### ❌ QR Code não aparece
- Verifique os logs no Railway (aba "Logs") — procure por erros de conexão com banco ou Redis
- Certifique-se que PostgreSQL e Redis estão rodando (status "Active")
- Confirme que `SERVER_URL` tem a URL REAL do Railway (não o placeholder)
- Confirme que `AUTHENTICATION_TYPE=apikey` está nas variáveis
- Confirme que `DATABASE_CONNECTION_URI` e `CACHE_REDIS_URI` têm os valores reais
- Tente deletar a instância e criar uma nova no Manager
- Se nada funcionar, faça Redeploy completo: Settings → Redeploy

### ❌ Erro de conexão com banco
- Verifique se `DATABASE_CONNECTION_URI` está correta
- O formato deve ser: `postgresql://usuario:senha@host:porta/banco`

### ❌ Instância desconecta sozinha
- Configure `DEL_INSTANCE=false`
- Verifique se Redis está funcionando

### ❌ Erro 500
- Veja os logs detalhados no Railway
- Verifique se todas as variáveis obrigatórias estão configuradas

---

## 💰 Custos no Railway

| Recurso | Custo Estimado |
|---------|----------------|
| Evolution API | ~$5-10/mês |
| PostgreSQL | ~$5/mês |
| Redis | ~$5/mês |
| **Total** | **~$15-20/mês** |

> O plano gratuito oferece $5/mês, suficiente para testes limitados.

---

## 🔗 Links Úteis

- **Documentação Evolution API:** https://doc.evolution-api.com
- **GitHub Evolution API:** https://github.com/EvolutionAPI/evolution-api
- **Postman Collection:** https://evolution-api.com/postman
- **Comunidade WhatsApp:** https://evolution-api.com/whatsapp
- **Discord:** https://evolution-api.com/discord

---

## ✅ Próximos Passos

Após o deploy, você pode:

1. **Usar a biblioteca cliente** que criamos (evolution-whatsapp)
2. **Configurar webhooks** para receber mensagens
3. **Integrar com Typebot/Chatwoot** se necessário
4. **Criar múltiplas instâncias** para diferentes números

---

**Pronto! Sua Evolution API está no ar! 🎉**
