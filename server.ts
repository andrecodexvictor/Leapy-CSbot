import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { NODES, EDGES, retrieveWithGraph } from './server/db.js';
import { AuditLog } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory list to store audits
const auditLogs: AuditLog[] = [];

// Initialize GoogleGenAI SDK safely as guided by gemini-api skill
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not configured or contains placeholder.");
}

// API Routes

// 1. Get entire Graph for visualizer (Obsidian-style)
app.get('/api/graph', (req, res) => {
  // Return nodes with document contents or filenames stripped out for privacy
  const clientNodes = NODES.map(node => {
    if (node.type === 'document') {
      return {
        id: node.id,
        title: node.title,
        type: node.type,
        topic: node.topic,
        keywords: node.keywords
      };
    }
    return node;
  });

  res.json({
    nodes: clientNodes,
    edges: EDGES
  });
});

// 2. Get Audit Logs for internal visibility
app.get('/api/logs', (req, res) => {
  res.json(auditLogs);
});

// 3. Clear Audit Logs
app.post('/api/logs/clear', (req, res) => {
  auditLogs.length = 0;
  res.json({ status: 'ok', message: 'Logs de auditoria limpos.' });
});

// 4. Feedback API
app.post('/api/feedback', (req, res) => {
  const { logId, feedback, comment } = req.body;
  const log = auditLogs.find(l => l.id === logId);
  if (log) {
    // Add feedback metadata to the audit log
    (log as any).feedback = feedback;
    (log as any).feedbackComment = comment;
    return res.json({ status: 'ok', message: 'Feedback registrado com sucesso no log de auditoria.' });
  }
  res.status(404).json({ error: 'Log correspondente não encontrado.' });
});

