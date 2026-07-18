# Leapy CSbot — Especificação Técnica de Produto (PRD & Arquitetura)

Este documento consolida a especificação de produto, o design de dados, os contratos de API e o modelo de estados de interface do **Leapy CSbot**, um assistente cognitivo interno baseado em Grafos de Conhecimento e Inteligência Artificial desenvolvido para o time de Suporte e Customer Success da Leapy.

---

## 🚀 Prompt 1: Consolidação do Produto Interno de CS

### 1. Visão do Produto
O **Leapy CSbot** é uma plataforma de inteligência operacional interna projetada para blindar e acelerar o atendimento do time de Customer Success da Leapy. Utilizando uma arquitetura de recuperação híbrida baseada em Grafos de Conhecimento (Graph-RAG), o bot cruza dúvidas operacionais de analistas com a base de conhecimento estruturada da empresa, reduzindo drasticamente o tempo de resposta, eliminando alucinações de IA sobre políticas corporativas e registrando proativamente lacunas informacionais.

### 2. O Problema
* **Sobrecarga e Erros Críticos de CS:** Analistas de CS gastam tempo excessivo folheando planilhas de elegibilidade de benefícios, PDFs de convenções coletivas de trabalho (CCTs) regionalizadas e regras complexas de cotas (Aprendiz/PCD). Informações incorretas repassadas aos clientes geram passivos trabalhistas, multas e atrito severo.
* **Alucinações de IAs Genéricas:** Chatbots convencionais sem contexto estruturado inventam políticas de RH, prazos de reembolso ou isenções legais que não constam em contrato.
* **Inexistência de Feedback Loop de Conhecimento:** Quando uma dúvida de cliente não possui resposta na base corporativa, essa lacuna (knowledge gap) é perdida no chat, nunca chegando ao time de documentação técnica para atualização.

### 3. Personas do Ecossistema
* **Ana — A Analista de CS Pleno (Usuária Principal):** Atende dezenas de contas diariamente. Precisa de respostas exatas com respaldo documental sobre prazos de férias, tributação de notas e transição de estagiários, além de saber o nível de risco de cada orientação.
* **Carlos — O Diretor de Operações e RH (Auditor):** Precisa auditar as interações, garantir a acurácia do bot, mapear quais são as maiores dúvidas dos analistas (hot topics) e assegurar que as respostas de "Alto Risco" (jurídico/tributário) estejam 100% homologadas.
* **Mariana — A Redatora Técnica / Product Owner de Documentação (Curadora de KB):** Responsável por monitorar as sinalizações de lacunas (gaps) identificadas pelo bot e feedbacks negativos para gerar novos playbooks de CS e atualizar as regras de negócio do grafo.

### 4. Módulos do Sistema
1. **Módulo de Conversação Assistida (Chat & Explicabilidade):** Interface para o analista interagir com o bot, contendo visualização transparente do grau de confiança, ressalvas contratuais, riscos da resposta e os conceitos recuperados.
2. **Módulo de Visualização de Conceitos (Graph Engine):** Visualizador interativo de grafos (estilo Obsidian) que mostra como os playbooks de suporte se interconectam com os conceitos legais de RH (CLT vs. Estágio, Regras Sindicais por Região).
3. **Módulo de Auditoria Operacional (Audit Dashboard):** Painel interno que registra todas as requisições, métricas de confiança média, avaliações dos analistas (likes/dislikes) e distribuição de risco de cada atendimento.
4. **Módulo de Gerenciamento da Base de Conhecimento (KB Manager):** Área administrativa para atualizar e cadastrar novos nós de documentos/conceitos, vincular arestas e autogerar rascunhos de artigos para as lacunas descobertas na operação.

### 5. Stack Tecnológica Recomendada
* **Frontend:** Next.js (App Router) + TypeScript, Tailwind CSS para estilo minimalista, Framer Motion para transições de estado, e Recharts para visualizações no dashboard de auditoria.
* **Backend:** Express ou NestJS com TypeScript, API RESTful segura e middleware para integração com LLMs.
* **Banco de Dados Relacional & Vetorial:** PostgreSQL (com extensão pgvector para busca semântica em chunks e tabelas estruturadas para o grafo e logs de auditoria).
* **Camada de IA:** SDK oficial `@google/genai` (utilizando o modelo `gemini-3.5-flash` para síntese ultra-rápida estruturada via JSON Schema).

