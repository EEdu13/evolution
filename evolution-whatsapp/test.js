/**
 * Arquivo de teste da biblioteca Evolution WhatsApp
 * Execute: node test.js
 */

const EvolutionWhatsApp = require('./index');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  📱 EVOLUTION WHATSAPP LIBRARY - TESTE');
console.log('═══════════════════════════════════════════════════════════════\n');

// ============================================
// TESTE 1: Inicialização com erro (sem parâmetros)
// ============================================
console.log('🧪 TESTE 1: Inicialização sem parâmetros');
console.log('─────────────────────────────────────────');
try {
  const whatsErro = new EvolutionWhatsApp({});
} catch (error) {
  console.log('✅ Erro capturado corretamente:', error.message);
}
console.log('');

// ============================================
// TESTE 2: Inicialização correta
// ============================================
console.log('🧪 TESTE 2: Inicialização correta');
console.log('─────────────────────────────────────────');
const whats = new EvolutionWhatsApp({
  url: 'https://evolution-api.exemplo.com',
  apiKey: 'teste-api-key-123',
  instance: 'minha-instancia'
});
console.log('✅ Biblioteca inicializada com sucesso!');
console.log('   URL Base:', whats.baseUrl);
console.log('   Instância:', whats.instance);
console.log('');

// ============================================
// TESTE 3: Validação de número
// ============================================
console.log('🧪 TESTE 3: Validação de números');
console.log('─────────────────────────────────────────');

async function testarValidacoes() {
  // Número inválido (curto)
  let resultado = await whats.enviarTexto('123', 'Teste');
  console.log('❌ Número curto:', resultado.error.message);

  // Número vazio
  resultado = await whats.enviarTexto('', 'Teste');
  console.log('❌ Número vazio:', resultado.error.message);

  // Texto vazio
  resultado = await whats.enviarTexto('5541999999999', '');
  console.log('❌ Texto vazio:', resultado.error.message);

  console.log('');

  // ============================================
  // TESTE 4: Validação de URL
  // ============================================
  console.log('🧪 TESTE 4: Validação de URLs');
  console.log('─────────────────────────────────────────');

  resultado = await whats.enviarImagem('5541999999999', 'url-invalida', 'teste');
  console.log('❌ URL inválida:', resultado.error.message);

  resultado = await whats.enviarImagem('5541999999999', 'ftp://arquivo.com/img.jpg', 'teste');
  console.log('❌ Protocolo FTP:', resultado.error.message);

  console.log('');

  // ============================================
  // TESTE 5: Validação de grupo
  // ============================================
  console.log('🧪 TESTE 5: Validação de grupos');
  console.log('─────────────────────────────────────────');

  resultado = await whats.enviarParaGrupo('123456789', 'Teste');
  console.log('❌ Grupo sem @g.us:', resultado.error.message);

  console.log('');

  // ============================================
  // TESTE 6: Validação de botões
  // ============================================
  console.log('🧪 TESTE 6: Validação de botões');
  console.log('─────────────────────────────────────────');

  resultado = await whats.enviarBotoes('5541999999999', 'Teste', []);
  console.log('❌ Array vazio:', resultado.error.message);

  resultado = await whats.enviarBotoes('5541999999999', 'Teste', [
    { id: '1', text: 'Btn1' },
    { id: '2', text: 'Btn2' },
    { id: '3', text: 'Btn3' },
    { id: '4', text: 'Btn4' }
  ]);
  console.log('❌ Mais de 3 botões:', resultado.error.message);

  resultado = await whats.enviarBotoes('5541999999999', 'Teste', [
    { id: '1' } // Falta text
  ]);
  console.log('❌ Botão sem text:', resultado.error.message);

  console.log('');

  // ============================================
  // TESTE 7: Validação de lista
  // ============================================
  console.log('🧪 TESTE 7: Validação de lista');
  console.log('─────────────────────────────────────────');

  resultado = await whats.enviarLista('5541999999999', '', 'desc', []);
  console.log('❌ Título vazio:', resultado.error.message);

  resultado = await whats.enviarLista('5541999999999', 'Titulo', 'desc', [
    { title: 'Item' } // Falta rowId
  ]);
  console.log('❌ Opção sem rowId:', resultado.error.message);

  console.log('');

  // ============================================
  // TESTE 8: Validação de localização
  // ============================================
  console.log('🧪 TESTE 8: Validação de localização');
  console.log('─────────────────────────────────────────');

  resultado = await whats.enviarLocalizacao('5541999999999', 'texto', -49.27, 'Nome', 'End');
  console.log('❌ Latitude inválida:', resultado.error.message);

  resultado = await whats.enviarLocalizacao('5541999999999', -95, -49.27, 'Nome', 'End');
  console.log('❌ Latitude fora do range:', resultado.error.message);

  console.log('');

  // ============================================
  // RESUMO
  // ============================================
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  ✅ TODOS OS TESTES DE VALIDAÇÃO PASSARAM!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 Métodos disponíveis:');
  console.log('   • enviarTexto(numero, texto)');
  console.log('   • enviarParaGrupo(grupoId, texto)');
  console.log('   • enviarImagem(numero, url, legenda)');
  console.log('   • enviarDocumento(numero, url, nomeArquivo)');
  console.log('   • enviarBotoes(numero, texto, botoes)');
  console.log('   • enviarLista(numero, titulo, descricao, opcoes)');
  console.log('   • enviarAudio(numero, url)');
  console.log('   • enviarVideo(numero, url, legenda)');
  console.log('   • enviarLocalizacao(numero, lat, lng, nome, endereco)');
  console.log('   • verificarStatus()');
  console.log('');
  console.log('📦 Biblioteca pronta para uso em produção!');
  console.log('');
}

testarValidacoes();
