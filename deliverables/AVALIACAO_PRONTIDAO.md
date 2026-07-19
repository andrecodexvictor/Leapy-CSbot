# Avaliação de prontidão — desafio técnico Leapy

**Candidato:** André Victor Andrade Oliveira Santos  
**Veredito:** forte para entrega como desafio técnico, com acabamento recomendado antes do envio.  
**Nota atual estimada:** 8,3/10.

## Aderência ao desafio

| Critério | Avaliação | Evidência |
|---|---:|---|
| Responder dúvidas de CS | 9/10 | Playbooks, pergunta livre e saída estruturada. |
| Usar documentos fictícios | 10/10 | Base sintética marcada como demonstração e conectada ao grafo. |
| Citar fonte | 7,5/10 | Nós e documentos são exibidos, mas falta uma propriedade explícita `fontes` com 1–3 referências no contrato da resposta. |
| Explicar o raciocínio | 9/10 | Justificativa curta e trilha de evidências; não expõe cadeia privada do modelo. |
| Fallback seguro | 8/10 | Recusa para perguntas fora da base, com confiança, risco e escalonamento. |
| UX e clareza | 9/10 | Modo claro legível, hierarquia operacional e grafo filtrável. |
| Engenharia | 7,5/10 | TypeScript e build passam; faltam testes automatizados do comportamento RAG. |
| Visão de evolução | 9/10 | Auditoria, feedback, gaps, curadoria e roadmap demonstráveis. |

## Pontos fortes

- A proposta resolve um fluxo real de CS, não apenas uma conversa genérica.
- Resposta estruturada em diretriz, justificativa, confiança, risco e próxima ação.
- Recuperação lexical com expansão pelo grafo de conceitos.
- Visualização das evidências e conteúdo integral dos documentos.
- Fallback, auditoria, feedback e gestão de lacunas.
- Interface madura e coerente com o contexto de dados e tomada de decisão da Leapy.

## Ajustes recomendados antes do envio

### Prioridade máxima

1. Adicionar `fontes: string[]` ao contrato do backend e mostrar de 1 a 3 referências exatas em cada resposta.
2. Remover o log do prefixo da chave de API no servidor. Chaves nunca devem aparecer, mesmo parcialmente, em console.
3. Gravar o vídeo com uma pergunta respondida e uma pergunta recusada por falta de base.

### Se ainda houver tempo

1. Criar um smoke test com 6–10 perguntas e expectativas de intenção, fallback e presença de fonte.
2. Revisar exemplos fictícios para garantir que nenhuma afirmação de demonstração pareça promessa real da Leapy.
3. Preparar README com comandos de execução, arquitetura, limitações e credenciais não necessárias para o modo simulado.

## Conclusão

A solução já demonstra produto, frontend, backend, IA aplicada, modelagem de conhecimento e preocupação com segurança. Para uma vaga de estágio/fellowship, o nível é competitivo. O melhor uso do tempo restante é fortalecer prova e rastreabilidade, não adicionar novas funcionalidades.