---

## 📊 Prompt 2: Schema de Dados (Banco de Dados Relacional/Grafo)

Para modelar o Leapy CSbot de forma durável e escalável em um banco de dados como o PostgreSQL, propõe-se o seguinte schema lógico:

```
  +-------------------+              +------------------+
  |   DocumentChunk   | <==========> |    GraphNode     |
  +-------------------+  (Contém)    +------------------+
  | - id (PK)         |              | - id (PK)        |
  | - node_id (FK)    |              | - title          |
  | - content         |              | - type (doc/con) |
  | - embedding       |              | - topic          |
  | - seq_order       |              | - keywords[]     |
  +-------------------+              +------------------+
                                              || 1
                                              ||
                                              || n (Origem / Destino)
                                              \/
                                     +------------------+
                                     |    GraphEdge     |
                                     +------------------+
                                     | - id (PK)        |
                                     | - source_id (FK) |
                                     | - target_id (FK) |
                                     | - label          |
                                     +------------------+

  +-------------------+              +------------------+              +------------------+
  |      Session      |              |      Answer      |              |     AuditLog     |
  +-------------------+              +------------------+              +------------------+
  | - id (PK)         | 1          1 | - id (PK)        | 1          1 | - id (PK)        |
  | - user_id         | ------------ | - log_id (FK)    | ------------ | - session_id(FK) |
  | - created_at      |            n | - text           |              | - timestamp      |
  | - status          |              | - confidence     |              | - query          |
  +-------------------+              | - risk_level     |              | - retrieved_nodes|
                                     | - intent_class   |              +------------------+
                                     | - next_action    |                       | 1
                                     +------------------+                       |
                                                                                | 1
                                                                       +------------------+
                                                                       |     Feedback     |
                                                                       +------------------+
                                                                       | - id (PK)        |
                                                                       | - log_id (FK)    |
                                                                       | - type (up/down) |
                                                                       | - comment        |
                                                                       | - created_at     |
                                                                       +------------------+
```

### 1. Entidade: `GraphNode`
* **Campos:**
  * `id` (VARCHAR, PK): Identificador único do nó (ex: `doc_cotas`, `cota_pcd`).
  * `title` (VARCHAR): Título amigável do nó.
  * `type` (VARCHAR): Enum (`'document'` ou `'concept'`).
  * `topic` (VARCHAR, NULL): Categoria de negócio (ex: `'Cotas e Legislação'`).
  * `description` (TEXT, NULL): Breve resumo (usado principalmente para nós de conceito).
  * `filename` (VARCHAR, NULL): Nome físico do arquivo original indexado.
  * `keywords` (VARCHAR[]): Array de tags de indexação para busca híbrida.
* **Finalidade:** Representa o ponto estruturado de conhecimento (artigo oficial ou conceito jurídico/operacional).

### 2. Entidade: `DocumentChunk`
* **Campos:**
  * `id` (UUID, PK): Identificador único do fragmento.
  * `node_id` (VARCHAR, FK -> `GraphNode.id`): Vínculo com o documento-pai.
  * `content` (TEXT): Conteúdo textual bruto do fragmento (geralmente fatiado em até 1000 caracteres).
  * `embedding` (vector(768)): Vetor de embeddings gerado para busca semântica.
  * `seq_order` (INTEGER): Ordem sequencial do chunk dentro do documento.
* **Finalidade:** Permite realizar busca vetorial granular de trechos específicos de manuais extensos.

### 3. Entidade: `GraphEdge`
* **Campos:**
  * `id` (UUID, PK): Identificador único do relacionamento.
  * `source_id` (VARCHAR, FK -> `GraphNode.id`): ID do nó de origem.
  * `target_id` (VARCHAR, FK -> `GraphNode.id`): ID do nó de destino.
  * `label` (VARCHAR): Tipo do vínculo (ex: `'Define'`, `'Explica'`, `'Restringe'`, `'Evolui para'`).
* **Finalidade:** Conecta as entidades no grafo semântico, permitindo a expansão de consultas a conceitos de segundo nível.

### 4. Entidade: `Session`
* **Campos:**
  * `id` (UUID, PK): Identificador único da sessão de chat.
  * `user_id` (VARCHAR): Identificador do analista de CS logado.
  * `created_at` (TIMESTAMP): Data e hora de início da sessão.
  * `status` (VARCHAR): Estado da sessão (ex: `'active'`, `'archived'`).
