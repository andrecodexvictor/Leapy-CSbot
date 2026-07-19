import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { NODES, EDGES, retrieveWithGraph } from './server/db.js';
import { AuditLog } from './src/types.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

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

// Helper function to call NVIDIA NIM (compatible with OpenAI format)
async function callNvidiaNIM(prompt: string, systemInstruction: string, apiKey?: string, model?: string): Promise<string> {
  const finalKey = apiKey || process.env.NVIDIA_API_KEY;
  const modelName = model || process.env.NVIDIA_MODEL_NAME || "minimaxai/minimax-m3";
  const url = "https://integrate.api.nvidia.com/v1/chat/completions";

  console.log(`[NVIDIA NIM] Calling model ${modelName} via OpenAI-compatible endpoint...`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${finalKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1, // low temperature for structured and accurate responses
      top_p: 0.95,
      max_tokens: 4096
    })
  });

  if (!res.ok) {
    await res.text();
    throw new Error(`NVIDIA NIM API Error (${res.status})`);
  }

  const data: any = await res.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  throw new Error("Invalid response format from NVIDIA NIM API.");
}

// Helper function to call OpenAI Chat completions API
async function callOpenAI(prompt: string, systemInstruction: string, apiKey: string, model?: string): Promise<string> {
  const modelName = model || "gpt-4o-mini";
  const url = "https://api.openai.com/v1/chat/completions";

  console.log(`[OpenAI] Calling model ${modelName}...`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    })
  });

  if (!res.ok) {
    await res.text();
    throw new Error(`OpenAI API Error (${res.status})`);
  }

  const data: any = await res.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  throw new Error("Invalid response format from OpenAI API.");
}

// Helper function to call OpenRouter Chat completions API
async function callOpenRouter(prompt: string, systemInstruction: string, apiKey: string, model?: string): Promise<string> {
  const modelName = model || "google/gemini-2.5-flash";
  const url = "https://openrouter.ai/api/v1/chat/completions";

  console.log(`[OpenRouter] Calling model ${modelName}...`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/andrecodexvictor/Leapy-CSbot',
      'X-Title': 'Leapy CSbot'
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    })
  });

  if (!res.ok) {
    await res.text();
    throw new Error(`OpenRouter API Error (${res.status})`);
  }

  const data: any = await res.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  throw new Error("Invalid response format from OpenRouter API.");
}

// Helper to robustly parse JSON from LLMs that might wrap outputs in markdown code blocks
function parseRobustJSON(text: string) {
  let cleanText = text.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleanText);
}

const FALLBACK_SOURCES = ['DOC-008 §8.1', 'DOC-008 §8.2'];

const INTENT_SOURCES: Record<string, string[]> = {
  empresa_visao_geral: ['DOC-001 §1.1', 'DOC-001 §1.2'],
  cota_aprendizagem: ['DOC-002 §2.1', 'DOC-002 §2.2', 'DOC-002 §2.4'],
  elegibilidade_jovem: ['DOC-003 §3.1', 'DOC-003 §3.2', 'DOC-003 §3.3'],
  operacao_regional: ['DOC-004 §4.1', 'DOC-004 §4.4'],
  plataforma_dados: ['DOC-005 §5.1', 'DOC-005 §5.4'],
  resultado_efetivacao: ['DOC-006 §6.1', 'DOC-006 §6.2'],
  'objeção_comercial': ['DOC-011 §11.2', 'DOC-011 §11.3'],
  fora_de_escopo: FALLBACK_SOURCES
};

function documentReference(title: string): string | null {
  const match = title.match(/^(DOC-(?:SYN-)?\d{3})(?:\s+§\s*([\d.]+))?/i);
  if (!match) return null;
  return match[2] ? `${match[1].toUpperCase()} §${match[2]}` : match[1].toUpperCase();
}

const knownSources = new Set(
  NODES
    .filter(node => node.type === 'document')
    .map(node => documentReference(node.title))
    .filter((source): source is string => Boolean(source))
);

