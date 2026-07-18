import { GraphNode, GraphEdge, DocumentNode, ConceptNode } from '../src/types.js';

// Fictional database of documents and concepts
export const NODES: GraphNode[] = [
  // Document Nodes
  {
    id: 'doc_cotas',
    title: 'Guia de Cotas de Aprendizagem e PCD',
    type: 'document',
    filename: 'guia_cotas_aprendiz.md',
    topic: 'Cotas e Legislação',
    content: `A contratação de Jovens Aprendizes é obrigatória para empresas de médio e grande porte, correspondendo a um mínimo de 5% e máximo de 15% dos trabalhadores cujas funções demandem formação profissional (conforme Artigo 429 da CLT).
As cotas de PCD (Pessoas com Deficiência) aplicam-se a todas as empresas com 100 ou mais empregados nas seguintes proporções legais: até 200 empregados, cota de 2%; de 201 a 500 empregados, cota de 3%; de 501 a 1000 empregados, cota de 4%; acima de 1000 empregados, cota de 5%.
Regra de Negócio e Isenção de Responsabilidade da Leapy: A Leapy oferece uma calculadora automatizada de projeção de cotas baseada estritamente na folha salarial importada pelo cliente. O cálculo de vagas elegíveis é meramente informativo. A Leapy não se responsabiliza por eventuais autuações trabalhistas ou multas caso o cliente não efetive as contratações recomendadas pela plataforma. O suporte legal e assessoria para contratação ativa é opcional e tarifado à parte sob o Plano Premium.`,
    keywords: ['cota', 'aprendiz', 'jovem aprendiz', 'pcd', 'clt', 'vaga', 'calculadora', 'responsabilidade', 'multa', 'autuação', 'lei', 'contratação']
  },
  {
    id: 'doc_elegibilidade',
    title: 'Tabela de Elegibilidade de Benefícios',
    type: 'document',
    filename: 'tabela_elegibilidade.xlsx',
    topic: 'Benefícios e RH',
    content: `Os colaboradores sob regime de contratação CLT possuem direito ao plano de saúde coparticipativo (cobertura nacional premium pela operadora SulAmérica) somente após a conclusão integral do período de experiência legal de 90 dias.
Vale-refeição: concedido integralmente a todos os profissionais CLT ativos no valor fixo de R$ 38,00 por dia útil trabalhado, sem nenhum desconto em folha salarial.
Estagiários: são elegíveis exclusivamente para vale-refeição no valor de R$ 22,00 por dia útil trabalhado e seguro de vida em grupo obrigatório. Estagiários não são elegíveis a plano de saúde, plano odontológico, auxílio-creche ou convênio Gympass sob nenhuma circunstância.
Gympass (Plano de Atividade Física): disponível exclusivamente para colaboradores CLT ativos a partir do primeiro dia útil, limitado ao plano Standard subsidiado em 50% pela Leapy (os outros 50% são descontados em folha).`,
    keywords: ['elegibilidade', 'benefício', 'beneficios', 'plano de saúde', 'saude', 'sulamerica', 'experiencia', 'estagiario', 'estagio', 'vale refeição', 'refeição', 'vr', 'gympass', 'clt']
  },
  {
    id: 'doc_regional',
    title: 'Política de Operação Regional e Tributação',
    type: 'document',
    filename: 'politica_regional_v2.pdf',
    topic: 'Operação e Tributário',
    content: `Habilitação de Operação: A Leapy está plenamente homologada a operar e processar folhas de pagamento em todo o território nacional. No entanto, o suporte automatizado para Convenções Coletivas de Trabalho (CCT) e cálculos de dissídio retroativo está validado e homologado estritamente para os estados de São Paulo (SP), Rio de Janeiro (RJ), Minas Gerais (MG) e Paraná (PR).
Operação em outras regiões: Para operações em outros estados brasileiros, o reajuste salarial anual e acompanhamento sindical devem ser configurados manualmente pelo gestor do cliente através do painel "Dissídio Customizado". A Leapy não realiza o acompanhamento proativo de pautas sindicais ou atualizações automáticas fora da região Sudeste e estado do Paraná.
Tributação de Serviços: Para clientes sediados no município de São Paulo (SP), a emissão de notas fiscais de serviço (NFS-e) sofre retenção na fonte obrigatória de 2% de ISS, referente ao código de serviço de processamento de dados 01.03. Clientes localizados fora do município de SP devem recolher o ISS diretamente no município de destino, conforme as regras da legislação tributária local de sua sede.`,
    keywords: ['região', 'regional', 'tributação', 'imposto', 'iss', 'retencao', 'sao paulo', 'sp', 'rio de janeiro', 'rj', 'minas gerais', 'mg', 'parana', 'pr', 'dissidio', 'sindicato', 'cct', 'convenção coletiva']
  },
  {
    id: 'doc_plataforma',
    title: 'Manual da Plataforma Self-Service',
    type: 'document',
    filename: 'plataforma_self_service.md',
    topic: 'Plataforma e Automação',
    content: `Funcionalidades do Portal do Colaborador: O Portal do Colaborador Leapy permite ao funcionário realizar visualização de holerites digitais com assinatura eletrônica integrada, envio de atestados médicos digitalizados e solicitação de férias de forma 100% autônoma.
Regra de Solicitação de Férias: Qualquer solicitação de férias por parte do colaborador deve ser cadastrada na plataforma com antecedência mínima de 30 dias corridos em relação à data de início desejada do período de gozo.
Fluxo de Aprovação: O processo de solicitação de férias requer obrigatoriamente aprovação em dois níveis sequenciais: primeiro pelo gestor direto da área (prazo máximo de 5 dias úteis para aprovar ou rejeitar no painel) e, posteriormente, pelo administrador do RH central da empresa cliente (prazo máximo de 3 dias úteis). Caso a aprovação não ocorra dentro destes prazos regulamentares, o sistema cancela a solicitação de férias por expiração de prazo de forma automática, exigindo que o colaborador realize um novo lançamento.`,
    keywords: ['plataforma', 'self service', 'portal', 'holerite', 'atestado', 'ferias', 'prazo', 'antecedência', 'aprovação', 'gestor', 'rh', 'cancelamento']
  },
  {
    id: 'doc_efetivacao',
    title: 'Manual de Efetivação de Estagiários',
    type: 'document',
    filename: 'manual_efetivacao_estagio.md',
    topic: 'Transição e Carreira',
    content: `Processo de Efetivação: A transição de um estagiário para um contrato efetivo sob o regime CLT exige obrigatoriamente a abertura de um ticket de "Efetivação de Estágio" no painel da Leapy com uma antecedência mínima de 15 dias corridos em relação à data final de término do contrato de estágio vigente.
Documentação Obrigatória: Para validar a efetivação, o analista de CS ou gestor do cliente deve anexar no portal: o histórico completo de avaliações semestrais de desempenho (exigindo um mínimo de duas avaliações anteriores com nota média superior a 7.5) e o termo assinado de rescisão amigável do contrato de estágio atual.
Regra de Piso Salarial: O salário inicial proposto para a nova vaga efetiva CLT não pode ser inferior ao piso salarial estabelecido para a categoria profissional na respectiva convenção coletiva (CCT) cadastrada na Leapy. Se o piso da categoria for menor que o valor da bolsa-auxílio que o estagiário já recebia, deve-se manter o valor correspondente à bolsa-auxílio anterior como salário inicial CLT, respeitando o princípio constitucional de irredutibilidade salarial.`,
    keywords: ['efetivação', 'efetivar', 'estagiario', 'estagio', 'transição', 'clt', 'prazo', 'avaliação', 'desempenho', 'piso salarial', 'piso', 'salário', 'contrato']
  },
  {
    id: 'doc_integracao',
    title: 'Guia de Objeções de RH e Integração',
    type: 'document',
    filename: 'guia_integracao_rh.md',
    topic: 'Objeções de Vendas e Segurança',
    content: `Objeção 1: "A integração com nossos sistemas legados de RH e ERP (Sênior, Totvs, SAP) é complexa demais e exigirá muito esforço técnico de nosso time de TI."
Resposta Padrão de CS: A Leapy foi desenvolvida sob uma filosofia API-First. Disponibilizamos APIs abertas RESTful com documentação Swagger completa e interativa para integração em tempo real de dados cadastrais e folha. Além disso, fornecemos um gerador nativo de exportações e relatórios totalmente personalizados em formatos CSV, TXT ou XLSX, permitindo o agendamento de conciliações automáticas diárias sem custos extras de implantação.
Objeção 2: "Como a Leapy garante a segurança da folha e conformidade com a LGPD?"
Resposta Padrão de CS: Toda a comunicação e tráfego de dados na plataforma Leapy ocorrem de forma criptografada em trânsito com o protocolo TLS 1.3 e em repouso utilizando criptografia AES de 256 bits (padrão militar). Possuímos certificações de auditoria de segurança anuais e mantemos um controle rígido de acesso baseado em perfis e funções de usuários (RBAC), assegurando total conformidade jurídica com a Lei Geral de Proteção de Dados (LGPD).`,
    keywords: ['objeção', 'objeções', 'integração', 'erp', 'senior', 'totvs', 'sap', 'api', 'csv', 'segurança', 'lgpd', 'criptografia', 'dados', 'privacidade']
  },

  // Concept Nodes
  {
    id: 'cota_aprendiz',
    title: 'Cota de Jovem Aprendiz',
    type: 'concept',
    description: 'Regras de obrigatoriedade legal de 5% a 15% de contratação de jovens aprendizes conforme CLT.',
    keywords: ['aprendiz', 'jovem aprendiz', 'cota', 'clt', 'lei', 'obrigatoriedade']
  },
  {
    id: 'cota_pcd',
    title: 'Cota de PCD',
    type: 'concept',
    description: 'Cota obrigatória de contratação de pessoas com deficiência (2% a 5%) aplicável a empresas a partir de 100 funcionários.',
    keywords: ['pcd', 'deficiente', 'cota', 'lei', 'obrigatoriedade', '100']
  },
  {
    id: 'elegibilidade_clt',
    title: 'Elegibilidade CLT',
    type: 'concept',
    description: 'Políticas de elegibilidade para planos de saúde, vale refeição premium e coparticipação para contratos CLT.',
    keywords: ['clt', 'elegibilidade', 'beneficio', 'plano de saude', 'sulamerica', 'experiencia']
  },
  {
    id: 'elegibilidade_estagio',
    title: 'Elegibilidade Estágio',
    type: 'concept',
    description: 'Direitos limitados de estagiários na Leapy: exclusivo vale refeição reduzido e seguro de vida, sem direito a plano de saúde ou Gympass.',
    keywords: ['estagiario', 'estagio', 'elegibilidade', 'bolsa', 'beneficio', 'vr']
  },
  {
    id: 'operacao_sudeste',
    title: 'Homologação Regional (Sudeste e PR)',
    type: 'concept',
    description: 'Automação completa homologada de convenções coletivas e dissídios retroativos restrita a SP, RJ, MG e PR.',
    keywords: ['sp', 'rj', 'mg', 'pr', 'homologação', 'dissidio', 'sindicato', 'cct']
  },
  {
    id: 'operacao_nacional',
    title: 'Abrangência Nacional',
    type: 'concept',
    description: 'Capacidade técnica de rodar folha em todo o Brasil com reajustes manuais nas demais regiões.',
    keywords: ['nacional', 'brasil', 'territorio', 'manual', 'customizado']
  },
  {
    id: 'portal_colaborador',
    title: 'Portal do Colaborador Self-Service',
    type: 'concept',
    description: 'Interface de autoatendimento para holerites assinados, envio de atestados e férias sem gargalos de RH.',
    keywords: ['portal', 'self service', 'holerite', 'atestado', 'colaborador', 'funcionario']
  },
  {
    id: 'solicitacao_ferias',
    title: 'Fluxo de Férias',
    type: 'concept',
    description: 'Regra estrita de 30 dias de antecedência mínima e aprovação sequencial de Gestor e RH, com cancelamento automático se atrasar.',
    keywords: ['ferias', 'antecedencia', 'solicitação', 'gestor', 'rh', 'cancelamento', 'aprovação']
  },
  {
    id: 'transicao_estagio',
    title: 'Transição e Efetivação CLT',
    type: 'concept',
    description: 'Regras para efetivar estagiários: antecedência de 15 dias, notas médias de desempenho > 7.5, e irredutibilidade do salário.',
    keywords: ['efetivação', 'efetivar', 'transição', 'estagiario', 'desempenho', 'nota', 'salario']
  },
  {
    id: 'integracao_erp',
    title: 'Integração de Sistemas',
    type: 'concept',
    description: 'Solução para sistemas legados como Totvs, Sênior e SAP via API RESTful ou exportadores personalizados agendados.',
    keywords: ['integracao', 'erp', 'senior', 'totvs', 'sap', 'api', 'csv']
  },
  {
    id: 'seguranca_lgpd',
    title: 'Segurança e LGPD',
    type: 'concept',
    description: 'Criptografia robusta TLS 1.3 em trânsito e AES-256 em repouso com controle baseado em perfil (RBAC) conforme LGPD.',
    keywords: ['segurança', 'lgpd', 'criptografia', 'dados', 'privacidade', 'aes', 'tls']
  }
];

