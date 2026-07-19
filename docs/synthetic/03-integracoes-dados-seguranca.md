# DOC-SYN-003 — Integrações, dados e segurança

> **DEMONSTRAÇÃO / FICTÍCIO.** Não constitui documentação técnica, declaração de segurança, DPA, parecer de LGPD ou especificação de integração da Leapy.

**Público:** CS, implantação, TI e privacidade  
**Tópico:** integrações e segurança  
**Tipo de fonte:** sintética, com referência pública separada  
**Revisão fictícia:** 2026-07-19

## 1. Fatos públicos verificados

A política pública de privacidade da Leapy declara, entre outros pontos:

- compromisso com a LGPD e com a proteção de dados pessoais;
- restrição de acesso a colaboradores com autorizações internas específicas;
- anonimização ou criptografia dos dados sempre que possível e compatível com a prestação do serviço;
- possibilidade de uso de empresas como Google, Microsoft ou Amazon, inclusive para armazenamento em nuvem;
- observância de medidas de segurança e da LGPD em eventual transferência internacional.

Fonte consultada em 2026-07-19: https://www.leapy.com.br/politicadeprivacidade

Essas declarações **não comprovam** certificações, regiões de hospedagem, métodos criptográficos, tempos de retenção por cliente, RTO/RPO, logs disponíveis ou arquitetura da plataforma.

## 2. Padrões de integração para a demo — cenário fictício

| Opção fictícia | Quando simular | Frequência de demo | Limite do cenário |
|---|---|---:|---|
| Arquivo CSV padronizado | Piloto rápido e baixo volume | Semanal | Carga manual, sem promessa de automação |
| SFTP gerenciado | Troca recorrente de arquivos | Diária | Endpoint e chaves são apenas placeholders |
| API REST mock | Demonstração técnica | Sob demanda | Não representa API comercial da Leapy |
| Cadastro manual | Pequena correção operacional | Eventual | Não recomendado como fonte mestre |

## 3. Discovery técnico — cenário fictício

Antes de sugerir qualquer caminho, registrar:

1. sistema de origem e owner;
2. objetos e campos necessários;
3. direção do fluxo e frequência;
4. volume inicial e incremental;
5. identificador único e regra de deduplicação;
6. tratamento de erros e reprocessamento;
7. dados pessoais envolvidos e finalidade;
8. perfis autorizados a consultar ou corrigir;
9. retenção e exclusão esperadas;
10. evidência necessária para aceite.

## 4. Classificação de dados — cenário fictício

| Classe | Exemplo fictício | Conduta na demo |
|---|---|---|
| Público | Conteúdo institucional já publicado | Pode constar na base com fonte |
| Interno | Identificador de unidade inventado | Acesso somente ao time do teste |
| Confidencial | Avaliação fictícia de desempenho | Minimizar, controlar acesso e expirar |
| Sensível | Saúde, biometria, raça, laudo | Não criar nem usar na demo |

## 5. Resposta segura a objeções — cenário fictício

**Pergunta:** “Vocês integram com o nosso ERP?”

**Resposta recomendada:** “Precisamos validar o sistema, os dados, a direção do fluxo e o escopo contratado. Para esta demonstração podemos simular uma carga CSV ou uma API mock; isso não confirma uma integração real.”

**Pergunta:** “A Leapy tem certificação ISO 27001?”

**Resposta recomendada:** “Não há confirmação dessa certificação nas fontes públicas consultadas. Vou registrar a pergunta para Segurança/Privacidade responder com documentação vigente.”

**Pergunta:** “Onde os dados ficam hospedados?”

**Resposta recomendada:** “A política pública menciona eventual uso de provedores de nuvem e transferência internacional conforme a LGPD, mas não informa a arquitetura ou região aplicável ao seu caso. Esse ponto requer validação técnica e contratual.”

## 6. Evidências de aceite — cenário fictício

- contagem de registros enviados, aceitos e rejeitados;
- amostra de três registros ponta a ponta;
- log fictício sem dados pessoais;
- regra de reprocessamento testada;
- matriz de acesso aprovada;
- confirmação de que os dados do teste são sintéticos.

## 7. Guardrails

- Não repetir como fato afirmações existentes na base antiga sobre AES-256, TLS 1.3, Swagger, SAP, TOTVS, Senior ou eSocial sem documentação oficial vigente.
- Não solicitar credenciais, tokens ou arquivos reais no chat.
- Não inferir conformidade a partir de uma funcionalidade técnica.
- Incidentes, direitos de titulares e condições de retenção devem seguir processos oficiais, não este playbook fictício.
