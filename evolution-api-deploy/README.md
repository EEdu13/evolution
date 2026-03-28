# Evolution API - Deploy Railway

Este repositório contém a configuração para deploy da Evolution API no Railway.

## 🚀 Deploy Rápido

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## 📋 Pré-requisitos no Railway

Antes de fazer deploy, crie estes serviços no seu projeto Railway:

1. **PostgreSQL** - Banco de dados
2. **Redis** - Cache

## ⚙️ Variáveis de Ambiente

Configure estas variáveis no Railway:

```env
# Servidor
SERVER_TYPE=http
SERVER_PORT=8080
SERVER_URL=https://seu-projeto.up.railway.app

# Autenticação (GERE UMA CHAVE SEGURA!)
AUTHENTICATION_API_KEY=sua-chave-api-segura
AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true

# Banco de Dados (use a variável do PostgreSQL do Railway)
DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=${{Postgres.DATABASE_URL}}
DATABASE_CONNECTION_CLIENT_NAME=evolution_api
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_MESSAGE_UPDATE=true
DATABASE_SAVE_DATA_CONTACTS=true
DATABASE_SAVE_DATA_CHATS=true
DATABASE_SAVE_DATA_LABELS=true
DATABASE_SAVE_DATA_HISTORIC=true

# Redis (use a variável do Redis do Railway)
CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=${{Redis.REDIS_URL}}
CACHE_REDIS_PREFIX_KEY=evolution
CACHE_REDIS_SAVE_INSTANCES=false
CACHE_LOCAL_ENABLED=false

# Configurações Gerais
DEL_INSTANCE=false
LOG_LEVEL=ERROR,WARN,DEBUG,INFO,LOG
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE
CORS_CREDENTIALS=true
LANGUAGE=pt-BR

# QR Code
QRCODE_LIMIT=30
QRCODE_COLOR=#175197

# Sessão
CONFIG_SESSION_PHONE_CLIENT=Evolution API
CONFIG_SESSION_PHONE_NAME=Chrome

# Integrações (desabilitadas)
TYPEBOT_ENABLED=false
CHATWOOT_ENABLED=false
OPENAI_ENABLED=false
DIFY_ENABLED=false
RABBITMQ_ENABLED=false
WEBSOCKET_ENABLED=false
S3_ENABLED=false
```

## 🔗 Endpoints Importantes

| Endpoint | Descrição |
|----------|-----------|
| `/` | Status da API |
| `/manager` | Painel de gerenciamento (QR Code) |
| `/docs` | Documentação Swagger |

## 📱 Após Deploy

1. Acesse `https://seu-projeto.up.railway.app/manager`
2. Faça login com sua API Key
3. Crie uma instância
4. Escaneie o QR Code com WhatsApp
5. Pronto! 🎉

## 📚 Documentação

- [Evolution API Docs](https://doc.evolution-api.com)
- [GitHub](https://github.com/EvolutionAPI/evolution-api)