export const EDGES: GraphEdge[] = [
  // Document links to concepts
  { source: 'doc_cotas', target: 'cota_aprendiz', label: 'Define' },
  { source: 'doc_cotas', target: 'cota_pcd', label: 'Define' },
  { source: 'doc_elegibilidade', target: 'elegibilidade_clt', label: 'Define' },
  { source: 'doc_elegibilidade', target: 'elegibilidade_estagio', label: 'Define' },
  { source: 'doc_regional', target: 'operacao_sudeste', label: 'Regulamenta' },
  { source: 'doc_regional', target: 'operacao_nacional', label: 'Regulamenta' },
  { source: 'doc_plataforma', target: 'portal_colaborador', label: 'Explica' },
  { source: 'doc_plataforma', target: 'solicitacao_ferias', label: 'Explica' },
  { source: 'doc_efetivacao', target: 'transicao_estagio', label: 'Explica' },
  { source: 'doc_efetivacao', target: 'elegibilidade_estagio', label: 'Valida' },
  { source: 'doc_integracao', target: 'integracao_erp', label: 'Responde' },
  { source: 'doc_integracao', target: 'seguranca_lgpd', label: 'Responde' },

  // Concepts interacting with other concepts
  { source: 'elegibilidade_clt', target: 'solicitacao_ferias', label: 'Aplica-se a' },
  { source: 'elegibilidade_estagio', target: 'transicao_estagio', label: 'Evolui para' },
  { source: 'cota_aprendiz', target: 'transicao_estagio', label: 'Conexão CLT' },
  { source: 'operacao_sudeste', target: 'operacao_nacional', label: 'Restringe' }
];