* **Finalidade:** Organiza a linha do tempo de conversação e isola o contexto de múltiplos atendimentos.

### 5. Entidade: `AuditLog`
* **Campos:**
  * `id` (VARCHAR, PK): ID amigável de auditoria (ex: `log_1721345...`).
  * `session_id` (UUID, FK -> `Session.id`, NULL): Sessão correspondente.
  * `timestamp` (TIMESTAMP): Data e hora exata da interação.
  * `query` (TEXT): Pergunta bruta formulada pelo analista.
  * `retrieved_nodes` (VARCHAR[]): Array de IDs dos nós que foram ativados no grafo.
  * `expanded_nodes` (VARCHAR[]): Array de IDs de nós de suporte que foram incluídos na expansão do grafo.
* **Finalidade:** Fornece rastreabilidade total das consultas de CS, viabilizando a auditoria e análise de qualidade.

### 6. Entidade: `Answer`
* **Campos:**
  * `id` (UUID, PK): Identificador único da resposta sintetizada.
  * `log_id` (VARCHAR, FK -> `AuditLog.id`): Log de auditoria gerador.
  * `text` (TEXT): A resposta objetiva final entregue ao analista.
  * `justificativa` (TEXT): Justificativa baseada nos fatos dos documentos.
  * `confidence` (VARCHAR): Enum (`'Alta'`, `'Média'`, `'Baixa'`, `'Nenhuma'`).
  * `risk_level` (VARCHAR): Enum (`'Baixo'`, `'Médio'`, `'Alto'`).
  * `intent_class` (VARCHAR): Categoria identificada de intenção.
  * `next_action` (TEXT): Próxima ação recomendada para o analista de CS.
  * `ressalvas` (TEXT, NULL): Detalhes de exceções ou limitações.
* **Finalidade:** Armazena de forma estruturada a saída gerada pela IA, separando os componentes cognitivos da resposta.

### 7. Entidade: `Feedback`
* **Campos:**
  * `id` (UUID, PK): Identificador único do feedback.
  * `log_id` (VARCHAR, FK -> `AuditLog.id`): Resposta associada.
  * `type` (VARCHAR): Enum (`'like'` ou `'dislike'`).
  * `comment` (TEXT, NULL): Comentário textual do analista explicando o motivo da marcação.
  * `created_at` (TIMESTAMP): Data de registro do feedback.
* **Finalidade:** Permite coletar o julgamento humano sobre a resposta da IA. Feedbacks do tipo `'dislike'` representam automaticamente lacunas na base que disparam revisões de conteúdo.

---

## 💻 Prompt 3: Estados de Interface em React (FSM da UI)

A interface de conversação do Leapy CSbot é estruturada como uma Máquina de Estados Finita (FSM) no React para garantir que o analista tenha feedbacks visuais perfeitamente alinhados com o contexto cognitivo retornado pelo sistema.

### 1. Estado: `idle`
* **Gatilho:** Tela inicial sem consulta ativa ou após limpar histórico.
* **Representação Visual:** Caixa de texto limpa e centralizada; exibição amigável do painel informativo com playbooks rápidos (ex: "Calcular cotas de aprendizagem", "Estagiário tem direito a Gympass?").
* **Comportamento:** Botões de playbooks ativos e prontos para clique imediato para acelerar a digitação.

### 2. Estado: `loading`
* **Gatilho:** Usuário submete uma pergunta (clica em enviar ou aciona um playbook).
* **Representação Visual:** Componente `active-thinking` é renderizado. Apresenta uma animação de pulsação ou rotação no ícone de faísca (`Sparkles` em rotação) com o texto: *"Consultando base estruturada e gerando diretrizes operacionais..."*. O botão de envio fica desabilitado (`disabled: true`).
* **Comportamento:** Bloqueia reenvios acidentais e indica ao usuário que o processo de busca em grafo e síntese está em execução.

### 3. Estado: `answer-high-confidence`
* **Gatilho:** Resposta retornada com campo `confidence === 'Alta'`.
* **Representação Visual:** Caixa da resposta contornada em borda suave com fundo limpo. Selo de confiança verde vibrante: `[✔ Confiança Alta]`. Badge de risco verde ou amarelo conforme as regras de negócio.
* **Comportamento:** Mostra o botão de Thumbs Up/Down habilitado e sugere o botão de copiar a resposta objetiva para uso rápido no atendimento.