// 5. Main Chat API
app.post('/api/chat', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Parâmetro query é obrigatório e deve ser string.' });
  }

  // Use graph to retrieve documents & concepts
  const retrieval = retrieveWithGraph(query);
  const { directMatchedNodeIds, expandedNodeIds, documents, isLowRelevance } = retrieval;

  // Enriched default block data matching the required structure
  let answerData: {
    respostaObjetiva: string;
    justificativa: string;
    confianca: 'Alta' | 'Média' | 'Baixa' | 'Nenhuma';
    ressalvas?: string;
    classificacaoIntencao?: string;
    sinalizacaoRisco?: 'Baixo' | 'Médio' | 'Alto';
    proximaAcaoRecomendada?: string;
    resumoCaso?: string;
  } = {
    respostaObjetiva: 'Desculpe, não encontrei evidência ou informação suficiente nos documentos internos da Leapy para responder a esta pergunta.',
    justificativa: 'O mecanismo de busca por conceitos determinou que a consulta não possui relevância direta com a base documental ou políticas homologadas da plataforma.',
    confianca: 'Nenhuma',
    ressalvas: 'Para dúvidas comerciais personalizadas ou negociações especiais, consulte a diretoria ou abra um chamado de escalonamento.',
    classificacaoIntencao: 'Consulta Fora do Escopo',
    sinalizacaoRisco: 'Médio',
    proximaAcaoRecomendada: 'Escalar para o time de Suporte Avançado / Operações Especiais.',
    resumoCaso: 'A pergunta do analista aborda tópicos não mapeados nos playbooks operacionais da Leapy.'
  };

  let isFallback = isLowRelevance;

  // If we have retrieved documents and Gemini client is initialized, call it!
  if (ai && documents.length > 0) {
    try {
      const documentsContext = documents.map((doc, idx) => {
        return `--- DOCUMENTO ${idx + 1}: ${doc.title} ---\n${doc.content}`;
      }).join('\n\n');

      const conceptsContext = directMatchedNodeIds.map(id => {
        const node = NODES.find(n => n.id === id);
        return `- Conceito Diretamente Relacionado: ${node?.title} (${node?.type === 'concept' ? (node as any).description : ''})`;
      }).concat(expandedNodeIds.map(id => {
        const node = NODES.find(n => n.id === id);
        return `- Conceito Expandido via Grafo: ${node?.title} (${node?.type === 'concept' ? (node as any).description : ''})`;
      })).join('\n');

      const systemInstruction = `Você é o Leapy CSbot, um copiloto inteligente de inteligência operacional interna para o time de Customer Success da Leapy.
Sua missão é responder perguntas dos analistas de CS com máxima precisão, elegância, e com base estrita no contexto corporativo homologado fornecido.

Regras fundamentais de comportamento:
1. Responda apenas com base nos documentos fornecidos como contexto. Nunca invente ou extrapole.
2. Se a informação não estiver presente nos documentos, ou se os documentos forem insuficientes para responder com certeza, você deve obrigatoriamente acionar o FALLBACK:
   - Defina confianca como "Nenhuma" ou "Baixa".
   - Defina respostaObjetiva como: "Desculpe, não encontrei evidência ou informação suficiente nos documentos internos da Leapy para responder a esta pergunta."
   - Defina justificativa indicando o que falta nos documentos.
3. Classifique a INTENÇÃO com precisão (ex: "Cotas & Regulamentação Legal", "Direitos & Elegibilidade de Benefícios", "Processamento de Férias e Prazos", "Política Regional & Tributária", "Transição de Estagiário para CLT", "Gestão de Objeções de Integração / Segurança").
4. Classifique a SINALIZAÇÃO DE RISCO ("Baixo", "Médio", "Alto"). Por exemplo: perguntas sobre multas ou processos trabalhistas (como cotas), ou operações fora da área homologada (reajustes fora de SP/RJ/MG/PR) possuem risco Alto ou Médio.
5. Recomende a PRÓXIMA AÇÃO ideal para o analista executar (ex: "Acionar Suporte Premium", "Solicitar as 2 avaliações semestrais anteriores", "Enviar documentação da API Swagger", "Orientar o cliente a cadastrar dissídio manual").
6. Escreva um RESUMO DO CASO conciso (máximo 1 frase esbelta e direta).
7. Nunca mostre ou cite os nomes físicos dos arquivos (ex: '.md', '.xlsx') na respostaObjetiva ou justificativa. Refira-se a eles de forma genérica ("a tabela de elegibilidade de benefícios", "a diretriz de transição de estagiários", etc).
8. Retorne os dados estritamente no esquema JSON definido.`;

      const prompt = `PERGUNTA DO ANALISTA:
"${query}"

CONTEXTO DOS DOCUMENTOS RECUPERADOS:
${documentsContext}

CONTEXTO DO GRAFO DE CONCEITOS ASSOCIADO:
${conceptsContext}

ESTADO DE RELEVÂNCIA DO GRAFO: ${isLowRelevance ? 'BAIXA RELEVÂNCIA' : 'RELEVANTE'}

Preencha todos os campos do JSON com base estrita no contexto acima.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              respostaObjetiva: {
                type: Type.STRING,
                description: 'Resposta limpa, direta, sem jargões desnecessários ou citações de arquivos. Mantém um tom sério, profissional e de utilidade operacional.'
              },
              justificativa: {
                type: Type.STRING,
                description: 'Explicação baseada estritamente nos fatos do documento (ex: prazos, percentuais) para sustentar a decisão.'
              },
              confianca: {
                type: Type.STRING,
                description: 'Grau de confiança operacional. Valores: "Alta", "Média", "Baixa", "Nenhuma".'
              },
              ressalvas: {
                type: Type.STRING,
                description: 'Diferença sutil, limitação contratual ou aviso importante sobre a legislação.'
              },
              classificacaoIntencao: {
                type: Type.STRING,
                description: 'Intenção da pergunta.'
              },
              sinalizacaoRisco: {
                type: Type.STRING,
                description: 'Grau de risco da situação. Valores: "Baixo", "Médio", "Alto".'
              },
              proximaAcaoRecomendada: {
                type: Type.STRING,
                description: 'Passo seguinte tático que o analista de CS deve realizar.'
              },
              resumoCaso: {
                type: Type.STRING,
                description: 'Linha curta resumindo o cerne do caso do cliente.'
              }
            },
            required: ['respostaObjetiva', 'justificativa', 'confianca', 'classificacaoIntencao', 'sinalizacaoRisco', 'proximaAcaoRecomendada', 'resumoCaso']
          }
        }
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text.trim());
          answerData = {
            respostaObjetiva: parsed.respostaObjetiva || answerData.respostaObjetiva,
            justificativa: parsed.justificativa || answerData.justificativa,
            confianca: parsed.confianca || answerData.confianca,
            ressalvas: parsed.ressalvas || '',
            classificacaoIntencao: parsed.classificacaoIntencao || 'Consulta Operacional',
            sinalizacaoRisco: parsed.sinalizacaoRisco || 'Baixo',
            proximaAcaoRecomendada: parsed.proximaAcaoRecomendada || 'Consultar documentação oficial.',
            resumoCaso: parsed.resumoCaso || 'Dúvida operacional respondida com base em documentos internos.'
          };
          
          if (answerData.confianca === 'Nenhuma' || answerData.confianca === 'Baixa') {
            isFallback = true;
          }
        } catch (parseError) {
          console.error("Erro ao parsear JSON do Gemini:", parseError, "Texto bruto:", text);
        }
      }
    } catch (apiError: any) {
      console.error("Erro ao chamar API do Gemini:", apiError);
      answerData.respostaObjetiva = "Ocorreu um erro técnico ao processar a consulta via inteligência artificial.";
      answerData.justificativa = apiError?.message || "Erro desconhecido na chamada do modelo.";
      answerData.confianca = "Nenhuma";
    }
  } else {
    // Elegant local simulation engine for when ai is null or key is missing
    if (documents.length > 0) {
      const doc = documents[0];
      const title = doc.title;
      
      // Determine mocked operational intelligence dynamically based on keywords
      let intent = 'Consulta Operacional';
      let risk: 'Baixo' | 'Médio' | 'Alto' = 'Baixo';
      let nextAction = 'Prosseguir com suporte padrão.';
      let summary = `Análise do documento ${title}.`;
      let objResp = '';
      let just = '';
      let ressalvaText = 'Modo Simulação local: as informações refletem o documento original com fidelidade, mas sem recalibração dinâmica.';

      if (query.toLowerCase().includes('cota') || query.toLowerCase().includes('aprendiz') || query.toLowerCase().includes('pcd')) {
        intent = 'Cotas & Regulamentação Legal';
        risk = 'Alto';
        objResp = 'O cálculo de cotas de Jovens Aprendizes (5% a 15%) e PCD (2% a 5% a partir de 100 funcionários) na Leapy é estritamente informativo e gerado por calculadora automatizada. A Leapy não se responsabiliza por multas ou autuações.';
        just = 'A Leapy disponibiliza uma calculadora de projeção com base na folha, porém a efetivação real é responsabilidade do cliente. Suporte ativo ou assessoria legal jurídica requer a contratação opcional do Plano Premium.';
        nextAction = 'Oferecer upgrade para o Plano Premium caso o cliente demande assessoria ativa para preenchimento de cotas.';
        summary = 'Cliente busca clareza sobre obrigatoriedades legais de contratação de Aprendiz/PCD e o escopo de cobertura da Leapy.';
      } else if (query.toLowerCase().includes('estágio') || query.toLowerCase().includes('estagiário') || query.toLowerCase().includes('plano de saúde') || query.toLowerCase().includes('gympass')) {
        intent = 'Direitos & Elegibilidade de Benefícios';
        risk = 'Médio';
        objResp = 'Estagiários não possuem direito a plano de saúde, plano odontológico, auxílio-creche ou Gympass. Eles recebem exclusivamente vale-refeição de R$ 22,00 por dia trabalhado e seguro de vida em grupo obrigatório.';
        just = 'A tabela de elegibilidade reserva plano de saúde (cobertura SulAmérica) e Gympass exclusivamente para colaboradores CLT ativos (plano de saúde exige 90 dias de experiência concluídos; Gympass é liberado no primeiro dia).';
        nextAction = 'Esclarecer formalmente as limitações de benefícios de estagiários, evitando expectativas contratuais indevidas.';
        summary = 'Esclarecimento de benefícios de saúde e Gympass para estagiários vs contratados CLT.';
      } else if (query.toLowerCase().includes('bahia') || query.toLowerCase().includes('ba') || query.toLowerCase().includes('regional') || query.toLowerCase().includes('dissídio')) {
        intent = 'Política Regional & Tributária';
        risk = 'Alto';
        objResp = 'A Leapy processa folhas de pagamento em todo o território nacional, mas o suporte automatizado de convenções coletivas (CCT) e dissídios retroativos está homologado estritamente para SP, RJ, MG e PR. Para a Bahia (BA) ou outros estados, o processo é manual.';
        just = 'Nas regiões não homologadas, o reajuste salarial e acompanhamento de pautas sindicais devem ser inseridos manualmente pelo gestor do cliente pelo painel "Dissídio Customizado".';
        nextAction = 'Orientar o cliente a configurar manualmente a convenção coletiva por meio do painel de "Dissídio Customizado".';
        summary = 'Processamento de folha e suporte para sindicatos/dissídios retroativos fora da região homologada.';
      } else if (query.toLowerCase().includes('férias') || query.toLowerCase().includes('ferias') || query.toLowerCase().includes('portal')) {
        intent = 'Processamento de Férias e Prazos';
        risk = 'Médio';
        objResp = 'A solicitação de férias pelo colaborador exige 30 dias corridos de antecedência mínima. O fluxo de aprovação é sequencial: o gestor tem até 5 dias úteis para validar, e o RH central tem 3 dias úteis. Caso expire, o sistema cancela automaticamente.';
        just = 'Regra estrita de parametrização da plataforma self-service para garantir conciliação da folha sem prejuízos de prazos operacionais ou cancelamentos automáticos por inércia de fluxo.';
        nextAction = 'Alertar o analista para monitorar solicitações pendentes de aprovação pelo gestor do cliente antes da expiração de 5 dias.';
        summary = 'Prazos operacionais e fluxo sequencial de aprovação de férias no Portal do Colaborador.';
      } else if (query.toLowerCase().includes('efetivação') || query.toLowerCase().includes('efetivar') || query.toLowerCase().includes('piso')) {
        intent = 'Transição de Estagiário para CLT';
        risk = 'Médio';
        objResp = 'A efetivação de estagiário exige a abertura de ticket com 15 dias de antecedência, anexo de histórico com média > 7.5, termo de rescisão assinado e obediência ao piso da categoria ou bolsa-auxílio anterior (o que for maior).';
        just = 'A regra protege o princípio constitucional de irredutibilidade salarial caso o piso da categoria seja inferior ao valor que o estagiário já recebia como bolsa-auxílio.';
        nextAction = 'Instruir o gestor a anexar as duas avaliações semestrais anteriores com nota média superior a 7.5 no portal.';
        summary = 'Migração de estagiário para CLT com manutenção de vencimentos baseada na irredutibilidade salarial.';
      } else if (query.toLowerCase().includes('sênior') || query.toLowerCase().includes('totvs') || query.toLowerCase().includes('sap') || query.toLowerCase().includes('lgpd') || query.toLowerCase().includes('segurança')) {
        intent = 'Gestão de Objeções de Integração / Segurança';
        risk = 'Baixo';
        objResp = 'A Leapy contorna complexidades de ERPs (Totvs, Sênior, SAP) oferecendo APIs RESTful abertas com documentação Swagger e exportadores em CSV/TXT agendáveis sem custo extra. A segurança cumpre a LGPD com criptografia TLS 1.3 e AES-256.';
        just = 'A infraestrutura utiliza autenticação baseada em perfis (RBAC), criptografia militar em repouso e em trânsito para blindar dados da folha.';
        nextAction = 'Compartilhar o link de documentação Swagger com a TI do cliente e destacar a conformidade com criptografia militar AES-256.';
        summary = 'Contorno de objeções de TI referentes à integração legado de ERPs e confidencialidade sob a LGPD.';
      } else {
        objResp = `[Simulação] Respondendo baseado no documento "${doc.title}": ${doc.content.substring(0, 180)}...`;
        just = 'Recuperado com base nas palavras-chave correspondentes entre a pergunta e os metadados do documento.';
        nextAction = 'Sanar dúvida operacional conforme o playbook ou encaminhar se requerer customizações especiais.';
        summary = `Consulta tática referente ao escopo temático de ${doc.topic}.`;
      }

      answerData = {
        respostaObjetiva: objResp,
        justificativa: just,
        confianca: 'Média',
        ressalvas: ressalvaText,
        classificacaoIntencao: intent,
        sinalizacaoRisco: risk,
        proximaAcaoRecomendada: nextAction,
        resumoCaso: summary
      };
    } else {
      // Direct low relevance fallback
      isFallback = true;
    }
  }

  // Create audit log entry
  const logEntry: AuditLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    query: query,
    matchedNodes: directMatchedNodeIds,
    expandedNodes: expandedNodeIds,
    confidence: answerData.confianca,
    retrievedDocs: documents.map(d => d.filename)
  };

  // Keep enrichments in memory
  (logEntry as any).blocks = answerData;

  auditLogs.unshift(logEntry);

  // Return final response with graph highlights
  res.json({
    text: answerData.respostaObjetiva,
    blocks: answerData,
    highlightedNodes: [...directMatchedNodeIds, ...expandedNodeIds],
    isFallback: isFallback,
    logId: logEntry.id
  });
});

// Setup Knowledge Base Analytics & Stats API
app.get('/api/kb/stats', (req, res) => {
  // 1. Gather all logged gaps (queries with Low or No confidence, or those marked with 'dislike' feedback)
  const gaps = auditLogs
    .filter(log => {
      const isLowConfidence = log.confidence === 'Baixa' || log.confidence === 'Nenhuma';
      const isDisliked = (log as any).feedback === 'dislike';
      return isLowConfidence || isDisliked;
    })
    .map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      query: log.query,
      confidence: log.confidence,
      feedbackComment: (log as any).feedbackComment,
      feedback: (log as any).feedback
    }));

  // 2. Count risk occurrences of active audits
  const riskCounts = { Alto: 0, Médio: 0, Baixo: 0 };
  auditLogs.forEach(log => {
    const risk = (log as any).blocks?.sinalizacaoRisco || 'Baixo';
    if (riskCounts[risk as 'Alto' | 'Médio' | 'Baixo'] !== undefined) {
      riskCounts[risk as 'Alto' | 'Médio' | 'Baixo']++;
    }
  });

  // 3. Extract hot topics (most common words from queries)
  const wordsMap: Record<string, number> = {};
  const stopWords = new Set(['de', 'do', 'da', 'o', 'a', 'os', 'as', 'em', 'um', 'uma', 'para', 'com', 'se', 'por', 'que', 'no', 'na', 'tem', 'e', 'ou', 'como', 'qual', 'o que', 'como', 'quem', 'quanto', 'quantas', 'meu', 'cliente', 'sobre', 'como', 'para', 'onde', 'quando', 'leapy', 'csbot']);
  
  auditLogs.forEach(log => {
    const words = log.query.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
    words.forEach(w => {
      wordsMap[w] = (wordsMap[w] || 0) + 1;
    });
  });

  const hotTopics = Object.entries(wordsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));

  // 4. Feedback rating
  const totalFeedback = auditLogs.filter(log => (log as any).feedback).length;
  const likes = auditLogs.filter(log => (log as any).feedback === 'like').length;
  const dislikes = auditLogs.filter(log => (log as any).feedback === 'dislike').length;
  const ratingPercentage = totalFeedback > 0 ? Math.round((likes / totalFeedback) * 100) : 100;

  // 5. General coverage metrics
  const totalDocs = NODES.filter(n => n.type === 'document').length;
  const totalConcepts = NODES.filter(n => n.type === 'concept').length;
  const totalEdges = EDGES.length;

  // Stale articles (those with very few keywords or older content)
  const staleArticles = NODES
    .filter(n => n.type === 'document' && (n.keywords?.length || 0) < 6)
    .map(n => {
      const doc = n as any;
      return {
        id: doc.id,
        title: doc.title,
        topic: doc.topic || 'Geral',
        reason: 'Densidade reduzida de indexadores (keywords) para busca contextual.'
      };
    });

  res.json({
    totalAudits: auditLogs.length,
    gaps,
    riskCounts,
    hotTopics,
    feedback: {
      totalFeedback,
      likes,
      dislikes,
      ratingPercentage
    },
    coverage: {
      totalDocs,
      totalConcepts,
      totalEdges,
      unlinkedConcepts: Math.max(0, totalConcepts - Math.round(totalEdges / 2.5))
    },
    staleArticles
  });
});

// 6. Add/Update Knowledge Base Node (Document or Concept)
app.post('/api/kb/node', (req, res) => {
  const { id, title, type, topic, content, description, keywords } = req.body;
  if (!id || !title || !type) {
    return res.status(400).json({ error: 'Campos id, título e tipo são obrigatórios.' });
  }

  const existingIndex = NODES.findIndex(n => n.id === id);
  const updatedNode: any = {
    id,
    title,
    type,
    keywords: Array.isArray(keywords) ? keywords : (keywords ? keywords.split(',').map((k: string) => k.trim()) : [])
  };

  if (type === 'document') {
    updatedNode.topic = topic || 'Outros';
    updatedNode.content = content || '';
    updatedNode.filename = id.endsWith('.md') ? id : `${id}.md`;
  } else {
    updatedNode.description = description || '';
  }

  if (existingIndex > -1) {
    NODES[existingIndex] = { ...NODES[existingIndex], ...updatedNode };
  } else {
    NODES.push(updatedNode);
  }

  res.json({ status: 'ok', node: updatedNode, nodesCount: NODES.length });
});

// 7. Add Relation Link (Edge)
app.post('/api/kb/edge', (req, res) => {
  const { source, target, label } = req.body;
  if (!source || !target) {
    return res.status(400).json({ error: 'Campos de origem (source) e destino (target) são obrigatórios.' });
  }

  const srcNode = NODES.find(n => n.id === source);
  const tgtNode = NODES.find(n => n.id === target);
  if (!srcNode || !tgtNode) {
    return res.status(400).json({ error: 'Os nós vinculados precisam existir no grafo.' });
  }

  const existingEdge = EDGES.find(e => e.source === source && e.target === target);
  if (!existingEdge) {
    EDGES.push({ source, target, label: label || 'Vinculado' });
  } else {
    existingEdge.label = label || 'Vinculado';
  }

  res.json({ status: 'ok', edgesCount: EDGES.length });
});

// 8. Delete Node
app.delete('/api/kb/node/:id', (req, res) => {
  const { id } = req.params;
  const index = NODES.findIndex(n => n.id === id);
  if (index > -1) {
    NODES.splice(index, 1);
    // Delete associated edges
    for (let i = EDGES.length - 1; i >= 0; i--) {
      if (EDGES[i].source === id || EDGES[i].target === id) {
        EDGES.splice(i, 1);
      }
    }
    return res.json({ status: 'ok', message: 'Nó e seus vínculos foram deletados com sucesso.' });
  }
  res.status(404).json({ error: 'Nó não encontrado.' });
});

// 9. Auto-generate draft article for gap resolution using Gemini
app.post('/api/kb/autodraft', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'O parâmetro query é obrigatório.' });
  }

  if (!ai) {
    // Elegant simulation fallback
    const tempId = 'auto_' + Date.now().toString().slice(-6);
    return res.json({
      id: `doc_${tempId}`,
      title: `Procedimento Operacional: ${query.substring(0, 32)}`,
      type: 'document',
      topic: 'Plataforma e Automação',
      content: `Este documento operacional foi criado automaticamente para resolver a lacuna identificada pelo analista:\n"${query}"\n\n### Diretrizes Operacionais Sugeridas:\n1. Configuração Inicial: O analista de CS deve conferir o cadastro do cliente e orientá-lo sobre este cenário.\n2. Tratamento do Caso: Siga o manual padrão de conformidade e verifique se há impacto financeiro ou fiscal.\n3. Escalamento tático: Caso a objeção ou dúvida persista, direcione o ticket ao suporte avançado com o registro deste manual.`,
      keywords: ['resolução', 'procedimento', 'suporte', 'ajuda'],
      conceptTitle: `Objeção / Dúvida: ${query.substring(0, 20)}`,
      conceptDescription: `Conceito associado ao atendimento de ${query}`
    });
  }

  try {
    const prompt = `Você é o redator técnico de Customer Success da Leapy. Um analista relatou que nossa base de conhecimento atual tem uma lacuna e não pôde responder à seguinte dúvida ou cenário do cliente:
"${query}"

Crie um rascunho de artigo operacional excelente em português que resolva essa dúvida ou contorne a objeção. O artigo deve parecer oficial e integrado às regras de negócio da Leapy.

Você deve responder estritamente no formato JSON com as seguintes propriedades:
1. "title": Um título esbelto e profissional para o novo artigo (ex: "Manual de Tratamento de Objeções de X", "Diretrizes de Parametrização de Y").
2. "topic": A categoria de negócio adequada (escolha uma de: "Cotas e Legislação", "Benefícios e RH", "Operação e Tributário", "Plataforma e Automação", "Transição e Carreira", "Objeções de Vendas e Segurança").
3. "content": O texto completo do artigo (mínimo de 3 parágrafos explicativos, estruturados com etapas operacionais claras e justificativa de negócio).
4. "keywords": Um array de até 6 palavras-chave strings em minúsculas para indexação híbrida.
5. "conceptTitle": Um nome curto (2-4 palavras) para um novo conceito teórico do grafo que esse artigo define.
6. "conceptDescription": Uma frase esbelta explicando a finalidade desse conceito no ecossistema do RH.

Formato esperado de resposta: apenas o objeto JSON plano, sem markdown extra.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            topic: { type: Type.STRING },
            content: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            conceptTitle: { type: Type.STRING },
            conceptDescription: { type: Type.STRING }
          },
          required: ['title', 'topic', 'content', 'keywords', 'conceptTitle', 'conceptDescription']
        }
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text.trim());
      const tempId = 'auto_' + Date.now().toString().slice(-6);
      res.json({
        id: `doc_${tempId}`,
        title: parsed.title,
        type: 'document',
        topic: parsed.topic,
        content: parsed.content,
        keywords: parsed.keywords,
        conceptTitle: parsed.conceptTitle,
        conceptDescription: parsed.conceptDescription
      });
    } else {
      throw new Error("Resposta do Gemini vazia.");
    }
  } catch (err: any) {
    console.error("Erro ao auto-draftar:", err);
    res.status(500).json({ error: 'Falha ao processar o rascunho operacional via IA.' });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Leapy CSbot server running on http://localhost:${PORT}`);
  });
}

startServer();
