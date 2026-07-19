Documentos adicionais fictícios + PRD do primeiro protótipo no AI Studio
Este material amplia a base fictícia anterior e descreve um Product Requirements Document para um primeiro protótipo robusto no AI Studio. O conteúdo factual de contexto foi ancorado no site público da Leapy, que destaca gestão ponta a ponta do programa de jovens aprendizes, atendimento nacional com atenção local, acompanhamento por dados, uso de entidades homologadas e um índice institucional de 48% de efetivação entre jovens formados.

Parte 1 — Documentos adicionais fictícios
Documento 11 — Playbook de objeções de RH
ID: DOC-011
Título: Como responder às objeções mais comuns de RH
Tipo: Playbook de atendimento
Última atualização fictícia: 2026-07-12

11.1 Objeção: “Já tenho fornecedores locais”
Resposta sugerida:

A Leapy não precisa substituir à força toda a estrutura atual. Em operações distribuídas, ela pode ajudar a reduzir fragmentação, trazendo coordenação, acompanhamento e mais visibilidade sobre o programa como um todo.

11.2 Objeção: “Não quero mais um sistema”
Resposta sugerida:

A plataforma existe para concentrar informação e reduzir ruído operacional. O objetivo não é adicionar trabalho desnecessário, e sim melhorar acompanhamento e tomada de decisão com base em dados.

11.3 Objeção: “Aprendiz dá muito trabalho para o RH”
Resposta sugerida:

Um dos argumentos centrais da Leapy é justamente diminuir esforço operacional da empresa e transformar a aprendizagem em uma frente mais estratégica.

11.4 Regra de ouro
O time de CS deve tratar objeções com linguagem consultiva, sem confronto e sem promessas absolutas.

Documento 12 — Guia de categorização de perguntas do assistente
ID: DOC-012
Título: Taxonomia de intents para perguntas de CS
Tipo: Documento técnico-funcional
Última atualização fictícia: 2026-07-12

12.1 Categorias principais
Toda pergunta recebida pelo assistente deve ser classificada em uma das categorias abaixo:

empresa_visao_geral

cota_aprendizagem

elegibilidade_jovem

operacao_regional

plataforma_dados

resultado_efetivacao

objeção_comercial

fora_de_escopo

12.2 Uso da categoria
A categoria deve ser usada para:

orientar recuperação de contexto;

melhorar o ranking dos chunks;

apoiar mensagens de fallback;

permitir avaliação manual por tipo de pergunta.

12.3 Exemplos
“A Leapy ajuda só com curso?” → empresa_visao_geral

“Qual a idade para jovem aprendiz?” → elegibilidade_jovem

“Vocês têm operação em qualquer cidade?” → operacao_regional

“Quanto custa por aprendiz?” → fora_de_escopo

Documento 13 — Política de citação e justificativa
ID: DOC-013
Título: Política de transparência da resposta do assistente
Tipo: Policy interna
Última atualização fictícia: 2026-07-12

13.1 Princípio
Toda resposta do assistente deve permitir que um analista humano entenda de onde a informação veio e por que aquela resposta foi produzida. Esse princípio está alinhado à importância de source attribution em sistemas de RAG, que melhora confiança, auditabilidade e depuração de erros.

13.2 Regra de fonte
Cada resposta deve citar de 1 a 3 trechos da base, com doc_id e section_id.

13.3 Regra de justificativa
A justificativa deve descrever, em no máximo 2 frases:

o que os trechos citados dizem;

por que eles são suficientes, insuficientes ou parcialmente suficientes.

13.4 Exemplo
Fontes: DOC-004 §4.2, DOC-004 §4.4
Justificativa: Os trechos citados descrevem que a formação pode depender de entidades terceiras e que a disponibilidade operacional varia por região. Por isso, não é correto afirmar cobertura idêntica em todo o território.

Documento 14 — Regras de confiança da resposta
ID: DOC-014
Título: Critérios para alta, média e baixa confiança
Tipo: Documento de avaliação
Última atualização fictícia: 2026-07-12

14.1 Alta confiança
Usar quando:

a pergunta está claramente coberta pela base;

há 2 ou mais trechos convergentes;

não existe ambiguidade relevante.

14.2 Média confiança
Usar quando:

a resposta depende de 1 trecho principal e 1 trecho complementar;

existe leve ambiguidade de escopo;

a pergunta exige adaptação de linguagem, mas não extrapolação forte.

14.3 Baixa confiança
Usar quando:

a base cobre apenas parte da pergunta;

há conflito entre trechos;

o assistente precisa responder com ressalvas fortes.

14.4 Fallback preferível
Se a confiança tenderia a ficar abaixo de baixa, o sistema deve optar por fallback em vez de uma resposta especulativa. Esse comportamento conservador é coerente com boas práticas de mitigação de alucinações em suporte.

Documento 15 — Prompt de avaliação humana
ID: DOC-015
Título: Rubrica para avaliar respostas do protótipo
Tipo: Documento de QA manual
Última atualização fictícia: 2026-07-12

15.1 Critérios
Cada resposta pode ser avaliada de 1 a 5 em:

correção factual;

aderência à base;

qualidade da citação;

clareza da justificativa;

adequação do fallback;

utilidade para o time de CS.

15.2 Erros críticos
Uma resposta deve ser considerada inadequada se:

inventar informação fora da base;

citar documento irrelevante;

responder com confiança alta sem lastro suficiente;

transformar dado institucional em promessa contratual.

15.3 Resultado esperado
Um protótipo aprovado para demo deve acertar bem as perguntas frequentes, errar com segurança nas perguntas fora de escopo e manter explicabilidade consistente.

Documento 16 — Exemplos de conversas para demo
ID: DOC-016
Título: Script de demonstração do assistente
Tipo: Demo script
Última atualização fictícia: 2026-07-12

