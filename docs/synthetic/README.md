# Pacote sintético de Customer Success — Leapy

> **DEMONSTRAÇÃO / FICTÍCIO.** Este diretório foi criado para prototipação, testes de RAG e treinamento do Leapy CSbot. Processos, prazos, SLAs, papéis, integrações, métricas operacionais e empresas citadas como cenário são hipóteses de demonstração, não compromissos comerciais ou operacionais da Leapy.

## Como ler este pacote

Cada documento separa explicitamente:

- **Fatos públicos verificados:** síntese do posicionamento publicado pela Leapy, com URL e data de consulta;
- **Cenário de demonstração / fictício:** conteúdo inventado para testar fluxos de Customer Success;
- **Guardrail:** o que o assistente não deve apresentar como fato, garantia, parecer jurídico ou condição contratual.

## Índice

| ID | Documento | Uso principal |
|---|---|---|
| DOC-SYN-001 | [Visão de produto e resultados do cliente](./01-visao-produto-e-outcomes.md) | Onboarding interno, narrativa de valor e discovery |
| DOC-SYN-002 | [Onboarding e implantação](./02-onboarding-implantacao.md) | Plano fictício de 30 dias, marcos e critérios de aceite |
| DOC-SYN-003 | [Integrações, dados e segurança](./03-integracoes-dados-seguranca.md) | Discovery técnico, LGPD, checklist e fallback |
| DOC-SYN-004 | [Expansão e objeções](./04-expansao-e-objecoes.md) | Identificação de oportunidade e respostas seguras |
| DOC-SYN-005 | [Matriz de escalonamento](./05-matriz-escalonamento.md) | Triagem, severidade, ownership e comunicação |
| DOC-SYN-006 | [Health score e revisão executiva](./06-health-score-e-revisao-executiva.md) | Priorização de carteira e reunião de valor |

## Ingestão no protótipo

O `scripts/compile_db.py` inclui explicitamente os seis playbooks deste diretório como nós documentais do grafo. Eles entram com `source_type: demonstracao-ficticia`, público `cs-interno` e conexões conceituais próprias. Ao adicionar um sétimo documento, inclua também sua especificação no array `synthetic_specs` do compilador para preservar metadados e relações controladas.

## Fatos públicos usados como base

Consulta realizada em **2026-07-19**:

1. A Leapy se apresenta como empresa especializada em jovens talentos e afirma apoiar empresas na gestão do Programa de Jovens Aprendizes de ponta a ponta.
2. A formação obrigatória é viabilizada com entidades homologadas; a Leapy GO é citada como escola técnica do Grupo Leapy e há parceiros terceiros onde não existe operação própria.
3. A proposta pública inclui contratação, desenvolvimento, acompanhamento com dados e centralização de informações do programa.
4. O site publica que 48% dos jovens formados são efetivados, três vezes a média nacional. Neste pacote, o dado é tratado somente como indicador institucional histórico, nunca como promessa de resultado.
5. A página institucional informa que a Leapy atua como consultoria de RH e não assume as obrigações regulatórias das entidades formadoras.
6. A política de privacidade declara compromisso com a LGPD, acesso interno restrito por autorização, uso de anonimização ou criptografia quando possível e eventual uso de provedores de nuvem. Ela não publica arquitetura, certificações, algoritmos ou SLAs técnicos detalhados.

## Fontes públicas

- https://www.leapy.com.br/
- https://www.leapy.com.br/sobre-leapy
- https://www.leapy.com.br/dados-para-visibilidade
- https://www.leapy.com.br/formacao-atualizada
- https://www.leapy.com.br/politicadeprivacidade

## Regra de uso pelo assistente

Quando a pergunta envolver preço, SLA, prazo contratual, região específica, integração, certificação de segurança, decisão jurídica ou disponibilidade de turma, responder que o pacote contém apenas um cenário fictício e solicitar validação com o responsável interno. Nunca converter os valores de demonstração abaixo em alegações sobre a operação real.