function normalizeSources(
  requestedSources: unknown,
  documents: Array<{ title: string }>,
  intent: string | undefined,
  isFallback: boolean
): string[] {
  const requested = Array.isArray(requestedSources)
    ? requestedSources.filter((source): source is string => typeof source === 'string')
    : [];
  const retrieved = documents
    .map(doc => documentReference(doc.title))
    .filter((source): source is string => Boolean(source));
  const preferred = isFallback
    ? FALLBACK_SOURCES
    : [...requested, ...(INTENT_SOURCES[intent || ''] || []), ...retrieved];

  const valid = [...new Set(preferred)].filter(source => knownSources.has(source)).slice(0, 3);
  if (valid.length > 0) return valid;

  return FALLBACK_SOURCES.filter(source => knownSources.has(source)).slice(0, 2);
}

// API Routes

// 1. Get entire Graph for visualizer (Obsidian-style)
app.get('/api/graph', (req, res) => {
  // Return complete nodes with content included for full visibility in UI
  res.json({
    nodes: NODES,
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
  const { query, provider, apiKey: clientApiKey, model: clientModel } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Parâmetro query é obrigatório e deve ser string.' });
  }

  // Use graph to retrieve documents & concepts
  const retrieval = retrieveWithGraph(query);
  const { directMatchedNodeIds, expandedNodeIds, documents, isLowRelevance } = retrieval;

  // Enriched default block data matching the required structure
  let answerData: {
    respostaObjetiva: string;
    fontes: string[];
    justificativa: string;
    confianca: 'Alta' | 'Média' | 'Baixa' | 'Nenhuma';
    ressalvas?: string;
    classificacaoIntencao?: string;
    sinalizacaoRisco?: 'Baixo' | 'Médio' | 'Alto';
    proximaAcaoRecomendada?: string;
    resumoCaso?: string;
  } = {
    respostaObjetiva: 'Desculpe, não encontrei evidência ou informação suficiente nos documentos internos da Leapy para responder a esta pergunta.',
    fontes: FALLBACK_SOURCES,
    justificativa: 'O mecanismo de busca por conceitos determinou que a consulta não possui relevância direta com a base documental ou políticas disponíveis no protótipo.',
    confianca: 'Nenhuma',
    ressalvas: 'Para dúvidas comerciais personalizadas ou negociações especiais, consulte a diretoria ou abra um chamado de escalonamento.',
    classificacaoIntencao: 'fora_de_escopo',
    sinalizacaoRisco: 'Médio',
    proximaAcaoRecomendada: 'Escalar para o time de Suporte Avançado / Operações Especiais.',
    resumoCaso: 'A pergunta do analista aborda tópicos não mapeados nos playbooks operacionais da Leapy.'
  };

  let isFallback = isLowRelevance;
  let usedProvider = "Simulação Local";

  const activeProvider = provider || "simulation";
  const activeKey = clientApiKey || (activeProvider === "nvidia" ? process.env.NVIDIA_API_KEY : (activeProvider === "gemini" ? process.env.GEMINI_API_KEY : (activeProvider === "openai" ? process.env.OPENAI_API_KEY : (activeProvider === "openrouter" ? process.env.OPENROUTER_API_KEY : ""))));
  const activeModel = clientModel || (activeProvider === "nvidia" ? "minimaxai/minimax-m3" : (activeProvider === "gemini" ? "gemini-3.5-flash" : (activeProvider === "openai" ? "gpt-4o-mini" : (activeProvider === "openrouter" ? "google/gemini-2.5-flash" : ""))));

  const canUseAI = activeProvider !== "simulation" && (activeKey || (activeProvider === "gemini" && ai !== null));

  // If we have retrieved documents and LLM client is initialized, call it!
  if (canUseAI && documents.length > 0) {
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
Sua missão é responder perguntas dos analistas de CS com máxima precisão, elegância e base estrita no contexto de demonstração fornecido.

Regras fundamentais de comportamento (conforme DOC-007, DOC-008, DOC-013 e DOC-014):
1. Responda apenas com base nos documentos fornecidos como contexto. Nunca invente ou extrapole.
2. Classifique a INTENÇÃO com precisão usando exatamente uma das seguintes categorias do DOC-012:
   - "empresa_visao_geral" (sobre o que a Leapy faz e onboarding)
   - "cota_aprendizagem" (sobre cotas de aprendizes e PCD, limites e obrigações)
   - "elegibilidade_jovem" (idade, escolaridade e jornada de aprendizes)
   - "operacao_regional" (sobre abrangência nacional, CCTs regionais e tributação)
   - "plataforma_dados" (portal, solicitação de férias e fluxos)
   - "resultado_efetivacao" (dados de efetivação de 48% e ref. institucional)
   - "objeção_comercial" (objeções de RH e integração legada ERP/LGPD)
   - "fora_de_escopo" (temas sem base, precificação, prazos contratuais, SLAs)
3. CITAÇÃO OBRIGATÓRIA (DOC-007, DOC-013): Sempre inclua uma lista de fontes usadas (de 1 a 3 trechos) em um campo separado de fontes, formatadas exatamente como "DOC-XXX §Y.Y" (ex: DOC-001 §1.1).
4. JUSTIFICATIVA CURTA (DOC-007, DOC-013): Explique em no máximo 2 frases o que as fontes citadas afirmam e por que elas sustentam ou não a resposta.
5. SINAL DE CONFIANÇA (DOC-014): Defina o grau de confiança:
   - "Alta": pergunta claramente coberta pela base, sem ambiguidade, fontes convergentes.
   - "Média": depende de um trecho principal e outro complementar, ou leve ambiguidade.
   - "Baixa" ou "Nenhuma": base cobre parcialmente, há conflito ou a pergunta é de fora de escopo.
6. MENSAGEM PADRÃO DE FALLBACK (DOC-008): Se a intenção for "fora_de_escopo", ou a confiança for "Baixa" ou "Nenhuma", ou se faltar base documental de apoio, você deve obrigatoriamente:
   - Definir respostaObjetiva exatamente como: "Não encontrei base suficiente nos documentos disponíveis para responder com segurança. Posso indicar o que a base cobre e quais pontos exigem confirmação com o time responsável."
   - Indicar na justificativa o que falta nos documentos.
7. SINALIZAÇÃO DE RISCO: Classifique o grau de risco em "Baixo", "Médio" ou "Alto". Perguntas sobre processos trabalhistas (cotas), multas ou operações cuja cobertura regional não esteja confirmada possuem risco Alto ou Médio.
8. RECOMENDE A PRÓXIMA AÇÃO: Indique o passo tático correto para o analista (ex: "Acionar Suporte Premium", "Solicitar avaliações semestrais anteriores", "Enviar documentação da API Swagger", "Orientar o cliente a cadastrar dissídio manual").
9. Nunca cite os nomes físicos dos arquivos (ex: '.md', '.xlsx') na respostaObjetiva ou justificativa. Refira-se a eles de forma genérica ("a tabela de elegibilidade de benefícios", "a diretriz de transição de estagiários", etc).
10. Retorne os dados estritamente no esquema JSON definido.`;

      const prompt = `PERGUNTA DO ANALISTA:
"${query}"

CONTEXTO DOS DOCUMENTOS RECUPERADOS:
${documentsContext}

CONTEXTO DO GRAFO DE CONCEITOS ASSOCIADO:
${conceptsContext}

ESTADO DE RELEVÂNCIA DO GRAFO: ${isLowRelevance ? 'BAIXA RELEVÂNCIA' : 'RELEVANTE'}

Preencha todos os campos do JSON com base estrita no contexto acima.`;

      let text = "";

      console.log(`\n=== 🧠 INICIANDO ANÁLISE DE CASO CS ===`);
      console.log(`[PROVEDOR RESOLVIDO] ${activeProvider.toUpperCase()}`);
      console.log(`[MODELO ENVIADO] ${activeModel}`);

      if (activeProvider === "nvidia") {
        console.log(`[NVIDIA NIM] Chamando API do console build.nvidia...`);
        text = await callNvidiaNIM(prompt, systemInstruction, activeKey, activeModel);
        usedProvider = `NVIDIA NIM (${activeModel})`;
      } else if (activeProvider === "openai") {
        if (!activeKey) throw new Error("Chave de API OpenAI ausente.");
        console.log(`[OpenAI] Chamando API oficial do gpt-4o-mini...`);
        text = await callOpenAI(prompt, systemInstruction, activeKey, activeModel);
        usedProvider = `OpenAI (${activeModel})`;
      } else if (activeProvider === "openrouter") {
        if (!activeKey) throw new Error("Chave de API OpenRouter ausente.");
        console.log(`[OpenRouter] Chamando API com modelos gratuitos...`);
        text = await callOpenRouter(prompt, systemInstruction, activeKey, activeModel);
        usedProvider = `OpenRouter (${activeModel})`;
      } else if (activeProvider === "gemini") {
        const geminiClient = clientApiKey ? new GoogleGenAI({ apiKey: clientApiKey }) : ai;
        if (!geminiClient) throw new Error("Cliente Gemini não inicializado.");
        console.log(`[Gemini] Chamando API do Google AI Studio...`);
        const response = await geminiClient.models.generateContent({
          model: activeModel || 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                respostaObjetiva: { type: Type.STRING },
                fontes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                justificativa: { type: Type.STRING },
                confianca: { type: Type.STRING },
                ressalvas: { type: Type.STRING },
                classificacaoIntencao: { type: Type.STRING },
                sinalizacaoRisco: { type: Type.STRING },
                proximaAcaoRecomendada: { type: Type.STRING },
                resumoCaso: { type: Type.STRING }
              },
              required: ['respostaObjetiva', 'fontes', 'justificativa', 'confianca', 'classificacaoIntencao', 'sinalizacaoRisco', 'proximaAcaoRecomendada', 'resumoCaso']
            }
          }
        });
        text = response.text || "";
        usedProvider = `Gemini (${activeModel})`;
      }

      if (text) {
        try {
          const parsed = parseRobustJSON(text);
          answerData = {
            respostaObjetiva: parsed.respostaObjetiva || answerData.respostaObjetiva,
            fontes: Array.isArray(parsed.fontes) ? parsed.fontes : [],
            justificativa: parsed.justificativa || answerData.justificativa,
            confianca: parsed.confianca || answerData.confianca,
            ressalvas: parsed.ressalvas || '',
            classificacaoIntencao: parsed.classificacaoIntencao || 'Consulta Operacional',
            sinalizacaoRisco: parsed.sinalizacaoRisco || 'Baixo',
            proximaAcaoRecomendada: parsed.proximaAcaoRecomendada || 'Consultar a base disponível e validar com o time responsável.',
            resumoCaso: parsed.resumoCaso || 'Dúvida operacional respondida com base em documentos internos.'
          };
          
          if (answerData.confianca === 'Nenhuma' || answerData.confianca === 'Baixa') {
            isFallback = true;
          }
          console.log(`[IA ANÁLISE COMPLETA] Sucesso via Provedor: ${usedProvider}`);
          console.log(`[CONFIDENCE] ${answerData.confianca} | [INTENT] ${answerData.classificacaoIntencao}`);
        } catch {
          console.error(`[IA] Resposta inválida recebida do provedor ${activeProvider}.`);
        }
      }
    } catch {
      console.error(`[IA] Falha ao chamar o provedor ${activeProvider}.`);
      answerData.respostaObjetiva = "Ocorreu um erro técnico ao processar a consulta via inteligência artificial.";
      answerData.justificativa = "O provedor externo não concluiu a solicitação. Nenhuma credencial ou detalhe da resposta foi registrado.";
      answerData.confianca = "Nenhuma";
    }
  } else {
    // Elegant local simulation engine for when ai is null or key is missing
    if (documents.length > 0) {
      const doc = documents[0];
      const title = doc.title;
      
      let intent = 'empresa_visao_geral';
      let risk: 'Baixo' | 'Médio' | 'Alto' = 'Baixo';
      let nextAction = 'Prosseguir com suporte padrão.';
      let summary = `Análise do documento ${title}.`;
      let objResp = '';
      let just = '';
      let confidence: 'Alta' | 'Média' | 'Baixa' | 'Nenhuma' = 'Alta';
      let ressalvaText = 'Modo Simulação local: as informações refletem o documento original com fidelidade, mas sem recalibração dinâmica.';

      const lowerQuery = query.toLowerCase();

      const hasTerm = (...terms: string[]) => terms.some(term => lowerQuery.includes(term));

      // Check for Out of Scope / Fallback triggers first
      if (hasTerm('preço', 'preco', 'sla', 'certificação', 'certificacao', 'iso 27001', 'integrar com', 'integração com', 'integracao com', 'zerar a cota em 15 dias')) {
        intent = 'fora_de_escopo';
        risk = 'Médio';
        confidence = 'Nenhuma';
        objResp = 'Não encontrei base suficiente nos documentos disponíveis para responder com segurança. Posso indicar o que a base cobre e quais pontos exigem confirmação com o time responsável.';
        just = 'A pergunta solicita dados comerciais sensíveis, prazos contratuais não listados ou integrações complexas ausentes da base de conhecimento.';
        nextAction = 'Escalar a dúvida para o time de Operações Avançadas ou Vendas.';
        summary = 'Consulta classificada como fora de escopo por tratar de SLA/pricing/integrações específicas.';
      } else if (hasTerm('idade', 'faixa etária', 'faixa etaria', 'escolaridade', 'jornada', 'horas por dia', 'estágio', 'estagio', 'estagiário', 'estagiario')) {
        intent = 'elegibilidade_jovem';
        risk = 'Médio';
        objResp = 'A base de demonstração cobre faixa etária, escolaridade e jornada do jovem aprendiz. A regra documentada indica idade entre 14 e 24 anos incompletos, sem limite máximo para PCD, e exige validação do caso concreto pelo time responsável.';
        just = 'As diretrizes de elegibilidade descrevem idade, vínculo escolar e limites de jornada. Benefícios ou condições específicas de estágio não devem ser inferidos a partir dessas regras.';
        nextAction = 'Confirmar idade, escolaridade e modalidade do contrato antes de orientar o cliente.';
        summary = 'Consulta sobre critérios documentados de elegibilidade do jovem aprendiz.';
      } else if (hasTerm('cota', 'pcd', 'cbo', 'percentual obrigatório', 'percentual obrigatorio')) {
        intent = 'cota_aprendizagem';
        risk = 'Alto';
        objResp = 'A obrigatoriedade de contratação começa a partir de 7 empregados em funções elegíveis, e o cálculo de cotas de Jovens Aprendizes (5% a 15%) e PCD (2% a 5% a partir de 100 funcionários) na Leapy é estritamente informativo. A Leapy não se responsabiliza por multas.';
        just = 'O cálculo fornecido no painel é baseado estritamente na folha do cliente e serve como orientação operacional. A validação final e jurídica é de responsabilidade do cliente.';
        nextAction = 'Orientar o cliente a cruzar CBOs com regras oficiais e sugerir upgrade para o Plano Premium se precisarem de assessoria legal ativa.';
        summary = 'Dúvida do cliente sobre limites de cotas Aprendiz/PCD e escopo de responsabilidade da calculadora.';
      } else if (hasTerm('bahia', 'regional', 'dissídio', 'dissidio', 'cct', 'cobertura nacional')) {
        intent = 'operacao_regional';
        risk = 'Alto';
        objResp = 'A base de demonstração descreve atendimento nacional com restrições regionais que precisam ser validadas antes de qualquer compromisso de cobertura, turma ou prazo.';
        just = 'As diretrizes regionais proíbem assumir disponibilidade uniforme em todas as localidades. A condição real depende de confirmação operacional e contratual.';
        nextAction = 'Registrar cidade, modalidade e demanda e solicitar validação do time de Operações.';
        summary = 'Consulta de demonstração sobre cobertura e dependências regionais.';
      } else if (hasTerm('férias', 'ferias', 'portal', 'plataforma', 'painel', 'dados')) {
        intent = 'plataforma_dados';
        risk = 'Médio';
        objResp = 'A base apresenta a plataforma como apoio à centralização e ao acompanhamento de informações. Fluxos, módulos e prazos específicos precisam ser confirmados para a operação e o contrato do cliente.';
        just = 'A proposta documentada é apoiar a gestão com dados sem substituir as decisões do RH. O protótipo não comprova disponibilidade comercial de uma funcionalidade específica.';
        nextAction = 'Confirmar o fluxo desejado e validar a configuração disponível com Produto ou Implantação.';
        summary = 'Consulta sobre uso da plataforma e validação de funcionalidades.';
      } else if (hasTerm('efetivação', 'efetivacao', 'efetivar', '48%', 'resultado')) {
        intent = 'resultado_efetivacao';
        risk = 'Médio';
        objResp = 'A base cita uma taxa histórica institucional de 48% de efetivação, mas esse indicador não é garantia, meta contratual nem previsão para uma empresa, turma ou jovem.';
        just = 'O dado serve apenas como referência institucional. A efetivação real depende de vagas, orçamento e desempenho individual.';
        nextAction = 'Apresentar o número com contexto e evitar qualquer promessa de resultado futuro.';
        summary = 'Consulta sobre o uso responsável do indicador institucional de efetivação.';
      } else if (hasTerm('não quero mais um sistema', 'nao quero mais um sistema', 'objeção', 'objecao', 'dá trabalho', 'da trabalho')) {
        intent = 'objeção_comercial';
        risk = 'Baixo';
        objResp = 'Diante da objeção a uma nova plataforma, a orientação é mapear quais controles seriam substituídos e qual decisão ficaria mais simples, sem prometer integração, economia ou automação ainda não validadas.';
        just = 'O playbook recomenda demonstrar centralização e redução de trabalho manual somente no escopo confirmado. Condições técnicas e comerciais exigem validação dos times responsáveis.';
        nextAction = 'Fazer discovery do processo atual e encaminhar dependências técnicas ou comerciais para validação.';
        summary = 'Tratamento consultivo de objeção sem converter hipótese de demonstração em promessa.';
      } else {
        objResp = `[Simulação] Respondendo baseado no documento "${doc.title}": ${doc.content.substring(0, 180)}...`;
        just = 'Recuperado com base nas palavras-chave correspondentes entre a pergunta e os metadados do documento.';
        nextAction = 'Sanar dúvida operacional conforme o playbook ou encaminhar se requerer customizações especiais.';
        summary = `Consulta tática referente ao escopo temático de ${doc.topic}.`;
      }

      answerData = {
        respostaObjetiva: objResp,
        fontes: INTENT_SOURCES[intent] || [],
        justificativa: just,
        confianca: confidence,
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

  isFallback = isFallback
    || answerData.classificacaoIntencao === 'fora_de_escopo'
    || answerData.confianca === 'Baixa'
    || answerData.confianca === 'Nenhuma';
  answerData.fontes = normalizeSources(
    answerData.fontes,
    documents,
    answerData.classificacaoIntencao,
    isFallback
  );

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
    logId: logEntry.id,
    provider: usedProvider
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

Crie um rascunho de demonstração em português que resolva essa dúvida ou contorne a objeção. O texto deve ser claramente apresentado como proposta sujeita a curadoria e não pode parecer política oficial, promessa ou condição comercial da Leapy.

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
