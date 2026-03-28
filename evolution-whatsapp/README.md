# 📱 Evolution WhatsApp Library

Biblioteca Node.js profissional e reutilizável para integração com **Evolution API** (WhatsApp).

## 📋 Índice

- [Descrição](#-descrição)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso Rápido](#-uso-rápido)
- [Métodos Disponíveis](#-métodos-disponíveis)
- [Exemplos Completos](#-exemplos-completos)
- [Formato de Retorno](#-formato-de-retorno)
- [Troubleshooting](#-troubleshooting)

---

## 📝 Descrição

Esta biblioteca oferece uma interface simples e robusta para enviar mensagens WhatsApp através da Evolution API. Projetada para ser:

- ✅ **Plug-and-play** - Copie para qualquer projeto e use imediatamente
- ✅ **Segura** - Nunca quebra sua aplicação (sempre retorna objeto)
- ✅ **Reutilizável** - Funciona em qualquer projeto Node.js
- ✅ **Profissional** - Qualidade de biblioteca npm

### Casos de Uso

- 📦 Sistema de Estoque → Alertas de produtos em falta
- 📄 Contratos → Notificações de vencimento
- 🛒 E-commerce → Confirmação de pedidos
- 📊 CRM → Follow-up automático com clientes
- 🔔 Monitoramento → Alertas de sistema

---

## 📥 Instalação

### 1. Copie a pasta para seu projeto

```bash
# Clone ou copie a pasta evolution-whatsapp para seu projeto
cp -r evolution-whatsapp /seu-projeto/lib/
```

### 2. Instale as dependências

```bash
cd evolution-whatsapp
npm install
```

Ou adicione ao package.json do seu projeto principal:

```json
{
  "dependencies": {
    "axios": "^1.6.0"
  }
}
```

---

## ⚙️ Configuração

### 1. Crie o arquivo .env no seu projeto

```env
EVOLUTION_URL=https://sua-evolution.up.railway.app
EVOLUTION_API_KEY=sua-chave-api-aqui
EVOLUTION_INSTANCE=nome-da-instancia
```

### 2. Onde encontrar as credenciais

| Variável | Onde Encontrar |
|----------|----------------|
| `EVOLUTION_URL` | URL do seu deploy (Railway, VPS, Docker) |
| `EVOLUTION_API_KEY` | Painel da Evolution API → Configurações → API Key |
| `EVOLUTION_INSTANCE` | Nome da instância criada na Evolution API |

### 3. Configure dotenv no seu projeto

```javascript
require('dotenv').config();
```

---

## 🚀 Uso Rápido

```javascript
const EvolutionWhatsApp = require('./evolution-whatsapp');

// Inicializa a biblioteca
const whats = new EvolutionWhatsApp({
  url: process.env.EVOLUTION_URL,
  apiKey: process.env.EVOLUTION_API_KEY,
  instance: process.env.EVOLUTION_INSTANCE
});

// Envia mensagem
const resultado = await whats.enviarTexto('5541999999999', 'Olá! 👋');

if (resultado.success) {
  console.log('✅ Mensagem enviada!');
} else {
  console.log('❌ Erro:', resultado.error.message);
}
```

---

## 📚 Métodos Disponíveis

### 1. `enviarTexto(numero, texto)`

Envia mensagem de texto simples.

```javascript
await whats.enviarTexto('5541999999999', 'Olá! Como posso ajudar?');
```

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| numero | string | Número com DDD e DDI (apenas dígitos) |
| texto | string | Mensagem a ser enviada |

---

### 2. `enviarParaGrupo(grupoId, texto)`

Envia mensagem para um grupo WhatsApp.

```javascript
await whats.enviarParaGrupo('5541999999999-1234567890@g.us', '📢 Aviso importante!');
```

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| grupoId | string | ID do grupo (formato: xxxxx@g.us) |
| texto | string | Mensagem a ser enviada |

---

### 3. `enviarImagem(numero, imagemUrl, legenda)`

Envia imagem com legenda opcional.

```javascript
await whats.enviarImagem(
  '5541999999999',
  'https://exemplo.com/produto.jpg',
  '📦 Novo produto disponível!'
);
```

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| numero | string | Número do destinatário |
| imagemUrl | string | URL pública da imagem (http/https) |
| legenda | string | Legenda da imagem (opcional) |

---

### 4. `enviarDocumento(numero, documentoUrl, nomeArquivo)`

Envia documento (PDF, Excel, Word, etc).

```javascript
await whats.enviarDocumento(
  '5541999999999',
  'https://exemplo.com/relatorio.pdf',
  'Relatório_Janeiro.pdf'
);
```

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| numero | string | Número do destinatário |
| documentoUrl | string | URL pública do documento |
| nomeArquivo | string | Nome para exibição do arquivo |

---

### 5. `enviarBotoes(numero, texto, botoes)`

Envia mensagem com botões interativos (máximo 3).

```javascript
await whats.enviarBotoes('5541999999999', '🔔 Aprovar saída de estoque?', [
  { id: 'aprovar', text: '✅ Aprovar' },
  { id: 'reprovar', text: '❌ Reprovar' },
  { id: 'pendente', text: '⏳ Pendente' }
]);
```

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| numero | string | Número do destinatário |
| texto | string | Texto principal da mensagem |
| botoes | array | Array de objetos { id, text } |

---

### 6. `enviarLista(numero, titulo, descricao, opcoes)`

Envia mensagem com lista de opções (máximo 10).

```javascript
await whats.enviarLista(
  '5541999999999',
  '📋 Menu Principal',
  'Selecione uma opção:',
  [
    { title: 'Ver Estoque', description: 'Consultar produtos', rowId: 'estoque' },
    { title: 'Ver Vendas', description: 'Relatório de vendas', rowId: 'vendas' },
    { title: 'Suporte', description: 'Falar com atendente', rowId: 'suporte' }
  ]
);
```

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| numero | string | Número do destinatário |
| titulo | string | Título da lista |
| descricao | string | Descrição/texto principal |
| opcoes | array | Array de { title, description, rowId } |

---

### 7. `enviarAudio(numero, audioUrl)`

Envia mensagem de áudio.

```javascript
await whats.enviarAudio('5541999999999', 'https://exemplo.com/audio.mp3');
```

---

### 8. `enviarVideo(numero, videoUrl, legenda)`

Envia vídeo com legenda opcional.

```javascript
await whats.enviarVideo(
  '5541999999999',
  'https://exemplo.com/video.mp4',
  '🎬 Confira!'
);
```

---

### 9. `enviarLocalizacao(numero, latitude, longitude, nome, endereco)`

Envia localização no mapa.

```javascript
await whats.enviarLocalizacao(
  '5541999999999',
  -25.4284,
  -49.2733,
  'Escritório Central',
  'Rua XV de Novembro, 1234 - Curitiba/PR'
);
```

---

### 10. `verificarStatus()`

Verifica se a instância está conectada.

```javascript
const status = await whats.verificarStatus();

if (status.connected) {
  console.log('✅ WhatsApp conectado!');
} else {
  console.log('❌ Desconectado. Status:', status.status);
}
```

**Retorno:**
```javascript
{
  connected: true,  // boolean
  status: 'open',   // 'open' | 'close' | 'connecting' | 'error'
  data: { ... }     // Dados completos da API
}
```

---

## 💡 Exemplos Completos

### Sistema de Estoque - Alerta de Produto em Falta

```javascript
const EvolutionWhatsApp = require('./evolution-whatsapp');

const whats = new EvolutionWhatsApp({
  url: process.env.EVOLUTION_URL,
  apiKey: process.env.EVOLUTION_API_KEY,
  instance: process.env.EVOLUTION_INSTANCE
});

async function alertaEstoqueBaixo(produto, quantidade, responsavel) {
  const mensagem = `
🚨 *ALERTA DE ESTOQUE BAIXO*

📦 Produto: ${produto.nome}
📊 Quantidade Atual: ${quantidade} unidades
⚠️ Mínimo Configurado: ${produto.estoqueMinimo} unidades

👤 Responsável: ${responsavel.nome}
📅 Data: ${new Date().toLocaleDateString('pt-BR')}

_Acesse o sistema para fazer a reposição._
  `.trim();

  const resultado = await whats.enviarTexto(responsavel.telefone, mensagem);
  
  if (resultado.success) {
    console.log(`Alerta enviado para ${responsavel.nome}`);
  }
  
  return resultado;
}

// Uso
await alertaEstoqueBaixo(
  { nome: 'Caneta Azul', estoqueMinimo: 100 },
  45,
  { nome: 'João Silva', telefone: '5541999999999' }
);
```

### Sistema de Contratos - Notificação de Vencimento

```javascript
async function notificarVencimentoContrato(contrato, cliente) {
  const diasRestantes = Math.ceil(
    (new Date(contrato.dataVencimento) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const mensagem = `
📄 *CONTRATO PRÓXIMO DO VENCIMENTO*

🏢 Cliente: ${cliente.nome}
📋 Contrato: ${contrato.numero}
📅 Vencimento: ${new Date(contrato.dataVencimento).toLocaleDateString('pt-BR')}
⏰ Dias Restantes: ${diasRestantes} dias

💰 Valor: R$ ${contrato.valor.toFixed(2)}

_Entre em contato para renovação._
  `.trim();

  // Envia para o comercial
  await whats.enviarTexto('5541999999999', mensagem);

  // Envia para o grupo de gestão
  await whats.enviarParaGrupo(
    '5541999999999-1234567890@g.us',
    `📢 Contrato ${contrato.numero} vence em ${diasRestantes} dias`
  );
}
```

### E-commerce - Confirmação de Pedido com Imagem

```javascript
async function confirmarPedido(pedido, cliente) {
  // Mensagem de confirmação
  const mensagem = `
✅ *PEDIDO CONFIRMADO!*

🛒 Pedido: #${pedido.numero}
📦 Itens: ${pedido.itens.length}
💰 Total: R$ ${pedido.total.toFixed(2)}

🚚 Prazo de Entrega: ${pedido.prazoEntrega}
📍 Endereço: ${cliente.endereco}

Obrigado pela preferência! 🙏
  `.trim();

  await whats.enviarTexto(cliente.telefone, mensagem);

  // Envia imagem do produto principal
  if (pedido.itens[0].imagemUrl) {
    await whats.enviarImagem(
      cliente.telefone,
      pedido.itens[0].imagemUrl,
      `📦 ${pedido.itens[0].nome}`
    );
  }

  // Envia boleto se houver
  if (pedido.boletoUrl) {
    await whats.enviarDocumento(
      cliente.telefone,
      pedido.boletoUrl,
      `Boleto_Pedido_${pedido.numero}.pdf`
    );
  }
}
```

### Aprovação com Botões

```javascript
async function solicitarAprovacaoSaida(saida, aprovador) {
  const resultado = await whats.enviarBotoes(
    aprovador.telefone,
    `🔔 *Aprovação Necessária*\n\n📦 ${saida.produto}\n📊 Qtd: ${saida.quantidade}\n👤 Solicitante: ${saida.solicitante}`,
    [
      { id: `aprovar_${saida.id}`, text: '✅ Aprovar' },
      { id: `reprovar_${saida.id}`, text: '❌ Reprovar' }
    ]
  );

  return resultado;
}
```

---

## 📤 Formato de Retorno

Todos os métodos retornam um objeto padronizado:

### Sucesso

```javascript
{
  success: true,
  data: {
    // Dados retornados pela Evolution API
    key: {
      remoteJid: '5541999999999@s.whatsapp.net',
      fromMe: true,
      id: 'ABCDEF123456'
    },
    message: { ... }
  },
  error: null
}
```

### Erro

```javascript
{
  success: false,
  data: null,
  error: {
    message: 'Descrição do erro',
    details: {
      // Detalhes adicionais da API ou validação
    }
  }
}
```

### Como Tratar

```javascript
const resultado = await whats.enviarTexto('5541999999999', 'Olá!');

if (resultado.success) {
  // Sucesso - mensagem enviada
  console.log('ID da mensagem:', resultado.data.key.id);
} else {
  // Erro - trate adequadamente
  console.error('Erro:', resultado.error.message);
  
  // Log detalhado para debug
  if (resultado.error.details) {
    console.error('Detalhes:', resultado.error.details);
  }
}
```

---

## 🔧 Troubleshooting

### ❌ Erro: "URL é obrigatória"

**Problema:** Variável de ambiente não configurada.

**Solução:**
```javascript
// Verifique se o .env está carregado
require('dotenv').config();

// Verifique os valores
console.log('URL:', process.env.EVOLUTION_URL);
console.log('API Key:', process.env.EVOLUTION_API_KEY);
console.log('Instance:', process.env.EVOLUTION_INSTANCE);
```

---

### ❌ Erro: "Request failed with status code 401"

**Problema:** API Key inválida ou expirada.

**Solução:**
1. Acesse o painel da Evolution API
2. Gere uma nova API Key
3. Atualize o `.env`

---

### ❌ Erro: "Request failed with status code 404"

**Problema:** Instância não existe ou URL incorreta.

**Solução:**
1. Verifique se a instância foi criada na Evolution API
2. Confirme o nome exato da instância
3. Verifique se a URL está correta (sem barra final)

---

### ❌ Erro: "Instance not connected"

**Problema:** WhatsApp não está conectado na instância.

**Solução:**
```javascript
// Verifique o status
const status = await whats.verificarStatus();
console.log('Status:', status);

// Se desconectado, reconecte via painel Evolution API
```

---

### ❌ Número inválido

**Problema:** Formato do número incorreto.

**Solução:**
- Use apenas dígitos: `5541999999999`
- Inclua DDI (55 para Brasil)
- Inclua DDD (41, 11, etc)
- Sem espaços, traços ou parênteses

```javascript
// ✅ Correto
'5541999999999'

// ❌ Incorreto
'(41) 99999-9999'
'+55 41 99999-9999'
'41999999999'  // Falta DDI
```

---

### ❌ Timeout na requisição

**Problema:** Evolution API demorou para responder.

**Solução:**
- Verifique a conexão de rede
- Verifique se o Railway/VPS está online
- Tente novamente após alguns segundos

---

## 📄 Licença

MIT License - Use livremente em seus projetos.

---

## 🤝 Contribuição

Sinta-se à vontade para melhorar esta biblioteca:

1. Faça um fork
2. Crie sua branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

**Desenvolvido para simplificar integrações WhatsApp com Evolution API** 🚀
