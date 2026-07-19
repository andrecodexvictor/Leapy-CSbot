# DOC-SYN-005 — Matriz de escalonamento

> **DEMONSTRAÇÃO / FICTÍCIO.** Times, prazos e níveis de severidade abaixo são uma simulação para o CSbot. Não representam canais ou SLAs oficiais da Leapy.

**Público:** CS, suporte e operações  
**Tópico:** escalonamento e incidentes  
**Tipo de fonte:** sintética  
**Revisão fictícia:** 2026-07-19

## 1. Objetivo — cenário fictício

Dar ao analista um método consistente para reconhecer impacto, preservar contexto e encaminhar cada caso ao owner correto, sem improvisar resposta jurídica, técnica ou comercial.

## 2. Severidade — cenário fictício

| Nível | Definição fictícia | Exemplo de demo | Atualização simulada |
|---|---|---|---:|
| S1 Crítico | Risco imediato a pessoas, privacidade ou operação ampla | Exposição suspeita de dados; acesso indevido | A cada 30 min |
| S2 Alto | Fluxo essencial indisponível para grupo relevante | RH não consulta a turma piloto | A cada 2 h úteis |
| S3 Médio | Impacto limitado, com alternativa temporária | Falha em relatório não essencial | Diária |
| S4 Baixo | Dúvida, melhoria ou inconsistência cosmética | Rótulo confuso na interface | No encerramento |

Os tempos são apenas valores de demonstração, não SLA.

## 3. Roteamento — cenário fictício

| Tema | Owner fictício | Informações mínimas | O que CS não decide |
|---|---|---|---|
| Acesso ou comportamento da plataforma | Suporte/Produto | usuário fictício, tela, horário, passos e impacto | causa raiz e prazo de correção |
| Integração ou carga | Implantação/TI | origem, lote, contagens, erro sem PII | compatibilidade e escopo comercial |
| Privacidade ou segurança | DPO/Segurança | natureza, sistema, horário e contenção já feita | materialidade, comunicação a titulares |
| Regra trabalhista ou cota | Jurídico/Especialista | pergunta, localidade e fonte citada | interpretação conclusiva |
| Entidade, turma ou região | Operações pedagógicas | cidade, volume, modalidade e data desejada | disponibilidade antes da validação |
| Preço, desconto ou aditivo | Vendas/Financeiro | necessidade, escopo e decisor | condição comercial |
| Risco de renovação | Liderança de CS | outcome, uso, incidentes e stakeholders | concessão ou compromisso contratual |

## 4. Template do chamado — cenário fictício

```text
Conta fictícia:
Data/hora e fuso:
Severidade proposta:
Quem é afetado:
Resultado que ficou bloqueado:
Comportamento observado:
Comportamento esperado:
Passos para reproduzir:
Evidências sem dados pessoais:
Alternativa temporária:
Owner solicitado:
Próxima atualização combinada:
```

## 5. Primeira resposta — cenário fictício

> Recebi o caso e registrei o impacto: [resultado bloqueado]. A severidade inicial é [Sx, simulação] e o owner acionado é [time fictício]. Ainda não há causa ou prazo confirmado. A próxima atualização será [momento fictício], mesmo que seja apenas para informar o andamento.

## 6. Casos que exigem contenção imediata — cenário fictício

- possível acesso indevido ou envio ao destinatário errado;
- presença de dados pessoais reais em ambiente de teste;
- orientação do bot que possa ser interpretada como parecer jurídico;
- promessa comercial ou regional feita sem validação;
- risco de dano a um jovem ou situação de segurança pessoal.

Nesses casos, interromper a circulação de dados, preservar evidências e escalar. Não investigar além do necessário nem copiar informações pessoais para o ticket.

## 7. Critério de encerramento — cenário fictício

- impacto cessou ou alternativa foi aceita;
- owner confirmou a resolução ou decisão;
- cliente recebeu resumo em linguagem clara;
- causa e prevenção foram registradas quando aplicável;
- documentos ou gaps de conhecimento foram encaminhados para curadoria.

## 8. Guardrails

- Não declarar “incidente de segurança” ou obrigação de notificação sem validação do time responsável.
- Não prometer prazo de solução com base nos tempos fictícios da tabela.
- Não inserir CPF, telefone, e-mail pessoal, laudo ou print com dados reais.
- Se houver risco humano imediato, priorizar o canal oficial apropriado; o bot não substitui atendimento de emergência.