### 4. Estado: `answer-medium-confidence`
* **Gatilho:** Resposta retornada com campo `confidence === 'Média'`.
* **Representação Visual:** Selo de confiança na cor âmbar/amarelo: `[⚠ Confiança Média]`. Exibe claramente a seção de **"Ressalvas e Limitações"** em destaque, alertando que o cenário possui nuances contratuais ou operacionais importantes.
* **Comportamento:** O analista é instruído a revisar a justificativa de suporte antes de repassar a informação ao cliente final.

### 5. Estado: `fallback`
* **Gatilho:** Resposta retorna com `confidence === 'Baixa'` ou `'Nenhuma'`, ou `isFallback === true` devido à baixa relevância com o grafo.
* **Representação Visual:** Caixa de resposta em tom vermelho/rosa suave. O bot exibe o texto padrão: *"Desculpe, não encontrei evidência ou informação suficiente nos documentos internos da Leapy para responder a esta pergunta."*
* **Comportamento:** Exibe um botão de destaque: **"Sinalizar Lacuna na Base (Knowledge Gap)"**. Ao clicar, o sistema permite registrar formalmente a pergunta para curadoria técnica.

### 6. Estado: `audit-open`
* **Gatilho:** O usuário clica na aba "Logs de Auditoria" no painel lateral direito.
* **Representação Visual:** Painel lateral é populado com a lista cronológica de requisições realizadas no sistema. Mostra estatísticas rápidas do sistema (taxa de acerto de base, quantidade de auditorias ativas).
* **Comportamento:** Clicar em qualquer linha do log destaca quais nós do grafo foram acessados para aquela resposta específica.

### 7. Estado: `graph-focus`
* **Gatilho:** O usuário clica em um nó de documento ou conceito na aba do Grafo Interativo ou no painel de detalhes da resposta.
* **Representação Visual:** O painel lateral de detalhes do nó é aberto por uma transição deslizante da direita para a esquerda (`AnimatePresence`). O nó focado é centralizado na visualização do mapa de conceitos.
* **Comportamento:** Exibe o conteúdo bruto indexado, metadados (categoria, keywords) e lista de forma clicável todos os outros artigos e conceitos conectados por arestas, permitindo navegação orgânica.

### 8. Estado: `knowledge-gap-signal`
* **Gatilho:** Usuário envia feedback negativo (`dislike`) ou aciona o fluxo de gap de conhecimento na tela de fallback.
* **Representação Visual:** Abre uma caixa de entrada contextual no painel da resposta contendo um campo de texto para que o analista digite o motivo de a resposta estar incorreta ou incompleta.
* **Comportamento:** Ao enviar, o estado transiciona para "Auditoria enviada!" e atualiza o dashboard de métricas na aba correspondente, criando um rascunho de playbook editável na aba "Gerenciar Base (KB)" para que o time possa redigir a resposta correta imediatamente.

---

## 🔌 Prompt 4: Contratos de Integração da API (RESTful JSON)

Abaixo estão definidos os endpoints da API do Leapy CSbot, incluindo payloads, headers e códigos de status HTTP.

