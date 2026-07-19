# Roteiro do vídeo — Leapy CSbot

**Candidato:** André Victor Andrade Oliveira Santos  
**Duração planejada:** 2min20s, com 10s de margem  
**Formato:** captura de tela com narração; câmera opcional apenas na abertura e no encerramento.

## 0:00–0:15 — Abertura

**Na tela:** título do projeto e visão geral da interface.

> Olá, eu sou André Victor Andrade Oliveira Santos. Para o desafio da Leapy, construí o Leapy CSbot: um copiloto para o time de Customer Success responder dúvidas operacionais com evidência, justificativa curta e rastreabilidade.

## 0:15–0:35 — Problema e proposta

**Na tela:** destaque para playbooks, campo de pergunta e painel de decisão.

> O problema que eu quis resolver não foi apenas gerar texto. Em CS, uma resposta precisa ser rápida, mas também segura. Por isso, a solução separa diretriz, justificativa, risco, confiança e próxima ação — e conecta tudo à base documental.

## 0:35–1:00 — Como funciona

**Na tela:** grafo e documentos destacados.

> A pergunta passa por uma recuperação híbrida. Primeiro, o sistema encontra termos nos títulos, palavras-chave e conteúdos. Depois, expande os resultados pelos relacionamentos do grafo. Os documentos recuperados viram o contexto do modelo, que recebe instruções para não extrapolar a base e devolver uma resposta estruturada.

## 1:00–1:35 — Demonstração principal

**Na tela:** pergunte “Qual é a faixa etária permitida para o jovem aprendiz?”; mostre a resposta e abra uma das referências `DOC-003` exibidas no bloco “Fontes exatas”.

> Neste exemplo, eu pergunto sobre a faixa etária do jovem aprendiz. O copiloto apresenta a orientação operacional, explica por que chegou nela, classifica o risco e sugere a próxima ação para o analista. As referências exatas aparecem na própria resposta; eu abro uma delas para conferir o trecho bruto usado como evidência.

## 1:35–1:55 — Fallback seguro

**Na tela:** pergunte “Qual é o SLA contratual e o preço do plano?”; destaque a confiança “Nenhuma”, o fallback e as referências `DOC-008`.

> Quando a pergunta não está coberta, como preço ou SLA contratual, o sistema não inventa. Ele ativa um fallback seguro, informa o que falta e orienta o escalonamento. Essa recusa controlada é parte central da proposta.

## 1:55–2:15 — Auditoria e evolução

**Na tela:** abas “Auditoria”, “Inteligência & Gaps” e “Gerenciar Base”.

> Cada consulta gera um registro de auditoria. O analista pode avaliar a resposta, sinalizar uma lacuna e alimentar o fluxo de curadoria. Assim, o produto não é apenas um chat: ele também mostra onde a base precisa evoluir.

## 2:15–2:20 — Encerramento

**Na tela:** visão geral do produto.

> Esse é o Leapy CSbot: resposta rápida para CS, evidência para auditoria e aprendizado contínuo da base. Obrigado pela oportunidade.

## Checklist de gravação

- Grave em 1920×1080 e aumente o zoom do navegador somente se o texto ficar pequeno.
- Deixe as abas e perguntas que serão usadas previamente preparadas.
- Não digite ao vivo; use os playbooks para evitar pausas.
- Demonstre a pergunta coberta sobre faixa etária e a recusa sobre SLA/preço; não substitua por duas perguntas respondidas.
- Não abra “Chaves de API” durante a gravação.
- Exporte em 1080p e confirme duração máxima de 2min30s.
