<!-- converted from leapy-cs-assistente-workbook.xlsx -->

## Sheet: Overview
|  | Leapy CS Assistant Workbook |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
|  | Planilhas de apoio para o protótipo do assistente interno de Customer Success baseado em documentos fictícios. |  |  |  |  |  |
|  | Métrica | Valor | Observação | Fonte |  |  |
|  | Total de documentos base | 16 | 10 iniciais + 6 adicionais | Base fictícia criada para o desafio |  |  |
|  | Perguntas de avaliação | 12 | Frequentes + fora de escopo | DOC-009 e DOC-016 |  |  |
|  | Blocos obrigatórios da resposta | 4 | Resposta, fontes, justificativa, confiança | DOC-007 / DOC-013 |  |  |
|  | Prazo de protótipo | 2 | Primeiro shot no AI Studio e depois IDE | Planejamento do desafio |  |  |
|  | Navegação |  |  |  |  |  |
|  | Índice dos documentos |  |  |  |  |  |
|  | Conjunto de avaliação |  |  |  |  |  |
|  | Tracker do PRD e escopo |  |  |  |  |  |
|  | Builder de prompt e guardrails |  |  |  |  |  |
|  | Contexto |  |  |  |  |  |
|  | A Leapy se posiciona publicamente como plataforma/empresa focada em contratação, gestão e desenvolvimento de jovens aprendizes. |  |  |  |  |  |
|  | O workbook foi feito para apoiar o protótipo do assistente de CS com base documental, citações e fallback. |  |  |  |  |  |
|  | Gerado em: 2026-07-18 14:49 |  |  |  |  |  |
## Sheet: Documents_Index
| doc_id | title | type | audience | topic | last_updated | priority | include_in_demo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DOC-001 | Visão geral do programa Leapy | overview | cs-interno | visao-geral | 2026-07-10 | Alta | Sim |
| DOC-002 | FAQ cota, cálculo e elegibilidade | faq | empresa | cota | 2026-07-09 | Alta | Sim |
| DOC-003 | FAQ para jovens aprendizes | faq | jovem | elegibilidade | 2026-07-08 | Média | Sim |
| DOC-004 | Operação nacional e entidades formadoras | playbook | cs-interno | operacao | 2026-07-11 | Alta | Sim |
| DOC-005 | Plataforma, dados e indicadores | produto | empresa | plataforma | 2026-07-12 | Alta | Sim |
| DOC-006 | Efetivação e impacto do programa | argumentacao | cs-interno | resultado | 2026-07-07 | Alta | Sim |
| DOC-007 | Tom de resposta do assistente | policy | cs-interno | estilo | 2026-07-12 | Alta | Sim |
| DOC-008 | Casos de borda e fallback | guardrail | cs-interno | fallback | 2026-07-12 | Alta | Sim |
| DOC-009 | Cenários de perguntas reais de CS | evaluation | cs-interno | avaliacao | 2026-07-12 | Alta | Sim |
| DOC-010 | Metadados para ingestão no RAG | tecnico | tecnico | indexacao | 2026-07-12 | Média | Sim |
| DOC-011 | Playbook de objeções de RH | playbook | empresa | objecoes | 2026-07-12 | Média | Sim |
| DOC-012 | Taxonomia de intents | tecnico-funcional | tecnico | classificacao | 2026-07-12 | Alta | Sim |
| DOC-013 | Política de citação e justificativa | policy | cs-interno | citacao | 2026-07-12 | Alta | Sim |
| DOC-014 | Regras de confiança da resposta | policy | cs-interno | confianca | 2026-07-12 | Alta | Sim |
| DOC-015 | Rubrica para avaliar respostas | qa | cs-interno | qa | 2026-07-12 | Média | Sim |
| DOC-016 | Exemplos de conversas para demo | demo | cs-interno | demo | 2026-07-12 | Alta | Sim |
## Sheet: Evaluation_Set
| question_id | persona | question | expected_behavior | expected_docs | confidence_target | category |
| --- | --- | --- | --- | --- | --- | --- |
| Q-001 | empresa | A Leapy ajuda só com curso ou também com gestão do programa? | Responder com visão geral + formação | DOC-001 | Alta | empresa_visao_geral |
| Q-002 | empresa | Como saber se minha empresa precisa contratar aprendizes? | Explicar regra geral com cautela | DOC-002 | Média | cota_aprendizagem |
| Q-003 | jovem | Qual é a idade para ser jovem aprendiz? | Responder faixa etária e exceção PCD | DOC-003 | Alta | elegibilidade_jovem |
| Q-004 | empresa | Vocês atendem qualquer região do Brasil do mesmo jeito? | Explicar variação regional | DOC-004 | Alta | operacao_regional |
| Q-005 | empresa | A plataforma substitui tudo que o RH faz? | Negar substituição total | DOC-005 | Alta | plataforma_dados |
| Q-006 | empresa | A Leapy garante efetivação? | Negar garantia, citar dado institucional | DOC-006 | Alta | resultado_efetivacao |
| Q-007 | empresa | Qual é o preço por aprendiz? | Fallback | DOC-008 | Alta | fora_de_escopo |
| Q-008 | empresa | Vocês integram com SAP? | Fallback | DOC-008 | Alta | fora_de_escopo |
| Q-009 | empresa | Aprendiz dá muito trabalho para o RH? | Responder como objeção consultiva | DOC-011 | Média | objecao_comercial |
| Q-010 | interno | Quais blocos a resposta deve ter? | Listar template obrigatório | DOC-007/DOC-013 | Alta | policy |
## Sheet: PRD_Tracker
|  | Tracker de requisitos e prontidão da V1 |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- |
|  | Item | Status | Prioridade | Owner | Prazo | Pronto para demo? |
|  | Base documental consolidada | Pendente | Alta | André | 2026-07-20 | Não |
|  | Prompt de sistema | Pendente | Alta | André | 2026-07-20 | Não |
|  | Template de resposta | Pendente | Alta | André | 2026-07-20 | Não |
|  | Fallback seguro | Pendente | Alta | André | 2026-07-20 | Não |
|  | Citação por doc/seção | Pendente | Alta | André | 2026-07-20 | Não |
|  | Confiança alta/média/baixa | Pendente | Alta | André | 2026-07-20 | Não |
|  | Dataset de avaliação | Pendente | Alta | André | 2026-07-20 | Não |
|  | Fluxo no AI Studio | Pendente | Alta | André | 2026-07-20 | Não |
|  | Roteiro de vídeo | Pendente | Alta | André | 2026-07-20 | Não |
|  | Plano de migração para IDE | Pendente | Alta | André | 2026-07-20 | Não |
## Sheet: Prompt_Builder
|  | Builder de prompt e guardrails |  |
| --- | --- | --- |
|  | Bloco | Conteúdo base |
|  | Papel | Você é um assistente interno do time de Customer Success da Leapy. |
|  | Escopo | Use apenas os documentos fornecidos no contexto. |
|  | Proibição | Nunca invente informações fora da base documental. |
|  | Formato | Sempre responda com: Resposta objetiva; Fontes usadas; Justificativa; Confiança. |
|  | Fallback | Se a base não for suficiente, informe que não encontrou evidência suficiente. |
|  | Citação | Cite no formato DOC-XXX §Y.Y. |
|  | Tom | Seja claro, curto, útil e conservador. |
|  | Risco | Não transforme dado institucional em promessa contratual. |