### 1. Rota: `POST /api/chat`
* **Finalidade:** Processa a dúvida do analista de CS e gera a resposta cognitiva estruturada pelo Gemini com base no grafo.
* **Headers:** `Content-Type: application/json`
* **Request Payload (JSON):**
```json
{
  "query": "Estagiário da Leapy que fica doente tem direito a usar o plano de saúde da SulAmérica?"
}
```
* **Response Payload - Sucesso (HTTP 200 - High/Medium Confidence):**
```json
{
  "text": "Estagiários não possuem direito à cobertura de plano de saúde ou plano odontológico da SulAmérica em nenhuma hipótese.",
  "blocks": {
    "respostaObjetiva": "Estagiários não possuem direito à cobertura de plano de saúde ou plano odontológico da SulAmérica em nenhuma hipótese.",
    "justificativa": "A tabela de elegibilidade de benefícios estipula que estagiários possuem direito estrito e exclusivo a vale-refeição de R$ 22,00 por dia útil e seguro de vida em grupo obrigatório.",
    "confianca": "Alta",
    "ressalvas": "O plano de saúde coparticipativo SulAmérica é de benefício exclusivo para colaboradores contratados sob regime CLT que já concluíram o período de experiência de 90 dias.",
    "classificacaoIntencao": "Direitos & Elegibilidade de Benefícios",
    "sinalizacaoRisco": "Baixo",
    "proximaAcaoRecomendada": "Esclarecer amigavelmente ao estagiário que a cobertura de saúde é restrita à CLT e que ele possui seguro de vida garantido pela apólice de estágio.",
    "resumoCaso": "Estagiário questionando elegibilidade para plano de saúde corporativo SulAmérica."
  },
  "highlightedNodes": ["doc_elegibilidade", "elegibilidade_estagio", "elegibilidade_clt"],
  "isFallback": false,
  "logId": "log_1721345678_48e2c"
}
```
* **Response Payload - Fallback (HTTP 200 - Low/No Confidence):**
```json
{
  "text": "Desculpe, não encontrei evidência ou informação suficiente nos documentos internos da Leapy para responder a esta pergunta.",
  "blocks": {
    "respostaObjetiva": "Desculpe, não encontrei evidência ou informação suficiente nos documentos internos da Leapy para responder a esta pergunta.",
    "justificativa": "Não há nenhum playbook ou manual cadastrado na base que regulamente ajuda de custo para planos de internet home-office durante férias.",
    "confianca": "Nenhuma",
    "ressalvas": "Para orientações de ajuda de custo excepcionais fora de playbooks, consulte o Diretor de Operações.",
    "classificacaoIntencao": "Consulta Fora do Escopo",
    "sinalizacaoRisco": "Médio",
    "proximaAcaoRecomendada": "Registrar a dúvida na curadoria da Base de Conhecimento e escalar para validação do RH Central.",
    "resumoCaso": "Dúvida sobre pagamento de ajuda de custo de internet durante período de férias."
  },
  "highlightedNodes": [],
  "isFallback": true,
  "logId": "log_1721345999_ab12c"
}
```

### 2. Rota: `GET /api/graph`
* **Finalidade:** Retorna a estrutura de nós (documentos e conceitos) e arestas para renderização do visualizador de grafo.
* **Response Payload (HTTP 200):**
```json
{
  "nodes": [
    {
      "id": "doc_cotas",
      "title": "Guia de Cotas de Aprendizagem e PCD",
      "type": "document",
      "topic": "Cotas e Legislação",
      "keywords": ["cota", "aprendiz", "pcd", "clt", "vaga", "calculadora"]
    },
    {
      "id": "cota_aprendiz",
      "title": "Cota de Jovem Aprendiz",
      "type": "concept",
      "description": "Regras de obrigatoriedade legal de 5% a 15% de contratação de jovens aprendizes conforme CLT.",
      "keywords": ["aprendiz", "jovem aprendiz", "cota", "clt"]
    }
  ],
  "edges": [
    {
      "source": "doc_cotas",
      "target": "cota_aprendiz",
      "label": "Define"
    }
  ]
}
```

### 3. Rota: `POST /api/feedback`
* **Finalidade:** Registra o feedback positivo/negativo do analista em relação a uma resposta para fins de curadoria e cálculo de acurácia.
* **Request Payload (JSON):**
```json
{
  "logId": "log_1721345678_48e2c",
  "feedback": "dislike",
  "comment": "O manual de transição diz que o prazo é de 15 dias, mas o cliente alega que a convenção da TI de SP exige 20 dias para homologação do estágio."
}
```
* **Response Payload (HTTP 200):**
```json
{
  "status": "ok",
  "message": "Feedback registrado com sucesso no log de auditoria."
}
```

### 4. Rota: `GET /api/kb/stats`
* **Finalidade:** Retorna métricas agregadas sobre a integridade da base, logs de auditoria e lista estruturada de lacunas identificadas (knowledge gaps).
* **Response Payload (HTTP 200):**
```json
{
  "totalAudits": 42,
  "gaps": [
    {
      "id": "log_1721345999_ab12c",
      "timestamp": "2026-07-18T22:45:00Z",
      "query": "Como lançar reembolso de táxi de analista comercial na Bahia?",
      "confidence": "Baixa",
      "feedback": "dislike",
      "feedbackComment": "Não temos esse documento na base e o cliente precisa da resposta com urgência."
    }
  ],
  "riskCounts": {
    "Alto": 8,
    "Médio": 14,
    "Baixo": 20
  },
  "hotTopics": [
    { "topic": "férias", "count": 15 },
    { "topic": "estagiário", "count": 12 },
    { "topic": "plano de saúde", "count": 9 }
  ],
  "feedback": {
    "totalFeedback": 18,
    "likes": 15,
    "dislikes": 3,
    "ratingPercentage": 83
  },
  "coverage": {
    "totalDocs": 6,
    "totalConcepts": 11,
    "totalEdges": 16,
    "unlinkedConcepts": 1
  }
}
```

