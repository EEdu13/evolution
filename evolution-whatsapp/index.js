/**
 * Evolution WhatsApp Library
 * Biblioteca reutilizável para integração com Evolution API
 * 
 * @author Evolution WhatsApp Library
 * @version 1.0.0
 * @license MIT
 */

const axios = require('axios');

/**
 * Classe principal para comunicação com Evolution API
 * @class EvolutionWhatsApp
 */
class EvolutionWhatsApp {
  /**
   * Cria uma nova instância do cliente Evolution API
   * 
   * @param {Object} config - Configurações de conexão
   * @param {string} config.url - URL base da Evolution API (ex: https://sua-evolution.up.railway.app)
   * @param {string} config.apiKey - Chave de API para autenticação
   * @param {string} config.instance - Nome da instância WhatsApp
   * @throws {Error} Se parâmetros obrigatórios não forem fornecidos
   * 
   * @example
   * const whats = new EvolutionWhatsApp({
   *   url: 'https://sua-evolution.up.railway.app',
   *   apiKey: 'sua-chave-api',
   *   instance: 'minha-instancia'
   * });
   */
  constructor({ url, apiKey, instance }) {
    // Validação de parâmetros obrigatórios
    if (!url) {
      throw new Error('EvolutionWhatsApp: URL é obrigatória');
    }
    if (!apiKey) {
      throw new Error('EvolutionWhatsApp: API Key é obrigatória');
    }
    if (!instance) {
      throw new Error('EvolutionWhatsApp: Nome da instância é obrigatório');
    }

    // Remove barra final da URL se existir
    this.baseUrl = url.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.instance = instance;

    // Configura cliente HTTP
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.apiKey
      }
    });
  }

  /**
   * Valida formato de número de telefone
   * @private
   * @param {string} numero - Número a validar
   * @returns {Object} { valid: boolean, error?: string }
   */
  _validarNumero(numero) {
    if (!numero) {
      return { valid: false, error: 'Número é obrigatório' };
    }

    const numeroLimpo = String(numero).replace(/\D/g, '');
    
    if (numeroLimpo.length < 10 || numeroLimpo.length > 15) {
      return { valid: false, error: 'Número deve ter entre 10 e 15 dígitos' };
    }

    return { valid: true, numero: numeroLimpo };
  }

  /**
   * Valida formato de URL
   * @private
   * @param {string} url - URL a validar
   * @returns {Object} { valid: boolean, error?: string }
   */
  _validarUrl(url) {
    if (!url) {
      return { valid: false, error: 'URL é obrigatória' };
    }

    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { valid: false, error: 'URL deve usar protocolo HTTP ou HTTPS' };
      }
      return { valid: true };
    } catch {
      return { valid: false, error: 'URL inválida' };
    }
  }

  /**
   * Valida ID de grupo WhatsApp
   * @private
   * @param {string} grupoId - ID do grupo
   * @returns {Object} { valid: boolean, error?: string }
   */
  _validarGrupo(grupoId) {
    if (!grupoId) {
      return { valid: false, error: 'ID do grupo é obrigatório' };
    }

    if (!grupoId.includes('@g.us')) {
      return { valid: false, error: 'ID do grupo deve conter @g.us' };
    }

    return { valid: true };
  }

  /**
   * Formata resposta padrão de sucesso
   * @private
   * @param {*} data - Dados da resposta
   * @returns {Object} { success: true, data, error: null }
   */
  _formatarSucesso(data) {
    return {
      success: true,
      data: data,
      error: null
    };
  }

  /**
   * Formata resposta padrão de erro
   * @private
   * @param {string} message - Mensagem de erro
   * @param {*} details - Detalhes adicionais do erro
   * @returns {Object} { success: false, data: null, error }
   */
  _formatarErro(message, details = null) {
    return {
      success: false,
      data: null,
      error: {
        message: message,
        details: details
      }
    };
  }

  /**
   * Envia mensagem de texto simples
   * 
   * @param {string} numero - Número do destinatário (apenas dígitos, ex: 5541999999999)
   * @param {string} texto - Texto da mensagem
   * @returns {Promise<Object>} { success: boolean, data: Object|null, error: Object|null }
   * 
   * @example
   * const resultado = await whats.enviarTexto('5541999999999', 'Olá! Tudo bem?');
   * if (resultado.success) {
   *   console.log('Mensagem enviada:', resultado.data);
   * } else {
   *   console.error('Erro:', resultado.error.message);
   * }
   */
  async enviarTexto(numero, texto) {
    try {
      // Valida número
      const validacaoNumero = this._validarNumero(numero);
      if (!validacaoNumero.valid) {
        return this._formatarErro(validacaoNumero.error);
      }

      // Valida texto
      if (!texto || typeof texto !== 'string' || texto.trim() === '') {
        return this._formatarErro('Texto da mensagem é obrigatório');
      }

      const response = await this.client.post(
        `/message/sendText/${this.instance}`,
        {
          number: validacaoNumero.numero,
          text: texto
        }
      );

      return this._formatarSucesso(response.data);
    } catch (error) {
      console.error('EvolutionWhatsApp.enviarTexto:', error.message);
      return this._formatarErro(
        'Falha ao enviar mensagem de texto',
        error.response?.data || error.message
      );
    }
  }

  /**
   * Envia mensagem para um grupo WhatsApp
   * 
   * @param {string} grupoId - ID do grupo (ex: 5541999999999-1234567890@g.us)
   * @param {string} texto - Texto da mensagem
   * @returns {Promise<Object>} { success: boolean, data: Object|null, error: Object|null }
   * 
   * @example
   * const resultado = await whats.enviarParaGrupo(
   *   '5541999999999-1234567890@g.us',
   *   '📢 Notificação importante para o grupo!'
   * );
   */
  async enviarParaGrupo(grupoId, texto) {
    try {
      // Valida grupo
      const validacaoGrupo = this._validarGrupo(grupoId);
      if (!validacaoGrupo.valid) {
        return this._formatarErro(validacaoGrupo.error);
      }

      // Valida texto
      if (!texto || typeof texto !== 'string' || texto.trim() === '') {
        return this._formatarErro('Texto da mensagem é obrigatório');
      }

      const response = await this.client.post(
        `/message/sendText/${this.instance}`,
        {
          number: grupoId,
          text: texto
        }
      );

      return this._formatarSucesso(response.data);
    } catch (error) {
      console.error('EvolutionWhatsApp.enviarParaGrupo:', error.message);
      return this._formatarErro(
        'Falha ao enviar mensagem para grupo',
        error.response?.data || error.message
      );
    }
  }

  /**
   * Envia imagem com legenda opcional
   * 
   * @param {string} numero - Número do destinatário (apenas dígitos)
   * @param {string} imagemUrl - URL pública da imagem (http/https)
   * @param {string} [legenda=''] - Legenda da imagem (opcional)
   * @returns {Promise<Object>} { success: boolean, data: Object|null, error: Object|null }
   * 
   * @example
   * const resultado = await whats.enviarImagem(
   *   '5541999999999',
   *   'https://exemplo.com/produto.jpg',
   *   '📦 Novo produto disponível!'
   * );
   */
  async enviarImagem(numero, imagemUrl, legenda = '') {
    try {
      // Valida número
      const validacaoNumero = this._validarNumero(numero);
      if (!validacaoNumero.valid) {
        return this._formatarErro(validacaoNumero.error);
      }

      // Valida URL
      const validacaoUrl = this._validarUrl(imagemUrl);
      if (!validacaoUrl.valid) {
        return this._formatarErro(validacaoUrl.error);
      }

      const response = await this.client.post(
        `/message/sendMedia/${this.instance}`,
        {
          number: validacaoNumero.numero,
          mediatype: 'image',
          media: imagemUrl,
          caption: legenda || ''
        }
      );

      return this._formatarSucesso(response.data);
    } catch (error) {
      console.error('EvolutionWhatsApp.enviarImagem:', error.message);
      return this._formatarErro(
        'Falha ao enviar imagem',
        error.response?.data || error.message
      );
    }
  }

  /**
   * Envia documento (PDF, Excel, Word, etc)
   * 
   * @param {string} numero - Número do destinatário (apenas dígitos)
   * @param {string} documentoUrl - URL pública do documento (http/https)
   * @param {string} nomeArquivo - Nome do arquivo para exibição (ex: 'relatorio.pdf')
   * @returns {Promise<Object>} { success: boolean, data: Object|null, error: Object|null }
   * 
   * @example
   * const resultado = await whats.enviarDocumento(
   *   '5541999999999',
   *   'https://exemplo.com/relatorio.pdf',
   *   'Relatório_Mensal.pdf'
   * );
   */
  async enviarDocumento(numero, documentoUrl, nomeArquivo) {
    try {
      // Valida número
      const validacaoNumero = this._validarNumero(numero);
      if (!validacaoNumero.valid) {
        return this._formatarErro(validacaoNumero.error);
      }

      // Valida URL
      const validacaoUrl = this._validarUrl(documentoUrl);
      if (!validacaoUrl.valid) {
        return this._formatarErro(validacaoUrl.error);
      }

      // Valida nome do arquivo
      if (!nomeArquivo || typeof nomeArquivo !== 'string' || nomeArquivo.trim() === '') {
        return this._formatarErro('Nome do arquivo é obrigatório');
      }

      const response = await this.client.post(
        `/message/sendMedia/${this.instance}`,
        {
          number: validacaoNumero.numero,
          mediatype: 'document',
          media: documentoUrl,
          fileName: nomeArquivo
        }
      );

      return this._formatarSucesso(response.data);
    } catch (error) {
      console.error('EvolutionWhatsApp.enviarDocumento:', error.message);
      return this._formatarErro(
        'Falha ao enviar documento',
        error.response?.data || error.message
      );
    }
  }

  /**
   * Envia mensagem com botões interativos
   * 
   * @param {string} numero - Número do destinatário (apenas dígitos)
   * @param {string} texto - Texto principal da mensagem
   * @param {Array<Object>} botoes - Array de botões
   * @param {string} botoes[].id - ID único do botão
   * @param {string} botoes[].text - Texto exibido no botão
   * @returns {Promise<Object>} { success: boolean, data: Object|null, error: Object|null }
   * 
   * @example
   * const resultado = await whats.enviarBotoes(
   *   '5541999999999',
   *   '🔔 Aprovar saída de estoque?',
   *   [
   *     { id: 'aprovar', text: '✅ Aprovar' },
   *     { id: 'reprovar', text: '❌ Reprovar' },
   *     { id: 'pendente', text: '⏳ Deixar Pendente' }
   *   ]
   * );
   */
  async enviarBotoes(numero, texto, botoes) {
    try {
      // Valida número
      const validacaoNumero = this._validarNumero(numero);
      if (!validacaoNumero.valid) {
        return this._formatarErro(validacaoNumero.error);
      }

      // Valida texto
      if (!texto || typeof texto !== 'string' || texto.trim() === '') {
        return this._formatarErro('Texto da mensagem é obrigatório');
      }

      // Valida botões
      if (!Array.isArray(botoes) || botoes.length === 0) {
        return this._formatarErro('Botões devem ser um array com pelo menos um item');
      }

      if (botoes.length > 3) {
        return this._formatarErro('Máximo de 3 botões permitidos');
      }

      // Valida estrutura de cada botão
      for (const botao of botoes) {
        if (!botao.id || !botao.text) {
          return this._formatarErro('Cada botão deve ter "id" e "text"');
        }
      }

      // Formata botões para Evolution API
      const botoesFormatados = botoes.map(b => ({
        buttonId: b.id,
        buttonText: { displayText: b.text }
      }));

      const response = await this.client.post(
        `/message/sendButtons/${this.instance}`,
        {
          number: validacaoNumero.numero,
          title: texto,
          buttons: botoesFormatados
        }
      );

      return this._formatarSucesso(response.data);
    } catch (error) {
      console.error('EvolutionWhatsApp.enviarBotoes:', error.message);
      return this._formatarErro(
        'Falha ao enviar mensagem com botões',
        error.response?.data || error.message
      );
    }
  }

  /**
   * Envia mensagem com lista de opções
   * 
   * @param {string} numero - Número do destinatário (apenas dígitos)
   * @param {string} titulo - Título da lista
   * @param {string} descricao - Descrição/texto principal
   * @param {Array<Object>} opcoes - Array de opções da lista
   * @param {string} opcoes[].title - Título da opção
   * @param {string} opcoes[].description - Descrição da opção
   * @param {string} opcoes[].rowId - ID único da opção
   * @returns {Promise<Object>} { success: boolean, data: Object|null, error: Object|null }
   * 
   * @example
   * const resultado = await whats.enviarLista(
   *   '5541999999999',
   *   '📋 Menu de Opções',
   *   'Selecione uma opção abaixo:',
   *   [
   *     { title: 'Ver Estoque', description: 'Consultar estoque atual', rowId: 'estoque' },
   *     { title: 'Ver Vendas', description: 'Relatório de vendas', rowId: 'vendas' },
   *     { title: 'Suporte', description: 'Falar com atendente', rowId: 'suporte' }
   *   ]
   * );
   */
  async enviarLista(numero, titulo, descricao, opcoes) {
    try {
      // Valida número
      const validacaoNumero = this._validarNumero(numero);
      if (!validacaoNumero.valid) {
        return this._formatarErro(validacaoNumero.error);
      }

      // Valida título
      if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        return this._formatarErro('Título da lista é obrigatório');
      }

      // Valida descrição
      if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
        return this._formatarErro('Descrição da lista é obrigatória');
      }

      // Valida opções
      if (!Array.isArray(opcoes) || opcoes.length === 0) {
        return this._formatarErro('Opções devem ser um array com pelo menos um item');
      }

      if (opcoes.length > 10) {
        return this._formatarErro('Máximo de 10 opções permitidas');
      }

      // Valida estrutura de cada opção
      for (const opcao of opcoes) {
        if (!opcao.title || !opcao.rowId) {
          return this._formatarErro('Cada opção deve ter "title" e "rowId"');
        }
      }

      // Formata opções para Evolution API
      const rows = opcoes.map(o => ({
        title: o.title,
        description: o.description || '',
        rowId: o.rowId
      }));

      const response = await this.client.post(
        `/message/sendList/${this.instance}`,
        {
          number: validacaoNumero.numero,
          title: titulo,
          description: descricao,
          buttonText: 'Ver Opções',
          sections: [
            {
              title: 'Opções',
              rows: rows
            }
          ]
        }
      );

      return this._formatarSucesso(response.data);
    } catch (error) {
      console.error('EvolutionWhatsApp.enviarLista:', error.message);
      return this._formatarErro(
        'Falha ao enviar lista',
        error.response?.data || error.message
      );
    }
  }

  /**
   * Verifica status da conexão da instância
   * 
   * @returns {Promise<Object>} { connected: boolean, status: string }
   * 
   * @example
   * const status = await whats.verificarStatus();
   * if (status.connected) {
   *   console.log('WhatsApp conectado!');
   * } else {
   *   console.log('WhatsApp desconectado. Status:', status.status);
   * }
   */
  async verificarStatus() {
    try {
      const response = await this.client.get(
        `/instance/connectionState/${this.instance}`
      );

      const state = response.data?.instance?.state || response.data?.state || 'unknown';
      
      return {
        connected: state === 'open',
        status: state,
        data: response.data
      };
    } catch (error) {
      console.error('EvolutionWhatsApp.verificarStatus:', error.message);
      return {
        connected: false,
        status: 'error',
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Envia áudio/voz
   * 
   * @param {string} numero - Número do destinatário (apenas dígitos)
   * @param {string} audioUrl - URL pública do áudio (http/https)
   * @returns {Promise<Object>} { success: boolean, data: Object|null, error: Object|null }
   * 
   * @example
   * const resultado = await whats.enviarAudio(
   *   '5541999999999',
   *   'https://exemplo.com/audio.mp3'
   * );
   */
  async enviarAudio(numero, audioUrl) {
    try {
      // Valida número
      const validacaoNumero = this._validarNumero(numero);
      if (!validacaoNumero.valid) {
        return this._formatarErro(validacaoNumero.error);
      }

      // Valida URL
      const validacaoUrl = this._validarUrl(audioUrl);
      if (!validacaoUrl.valid) {
        return this._formatarErro(validacaoUrl.error);
      }

      const response = await this.client.post(
        `/message/sendMedia/${this.instance}`,
        {
          number: validacaoNumero.numero,
          mediatype: 'audio',
          media: audioUrl
        }
      );

      return this._formatarSucesso(response.data);
    } catch (error) {
      console.error('EvolutionWhatsApp.enviarAudio:', error.message);
      return this._formatarErro(
        'Falha ao enviar áudio',
        error.response?.data || error.message
      );
    }
  }

  /**
   * Envia vídeo com legenda opcional
   * 
   * @param {string} numero - Número do destinatário (apenas dígitos)
   * @param {string} videoUrl - URL pública do vídeo (http/https)
   * @param {string} [legenda=''] - Legenda do vídeo (opcional)
   * @returns {Promise<Object>} { success: boolean, data: Object|null, error: Object|null }
   * 
   * @example
   * const resultado = await whats.enviarVideo(
   *   '5541999999999',
   *   'https://exemplo.com/video.mp4',
   *   '🎬 Confira nosso novo vídeo!'
   * );
   */
  async enviarVideo(numero, videoUrl, legenda = '') {
    try {
      // Valida número
      const validacaoNumero = this._validarNumero(numero);
      if (!validacaoNumero.valid) {
        return this._formatarErro(validacaoNumero.error);
      }

      // Valida URL
      const validacaoUrl = this._validarUrl(videoUrl);
      if (!validacaoUrl.valid) {
        return this._formatarErro(validacaoUrl.error);
      }

      const response = await this.client.post(
        `/message/sendMedia/${this.instance}`,
        {
          number: validacaoNumero.numero,
          mediatype: 'video',
          media: videoUrl,
          caption: legenda || ''
        }
      );

      return this._formatarSucesso(response.data);
    } catch (error) {
      console.error('EvolutionWhatsApp.enviarVideo:', error.message);
      return this._formatarErro(
        'Falha ao enviar vídeo',
        error.response?.data || error.message
      );
    }
  }

  /**
   * Envia localização
   * 
   * @param {string} numero - Número do destinatário (apenas dígitos)
   * @param {number} latitude - Latitude da localização
   * @param {number} longitude - Longitude da localização
   * @param {string} [nome=''] - Nome do local (opcional)
   * @param {string} [endereco=''] - Endereço do local (opcional)
   * @returns {Promise<Object>} { success: boolean, data: Object|null, error: Object|null }
   * 
   * @example
   * const resultado = await whats.enviarLocalizacao(
   *   '5541999999999',
   *   -25.4284,
   *   -49.2733,
   *   'Escritório Central',
   *   'Rua XV de Novembro, 1234 - Curitiba/PR'
   * );
   */
  async enviarLocalizacao(numero, latitude, longitude, nome = '', endereco = '') {
    try {
      // Valida número
      const validacaoNumero = this._validarNumero(numero);
      if (!validacaoNumero.valid) {
        return this._formatarErro(validacaoNumero.error);
      }

      // Valida coordenadas
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return this._formatarErro('Latitude e longitude devem ser números');
      }

      if (latitude < -90 || latitude > 90) {
        return this._formatarErro('Latitude deve estar entre -90 e 90');
      }

      if (longitude < -180 || longitude > 180) {
        return this._formatarErro('Longitude deve estar entre -180 e 180');
      }

      const response = await this.client.post(
        `/message/sendLocation/${this.instance}`,
        {
          number: validacaoNumero.numero,
          latitude: latitude,
          longitude: longitude,
          name: nome,
          address: endereco
        }
      );

      return this._formatarSucesso(response.data);
    } catch (error) {
      console.error('EvolutionWhatsApp.enviarLocalizacao:', error.message);
      return this._formatarErro(
        'Falha ao enviar localização',
        error.response?.data || error.message
      );
    }
  }
}

module.exports = EvolutionWhatsApp;
