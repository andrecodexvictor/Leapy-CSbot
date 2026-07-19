import { GraphNode, GraphEdge, DocumentNode, ConceptNode } from '../src/types.js';

// Enriched database of documents and concepts (compiled from excel and markdown docs)
export const NODES: GraphNode[] = [
  {
    "id": "chk_001",
    "title": "DOC-001 §1.1 — Resumo",
    "type": "document",
    "filename": "doc-001_1_1.md",
    "topic": "visao-geral",
    "content": "A Leapy é uma plataforma pioneira que apoia empresas na gestão completa do programa de jovens aprendizes de ponta a ponta. Ela combina a formação teórica obrigatória (através da escola técnica certificada Leapy GO) com uma infraestrutura de software SaaS para automação operacional (assinaturas de contratos, relatórios de desenvolvimento, controle de ponto e integração com ERPs de folha de pagamento). O objetivo da Leapy é eliminar a carga burocrática das empresas, permitindo que a cota legal de aprendizagem seja utilizada de forma estratégica como um celeiro de novos talentos de alta performance.",
    "keywords": [
      "visao-geral",
      "resumo",
      "institucional"
    ],
    "audience": "cs-interno",
    "source_type": "institucional",
    "updated_at": "2026-07-10"
  },
  {
    "id": "chk_002",
    "title": "DOC-001 §1.2 — O que a Leapy entrega",
    "type": "document",
    "filename": "doc-001_1_2.md",
    "topic": "visao-geral",
    "content": "A operação da Leapy está estruturada em quatro frentes principais: 1) Estruturação e Acompanhamento: triagem socioeconômica, recrutamento dinâmico e integração rápida do jovem à cultura do cliente. 2) Formação Teórica Obrigatória: aulas ministradas pela escola técnica oficial Leapy GO nas áreas de tecnologia (análise de dados, Excel avançado, programação e IA) e soft skills. 3) Plataforma SaaS centralizada: painel para acompanhamento de notas de aula, relatórios de frequência e conformidade jurídica. 4) Atendimento Nacional com Atenção Local: gerentes locais que prestam suporte onsite, realizam auditorias periódicas e apoiam o alinhamento com sindicatos regionais.",
    "keywords": [
      "visao-geral",
      "leapy",
      "overview",
      "entrega"
    ],
    "audience": "empresa",
    "source_type": "overview",
    "updated_at": "2026-07-10"
  },
  {
    "id": "chk_003",
    "title": "DOC-001 §1.4 — O que não prometer",
    "type": "document",
    "filename": "doc-001_1_4.md",
    "topic": "guardrail",
    "content": "Como política rígida de guardrails corporativos, o time de Customer Success está expressamente proibido de: 1) Prometer contratação ou preenchimento de cotas imediato em qualquer localidade (já que depende da disponibilidade de candidatos regionais homologados). 2) Garantir efetivação futura de aprendizes (visto que a decisão é exclusiva do RH e da política interna do cliente). 3) Validação jurídica própria do cliente, cabendo ao DP dele auditar as CBOs locais. 4) Disponibilidade irrestrita de turmas de formação da Leapy GO fora dos eixos de atendimento homologados.",
    "keywords": [
      "guardrail",
      "policy",
      "prometer"
    ],
    "audience": "cs-interno",
    "source_type": "policy",
    "updated_at": "2026-07-10"
  },
  {
    "id": "chk_004",
    "title": "DOC-002 §2.1 — Obrigatoriedade",
    "type": "document",
    "filename": "doc-002_2_1.md",
    "topic": "cota",
    "content": "Segundo o Artigo 429 da CLT e a Lei da Aprendizagem nº 10.097/2000, a contratação de jovens aprendizes é obrigatória para estabelecimentos de qualquer natureza que possuam pelo menos 7 empregados contratados in funções que exijam formação profissional. Funções administrativas, operacionais e técnicas de nível médio entram na base de cálculo. O não cumprimento da cota sujeita a empresa a multas pesadas aplicadas pela fiscalização do trabalho, além de potenciais ações civis públicas do Ministério Público do Trabalho (MPT).",
    "keywords": [
      "faq",
      "obrigatoriedade",
      "cota"
    ],
    "audience": "empresa",
    "source_type": "faq",
    "updated_at": "2026-07-09"
  },
  {
    "id": "chk_005",
    "title": "DOC-002 §2.2 — Cálculo da cota",
    "type": "document",
    "filename": "doc-002_2_2.md",
    "topic": "cota",
    "content": "O cálculo da cota obrigatória baseia-se na aplicação do percentual mínimo de 5% e máximo de 15% sobre o total de empregados de cada estabelecimento cujas funções demandem formação profissional, conforme a Classificação Brasileira de Ocupações (CBO). Devem ser excluídos da base de cálculo apenas os cargos de gerência, confiança, colaboradores temporários e funções que exijam nível técnico ou superior completo. A calculadora disponível na plataforma Leapy serve unicamente para simulação operacional baseada nos dados enviados pelo próprio cliente, não constituindo parecer legal.",
    "keywords": [
      "faq",
      "cota",
      "cálculo"
    ],
    "audience": "empresa",
    "source_type": "faq",
    "updated_at": "2026-07-09"
  },
  {
    "id": "chk_006",
    "title": "DOC-002 §2.4 — Validação jurídica",
    "type": "document",
    "filename": "doc-002_2_4.md",
    "topic": "cota",
    "content": "A Leapy fornece orientações gerais e simulações matemáticas sobre a composição de cotas no painel do cliente. Contudo, a validação final da situação legal e da interpretação aplicável das regras oficiais de cota é de inteira responsabilidade do DP e do time jurídico do cliente. Os analistas de CS da Leapy devem recomendar que qualquer alteração de CBO ou base de cálculo simulada no painel seja previamente validada pelas assessorias legais internas do cliente antes de ser enviada ao e-Social ou reportada ao MTE.",
    "keywords": [
      "guardrail",
      "validação",
      "cota",
      "jurídica"
    ],
    "audience": "empresa",
    "source_type": "guardrail",
    "updated_at": "2026-07-09"
  },
  {
    "id": "chk_007",
    "title": "DOC-003 §3.1 — Faixa etária",
    "type": "document",
    "filename": "doc-003_3_1.md",
    "topic": "elegibilidade",
    "content": "Nas diretrizes oficiais de elegibilidade, os jovens aprendizes contratados sob o amparo da Lei 10.097/2000 devem ter entre 14 e 24 anos incompletos no momento da contratação. A idade máxima de 24 anos não se aplica a candidatos com deficiência (PCD), que podem ser contratados em qualquer faixa etária. O contrato de aprendizagem possui duração máxima de 24 meses, devendo ser rescindido no término do prazo ou quando o jovem completar 24 anos (exceto para PCD).",
    "keywords": [
      "faq",
      "faixa",
      "elegibilidade",
      "etária"
    ],
    "audience": "jovem",
    "source_type": "faq",
    "updated_at": "2026-07-08"
  },
  {
    "id": "chk_008",
    "title": "DOC-003 §3.2 — Escolaridade",
    "type": "document",
    "filename": "doc-003_3_2.md",
    "topic": "elegibilidade",
    "content": "Para ingressar no programa de jovem aprendiz da Leapy, o candidato deve comprovar que está matriculado e frequentando regularmente o Ensino Fundamental ou Ensino Médio, ou que já concluiu a educação básica (Ensino Médio completo). A empresa contratante tem o dever de acompanhar a frequência escolar do jovem e exigir os boletins periódicos, visto que o abandono escolar ou faltas reiteradas sem justificativa na escola regular constituem motivo legal para rescisão do contrato de aprendizagem.",
    "keywords": [
      "faq",
      "elegibilidade",
      "escolaridade"
    ],
    "audience": "jovem",
    "source_type": "faq",
    "updated_at": "2026-07-08"
  },
  {
    "id": "chk_009",
    "title": "DOC-003 §3.3 — Jornada",
    "type": "document",
    "filename": "doc-003_3_3.md",
    "topic": "elegibilidade",
    "content": "A jornada de trabalho do jovem aprendiz é rigidamente controlada por lei. Ela é limitada a no máximo 6 horas diárias para aqueles que ainda não concluíram o Ensino Fundamental (neste limite computando-se tanto as horas de atividades práticas na empresa quanto as aulas teóricas da entidade formadora). Para os jovens que já concluíram o Ensino Médio, a jornada diária pode ser de até 8 horas, contanto que haja atividades teóricas no programa de formação correspondente. São proibidas a realização de horas extras, compensações de jornada ou trabalho noturno (22h às 5h).",
    "keywords": [
      "faq",
      "jornada",
      "elegibilidade"
    ],
    "audience": "jovem",
    "source_type": "faq",
    "updated_at": "2026-07-08"
  },
  {
    "id": "chk_010",
    "title": "DOC-004 §4.1 — Estrutura operacional",
    "type": "document",
    "filename": "doc-004_4_1.md",
    "topic": "operacao",
    "content": "A estrutura de atendimento e operação da Leapy baseia-se em um modelo híbrido. Mantemos uma central de coordenação em São Paulo (responsável pelas diretrizes pedagógicas da Leapy GO, suporte técnico da plataforma SaaS e parametrizações de negócio) e gerentes regionais distribuídos em estados estratégicos. Isso nos permite gerenciar filiais de clientes em todo o território nacional, oferecendo proximidade física para auditorias locais, acompanhamento presencial de aprendizes e interlocução com sindicatos regionais.",
    "keywords": [
      "estrutura",
      "playbook",
      "operacional",
      "operacao"
    ],
    "audience": "empresa",
    "source_type": "playbook",
    "updated_at": "2026-07-11"
  },
  {
    "id": "chk_011",
    "title": "DOC-004 §4.2 — Entidades formadoras",
    "type": "document",
    "filename": "doc-004_4_2.md",
    "topic": "operacao",
    "content": "A formação teórica do programa de jovens aprendizes deve ser realizada obrigatoriamente por entidades formadoras homologadas no CNAP (Cadastro Nacional de Aprendizagem Profissional). A Leapy utiliza a escola oficial Leapy GO para ministrar os cursos teóricos nas regiões em que possui homologação e turmas ativas. Nas localidades onde não há infraestrutura pedagógica própria da Leapy GO, realizamos parcerias com o Sistema S (Senai, Senac) ou ONGs locais parceiras.",
    "keywords": [
      "entidades",
      "operacao",
      "playbook",
      "formadoras"
    ],
    "audience": "empresa",
    "source_type": "playbook",
    "updated_at": "2026-07-11"
  },
  {
    "id": "chk_012",
    "title": "DOC-004 §4.4 — Restrições regionais",
    "type": "document",
    "filename": "doc-004_4_4.md",
    "topic": "operacao",
    "content": "Embora a plataforma SaaS da Leapy possua alcance nacional, a oferta de cursos teóricos da Leapy GO e a disponibilidade de entidades parceiras locais dependem estritamente da demanda e do cadastro municipal em cada localidade. O time de Customer Success não deve garantir a abertura de turmas presenciais imediatas para estabelecimentos do cliente situados fora dos eixos de atendimento homologados antes de confirmar a disponibilidade de vagas e homologações na região correspondente.",
    "keywords": [
      "regionais",
      "guardrail",
      "restrições",
      "operacao"
    ],
    "audience": "empresa",
    "source_type": "guardrail",
    "updated_at": "2026-07-11"
  },
  {
    "id": "chk_013",
    "title": "DOC-005 §5.1 — Proposta da plataforma",
    "type": "document",
    "filename": "doc-005_5_1.md",
    "topic": "plataforma",
    "content": "A plataforma SaaS da Leapy centraliza todas as informações do programa e indicadores de desenvolvimento dos jovens para apoiar o RH na tomada de decisão. O painel inclui controle de ponto eletrônico (frequência prática), registro de notas escolares e frequência teórica, alertas de risco de desligamento, assinaturas de contratos digitais e exportadores para o e-Social. O gestor tem visibilidade total do andamento de cada aprendiz em tempo real, eliminando o uso de planilhas paralelas.",
    "keywords": [
      "plataforma",
      "proposta",
      "produto"
    ],
    "audience": "empresa",
    "source_type": "produto",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_014",
    "title": "DOC-005 §5.4 — RH não substituído",
    "type": "document",
    "filename": "doc-005_5_4.md",
    "topic": "plataforma",
    "content": "A plataforma da Leapy apoia a gestão e traz visibilidade de indicadores, mas ela não substitui a atuação do departamento de Recursos Humanos do cliente. A tomada de decisões operacionais (como rescisões contratuais por justa causa, promoções de efetivação, ajustes locais de benefícios e sanções disciplinares) continua exigindo a atuação conjunta do RH da empresa e a coordenação pedagógica da Leapy.",
    "keywords": [
      "plataforma",
      "substituído",
      "produto"
    ],
    "audience": "empresa",
    "source_type": "produto",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_015",
    "title": "DOC-006 §6.1 — Indicador institucional",
    "type": "document",
    "filename": "doc-006_6_1.md",
    "topic": "resultado",
    "content": "A comunicação institucional pública da Leapy informa que historicamente 48% dos jovens formados pelo programa são efetivados ao fim do contrato pelas empresas contratantes. Esse índice é apresentado como três vezes maior do que a média nacional de efetivação de aprendizes, que gira em torno de 15%. Esse excelente indicador é resultado direto do nosso modelo educacional focado em capacitação técnica voltada para a economia digital (programação, dados e soft skills).",
    "keywords": [
      "indicador",
      "argumentacao",
      "institucional",
      "resultado"
    ],
    "audience": "empresa",
    "source_type": "argumentacao",
    "updated_at": "2026-07-07"
  },
  {
    "id": "chk_016",
    "title": "DOC-006 §6.2 — Como usar o dado",
    "type": "document",
    "filename": "doc-006_6_2.md",
    "topic": "resultado",
    "content": "O time de Customer Success pode utilizar a taxa de efetivação de 48% como argumento de impacto do programa, mas deve expressamente evitar tratá-la como uma garantia contratual de resultado futuro para novas turmas de um cliente específico. A efetivação real depende da disponibilidade de vagas CLT no cliente, do orçamento anual aprovado por eles e do desempenho individual do jovem durante o contrato.",
    "keywords": [
      "dado",
      "resultado",
      "guardrail",
      "usar",
      "como"
    ],
    "audience": "cs-interno",
    "source_type": "guardrail",
    "updated_at": "2026-07-07"
  },
  {
    "id": "chk_017",
    "title": "DOC-007 §7.2 — Regras de comportamento",
    "type": "document",
    "filename": "doc-007_7_2.md",
    "topic": "policy",
    "content": "O assistente de inteligência operacional Leapy CSbot opera sob regras estritas de conduta e explicabilidade corporativa. Suas respostas devem ser formuladas exclusivamente com base nos fragmentos de documentos ativos no grafo de conceitos da Leapy. É terminantemente proibido inventar dados estatísticos, criar prazos de reembolso ou isenções regulatórias não homologadas, devendo o bot assumir a ausência de informações na base e ativar o fallback.",
    "keywords": [
      "comportamento",
      "regras",
      "policy"
    ],
    "audience": "cs-interno",
    "source_type": "policy",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_018",
    "title": "DOC-007 §7.3 — Estrutura padrão",
    "type": "document",
    "filename": "doc-007_7_3.md",
    "topic": "policy",
    "content": "A estrutura padrão de entrega das respostas pelo copiloto Leapy CSbot deve respeitar obrigatoriamente os seguintes blocos de informação em formato JSON estruturado: 1) Resposta Objetiva (tonalidade profissional e direta). 2) Fontes Usadas (lista contendo doc_id e section_id dos fragmentos acessados). 3) Justificativa Curta (resumo de até 2 frases ligando as fontes à resposta). 4) Sinal de Confiança (Alta, Média, Baixa ou Nenhuma).",
    "keywords": [
      "estrutura",
      "padrão",
      "policy"
    ],
    "audience": "cs-interno",
    "source_type": "policy",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_019",
    "title": "DOC-008 §8.1 — Quando usar fallback",
    "type": "document",
    "filename": "doc-008_8_1.md",
    "topic": "fallback",
    "content": "O copiloto Leapy CSbot deve ativar o mecanismo de Fallback Seguro sempre que a dúvida do usuário solicitar informações que não constam nos playbooks operacionais da empresa, tais como: precificação de pacotes e reajustes de planos comerciais, termos específicos de SLAs de contratos de parceria, integração técnica com sistemas legados ou ERPs de TI não documentados, e interpretações jurídicas e trabalhistas conclusivas.",
    "keywords": [
      "guardrail",
      "usar",
      "fallback",
      "quando"
    ],
    "audience": "cs-interno",
    "source_type": "guardrail",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_020",
    "title": "DOC-008 §8.2 — Mensagem padrão de fallback",
    "type": "document",
    "filename": "doc-008_8_2.md",
    "topic": "fallback",
    "content": "Ao acionar o Fallback Seguro devido à falta de escopo ou confiança baixa nas informações documentais, o assistente deve responder com a seguinte mensagem padrão: \\'Não encontrei base suficiente nos documentos disponíveis para responder com segurança. Posso indicar o que a base cobre e quais pontos exigem confirmação com o time responsável.\\' A justificativa do log deve descrever qual informação específica está em falta na base.",
    "keywords": [
      "guardrail",
      "padrão",
      "fallback",
      "mensagem"
    ],
    "audience": "cs-interno",
    "source_type": "guardrail",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_021",
    "title": "DOC-009 §9.1 — Perguntas de empresas",
    "type": "document",
    "filename": "doc-009_9_1.md",
    "topic": "avaliacao",
    "content": "O dataset de avaliação (Evaluation Set) serve para auditar o comportamento da inteligência artificial frente a consultas comuns do time de Customer Success. Ele contém perguntas reais e fictícias sobre gestão, regras operacionais e restrições sindicais. As respostas geradas no protótipo devem ser auditadas manualmente no painel de auditoria, comparando-as com as respostas esperadas listadas na planilha de QA.",
    "keywords": [
      "dataset",
      "avaliacao",
      "empresas",
      "perguntas"
    ],
    "audience": "cs-interno",
    "source_type": "dataset",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_022",
    "title": "DOC-010 §10.1 — Campos por documento",
    "type": "document",
    "filename": "doc-010_10_1.md",
    "topic": "indexacao",
    "content": "A estrutura lógica de indexação de cada fragmento documental (chunk) inserido na base de conhecimento da Leapy deve conter os seguintes campos de metadados obrigatórios: doc_id (ID do documento pai), section_id (número da seção ou parágrafo), title (título amigável da seção), audience (público receptor), topic (tópico de negócio), source_type (tipo de fonte) e updated_at (data de última revisão).",
    "keywords": [
      "campos",
      "indexacao",
      "documento",
      "tecnico"
    ],
    "audience": "tecnico",
    "source_type": "tecnico",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_023",
    "title": "DOC-011 §11.2 — Não quero mais um sistema",
    "type": "document",
    "filename": "doc-011_11_2.md",
    "topic": "objecoes",
    "content": "Para rebater a objeção do cliente \\'Não quero mais um sistema para gerenciar\\', o CS deve argumentar que a plataforma Leapy não foi desenhada para adicionar burocracia, mas sim para simplificar e unificar processos. Ela substitui a troca caótica de e-mails, o uso de planilhas offline e o monitoramento manual de ponto por um único painel automatizado, economizando em média 12 horas semanais de trabalho do DP do cliente.",
    "keywords": [
      "sistema",
      "objecoes",
      "quero",
      "mais",
      "playbook"
    ],
    "audience": "empresa",
    "source_type": "playbook",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_024",
    "title": "DOC-011 §11.3 — Aprendiz dá trabalho",
    "type": "document",
    "filename": "doc-011_11_3.md",
    "topic": "objecoes",
    "content": "Frente à objeção \\'Jovem aprendiz dá muito trabalho e não traz retorno\\', o analista deve explicar que a Leapy remove todo o esforço operacional de seleção e gestão de ponto, entregando um jovem treinado em habilidades altamente produtivas (dados e tecnologia). Isso transforma a obrigação da cota em um canal estratégico de captação de talentos de alta conversão, resultando em uma taxa de efetivação de 48%.",
    "keywords": [
      "objecoes",
      "trabalho",
      "playbook",
      "aprendiz"
    ],
    "audience": "empresa",
    "source_type": "playbook",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_025",
    "title": "DOC-012 §12.1 — Categorias principais",
    "type": "document",
    "filename": "doc-012_12_1.md",
    "topic": "classificacao",
    "content": "As categorias de intenção de negócio para classificação estruturada no Leapy CSbot são divididas em 8 classes nativas: empresa_visao_geral (sobre a Leapy e onboarding), cota_aprendizagem (cotas e regras legais de contratação), elegibilidade_jovem (idade, jornada e escolaridade do aprendiz), operacao_regional (cobertura nacional e acordos locais), plataforma_dados (uso do SaaS e prazos de férias), resultado_efetivacao (taxas de 48% e retenção), objecao_comercial (argumentação de vendas e integrações de TI) e fora_de_escopo (SLA, precificação ou dados contratuais privados).",
    "keywords": [
      "categorias",
      "principais",
      "tecnico-funcional",
      "classificacao"
    ],
    "audience": "tecnico",
    "source_type": "tecnico-funcional",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_026",
    "title": "DOC-013 §13.2 — Regra de fonte",
    "type": "document",
    "filename": "doc-013_13_2.md",
    "topic": "citacao",
    "content": "O assistente Leapy CSbot deve associar e listar sempre de 1 a 3 fontes documentais para sustentar a resposta objetiva. Essas referências devem ser indicadas nos metadados e apresentadas na interface de forma estruturada e clicável, utilizando o formato oficial \\'DOC-XXX §Y.Y\\'. Caso a consulta utilize mais trechos, devem ser selecionados os de maior relevância semântica.",
    "keywords": [
      "policy",
      "regra",
      "citacao",
      "fonte"
    ],
    "audience": "cs-interno",
    "source_type": "policy",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_027",
    "title": "DOC-013 §13.3 — Regra de justificativa",
    "type": "document",
    "filename": "doc-013_13_3.md",
    "topic": "citacao",
    "content": "Toda justificativa do assistente deve conter no máximo duas frases objetivas em português. Ela deve ligar de forma concisa o que as fontes citadas afirmam e por que aquela informação responde, limita ou nega a pergunta feita pelo analista de Customer Success, mantendo total clareza lógica para o auditor interno.",
    "keywords": [
      "regra",
      "citacao",
      "policy",
      "justificativa"
    ],
    "audience": "cs-interno",
    "source_type": "policy",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_028",
    "title": "DOC-014 §14.1 — Alta confiança",
    "type": "document",
    "filename": "doc-014_14_1.md",
    "topic": "confianca",
    "content": "A classificação de \\'Alta Confiança\\' deve ser atribuída pelo assistente somente quando o cenário da pergunta estiver inteiramente coberto pela base documental indexada, com fontes convergentes e sem ambiguidade operacional. Exemplos incluem perguntas diretas sobre idade do aprendiz, jornada de 6 horas ou e-mail corporativo da Leapy.",
    "keywords": [
      "confiança",
      "alta",
      "policy",
      "confianca"
    ],
    "audience": "cs-interno",
    "source_type": "policy",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_029",
    "title": "DOC-014 §14.2 — Média confiança",
    "type": "document",
    "filename": "doc-014_14_2.md",
    "topic": "confianca",
    "content": "A classificação de \\'Média Confiança\\' aplica-se a cenários onde a resposta exige cruzamento de um trecho principal com um complementar, ou quando há pequenas nuances operacionais a serem consideradas, como a obrigatoriedade de acompanhamento de frequência escolar ou a aplicação de dissídios em estados que exigem reajuste manual.",
    "keywords": [
      "confiança",
      "média",
      "policy",
      "confianca"
    ],
    "audience": "cs-interno",
    "source_type": "policy",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_030",
    "title": "DOC-014 §14.4 — Fallback preferível",
    "type": "document",
    "filename": "doc-014_14_4.md",
    "topic": "confianca",
    "content": "Caso haja qualquer conflito de informações nos playbooks ou as fontes recuperadas tragam escopo ambíguo que tenda a diminuir a confiança da resposta abaixo do nível médio, o copiloto Leapy CSbot deve recusar a resposta e acionar preventivamente o Fallback Seguro, instruindo o analista a registrar o gap para curadoria.",
    "keywords": [
      "confianca",
      "fallback",
      "guardrail",
      "preferível"
    ],
    "audience": "cs-interno",
    "source_type": "guardrail",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_031",
    "title": "DOC-015 §15.1 — Critérios de QA",
    "type": "document",
    "filename": "doc-015_15_1.md",
    "topic": "qa",
    "content": "A rubrica de qualidade da auditoria de respostas baseia-se em cinco critérios de avaliação: 1) Correção Factual: aderência estrita aos documentos. 2) Rastreabilidade: citação correta das fontes. 3) Clareza: justificativa curta de até duas frases. 4) Adequação do Fallback: recusa correta em fora de escopo. 5) Utilidade: valor tático da recomendação.",
    "keywords": [
      "critérios",
      "qa"
    ],
    "audience": "cs-interno",
    "source_type": "qa",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_032",
    "title": "DOC-016 §16.1 — Conversa demo visão geral",
    "type": "document",
    "filename": "doc-016_16_1.md",
    "topic": "demo",
    "content": "Na conversação simulada de demonstração sobre a atuação da Leapy, o usuário pergunta se a empresa realiza apenas o curso teórico ou também faz a gestão. O assistente deve responder com alta confiança que a Leapy faz a gestão de ponta a ponta (recrutamento, contratos, frequência) e provê a formação teórica obrigatória via Leapy GO.",
    "keywords": [
      "conversa",
      "demo",
      "visão",
      "geral"
    ],
    "audience": "cs-interno",
    "source_type": "demo",
    "updated_at": "2026-07-12"
  },
  {
    "id": "chk_033",
    "title": "DOC-016 §16.4 — Conversa demo fallback",
    "type": "document",
    "filename": "doc-016_16_4.md",
    "topic": "demo",
    "content": "Na conversação de demonstração para testar o fallback, o analista pergunta qual é o prazo contratual de atendimento (SLA) para a empresa. Como essa informação é comercial e privada, o assistente deve acionar o Fallback Seguro, respondendo que não encontrou informações na base e sugerindo a abertura de ticket com Vendas.",
    "keywords": [
      "conversa",
      "demo",
      "fallback"
    ],
    "audience": "cs-interno",
    "source_type": "demo",
    "updated_at": "2026-07-12"
  },
  {
    "id": "doc_stack",
    "title": "DOC-017 §1.0 — Tecnologia e Stack do Leapy CSbot",
    "type": "document",
    "filename": "dotstack_recommendations.md",
    "topic": "Infraestrutura e Stack",
    "content": "# Technology Stack (.stack) - Leapy CSbot  This document defines the official technology stack and configuration boundaries for **Leapy CSbot**, as compiled by the `dotstack` engine.  ## 🚀 System Stack Overview  | Category | Technology | Rationale | | :--- | :--- | :--- | | **Language** | TypeScript | Strong typing across frontend and backend for robust interfaces. | | **Frontend** | React 19 + Vite | Fast, single-page application with modern state management. | | **Backend** | Express + tsx | Minimalist, fast API layer for local server execution. | | **Styling** | Tailwind CSS v4 | Utility-first, high-performance styling using the `@tailwindcss/vite` plugin. | | **Icons** | Lucide React | Modern, clean vector icon suite. | | **Animations**| Motion | Smooth transition physics for glassmorphic elements. | | **AI Layer** | `@google/genai` (Gemini 3.5 Flash) | Ultra-fast structured JSON generation for cognitive response synthesis. | | **Database** | In-Memory Graph Engine (`server/db.ts`) | Simple, zero-dependency graph search and RAG context retrieval. |  ## 🛠️ Configuration Boundaries  1. **Vite + React 19:** Hot Module Replacement (HMR) is run locally via `npm run dev` at `http://localhost:5173`. 2. **Express Server:** Proxies `/api/*` endpoints and handles LLM generation using the standard Google GenAI SDK. 3. **No External DB Dependency:** The current V1 prototype uses a fully featured in-memory database in `server/db.ts` to ensure instant local execution. ",
    "keywords": [
      "stack",
      "tecnologia",
      "react",
      "express",
      "gemini",
      "typescript",
      "vite"
    ],
    "audience": "cs-interno",
    "source_type": "tecnico",
    "updated_at": "2026-07-19"
  },
  {
    "id": "doc_architecture",
    "title": "DOC-018 §1.0 — Arquitetura e Componentes do Leapy CSbot",
    "type": "document",
    "filename": "dotarchitecture_decisions.md",
    "topic": "Infraestrutura e Stack",
    "content": "# 🏛️ Architecture Decisions (.architecture) - Leapy CSbot  Este documento define os padrões arquiteturais e decisões de design de componentes para o **Leapy CSbot**.  ## 🗺️ Visão de Componentes (Layered Monolith)  A aplicação é dividida em três camadas lógicas dentro do mesmo ecossistema local:  1. **Camada de Apresentação (React 19 + Vite):**    * Interface de chat rica com selos de status dinâmicos.    * Visualização de Grafo interativo utilizando SVG/D3 para representação de conexões lógicas.    * Dashboard estatístico para monitoramento de gaps operacionais e auditoria.  2. **Camada de Orquestração & API (Express Server):**    * `/api/chat`: Realiza busca híbrida no grafo local e orquestra a geração de resposta via provedores de IA (NVIDIA NIM / Gemini / OpenAI / OpenRouter).    * `/api/graph`: Retorna a estrutura atualizada de nós e arestas.    * `/api/feedback`: Registra dislikes e likes de analistas diretamente no log.  3. **Camada de Conhecimento & RAG (Graph-RAG Engine):**    * Grafo de Conceitos e Documentos indexado em memória (`server/db.ts`).    * Algoritmo de busca por similaridade de palavras-chave associado a expansão BFS (Breadth-First Search) para recuperar nós conectados até 1º grau de profundidade.  ## 🔗 Decisões de Design (ADRs)  * **ADR-001 (Motor de Busca):** Uso de Grafo em Memória com busca léxica híbrida e expansão via BFS. Justificativa: Garante zero dependências externas para execução local do protótipo com alta explicabilidade. * **ADR-002 (Multi-Provedor Híbrido):** Suporte a NVIDIA NIM com fallback dinâmico para Gemini. Chaves de API podem ser injetadas localmente pelo navegador para acessibilidade total de recrutadores. * **ADR-003 (Robustez de Ingestão):** Sanitização estrita de saídas LLM via regex (`parseRobustJSON`) para impedir quebra de parsers. ",
    "keywords": [
      "arquitetura",
      "design",
      "monolith",
      "layered",
      "grafo",
      "rag",
      "api"
    ],
    "audience": "cs-interno",
    "source_type": "tecnico",
    "updated_at": "2026-07-19"
  },
  {
    "id": "doc_context",
    "title": "DOC-019 §1.0 — Contexto e Negócio do Leapy CSbot",
    "type": "document",
    "filename": "dotcontext_goals.md",
    "topic": "Infraestrutura e Stack",
    "content": "# 🎯 Context & Governance (.context) - Leapy CSbot  Este documento define as regras de governança de tom, personas e comportamento de Inteligência Artificial para o **Leapy CSbot**.  ## 👥 Personas Homologadas  1. **Ana — A Analista de CS Pleno (Usuária Principal):**    * **Objetivo:** Responder com velocidade e 100% de segurança a clientes sobre contratação de aprendizes, CCTs regionalizadas e benefícios.    * **Necessidade:** Acesso a respostas com citações literais das fontes legais para evitar passivos trabalhistas.  2. **Carlos — O Diretor de Operações e DP (Auditor Interno):**    * **Objetivo:** Monitorar a acurácia das respostas emitidas pela IA e certificar que as regras de alto risco estão em total conformidade.  3. **Mariana — A Curadora de Base de Conhecimento (Editora de Playbooks):**    * **Objetivo:** Identificar lacunas de conhecimento (*knowledge gaps*) sinalizadas pelos analistas para redigir e homologar novos artigos.  ## ✍️ Tom, Voz e Diretrizes de Escrita  * **Tom:** Sério, profissional, focado na utilidade operacional e livre de \"jargões de marketing\" ou floreios. * **Voz:** Terceira pessoa, corporativa e consultiva. * **Diretriz Crucial:** Nunca citar o nome físico de arquivos internos na resposta (ex: `.md`, `.xlsx`). Referir-se aos manuais de forma conceitual (ex: \"a tabela de benefícios de estágio\", \"o manual de transição\").  ## 🛡️ Políticas de Fallback Seguro Caso a pergunta trate de: 1. Precificação de planos comerciais ou renegociações especiais. 2. Prazos contratuais de parcerias corporativas ou SLAs. 3. Integração sob demanda com sistemas ERP não homologados.  A resposta objetiva deve obrigatoriamente acionar o Fallback Seguro (confiança \\'Baixa\\' ou \\'Nenhuma\\'), sinalizando o escalonamento ao setor responsável. ",
    "keywords": [
      "contexto",
      "produto",
      "persona",
      "regra",
      "comportamento",
      "fallback"
    ],
    "audience": "cs-interno",
    "source_type": "tecnico",
    "updated_at": "2026-07-19"
  },
  {
    "id": "doc_customer_success",
    "title": "DOC-020 §1.0 — Guia de Customer Success da Leapy",
    "type": "document",
    "filename": "CUSTOMER_SUCCESS_LEAPY.md",
    "topic": "Processo e Negócio",
    "content": "# 📈 Guia Operacional de Customer Success (CS) na Leapy  Este guia estabelece os fundamentos teóricos de Customer Success (CS), as particularidades operacionais da Leapy, as necessidades do time de atendimento e a caracterização dos nossos clientes e público-alvo. Ele serve como referencial teórico e prático para o treinamento de analistas e para a calibragem do **Leapy CSbot**.  ---  ## 1. O que é Customer Success (CS) e qual o seu papel?  Customer Success (CS) ou **Sucesso do Cliente** é uma estratégia de negócios proativa cujo objetivo principal é garantir que os clientes alcancem os resultados desejados (*Desired Outcomes*) ao utilizar o produto ou serviço da empresa.   Diferente do Suporte Tradicional (que é reativo e resolve problemas técnicos pontuais), o time de CS atua na: *   **Adoção (Adoption):** Garantir que o cliente utilize o máximo valor das funcionalidades da plataforma. *   **Retenção (Retention):** Minimizar cancelamentos (*churn*) e manter a previsibilidade de receita. *   **Expansão (Expansion):** Identificar oportunidades de aumento de plano (*upsell*) ou venda de novos produtos (*cross-sell*). *   **Evangelização (Advocacy):** Transformar clientes satisfeitos em promotores ativos da marca.  ---  ## 2. O Escopo de CS na Leapy: Desafios e Especificidades  A Leapy não é apenas um software de recursos humanos; é uma plataforma que une tecnologia e educação para transformar a contratação de jovens aprendizes de uma obrigação legal em uma **vantagem competitiva de recrutamento**.  Portanto, o analista de CS na Leapy atua na interseção de três grandes pilares: 1.  **Tecnologia (SaaS):** Gestão do portal, integração com ERPs (TOTVS, Senior, SAP) e folhas de pagamento, relatórios de performance e envio automático de eventos ao e-Social. 2.  **Educação (EdTech):** Acompanhamento do desempenho acadêmico, notas e faltas dos jovens formados pela **Leapy GO** (escola técnica oficial da Leapy) ou por outras entidades parceiras. 3.  **Legislação Trabalhista (Compliance):** Navegação estrita pela **Lei do Aprendiz** (cálculo de cotas entre 5% e 15%, verificação de CBOs elegíveis, idades entre 14 e 24 anos, contratos de 24 meses).  ---  ## 3. Quem são os Clientes e o Público-Alvo da Leapy?  ### A. Clientes (Empresas Contratantes) São organizações de médio e grande porte sujeitas à obrigatoriedade da cota de jovens aprendizes (estabelecimentos com 7 ou mais colaboradores em funções elegíveis). *   **Segmentos Principais:** Empresas de tecnologia, e-commerce, finanças, manufatura avançada e serviços. *   **Interlocutores da Leapy:**     *   **Analistas e Gestores de RH/DP:** Operacionalizam o cadastro, conferem a folha, calculam cotas e acompanham as avaliações.     *   **Líderes de TI:** Responsáveis por integrar as APIs de dados com os ERPs de pagamento da empresa.     *   **Diretores e C-Levels:** Focados em métricas macro, redução de multas de fiscalização do trabalho e aumento da taxa de efetivação de aprendizes para oxigenação de talentos.  ### B. Público-Alvo (Os Jovens Aprendizes) Jovens de 14 a 24 anos em busca de inserção no mercado profissional. Eles utilizam a plataforma para fazer as aulas teóricas da Leapy GO, bater ponto prático, acompanhar boletins e tirar dúvidas com a **@FeLeapy** (agente virtual de suporte ao estudante).  ---  ## 4. Necessidades Cruciais do Time de CS da Leapy  Para garantir a retenção de grandes clientes, o time de CS da Leapy precisa responder rapidamente a dúvidas complexas sobre: *   **Cálculo e Simulação de Cotas:** Saber orientar o cliente sobre quais funcionários entram na base de cálculo (CBOs elegíveis) e as isenções legais. *   **Diferenças de Benefícios:** Esclarecer conflitos clássicos, como a restrição de plano de saúde corporativo ou Gympass para estagiários vs. a elegibilidade padrão de jovens aprendizes. *   **Abrangência e Dissídios:** Tratar reajustes sindicais e dissídios retroativos de acordos coletivos (CCTs), que variam imensamente por estado. A Leapy automatiza esses fluxos no Sudeste/PR, mas exige parametrização manual em outros locais (ex: Bahia). *   **Segurança e LGPD:** Responder a objeções de segurança de dados de TI (criptografia de ponta a ponta AES-256 e APIs abertas Swagger).  ---  ## 5. Como o Leapy CSbot Apoia o Analista de CS no Dia a Dia  O **Leapy CSbot** funciona como um \"copiloto de decisão assistida\" de segunda linha. Ele ajuda a resolver o principal gargalo do CS: 1.  **Redução do Tempo de Resposta:** O analista não precisa pesquisar manuais em PDF; o robô recupera o trecho exato instantaneamente. 2.  **Prevenção de Passivos:** Como o bot cita a fonte exata (ex: `DOC-003 §3.1`), o analista de CS tem a segurança jurídica de que a resposta está homologada. 3.  **Segurança Comercial (Fallback de Preço/Integração):** Bloqueia respostas improvisadas do CS sobre descontos comerciais ou integrações de TI personalizadas, direcionando esses tickets para escalonamento estruturado. 4.  **Feedback Loop de Conhecimento:** Permite que o CS registre perguntas que a base de dados ainda não cobre, gerando rascunhos automatizados para a curadoria. ",
    "keywords": [
      "customer success",
      "sucesso do cliente",
      "onboarding",
      "retencao",
      "clientes",
      "publico",
      "leapy go"
    ],
    "audience": "cs-interno",
    "source_type": "negocio",
    "updated_at": "2026-07-19"
  },
  {
    "id": "doc_syn_001",
    "title": "DOC-SYN-001 — Visão de produto e resultados do cliente",
    "type": "document",
    "filename": "synthetic/01-visao-produto-e-outcomes.md",
    "topic": "Processo e Negócio",
    "content": "# DOC-SYN-001 — Visão de produto e resultados do cliente\n\n> **DEMONSTRAÇÃO / FICTÍCIO.** Documento para simular o onboarding de analistas de Customer Success. As práticas e métricas operacionais abaixo não representam contrato, SLA ou garantia da Leapy.\n\n**Público:** CS, implantação, vendas e liderança de RH  \n**Tópico:** visão do negócio e outcomes  \n**Tipo de fonte:** sintética, com referências públicas separadas  \n**Revisão fictícia:** 2026-07-19\n\n## 1. Fatos públicos verificados\n\nSegundo as páginas públicas consultadas em 2026-07-19:\n\n- a Leapy apoia empresas na contratação, no desenvolvimento e no acompanhamento de jovens aprendizes;\n- a plataforma centraliza informações e indicadores para apoiar a gestão e a tomada de decisão;\n- a formação obrigatória pode ocorrer com a Leapy GO ou com entidades formadoras homologadas parceiras, conforme a região;\n- a empresa posiciona o programa de aprendizagem como uma oportunidade estratégica de formação de talentos;\n- a Leapy publica uma taxa histórica institucional de 48% de efetivação dos jovens formados, descrita como três vezes a média nacional. Isso não equivale a garantia para uma conta, turma ou jovem específico.\n\nFontes: https://www.leapy.com.br/ e https://www.leapy.com.br/sobre-leapy\n\n## 2. Mapa de valor — cenário fictício\n\nPara a demonstração do CSbot, o cliente fictício **Grupo Horizonte** possui 18 unidades e deseja reduzir esforço administrativo sem perder qualidade de desenvolvimento.\n\n| Necessidade do cliente | Resultado desejado fictício | Evidência a acompanhar na demo |\n|---|---|---|\n| Organizar a operação distribuída | Uma visão consolidada do programa | Percentual de cadastros completos e unidades ativas |\n| Engajar líderes | Acompanhamento frequente dos jovens | Percentual de avaliações de liderança concluídas |\n| Detectar risco cedo | Intervir antes de abandono ou baixo desempenho | Jovens com alerta e plano de ação registrado |\n| Demonstrar valor ao RH | Conectar desenvolvimento a decisões de talento | Evolução de competências e pipeline de efetivação |\n| Reduzir fragmentação | Menos controles paralelos | Fontes de dados desativadas após validação |\n\n## 3. Outcome statement — cenário fictício\n\n> Até o fim do primeiro ciclo de acompanhamento, o Grupo Horizonte quer ter dados mínimos confiáveis de todas as unidades, líderes responsáveis por cada jovem e uma cadência mensal de ação sobre riscos, para decidir com mais antecedência onde desenvolver e efetivar talentos.\n\nO CS usa esse statement para orientar a implantação. Ele não deve prometer percentual de efetivação, economia financeira ou conformidade automática.\n\n## 4. Perguntas de discovery — cenário fictício\n\n1. Qual decisão o RH hoje não consegue tomar por falta de dados?\n2. Quem responde pelo programa no corporativo e em cada unidade?\n3. Onde ficam cadastros, frequência, avaliações e datas contratuais hoje?\n4. Quais grupos exigem acompanhamento prioritário?\n5. Como a liderança identifica um jovem pronto para novos desafios?\n6. O que precisa estar verdadeiro em 30 e 90 dias para o projeto ser percebido como bem-sucedido?\n\n## 5. Narrativa recomendada — cenário fictício\n\n**Mensagem curta:** “Vamos organizar pessoas, dados e cadências do programa para que o RH saia do acompanhamento reativo e consiga agir com antecedência.”\n\n**Mensagem executiva:** “A Leapy combina desenvolvimento e visibilidade operacional. Na demo, o objetivo não é apenas colocar dados em uma tela; é criar um ciclo no qual informação gera decisão, ação e aprendizagem.”\n\n## 6. Guardrails\n\n- Não afirmar que a Leapy substitui o RH, o jurídico ou a entidade formadora.\n- Não tratar 48% como meta contratual ou previsão para um cliente.\n- Não prometer cobertura regional antes de validar a malha disponível.\n- Não inventar módulos, integrações, relatórios ou automações como se estivessem disponíveis comercialmente.\n- Se a pergunta pedir condição real de produto ou contrato, marcar a resposta como “requer validação interna”.",
    "keywords": [
      "visao",
      "produto",
      "outcomes",
      "valor",
      "discovery",
      "demonstracao",
      "ficticio",
      "customer success"
    ],
    "audience": "cs-interno",
    "source_type": "demonstracao-ficticia",
    "updated_at": "2026-07-19"
  },
  {
    "id": "doc_syn_002",
    "title": "DOC-SYN-002 — Onboarding e implantação",
    "type": "document",
    "filename": "synthetic/02-onboarding-implantacao.md",
    "topic": "Onboarding e Implantação",
    "content": "# DOC-SYN-002 — Onboarding e implantação\n\n> **DEMONSTRAÇÃO / FICTÍCIO.** Plano criado exclusivamente para simulação. Prazos, reuniões, responsáveis e critérios de aceite não são SLAs reais da Leapy.\n\n**Público:** CS, implantação e administrador do cliente  \n**Tópico:** onboarding  \n**Tipo de fonte:** sintética  \n**Revisão fictícia:** 2026-07-19\n\n## 1. Contexto público verificado\n\nA Leapy afirma publicamente apoiar a gestão do Programa de Jovens Aprendizes de ponta a ponta e oferecer acompanhamento centralizado por dados. As páginas públicas não detalham um cronograma padrão de implantação.\n\nFontes: https://www.leapy.com.br/ e https://www.leapy.com.br/dados-para-visibilidade\n\n## 2. Objetivo do onboarding — cenário fictício\n\nConfigurar a conta de demonstração **Grupo Horizonte**, validar os dados mínimos de jovens e líderes e habilitar uma rotina de acompanhamento que o RH consiga operar sem apoio contínuo do time de implantação.\n\n## 3. Plano de 30 dias — cenário fictício\n\n| Fase | Janela fictícia | Atividades | Critério de saída |\n|---|---:|---|---|\n| Descoberta | D0–D3 | Kickoff, outcomes, stakeholders, regiões e riscos | Escopo da demo aceito pelo sponsor |\n| Preparação | D4–D8 | Template de dados, perfis de acesso e regras de qualidade | Arquivo de teste sem erros críticos |\n| Configuração | D9–D15 | Carga de dados, grupos, responsáveis e alertas de demonstração | Amostra validada pelo admin |\n| Piloto | D16–D23 | Treinamento de RH e líderes, coleta de feedback | Fluxos críticos concluídos em teste |\n| Entrada assistida | D24–D30 | Carga final fictícia e rotina de acompanhamento | Checklist de prontidão aprovado |\n\n## 4. Dados mínimos — cenário fictício\n\n- identificador interno do jovem;\n- nome social ou nome de preferência;\n- unidade, cidade e responsável direto;\n- data inicial e final do contrato;\n- entidade formadora associada;\n- trilha ou grupo de formação;\n- status do cadastro e do acompanhamento;\n- e-mail corporativo dos usuários administradores.\n\nNão usar CPF, dados de saúde, laudos, informações familiares ou outros dados sensíveis em demonstrações. Preferir dados integralmente inventados.\n\n## 5. RACI — cenário fictício\n\n| Entrega | Sponsor RH | Admin cliente | CS Leapy | Implantação fictícia | TI/Privacidade |\n|---|---|---|---|---|---|\n| Outcomes e priorização | A | C | R | C | I |\n| Preparação de dados | I | R | C | A | C |\n| Perfis de acesso | I | R | C | C | A |\n| Treinamento | I | C | A/R | R | I |\n| Aceite do piloto | A | R | C | C | I |\n\nLegenda: **R** executa, **A** aprova, **C** consulta, **I** informado.\n\n## 6. Checklist de prontidão — cenário fictício\n\n- [ ] Sponsor e administrador nomeados.\n- [ ] Outcome statement aprovado.\n- [ ] Dados fictícios validados e sem informações pessoais reais.\n- [ ] Perfis com menor privilégio necessário.\n- [ ] Unidade piloto e grupo de usuários definidos.\n- [ ] Fluxos de cadastro, consulta e alerta testados.\n- [ ] Canal de suporte de demonstração informado.\n- [ ] Backlog de gaps registrado com owner e prioridade.\n\n## 7. Comunicação de kickoff — cenário fictício\n\n**Assunto:** Início do piloto Leapy — Grupo Horizonte\n\n> Nosso objetivo neste piloto é validar a centralização das informações e a rotina de acompanhamento do programa. Nesta semana confirmaremos responsáveis, dados mínimos e critérios de sucesso. Os prazos e fluxos são exclusivos da demonstração e não representam condições contratuais.\n\n## 8. Guardrails\n\n- Não iniciar carga com dados reais sem base legal, acordo e validação de privacidade.\n- Não definir cobertura regional ou entidade formadora apenas pelo endereço do cliente.\n- Não assumir que “arquivo enviado” significa “dado confiável”; validar campos, duplicidade e datas.\n- Escopo, cronograma e aceite reais dependem de contrato e confirmação dos times responsáveis.",
    "keywords": [
      "onboarding",
      "implantacao",
      "marcos",
      "aceite",
      "kickoff",
      "demonstracao",
      "ficticio",
      "customer success"
    ],
    "audience": "cs-interno",
    "source_type": "demonstracao-ficticia",
    "updated_at": "2026-07-19"
  },
  {
    "id": "doc_syn_003",
    "title": "DOC-SYN-003 — Integrações, dados e segurança",
    "type": "document",
    "filename": "synthetic/03-integracoes-dados-seguranca.md",
    "topic": "Integrações e Segurança",
    "content": "# DOC-SYN-003 — Integrações, dados e segurança\n\n> **DEMONSTRAÇÃO / FICTÍCIO.** Não constitui documentação técnica, declaração de segurança, DPA, parecer de LGPD ou especificação de integração da Leapy.\n\n**Público:** CS, implantação, TI e privacidade  \n**Tópico:** integrações e segurança  \n**Tipo de fonte:** sintética, com referência pública separada  \n**Revisão fictícia:** 2026-07-19\n\n## 1. Fatos públicos verificados\n\nA política pública de privacidade da Leapy declara, entre outros pontos:\n\n- compromisso com a LGPD e com a proteção de dados pessoais;\n- restrição de acesso a colaboradores com autorizações internas específicas;\n- anonimização ou criptografia dos dados sempre que possível e compatível com a prestação do serviço;\n- possibilidade de uso de empresas como Google, Microsoft ou Amazon, inclusive para armazenamento em nuvem;\n- observância de medidas de segurança e da LGPD em eventual transferência internacional.\n\nFonte consultada em 2026-07-19: https://www.leapy.com.br/politicadeprivacidade\n\nEssas declarações **não comprovam** certificações, regiões de hospedagem, métodos criptográficos, tempos de retenção por cliente, RTO/RPO, logs disponíveis ou arquitetura da plataforma.\n\n## 2. Padrões de integração para a demo — cenário fictício\n\n| Opção fictícia | Quando simular | Frequência de demo | Limite do cenário |\n|---|---|---:|---|\n| Arquivo CSV padronizado | Piloto rápido e baixo volume | Semanal | Carga manual, sem promessa de automação |\n| SFTP gerenciado | Troca recorrente de arquivos | Diária | Endpoint e chaves são apenas placeholders |\n| API REST mock | Demonstração técnica | Sob demanda | Não representa API comercial da Leapy |\n| Cadastro manual | Pequena correção operacional | Eventual | Não recomendado como fonte mestre |\n\n## 3. Discovery técnico — cenário fictício\n\nAntes de sugerir qualquer caminho, registrar:\n\n1. sistema de origem e owner;\n2. objetos e campos necessários;\n3. direção do fluxo e frequência;\n4. volume inicial e incremental;\n5. identificador único e regra de deduplicação;\n6. tratamento de erros e reprocessamento;\n7. dados pessoais envolvidos e finalidade;\n8. perfis autorizados a consultar ou corrigir;\n9. retenção e exclusão esperadas;\n10. evidência necessária para aceite.\n\n## 4. Classificação de dados — cenário fictício\n\n| Classe | Exemplo fictício | Conduta na demo |\n|---|---|---|\n| Público | Conteúdo institucional já publicado | Pode constar na base com fonte |\n| Interno | Identificador de unidade inventado | Acesso somente ao time do teste |\n| Confidencial | Avaliação fictícia de desempenho | Minimizar, controlar acesso e expirar |\n| Sensível | Saúde, biometria, raça, laudo | Não criar nem usar na demo |\n\n## 5. Resposta segura a objeções — cenário fictício\n\n**Pergunta:** “Vocês integram com o nosso ERP?”\n\n**Resposta recomendada:** “Precisamos validar o sistema, os dados, a direção do fluxo e o escopo contratado. Para esta demonstração podemos simular uma carga CSV ou uma API mock; isso não confirma uma integração real.”\n\n**Pergunta:** “A Leapy tem certificação ISO 27001?”\n\n**Resposta recomendada:** “Não há confirmação dessa certificação nas fontes públicas consultadas. Vou registrar a pergunta para Segurança/Privacidade responder com documentação vigente.”\n\n**Pergunta:** “Onde os dados ficam hospedados?”\n\n**Resposta recomendada:** “A política pública menciona eventual uso de provedores de nuvem e transferência internacional conforme a LGPD, mas não informa a arquitetura ou região aplicável ao seu caso. Esse ponto requer validação técnica e contratual.”\n\n## 6. Evidências de aceite — cenário fictício\n\n- contagem de registros enviados, aceitos e rejeitados;\n- amostra de três registros ponta a ponta;\n- log fictício sem dados pessoais;\n- regra de reprocessamento testada;\n- matriz de acesso aprovada;\n- confirmação de que os dados do teste são sintéticos.\n\n## 7. Guardrails\n\n- Não repetir como fato afirmações existentes na base antiga sobre AES-256, TLS 1.3, Swagger, SAP, TOTVS, Senior ou eSocial sem documentação oficial vigente.\n- Não solicitar credenciais, tokens ou arquivos reais no chat.\n- Não inferir conformidade a partir de uma funcionalidade técnica.\n- Incidentes, direitos de titulares e condições de retenção devem seguir processos oficiais, não este playbook fictício.",
    "keywords": [
      "integracao",
      "dados",
      "seguranca",
      "lgpd",
      "discovery",
      "demonstracao",
      "ficticio",
      "customer success"
    ],
    "audience": "cs-interno",
    "source_type": "demonstracao-ficticia",
    "updated_at": "2026-07-19"
  },
  {
    "id": "doc_syn_004",
    "title": "DOC-SYN-004 — Playbook de expansão e objeções",
    "type": "document",
    "filename": "synthetic/04-expansao-e-objecoes.md",
    "topic": "Expansão e Objeções",
    "content": "# DOC-SYN-004 — Playbook de expansão e objeções\n\n> **DEMONSTRAÇÃO / FICTÍCIO.** Hipóteses, gatilhos, mensagens e ofertas deste documento servem para testar o raciocínio do CSbot. Não representam catálogo, preço ou compromisso comercial da Leapy.\n\n**Público:** CS e vendas  \n**Tópico:** expansão e objeções  \n**Tipo de fonte:** sintética  \n**Revisão fictícia:** 2026-07-19\n\n## 1. Base pública verificada\n\nA comunicação pública da Leapy destaca atendimento nacional com atenção local, desenvolvimento conectado ao mercado e acompanhamento do programa com base em dados. A disponibilidade concreta depende de região, entidade, escopo e validação interna.\n\nFontes: https://www.leapy.com.br/, https://www.leapy.com.br/formacao-atualizada e https://www.leapy.com.br/dados-para-visibilidade\n\n## 2. Princípio da expansão — cenário fictício\n\nExpansão só deve ser sugerida quando existe um novo resultado do cliente a perseguir. Uso baixo, incidentes abertos ou ausência de sponsor pedem recuperação de valor, não oferta comercial imediata.\n\n## 3. Gatilhos de oportunidade — cenário fictício\n\n| Sinal observado | Pergunta de validação | Próxima ação fictícia |\n|---|---|---|\n| Nova unidade ou região | “Qual problema a expansão precisa resolver?” | Discovery regional; não prometer cobertura |\n| Mais jovens previstos | “Como muda a capacidade de RH e liderança?” | Revisar governança e dados |\n| Baixa participação dos líderes | “O fluxo atual cabe na rotina deles?” | Plano de adoção antes de expansão |\n| Interesse em integração | “Qual sistema é fonte e qual decisão depende dele?” | Discovery técnico com TI |\n| Demanda por relatório executivo | “Qual decisão o comitê quer tomar?” | Prototipar narrativa e indicadores disponíveis |\n\n## 4. Objeções e respostas — cenário fictício\n\n### “Já temos entidades e fornecedores locais.”\n\n**Resposta:** “Faz sentido preservar relações que funcionam. O ponto a explorar é se o RH consegue ter uma visão consistente e uma rotina única entre regiões. Antes de sugerir mudança, vamos mapear onde existe fragmentação e se ela realmente gera custo ou risco.”\n\n### “Não quero mais uma plataforma.”\n\n**Resposta:** “A preocupação é válida. Vamos identificar quais controles atuais seriam substituídos e qual decisão ficaria mais simples. Se a demo apenas adicionar uma nova etapa, não atingiu o outcome definido.”\n\n### “Vocês garantem aumento de efetivação?”\n\n**Resposta:** “Não. A Leapy publica um indicador institucional histórico, mas efetivação depende do desempenho do jovem, das oportunidades e das decisões de cada empresa. Podemos acompanhar sinais que apoiem a decisão, sem garantir o resultado.”\n\n### “Preciso operar em uma nova cidade no mês que vem.”\n\n**Resposta:** “Vamos validar demanda, região, modalidade e disponibilidade da entidade formadora antes de assumir viabilidade ou prazo. O atendimento nacional divulgado não significa disponibilidade imediata e idêntica em toda localidade.”\n\n### “A integração com nosso ERP está incluída?”\n\n**Resposta:** “Isso depende do sistema, do escopo técnico e do contrato. Posso estruturar o discovery, mas confirmação de compatibilidade, prazo e preço precisa vir dos times responsáveis.”\n\n## 5. Critérios de passagem para Vendas — cenário fictício\n\nEncaminhar somente quando houver:\n\n- problema e outcome descritos;\n- sponsor ou decisor identificado;\n- escopo inicial estimado sem dados sensíveis;\n- dependências regionais ou técnicas registradas;\n- adoção atual saudável ou plano de recuperação em curso;\n- confirmação explícita de interesse em avaliar uma solução.\n\n## 6. Nota de handoff — cenário fictício\n\n> **Conta:** Grupo Horizonte  \n> **Oportunidade:** avaliar inclusão de cinco unidades fictícias  \n> **Outcome:** consolidar acompanhamento nacional  \n> **Sinal:** sponsor solicitou discovery  \n> **Dependências:** validar cobertura regional e entidade; dimensionar migração de dados  \n> **Não prometido:** prazo, preço, vagas, modalidade ou integração\n\n## 7. Guardrails\n\n- Não usar urgência regulatória para pressionar uma venda.\n- Não prometer ROI, redução de horas, número de candidatos ou taxa de efetivação.\n- Não sugerir que uma entidade existente deva ser substituída sem discovery.\n- Não tratar interesse informal como oportunidade qualificada.",
    "keywords": [
      "expansao",
      "objecoes",
      "valor",
      "adocao",
      "oportunidade",
      "demonstracao",
      "ficticio",
      "customer success"
    ],
    "audience": "cs-interno",
    "source_type": "demonstracao-ficticia",
    "updated_at": "2026-07-19"
  },
  {
    "id": "doc_syn_005",
    "title": "DOC-SYN-005 — Matriz de escalonamento",
    "type": "document",
    "filename": "synthetic/05-matriz-escalonamento.md",
    "topic": "Suporte e Escalonamento",
    "content": "# DOC-SYN-005 — Matriz de escalonamento\n\n> **DEMONSTRAÇÃO / FICTÍCIO.** Times, prazos e níveis de severidade abaixo são uma simulação para o CSbot. Não representam canais ou SLAs oficiais da Leapy.\n\n**Público:** CS, suporte e operações  \n**Tópico:** escalonamento e incidentes  \n**Tipo de fonte:** sintética  \n**Revisão fictícia:** 2026-07-19\n\n## 1. Objetivo — cenário fictício\n\nDar ao analista um método consistente para reconhecer impacto, preservar contexto e encaminhar cada caso ao owner correto, sem improvisar resposta jurídica, técnica ou comercial.\n\n## 2. Severidade — cenário fictício\n\n| Nível | Definição fictícia | Exemplo de demo | Atualização simulada |\n|---|---|---|---:|\n| S1 Crítico | Risco imediato a pessoas, privacidade ou operação ampla | Exposição suspeita de dados; acesso indevido | A cada 30 min |\n| S2 Alto | Fluxo essencial indisponível para grupo relevante | RH não consulta a turma piloto | A cada 2 h úteis |\n| S3 Médio | Impacto limitado, com alternativa temporária | Falha em relatório não essencial | Diária |\n| S4 Baixo | Dúvida, melhoria ou inconsistência cosmética | Rótulo confuso na interface | No encerramento |\n\nOs tempos são apenas valores de demonstração, não SLA.\n\n## 3. Roteamento — cenário fictício\n\n| Tema | Owner fictício | Informações mínimas | O que CS não decide |\n|---|---|---|---|\n| Acesso ou comportamento da plataforma | Suporte/Produto | usuário fictício, tela, horário, passos e impacto | causa raiz e prazo de correção |\n| Integração ou carga | Implantação/TI | origem, lote, contagens, erro sem PII | compatibilidade e escopo comercial |\n| Privacidade ou segurança | DPO/Segurança | natureza, sistema, horário e contenção já feita | materialidade, comunicação a titulares |\n| Regra trabalhista ou cota | Jurídico/Especialista | pergunta, localidade e fonte citada | interpretação conclusiva |\n| Entidade, turma ou região | Operações pedagógicas | cidade, volume, modalidade e data desejada | disponibilidade antes da validação |\n| Preço, desconto ou aditivo | Vendas/Financeiro | necessidade, escopo e decisor | condição comercial |\n| Risco de renovação | Liderança de CS | outcome, uso, incidentes e stakeholders | concessão ou compromisso contratual |\n\n## 4. Template do chamado — cenário fictício\n\n```text\nConta fictícia:\nData/hora e fuso:\nSeveridade proposta:\nQuem é afetado:\nResultado que ficou bloqueado:\nComportamento observado:\nComportamento esperado:\nPassos para reproduzir:\nEvidências sem dados pessoais:\nAlternativa temporária:\nOwner solicitado:\nPróxima atualização combinada:\n```\n\n## 5. Primeira resposta — cenário fictício\n\n> Recebi o caso e registrei o impacto: [resultado bloqueado]. A severidade inicial é [Sx, simulação] e o owner acionado é [time fictício]. Ainda não há causa ou prazo confirmado. A próxima atualização será [momento fictício], mesmo que seja apenas para informar o andamento.\n\n## 6. Casos que exigem contenção imediata — cenário fictício\n\n- possível acesso indevido ou envio ao destinatário errado;\n- presença de dados pessoais reais em ambiente de teste;\n- orientação do bot que possa ser interpretada como parecer jurídico;\n- promessa comercial ou regional feita sem validação;\n- risco de dano a um jovem ou situação de segurança pessoal.\n\nNesses casos, interromper a circulação de dados, preservar evidências e escalar. Não investigar além do necessário nem copiar informações pessoais para o ticket.\n\n## 7. Critério de encerramento — cenário fictício\n\n- impacto cessou ou alternativa foi aceita;\n- owner confirmou a resolução ou decisão;\n- cliente recebeu resumo em linguagem clara;\n- causa e prevenção foram registradas quando aplicável;\n- documentos ou gaps de conhecimento foram encaminhados para curadoria.\n\n## 8. Guardrails\n\n- Não declarar “incidente de segurança” ou obrigação de notificação sem validação do time responsável.\n- Não prometer prazo de solução com base nos tempos fictícios da tabela.\n- Não inserir CPF, telefone, e-mail pessoal, laudo ou print com dados reais.\n- Se houver risco humano imediato, priorizar o canal oficial apropriado; o bot não substitui atendimento de emergência.",
    "keywords": [
      "escalonamento",
      "severidade",
      "triagem",
      "ownership",
      "incidente",
      "demonstracao",
      "ficticio",
      "customer success"
    ],
    "audience": "cs-interno",
    "source_type": "demonstracao-ficticia",
    "updated_at": "2026-07-19"
  },
  {
    "id": "doc_syn_006",
    "title": "DOC-SYN-006 — Health score e revisão executiva",
    "type": "document",
    "filename": "synthetic/06-health-score-e-revisao-executiva.md",
    "topic": "Customer Success",
    "content": "# DOC-SYN-006 — Health score e revisão executiva\n\n> **DEMONSTRAÇÃO / FICTÍCIO.** Modelo inventado para testes de priorização e QBR. Pesos, faixas e cadências não correspondem a metodologia oficial da Leapy.\n\n**Público:** CS e liderança de RH  \n**Tópico:** saúde da conta e valor  \n**Tipo de fonte:** sintética  \n**Revisão fictícia:** 2026-07-19\n\n## 1. Contexto público verificado\n\nA Leapy posiciona o acompanhamento por dados como forma de centralizar informações, observar desenvolvimento e apoiar decisões. O site não publica um health score de clientes.\n\nFonte: https://www.leapy.com.br/dados-para-visibilidade\n\n## 2. Score de demonstração\n\nO score fictício varia de 0 a 100 e serve apenas para ordenar atenção do CS. Ele nunca deve decidir sozinho uma ação sobre cliente ou jovem.\n\n| Dimensão fictícia | Peso | Exemplo de evidência |\n|---|---:|---|\n| Adoção do RH | 25 | administradores ativos e rotinas concluídas |\n| Engajamento da liderança | 20 | avaliações ou pulsos respondidos |\n| Qualidade de dados | 20 | cadastros completos, datas válidas e baixa duplicidade |\n| Execução do plano de sucesso | 20 | marcos concluídos e ações com owner |\n| Relacionamento e governança | 15 | sponsor ativo e reuniões com decisão |\n\n### Faixas fictícias\n\n- **80–100 — Saudável:** manter cadência e documentar valor.\n- **60–79 — Atenção:** definir até duas ações com owner.\n- **0–59 — Risco:** validar a causa com pessoas; não automatizar diagnóstico.\n- **Sem dados — Desconhecido:** tratar como gap de observabilidade, não como conta saudável.\n\n## 3. Regras contra falsos sinais — cenário fictício\n\n- Login alto sem decisão ou ação não prova valor.\n- Queda sazonal de uso não significa churn.\n- Muitos tickets podem indicar adoção intensa, não necessariamente insatisfação.\n- Sponsor ausente pode exigir remapeamento político mesmo com uso alto.\n- Efetivação depende de fatores do jovem e da empresa e não deve ser atribuída apenas à plataforma.\n\n## 4. Agenda da revisão executiva — cenário fictício\n\n1. Outcome acordado e mudanças de contexto.\n2. Evidências de valor desde a última revisão.\n3. Jovens, unidades ou fluxos que pedem atenção agregada, sem exposição indevida.\n4. Decisões pendentes e respectivos owners.\n5. Riscos e plano de mitigação.\n6. Próximo marco de valor.\n7. Oportunidades a explorar, somente se a operação atual estiver saudável.\n\n## 5. One-page de valor — cenário fictício\n\n> **Cliente:** Grupo Horizonte  \n> **Outcome:** consolidar o acompanhamento de 18 unidades  \n> **Evidência do período:** 92% dos cadastros fictícios completos; 14 de 18 líderes concluíram a rotina simulada  \n> **Risco:** quatro unidades sem owner local  \n> **Decisão necessária:** sponsor nomear responsáveis até a próxima revisão fictícia  \n> **Próximo marco:** validar alertas e retirar a planilha paralela da demo  \n> **Limite:** indicadores inventados; não usar externamente\n\n## 6. Perguntas do CSbot — cenário fictício\n\n- “Qual evidência mostra que o cliente chegou mais perto do outcome?”\n- “Esse indicador mede atividade ou resultado?”\n- “Existe uma causa confirmada ou apenas correlação?”\n- “Quem precisa tomar qual decisão até quando?”\n- “Há um dado ausente que torna o score enganoso?”\n\n## 7. Guardrails\n\n- Não usar health score para avaliar desempenho individual do jovem.\n- Não expor ranking nominal em reunião executiva sem finalidade e acesso adequados.\n- Não confundir indicador institucional público com resultado da conta.\n- Não apresentar pesos ou faixas fictícias como metodologia oficial.",
    "keywords": [
      "health score",
      "qbr",
      "revisao executiva",
      "risco",
      "carteira",
      "demonstracao",
      "ficticio",
      "customer success"
    ],
    "audience": "cs-interno",
    "source_type": "demonstracao-ficticia",
    "updated_at": "2026-07-19"
  },
  {
    "id": "cota_aprendiz",
    "title": "Cota de Jovem Aprendiz",
    "type": "concept",
    "description": "Regras de obrigatoriedade legal de 5% a 15% de contratação de jovens aprendizes conforme CLT.",
    "keywords": [
      "aprendiz",
      "jovem aprendiz",
      "cota",
      "clt",
      "lei",
      "obrigatoriedade",
      "calculo"
    ]
  },
  {
    "id": "cota_pcd",
    "title": "Cota de PCD",
    "type": "concept",
    "description": "Cota obrigatória de contratação de pessoas com deviciência (2% a 5%) aplicável a empresas a partir de 100 funcionários.",
    "keywords": [
      "pcd",
      "deficiente",
      "cota",
      "lei",
      "obrigatoriedade",
      "100"
    ]
  },
  {
    "id": "elegibilidade_clt",
    "title": "Elegibilidade CLT",
    "type": "concept",
    "description": "Políticas de elegibilidade para planos de saúde, vale refeição premium e coparticipação para contratos CLT.",
    "keywords": [
      "clt",
      "elegibilidade",
      "beneficio",
      "plano de saude",
      "sulamerica",
      "experiencia"
    ]
  },
  {
    "id": "elegibilidade_estagio",
    "title": "Elegibilidade Estágio",
    "type": "concept",
    "description": "Direitos limitados de estagiários na Leapy: exclusivo vale refeição reduzido e seguro de vida, sem direito a plano de saúde ou Gympass.",
    "keywords": [
      "estagiario",
      "estagio",
      "elegibilidade",
      "bolsa",
      "beneficio",
      "vr"
    ]
  },
  {
    "id": "operacao_sudeste",
    "title": "Homologação Regional (Sudeste e PR)",
    "type": "concept",
    "description": "Automação completa homologada de convenções coletivas e dissídios retroativos restrita a SP, RJ, MG e PR.",
    "keywords": [
      "sp",
      "rj",
      "mg",
      "pr",
      "homologação",
      "dissidio",
      "sindicato",
      "cct"
    ]
  },
  {
    "id": "operacao_nacional",
    "title": "Abrangência Nacional",
    "type": "concept",
    "description": "Capacidade técnica de rodar folha em todo o Brasil com reajustes manuais nas demais regiões.",
    "keywords": [
      "nacional",
      "brasil",
      "territorio",
      "manual",
      "customizado"
    ]
  },
  {
    "id": "portal_colaborador",
    "title": "Portal do Colaborador Self-Service",
    "type": "concept",
    "description": "Interface de autoatendimento para holerites assinados, envio de atestados e férias sem gargalos de RH.",
    "keywords": [
      "portal",
      "self service",
      "holerite",
      "atestado",
      "colaborador",
      "funcionario"
    ]
  },
  {
    "id": "solicitacao_ferias",
    "title": "Fluxo de Férias",
    "type": "concept",
    "description": "Regra estrita de 30 dias de antecedência mínima e aprovação sequencial de Gestor e RH, com cancelamento automático se atrasar.",
    "keywords": [
      "ferias",
      "antecedencia",
      "solicitação",
      "gestor",
      "rh",
      "cancelamento",
      "aprovação"
    ]
  },
  {
    "id": "transicao_estagio",
    "title": "Transição e Efetivação CLT",
    "type": "concept",
    "description": "Regras para efetivar estagiários: antecedência de 15 dias, notas médias de desempenho > 7.5, e irredutibilidade do salário.",
    "keywords": [
      "efetivação",
      "efetivar",
      "transição",
      "estagiario",
      "desempenho",
      "nota",
      "salario"
    ]
  },
  {
    "id": "integracao_erp",
    "title": "Integração de Sistemas",
    "type": "concept",
    "description": "Solução para sistemas legados como Totvs, Sênior e SAP via API RESTful ou exportadores personalizados agendados.",
    "keywords": [
      "integracao",
      "erp",
      "senior",
      "totvs",
      "sap",
      "api",
      "csv"
    ]
  },
  {
    "id": "seguranca_lgpd",
    "title": "Segurança e LGPD",
    "type": "concept",
    "description": "Criptografia robusta TLS 1.3 em trânsito e AES-256 em repouso com controle baseado em perfil (RBAC) conforme LGPD.",
    "keywords": [
      "segurança",
      "lgpd",
      "criptografia",
      "dados",
      "privacidade",
      "aes",
      "tls"
    ]
  }
];

