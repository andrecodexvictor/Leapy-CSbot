# Revisão geral de UI/UX — Leapy CSbot

Data: 19/07/2026  
Superfície avaliada: workspace desktop do copiloto operacional

## Diagnóstico

### 1. Legibilidade — prioridade alta

A interface usava muitos textos entre 8 e 10 px, inclusive em labels, evidências, metadados e ações. Isso tornava o modo claro visualmente leve, mas exigia esforço contínuo de leitura. A nova base estabelece 11 px como piso para metadados, 13 px para UI compacta e 14 px para conteúdo decisório.

### 2. Hierarquia da decisão — prioridade alta

Resumo, diretriz, justificativa, evidências, próxima ação e risco tinham peso visual semelhante. A revisão dá mais presença à diretriz e à justificativa, reduz a voz dos metadados e mantém risco/confiança como informação de apoio.

### 3. Excesso de contêineres — prioridade média

Bordas, fundos e sombras estavam presentes em quase todos os níveis. A revisão remove sombras decorativas no modo claro, preserva bordas apenas para agrupamentos funcionais e troca as abas em formato de botão por uma navegação linear com indicador inferior.

### 4. Modo claro — prioridade alta

O tema claro tinha contraste aceitável em tokens centrais, mas vários cianos, verdes e violetas codificados diretamente foram pensados para fundo escuro. A revisão cria equivalentes mais escuros no tema claro, separa melhor canvas, painel e cartão, corrige a exibição do logo e reserva o azul Leapy para seleção, foco e ação primária.

### 5. Ergonomia — prioridade alta

Controles de cabeçalho e envio eram pequenos, as abas competiam por largura e a metade direita não se adaptava bem a telas menores. A revisão estabelece alvos de 36–44 px, permite rolagem horizontal das abas e prioriza o copiloto em telas abaixo de desktop.

### 6. Consistência visual — prioridade média

A combinação Inter + Outfit + JetBrains Mono e a mistura ciano/índigo/violeta criavam três vozes concorrentes. A interface agora usa IBM Plex Sans como família de produto e IBM Plex Mono somente para IDs/dados técnicos. A paleta operacional fica centrada no azul-petróleo, com verde, âmbar e vermelho reservados à semântica.

## Princípios aplicados

- O conteúdo de decisão deve ser lido antes dos detalhes do mecanismo.
- Cor indica ação, seleção ou estado; não decora.
- Metadados podem ser densos, mas nunca minúsculos.
- A interface deve continuar útil sem animação.
- Dados fictícios devem ser visualmente e semanticamente rastreáveis como demonstração.

## Próximas validações recomendadas

- Teste com analistas de CS usando três tarefas: responder objeção, verificar fonte e registrar lacuna.
- Medir tempo para localizar “próxima ação”, “risco” e “fonte usada”.
- Validar o workspace em 1366×768, 1440×900 e 1920×1080.
- Revisar o volume de playbooks rápidos após observar os seis mais usados em operação.
