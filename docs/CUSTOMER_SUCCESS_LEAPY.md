# 📈 Guia Operacional de Customer Success (CS) na Leapy

Este guia estabelece os fundamentos teóricos de Customer Success (CS), as particularidades operacionais da Leapy, as necessidades do time de atendimento e a caracterização dos nossos clientes e público-alvo. Ele serve como referencial teórico e prático para o treinamento de analistas e para a calibragem do **Leapy CSbot**.

---

## 1. O que é Customer Success (CS) e qual o seu papel?

Customer Success (CS) ou **Sucesso do Cliente** é uma estratégia de negócios proativa cujo objetivo principal é garantir que os clientes alcancem os resultados desejados (*Desired Outcomes*) ao utilizar o produto ou serviço da empresa. 

Diferente do Suporte Tradicional (que é reativo e resolve problemas técnicos pontuais), o time de CS atua na:
*   **Adoção (Adoption):** Garantir que o cliente utilize o máximo valor das funcionalidades da plataforma.
*   **Retenção (Retention):** Minimizar cancelamentos (*churn*) e manter a previsibilidade de receita.
*   **Expansão (Expansion):** Identificar oportunidades de aumento de plano (*upsell*) ou venda de novos produtos (*cross-sell*).
*   **Evangelização (Advocacy):** Transformar clientes satisfeitos em promotores ativos da marca.

---

## 2. O Escopo de CS na Leapy: Desafios e Especificidades

A Leapy não é apenas um software de recursos humanos; é uma plataforma que une tecnologia e educação para transformar a contratação de jovens aprendizes de uma obrigação legal em uma **vantagem competitiva de recrutamento**.

Portanto, o analista de CS na Leapy atua na interseção de três grandes pilares:
1.  **Tecnologia (SaaS):** Gestão do portal, integração com ERPs (TOTVS, Senior, SAP) e folhas de pagamento, relatórios de performance e envio automático de eventos ao e-Social.
2.  **Educação (EdTech):** Acompanhamento do desempenho acadêmico, notas e faltas dos jovens formados pela **Leapy GO** (escola técnica oficial da Leapy) ou por outras entidades parceiras.
3.  **Legislação Trabalhista (Compliance):** Navegação estrita pela **Lei do Aprendiz** (cálculo de cotas entre 5% e 15%, verificação de CBOs elegíveis, idades entre 14 e 24 anos, contratos de 24 meses).

---

## 3. Quem são os Clientes e o Público-Alvo da Leapy?

### A. Clientes (Empresas Contratantes)
São organizações de médio e grande porte sujeitas à obrigatoriedade da cota de jovens aprendizes (estabelecimentos com 7 ou mais colaboradores em funções elegíveis).
*   **Segmentos Principais:** Empresas de tecnologia, e-commerce, finanças, manufatura avançada e serviços.
*   **Interlocutores da Leapy:**
    *   **Analistas e Gestores de RH/DP:** Operacionalizam o cadastro, conferem a folha, calculam cotas e acompanham as avaliações.
    *   **Líderes de TI:** Responsáveis por integrar as APIs de dados com os ERPs de pagamento da empresa.
    *   **Diretores e C-Levels:** Focados em métricas macro, redução de multas de fiscalização do trabalho e aumento da taxa de efetivação de aprendizes para oxigenação de talentos.

### B. Público-Alvo (Os Jovens Aprendizes)
Jovens de 14 a 24 anos em busca de inserção no mercado profissional. Eles utilizam a plataforma para fazer as aulas teóricas da Leapy GO, bater ponto prático, acompanhar boletins e tirar dúvidas com a **@FeLeapy** (agente virtual de suporte ao estudante).

---

## 4. Necessidades Cruciais do Time de CS da Leapy

Para garantir a retenção de grandes clientes, o time de CS da Leapy precisa responder rapidamente a dúvidas complexas sobre:
*   **Cálculo e Simulação de Cotas:** Saber orientar o cliente sobre quais funcionários entram na base de cálculo (CBOs elegíveis) e as isenções legais.
*   **Diferenças de Benefícios:** Esclarecer conflitos clássicos, como a restrição de plano de saúde corporativo ou Gympass para estagiários vs. a elegibilidade padrão de jovens aprendizes.
*   **Abrangência e Dissídios:** Tratar reajustes sindicais e dissídios retroativos de acordos coletivos (CCTs), que variam imensamente por estado. A Leapy automatiza esses fluxos no Sudeste/PR, mas exige parametrização manual em outros locais (ex: Bahia).
*   **Segurança e LGPD:** Responder a objeções de segurança de dados de TI (criptografia de ponta a ponta AES-256 e APIs abertas Swagger).

---

## 5. Como o Leapy CSbot Apoia o Analista de CS no Dia a Dia

O **Leapy CSbot** funciona como um "copiloto de decisão assistida" de segunda linha. Ele ajuda a resolver o principal gargalo do CS:
1.  **Redução do Tempo de Resposta:** O analista não precisa pesquisar manuais em PDF; o robô recupera o trecho exato instantaneamente.
2.  **Prevenção de Passivos:** Como o bot cita a fonte exata (ex: `DOC-003 §3.1`), o analista de CS tem a segurança jurídica de que a resposta está homologada.
3.  **Segurança Comercial (Fallback de Preço/Integração):** Bloqueia respostas improvisadas do CS sobre descontos comerciais ou integrações de TI personalizadas, direcionando esses tickets para escalonamento estruturado.
4.  **Feedback Loop de Conhecimento:** Permite que o CS registre perguntas que a base de dados ainda não cobre, gerando rascunhos automatizados para a curadoria.