16.1 Conversa 1 — visão geral
Pergunta: A Leapy faz só o curso ou também a gestão?
Resposta ideal: A Leapy apoia empresas na gestão do programa de ponta a ponta e viabiliza a frente de formação obrigatória com entidades homologadas.
Fontes: DOC-001 §1.1, DOC-001 §1.2

16.2 Conversa 2 — operação local
Pergunta: Vocês atendem qualquer região do Brasil do mesmo jeito?
Resposta ideal: A Leapy tem atendimento nacional com atenção local, mas a disponibilidade operacional e de entidades pode variar conforme a região.
Fontes: DOC-004 §4.1, DOC-004 §4.4

16.3 Conversa 3 — dado institucional
Pergunta: A Leapy garante efetivação?
Resposta ideal: Não. O dado de efetivação é uma referência institucional e não deve ser tratado como garantia para toda empresa ou turma.
Fontes: DOC-006 §6.1, DOC-006 §6.2, DOC-006 §6.4

16.4 Conversa 4 — fallback
Pergunta: Qual o SLA de atendimento?
Resposta ideal: Não encontrei base suficiente nos documentos disponíveis para responder com segurança.
Fontes: DOC-008 §8.1, DOC-008 §8.4

Parte 2 — PRD do primeiro protótipo no AI Studio
PRD — Assistente interno de CS da Leapy baseado em documentos
1. Visão do produto
O produto é um assistente interno para o time de Customer Success que responde perguntas com base em uma biblioteca de documentos de ajuda da Leapy, sempre citando a fonte e explicando, de forma resumida, o raciocínio de resposta. A necessidade desse produto faz sentido para o contexto público da Leapy, que combina gestão do programa de aprendizagem, operação nacional, acompanhamento por dados e comunicação com empresas e jovens.

O primeiro objetivo não é substituir pessoas nem automatizar todo o atendimento. O objetivo é acelerar respostas internas, padronizar linguagem e reduzir risco de respostas imprecisas, especialmente em temas recorrentes como cota, elegibilidade, operação regional, plataforma e efetivação.

2. Problema
Analistas de CS precisam responder rapidamente perguntas repetidas, mas a informação pode estar espalhada em materiais de onboarding, FAQs, playbooks e orientações internas. Sem um assistente com recuperação documental e rastreabilidade, o time corre risco de responder com inconsistência, extrapolar dados institucionais ou gastar tempo excessivo buscando referências.

3. Objetivo do protótipo
O protótipo deve provar quatro coisas:

O assistente encontra trechos relevantes na base.

O assistente responde de forma útil para CS.

O assistente cita corretamente as fontes utilizadas.

O assistente falha com segurança quando a base não sustenta a resposta.

4. Usuário-alvo
Usuário primário:

analista de Customer Success;

pessoa de onboarding ou operação de contas;

liderança que quer validar consistência da comunicação.

Usuários secundários:

time de produto ou operações internas;

avaliadores do desafio técnico.

5. Jobs to be done
“Quando eu receber uma pergunta de cliente, quero encontrar uma resposta confiável sem vasculhar vários documentos.”

“Quando eu responder algo sensível, quero saber exatamente qual documento sustenta a resposta.”

“Quando a base não cobrir um assunto, quero que o assistente admita isso em vez de improvisar.”

6. Escopo da V1
Inclui
base fictícia de documentos;

experiência conversacional simples no AI Studio;

recuperação de trechos relevantes;

resposta com fontes;

justificativa curta;

fallback explícito;

confiança alta, média ou baixa.

Não inclui
autenticação corporativa;

integração com CRM ou tickets;

upload dinâmico de documentos pelo usuário;

analytics em produção;

memória entre sessões;

multi-tenant;

compliance jurídico formal.

7. Requisitos funcionais
RF-01 — Pergunta e resposta
O usuário deve poder escrever uma pergunta livre em linguagem natural e receber uma resposta curta, objetiva e legível.

RF-02 — Citação obrigatória
Toda resposta útil deve conter fontes com doc_id e seção.

RF-03 — Justificativa curta
A resposta deve conter uma justificativa de até 2 frases explicando por que os trechos recuperados sustentam a conclusão.

RF-04 — Fallback
Quando a base não sustentar a resposta, o sistema deve devolver fallback em vez de improvisar.

RF-05 — Sinal de confiança
A resposta deve exibir confiança alta, média ou baixa, conforme regras definidas no documento de política.

RF-06 — Perguntas de avaliação
O sistema deve conseguir responder um conjunto conhecido de perguntas frequentes e fora de escopo para demo.

8. Requisitos não funcionais
Latência percebida aceitável para demo.

Resposta legível em menos de 10 segundos em cenário de protótipo.

Estilo consistente e não prolixo.

Baixa incidência de respostas sem fonte.

Comportamento conservador em dúvidas.

9. Arquitetura conceitual
9.1 Ingestão
Os documentos fictícios serão estruturados com ID, título, seção, público, tópico e texto. Essa estrutura facilita recuperação contextual e atribuição de fontes.

9.2 Indexação
O conteúdo será dividido em chunks pequenos por seção ou subtópico. Para o primeiro shot, chunking semântico leve é mais adequado do que tentar evitar chunking completamente, porque melhora precisão da recuperação e da citação.

9.3 Recuperação
Dada uma pergunta do usuário, o sistema deve recuperar os trechos mais relevantes da base e passá-los ao modelo como contexto prioritário.

9.4 Geração
O modelo deve responder com base apenas no contexto recuperado e nas regras do sistema. Em perguntas fora da base, deve recusar com elegância e utilidade.

9.5 Camada de apresentação
A saída final deve seguir um template fixo:

Resposta objetiva

Fontes usadas

Justificativa

Confiança