### 5. Rota: `POST /api/kb/node`
* **Finalidade:** Adiciona ou atualiza um nó no Grafo de Conhecimento (curadoria de documentos/conceitos).
* **Request Payload (JSON):**
```json
{
  "id": "doc_reembolso_bahia",
  "title": "Política de Reembolso de Viagens e Km",
  "type": "document",
  "topic": "Operação e Tributário",
  "content": "A política de reembolso de viagens da Leapy prevê o pagamento integral de despesas de táxi, combustível e hospedagem exclusivamente para viagens comerciais pré-aprovadas pela diretoria com antecedência mínima de 48 horas.",
  "keywords": ["reembolso", "viagem", "combustivel", "taxi", "despesa", "bahia"]
}
```
* **Response Payload (HTTP 200):**
```json
{
  "status": "ok",
  "node": {
    "id": "doc_reembolso_bahia",
    "title": "Política de Reembolso de Viagens e Km",
    "type": "document",
    "topic": "Operação e Tributário",
    "keywords": ["reembolso", "viagem", "combustivel", "taxi", "despesa", "bahia"]
  },
  "nodesCount": 18
}
```

### 6. Rota: `POST /api/kb/autodraft`
* **Finalidade:** Aciona a inteligência artificial para ler uma lacuna de conhecimento relatada pela equipe e formular um rascunho de manual operacional completo e estruturado para publicação imediata.
* **Request Payload (JSON):**
```json
{
  "query": "Como lançar reembolso de táxi de analista comercial na Bahia?"
}
```
* **Response Payload (HTTP 200):**
```json
{
  "id": "doc_auto_983712",
  "title": "Manual de Reembolso e Lançamento de Despesas Comerciais",
  "type": "document",
  "topic": "Operação e Tributário",
  "content": "### Introdução\nEste manual regulamenta o fluxo de prestação de contas para reembolso de despesas operacionais e comerciais...\n\n### Diretrizes Operacionais\n1. Lançamento: O analista de CS deve orientar o colaborador a salvar todos os comprovantes fiscais (NFS-e ou cupons).\n2. Prazos: O envio dos comprovantes deve ser realizado em até 5 dias úteis úteis pós-evento.\n3. Regionalização: Para colaboradores alocados na Bahia (BA) ou região Nordeste, o processamento segue fluxo idêntico ao Sudeste.",
  "keywords": ["reembolso", "lançamento", "despesa", "comercial", "bahia"],
  "conceptTitle": "Prestação de Contas Comerciais",
  "conceptDescription": "Processo de envio, validação e conciliação de comprovantes de despesas de viagens comerciais."
}
```

---

## 📅 Roadmap de Implementação (Road to Production)

```
  Fase 1: Estruturação & RAG              Fase 2: Auditoria & Curadoria          Fase 3: Escalonamento & MCP
  [Semanas 1-2]                          [Semanas 3-4]                         [Semanas 5-6]
  +--------------------------------+     +-------------------------------+     +-------------------------------+
  | - Migração para PostgreSQL     |     | - Painel de Gaps em Tempo Real|     | - Integração OAuth Leapy      |
  |   (pgvector + tabelas de grafo)| --> | - Editor Visual de Grafo      | --> | - Protocolo MCP para agentes  |
  | - Pipeline de Chunking de PDFs |     |   (Draggable Nodes/Edges)     |     | - Integração com Slack/Teams  |
  | - Resoluções automáticas com IA|     | - Notificações de Auditoria   |     | - Analytics de Desempenho     |
  +--------------------------------+     +-------------------------------+     +-------------------------------+
```

Este plano garante que o **Leapy CSbot** se torne não apenas uma interface de resposta, mas o cérebro operacional e o hub de conformidade do Customer Success da Leapy.