export const EDGES: GraphEdge[] = [
  {
    "source": "chk_004",
    "target": "cota_aprendiz",
    "label": "Define"
  },
  {
    "source": "chk_004",
    "target": "cota_pcd",
    "label": "Define"
  },
  {
    "source": "chk_005",
    "target": "cota_aprendiz",
    "label": "Define"
  },
  {
    "source": "chk_005",
    "target": "cota_pcd",
    "label": "Define"
  },
  {
    "source": "chk_006",
    "target": "cota_aprendiz",
    "label": "Define"
  },
  {
    "source": "chk_006",
    "target": "cota_pcd",
    "label": "Define"
  },
  {
    "source": "chk_007",
    "target": "elegibilidade_estagio",
    "label": "Define"
  },
  {
    "source": "chk_008",
    "target": "elegibilidade_estagio",
    "label": "Define"
  },
  {
    "source": "chk_009",
    "target": "elegibilidade_estagio",
    "label": "Define"
  },
  {
    "source": "chk_010",
    "target": "operacao_sudeste",
    "label": "Regulamenta"
  },
  {
    "source": "chk_010",
    "target": "operacao_nacional",
    "label": "Regulamenta"
  },
  {
    "source": "chk_011",
    "target": "operacao_sudeste",
    "label": "Regulamenta"
  },
  {
    "source": "chk_011",
    "target": "operacao_nacional",
    "label": "Regulamenta"
  },
  {
    "source": "chk_012",
    "target": "operacao_sudeste",
    "label": "Regulamenta"
  },
  {
    "source": "chk_012",
    "target": "operacao_nacional",
    "label": "Regulamenta"
  },
  {
    "source": "chk_013",
    "target": "portal_colaborador",
    "label": "Explica"
  },
  {
    "source": "chk_013",
    "target": "solicitacao_ferias",
    "label": "Explica"
  },
  {
    "source": "chk_014",
    "target": "portal_colaborador",
    "label": "Explica"
  },
  {
    "source": "chk_014",
    "target": "solicitacao_ferias",
    "label": "Explica"
  },
  {
    "source": "chk_015",
    "target": "transicao_estagio",
    "label": "Explica"
  },
  {
    "source": "chk_016",
    "target": "transicao_estagio",
    "label": "Explica"
  },
  {
    "source": "chk_023",
    "target": "integracao_erp",
    "label": "Responde"
  },
  {
    "source": "chk_024",
    "target": "integracao_erp",
    "label": "Responde"
  },
  {
    "source": "doc_syn_001",
    "target": "operacao_nacional",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_001",
    "target": "portal_colaborador",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_002",
    "target": "portal_colaborador",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_002",
    "target": "operacao_nacional",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_003",
    "target": "integracao_erp",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_003",
    "target": "seguranca_lgpd",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_004",
    "target": "operacao_nacional",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_004",
    "target": "integracao_erp",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_005",
    "target": "portal_colaborador",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_005",
    "target": "integracao_erp",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_006",
    "target": "portal_colaborador",
    "label": "Demonstra"
  },
  {
    "source": "doc_syn_006",
    "target": "transicao_estagio",
    "label": "Demonstra"
  },
  {
    "source": "doc_stack",
    "target": "integracao_erp",
    "label": "Usa"
  },
  {
    "source": "doc_architecture",
    "target": "integracao_erp",
    "label": "Define"
  },
  {
    "source": "doc_context",
    "target": "portal_colaborador",
    "label": "Explica"
  },
  {
    "source": "doc_customer_success",
    "target": "operacao_nacional",
    "label": "Detona"
  },
  {
    "source": "doc_customer_success",
    "target": "portal_colaborador",
    "label": "Guia"
  },
  {
    "source": "doc_customer_success",
    "target": "transicao_estagio",
    "label": "Explica"
  }
];

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