// Graph-based search and retrieval with expansion
export function retrieveWithGraph(query: string): {
  directMatchedNodeIds: string[];
  expandedNodeIds: string[];
  documents: DocumentNode[];
  isLowRelevance: boolean;
  explanationOfExpansion: string;
} {
  const cleanQuery = query.toLowerCase();
  
  // Clean query into tokens (removing some Portuguese stop words)
  const stopWords = new Set(['de', 'do', 'da', 'o', 'a', 'os', 'as', 'em', 'um', 'uma', 'para', 'com', 'se', 'por', 'que', 'no', 'na', 'tem', 'e', 'ou', 'como']);
  const tokens = cleanQuery
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !stopWords.has(t));

  const directScores: Record<string, number> = {};

  // Score nodes based on tokens matching title, keywords, or content
  NODES.forEach(node => {
    let score = 0;
    const titleLower = node.title.toLowerCase();
    
    // Exact phrase matches
    if (cleanQuery.includes(titleLower)) {
      score += 30;
    }

    tokens.forEach(token => {
      // Check in title
      if (titleLower.includes(token)) {
        score += 10;
      }
      
      // Check in keywords
      const keywordMatches = node.keywords.filter(kw => kw.toLowerCase().includes(token));
      score += keywordMatches.length * 5;

      // Check in description or content
      if (node.type === 'document') {
        const contentLower = node.content.toLowerCase();
        if (contentLower.includes(token)) {
          // Count occurrences
          const regex = new RegExp(token, 'gi');
          const matches = contentLower.match(regex);
          score += (matches ? matches.length : 0) * 2;
        }
      } else if (node.type === 'concept') {
        const descLower = node.description.toLowerCase();
        if (descLower.includes(token)) {
          score += 4;
        }
      }
    });

    if (score > 0) {
      directScores[node.id] = score;
    }
  });

  // Sort matched nodes by score and pick top hits
  const directMatches = Object.entries(directScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score >= 3) // threshold
    .map(([id]) => id);

  // Perform Graph Expansion: get 1st-degree neighbors of directly matched nodes
  const expandedNodeIdsSet = new Set<string>();
  
  directMatches.forEach(nodeId => {
    EDGES.forEach(edge => {
      if (edge.source === nodeId && !directMatches.includes(edge.target)) {
        expandedNodeIdsSet.add(edge.target);
      } else if (edge.target === nodeId && !directMatches.includes(edge.source)) {
        expandedNodeIdsSet.add(edge.source);
      }
    });
  });

  const directMatchedNodeIds = directMatches;
  const expandedNodeIds = Array.from(expandedNodeIdsSet);

  // Gather documents to use as context
  // We retrieve documents that were directly matched, plus any documents that got pulled via expansion
  const retrievedDocIds = new Set<string>();
  
  directMatchedNodeIds.forEach(id => {
    const node = NODES.find(n => n.id === id);
    if (node && node.type === 'document') {
      retrievedDocIds.add(id);
    }
  });

  expandedNodeIds.forEach(id => {
    const node = NODES.find(n => n.id === id);
    if (node && node.type === 'document') {
      retrievedDocIds.add(id);
    }
  });

  // If no documents were retrieved directly, but we matched some concepts, let's find documents that define/explain these concepts!
  if (retrievedDocIds.size === 0) {
    directMatchedNodeIds.forEach(conceptId => {
      EDGES.forEach(edge => {
        // If edge links a document to this concept, pull that document
        if (edge.target === conceptId) {
          const docNode = NODES.find(n => n.id === edge.source && n.type === 'document');
          if (docNode) {
            retrievedDocIds.add(docNode.id);
            if (!expandedNodeIds.includes(docNode.id)) {
              expandedNodeIds.push(docNode.id);
            }
          }
        } else if (edge.source === conceptId) {
          const docNode = NODES.find(n => n.id === edge.target && n.type === 'document');
          if (docNode) {
            retrievedDocIds.add(docNode.id);
            if (!expandedNodeIds.includes(docNode.id)) {
              expandedNodeIds.push(docNode.id);
            }
          }
        }
      });
    });
  }

  const documents = NODES.filter(node => node.type === 'document' && retrievedDocIds.has(node.id)) as DocumentNode[];

  // Fallback detection: If score is extremely low or no documents match, it's low relevance
  const isLowRelevance = documents.length === 0 || directMatchedNodeIds.length === 0;

  // Build a human-readable explanation of why we expanded (for logs/auditing)
  let explanationOfExpansion = '';
  if (expandedNodeIds.length > 0) {
    explanationOfExpansion = `Consulta direta conectada aos conceitos: ${directMatchedNodeIds.map(id => NODES.find(n => n.id === id)?.title).join(', ')}. `;
    explanationOfExpansion += `Grafo expandido para incluir nós vizinhos: ${expandedNodeIds.map(id => NODES.find(n => n.id === id)?.title).join(', ')}.`;
  } else {
    explanationOfExpansion = `Consulta direta conectada aos conceitos: ${directMatchedNodeIds.map(id => NODES.find(n => n.id === id)?.title).join(', ')}. Sem expansão de nós necessária.`;
  }

  return {
    directMatchedNodeIds,
    expandedNodeIds,
    documents,
    isLowRelevance,
    explanationOfExpansion
  };
}
