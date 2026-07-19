import { useState } from 'react';
import { AuditLog, GraphNode } from '../types';
import { Activity, Clock, ShieldAlert, CheckCircle, FileCode, Trash2, ArrowUpRight, Search, Server, Cpu, Database, Award, ThumbsUp, ThumbsDown, MessageSquare, X, ShieldCheck, Printer } from 'lucide-react';

interface AuditDashboardProps {
  logs: AuditLog[];
  allNodes: GraphNode[];
  onClearLogs: () => void;
  onSelectNode: (node: GraphNode) => void;
}

export default function AuditDashboard({ logs, allNodes, onClearLogs, onSelectNode }: AuditDashboardProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedLogForModal, setSelectedLogForModal] = useState<AuditLog | null>(null);

  const handleExportPDF = (log: AuditLog) => {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const blocks = (log as any).blocks || {};
    const matchedDocsList = log.retrievedDocs.map(docId => {
      const matchedNode = allNodes.find(n => n.type === 'document' && n.filename === docId) as any;
      return {
        id: docId,
        topic: matchedNode?.topic || 'Playbook Geral',
        content: matchedNode?.content || 'Conteúdo do artigo operacional da Leapy.'
      };
    });

    const directConceptsList = log.matchedNodes.map(nodeId => {
      const matched = allNodes.find(n => n.id === nodeId);
      return {
        id: nodeId,
        title: matched?.title || nodeId,
        description: (matched as any)?.description || 'Nó conceitual ativado.'
      };
    });

    const isHigh = log.confidence === 'Alta';
    const isMedium = log.confidence === 'Média';
    const confidenceClass = isHigh ? 'badge-success' : isMedium ? 'badge-warning' : 'badge-danger';
    
    const risk = blocks.sinalizacaoRisco || 'Baixo';
    const riskClass = risk === 'Alto' ? 'badge-danger' : risk === 'Médio' ? 'badge-warning' : 'badge-success';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Dossiê de Auditoria Leapy - ${log.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
            body {
              font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
              color: #0F172A;
              background: #FFFFFF;
              padding: 40px;
              font-size: 12px;
              line-height: 1.6;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .header {
              border-bottom: 2px solid #0284C7;
              padding-bottom: 16px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .brand {
              font-size: 20px;
              font-weight: 800;
              color: #0284C7;
              letter-spacing: -0.5px;
            }
            .subtitle {
              font-size: 9px;
              color: #64748B;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 2px;
              font-weight: 600;
            }
            .doc-id {
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              background: #F1F5F9;
              padding: 4px 8px;
              border-radius: 4px;
              color: #334155;
              border: 1px solid #E2E8F0;
            }
            .section-title {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              color: #334155;
              border-bottom: 1px solid #E2E8F0;
              padding-bottom: 6px;
              margin-top: 24px;
              margin-bottom: 12px;
              letter-spacing: 0.5px;
            }
            .query-box {
              background: #F8FAFC;
              border: 1px solid #CBD5E1;
              padding: 12px 16px;
              border-radius: 4px;
              font-style: italic;
              font-size: 12.5px;
              color: #1E293B;
              margin-bottom: 20px;
            }
            .grid-kpis {
              display: grid;
              grid-template-cols: repeat(4, 1fr);
              gap: 12px;
              margin-bottom: 24px;
            }
            .kpi-card {
              background: #F8FAFC;
              border: 1px solid #E2E8F0;
              border-radius: 6px;
              padding: 10px;
            }
            .kpi-label {
              font-size: 8px;
              color: #64748B;
              text-transform: uppercase;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
            .kpi-value {
              font-size: 11px;
              font-weight: 700;
              color: #0F172A;
              margin-top: 4px;
            }
            .badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              border: 1px solid transparent;
            }
            .badge-success { background: #DCFCE7; color: #15803D; border-color: #BBF7D0; }
            .badge-warning { background: #FEF3C7; color: #B45309; border-color: #FDE68A; }
            .badge-danger { background: #FEE2E2; color: #B91C1C; border-color: #FCA5A5; }
            
            .content-block {
              background: #FDFDFD;
              border: 1px solid #E2E8F0;
              border-radius: 6px;
              padding: 14px;
              margin-bottom: 16px;
            }
            .content-header {
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              color: #64748B;
              margin-bottom: 6px;
              letter-spacing: 0.5px;
            }
            .content-text {
              font-size: 11.5px;
              color: #0F172A;
              line-height: 1.5;
            }
            .highlight-box {
              background: #F0F9FF;
              border: 1px solid #B9E6FE;
              border-radius: 6px;
              padding: 14px;
              margin-bottom: 16px;
              color: #0369A1;
            }
            .highlight-text {
              font-size: 12px;
              font-weight: 500;
              line-height: 1.5;
            }
            .doc-card {
              border: 1px solid #E2E8F0;
              border-radius: 6px;
              padding: 10px;
              margin-bottom: 8px;
              background: #FAFAFA;
              page-break-inside: avoid;
            }
            .doc-meta {
              display: flex;
              justify-content: space-between;
              font-size: 9px;
              font-weight: 700;
              color: #475569;
              font-family: 'JetBrains Mono', monospace;
            }
            .doc-content {
              font-size: 11px;
              color: #475569;
              margin-top: 4px;
              font-style: italic;
              line-height: 1.4;
            }
            .tech-specs {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              background: #F8FAFC;
              border: 1px solid #E2E8F0;
              border-radius: 6px;
              padding: 10px;
              display: grid;
              grid-template-cols: repeat(4, 1fr);
              gap: 10px;
              color: #475569;
            }
            .tech-item span {
              display: block;
            }
            .tech-label {
              font-size: 8px;
              color: #64748B;
              text-transform: uppercase;
              font-weight: bold;
              margin-bottom: 2px;
            }
            .footer {
              margin-top: 40px;
              border-top: 1px solid #E2E8F0;
              padding-top: 12px;
              font-size: 9px;
              color: #94A3B8;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-family: 'JetBrains Mono', monospace;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">Leapy CSbot</div>
              <div class="subtitle">Dossiê de Auditoria Cognitiva de Customer Success</div>
            </div>
            <div class="doc-id">AUDIT-ID: ${log.id}</div>
          </div>

          <div class="section-title">Consulta Submetida pelo Analista</div>
          <div class="query-box">
            "${log.query}"
          </div>

          <div class="section-title">Avaliação e Parâmetros Cognitivos</div>
          <div class="grid-kpis">
            <div class="kpi-card">
              <div class="kpi-label">Confiança do Grafo</div>
              <div class="kpi-value">
                <span class="badge ${confidenceClass}">${log.confidence}</span>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Classificação de Intenção</div>
              <div class="kpi-value" style="font-size: 10px;">${blocks.classificacaoIntencao || 'N/A'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Sinalização de Risco</div>
              <div class="kpi-value">
                <span class="badge ${riskClass}">${risk}</span>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Carimbo de Data/Hora</div>
              <div class="kpi-value" style="font-size: 10px;">${new Date(log.timestamp).toLocaleString()}</div>
            </div>
          </div>

          <div class="section-title">Diretriz Operacional Emitida</div>
          <div class="highlight-box">
            <div class="content-header" style="color: #0369A1;">1. Diretriz com Referência</div>
            <div class="highlight-text">
              ${blocks.respostaObjetiva || (log as any).text || ''}
            </div>
          </div>

          <div class="content-block">
            <div class="content-header">2. Resumo Contextualizado</div>
            <div class="content-text">${blocks.resumoCaso || 'N/A'}</div>
          </div>

          <div class="content-block">
            <div class="content-header">3. Justificativa Estruturada</div>
            <div class="content-text">${blocks.justificativa || 'N/A'}</div>
          </div>

          <div class="content-block">
            <div class="content-header">4. Próxima Ação recomendada (CS)</div>
            <div class="content-text" style="color: #0284C7; font-weight: 500;">${blocks.proximaAcaoRecomendada || 'N/A'}</div>
          </div>

          ${blocks.ressalvas ? `
          <div class="content-block" style="border: 1px solid #F1C27D; background: #FFFDF5;">
            <div class="content-header" style="color: #B45309;">Observações & Ressalvas</div>
            <div class="content-text">${blocks.ressalvas}</div>
          </div>
          ` : ''}

          <div class="section-title">Evidências e Grounding (Artigos do Playbook Associados)</div>
          ${matchedDocsList.length === 0 ? `
            <div style="padding: 10px; background: #FEE2E2; color: #B91C1C; border-radius: 4px; font-weight: 500; font-family: monospace; font-size: 10px; text-align: center;">
              ⚠️ NENHUM DOCUMENTO ENCONTRADO NO VECTOR DB (EXECUÇÃO DE FALLBACK OPERATIVO)
            </div>
          ` : matchedDocsList.map(doc => `
            <div class="doc-card">
              <div class="doc-meta">
                <span>📄 ${doc.id}</span>
                <span>Tópico: ${doc.topic}</span>
              </div>
              <div class="doc-content">"${doc.content}"</div>
            </div>
          `).join('')}

          ${directConceptsList.length > 0 ? `
            <div class="section-title">Conceitos Relacionados</div>
            <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 10px;">
              ${directConceptsList.map(c => `
                <div style="border: 1px solid #E2E8F0; padding: 10px; border-radius: 6px; background: #FAFDFE;">
                  <div style="font-weight: 700; color: #0284C7; font-size: 10.5px;">🔗 ${c.title}</div>
                  <div style="font-size: 10px; color: #475569; margin-top: 3px;">${c.description}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="section-title" style="margin-top: 30px;">Especificações Técnicas de Grounding</div>
          <div class="tech-specs">
            <div class="tech-item">
              <span class="tech-label">LLM Engine</span>
              <span>Gemini 2.5 Flash</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">Temperature</span>
              <span>0.15 (Strict)</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">Grounding Mode</span>
              <span>Grafo Híbrido</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">Filtros</span>
              <span>Safety Block Ativo</span>
            </div>
          </div>

          <div class="footer">
            <span>Leapy CSbot © 2026</span>
            <span>Relatório de Auditoria do Protótipo</span>
            <span>Página 1 de 1</span>
          </div>
        </body>
      </html>
    `;

    printFrame.contentWindow?.document.open();
    printFrame.contentWindow?.document.write(htmlContent);
    printFrame.contentWindow?.document.close();

    printFrame.onload = () => {
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }, 500);
    };
  };

  const getNodeTitle = (id: string) => {
    const node = allNodes.find(n => n.id === id);
    return node ? node.title : id;
  };

  const filteredLogs = logs.filter(log => 
    log.query.toLowerCase().includes(filterQuery.toLowerCase()) ||
    log.confidence.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Statistics calculations
  const totalDocs = allNodes.filter(n => n.type === 'document').length;
  const totalConcepts = allNodes.filter(n => n.type === 'concept').length;
  const highConfidenceLogs = logs.filter(l => l.confidence === 'Alta' || l.confidence === 'Média').length;
  const confidenceRatio = logs.length > 0 ? Math.round((highConfidenceLogs / logs.length) * 100) : 100;

  return (
    <div 
      className="flex flex-col h-full bg-[var(--bg-app)] border-l border-[var(--border-main)]/80"
      id="audit-dashboard"
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-header)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-display font-semibold text-xs tracking-wider uppercase text-[var(--text-main)]">Terminal de Auditoria Operacional</span>
        </div>
        <button
          onClick={onClearLogs}
          disabled={logs.length === 0}
          className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 rounded border border-rose-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          id="btn-clear-audit-logs"
        >
          <Trash2 className="w-3 h-3" />
          <span>Limpar</span>
        </button>
      </div>

      {/* Tabs / Stack Information Card */}
      <div className="p-4 bg-[var(--bg-panel)] border-b border-[var(--border-main)] text-[11px] text-[var(--text-muted)] space-y-3">
        <div className="flex items-center gap-1.5 text-[var(--text-main)] font-semibold uppercase tracking-wider text-[10px]">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stack Tecnológica & Homologação</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] bg-[var(--bg-body)] p-2.5 rounded border border-[var(--border-main)]">
          <div className="space-y-1">
            <span className="text-[var(--text-muted)] font-medium block">FRONTEND ARCHITECTURE</span>
            <ul className="list-disc pl-3 text-[var(--text-muted)] space-y-0.5 font-mono text-[9px]">
              <li>React 18 + TS + Vite</li>
              <li>Tailwind CSS Utility Engine</li>
              <li>Obsidian-style Concept Graph</li>
              <li>Zustand Operational State</li>
            </ul>
          </div>
          <div className="space-y-1">
            <span className="text-[var(--text-muted)] font-medium block">BACKEND & AI COGNITION</span>
            <ul className="list-disc pl-3 text-[var(--text-muted)] space-y-0.5 font-mono text-[9px]">
              <li>Node.js / Express Service</li>
              <li>Google GenAI (Gemini SDK)</li>
              <li>ChromaDB Local Vector Mock</li>
              <li>Graph Retrieval Index</li>
            </ul>
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="bg-[var(--bg-body)] p-2 rounded border border-[var(--border-main)]/40">
            <span className="text-[var(--text-muted)] text-[9px] block uppercase font-mono">Artigos</span>
            <span className="text-xs font-bold text-[var(--text-main)]">{totalDocs} docs</span>
          </div>
          <div className="bg-[var(--bg-body)] p-2 rounded border border-[var(--border-main)]/40">
            <span className="text-[var(--text-muted)] text-[9px] block uppercase font-mono">Conceitos</span>
            <span className="text-xs font-bold text-[var(--text-main)]">{totalConcepts} nós</span>
          </div>
          <div className="bg-[var(--bg-body)] p-2 rounded border border-[var(--border-main)]/40">
            <span className="text-[var(--text-muted)] text-[9px] block uppercase font-mono">Confiança</span>
            <span className="text-xs font-bold text-emerald-400">{confidenceRatio}%</span>
          </div>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="p-2.5 border-b border-[var(--border-main)] bg-[var(--bg-panel)]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Pesquisar auditorias..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-500/50 transition-colors"
            id="audit-filter-input"
          />
        </div>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5" id="audit-logs-list">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <FileCode className="w-8 h-8 stroke-[1.2] mb-2 text-slate-600" />
            <p className="text-xs">Nenhum registro de recuperação encontrado.</p>
            <p className="text-[10px] text-slate-600 mt-1">Consulte o copiloto para disparar auditorias em tempo real.</p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const extra = (log as any).blocks || {};
            const riskColors = {
              'Alto': 'bg-rose-950/40 text-rose-400 border border-rose-900/50',
              'Médio': 'bg-amber-950/40 text-amber-400 border border-amber-900/50',
              'Baixo': 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50'
            };

            return (
              <div 
                key={log.id} 
                className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg flex flex-col gap-3 hover:border-[var(--accent-color)]/30 transition-all"
                id={`audit-log-item-${log.id}`}
              >
                {/* Log Header */}
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {log.confidence === 'Alta' ? (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-900/30">
                        <CheckCircle className="w-2.5 h-2.5" />
                        Confiança Alta
                      </span>
                    ) : log.confidence === 'Média' ? (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 font-bold border border-amber-900/30">
                        <CheckCircle className="w-2.5 h-2.5" />
                        Confiança Média
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-400 font-bold border border-rose-900/30">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        Confiança {log.confidence}
                      </span>
                    )}
                  </div>
                </div>

                {/* User Query */}
                <div className="text-xs">
                  <span className="text-[9px] font-semibold text-[var(--text-muted)] block uppercase tracking-wider font-mono">Pergunta do Analista</span>
                  <p className="text-[var(--text-main)] mt-0.5 font-medium italic">"{log.query}"</p>
                </div>

                {/* Enriched Operational Blocks (Intenção, Risco, Recomendação) */}
                {extra.classificacaoIntencao && (
                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-[var(--bg-body)] p-2 rounded border border-[var(--border-main)]/60">
                    <div>
                      <span className="text-[var(--text-muted)] font-semibold block uppercase tracking-wider font-mono text-[8px]">Intenção Identificada</span>
                      <span className="text-[var(--text-main)] font-medium block mt-0.5">{extra.classificacaoIntencao}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] font-semibold block uppercase tracking-wider font-mono text-[8px]">Sinalização de Risco</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold inline-block mt-1 ${riskColors[extra.sinalizacaoRisco as 'Alto'|'Médio'|'Baixo'] || 'bg-[var(--bg-panel)] text-[var(--text-muted)]'}`}>
                        {extra.sinalizacaoRisco || 'Baixo'}
                      </span>
                    </div>
                  </div>
                )}

                {extra.proximaAcaoRecomendada && (
                  <div className="text-[10px] bg-[var(--bg-body)]/50 p-2 rounded border border-[var(--border-main)]/40">
                    <span className="text-[var(--accent-color)] font-semibold block uppercase tracking-wider font-mono text-[8.5px]">Próxima Ação Sugerida (Tática)</span>
                    <p className="text-[var(--text-muted)] mt-0.5">{extra.proximaAcaoRecomendada}</p>
                  </div>
                )}

                {/* User Feedback in Log */}
                {((log as any).feedback || (log as any).feedbackComment) && (
                  <div className="text-[10px] bg-[var(--accent-glow)] p-2 rounded border border-[var(--accent-color)]/20 flex gap-2">
                    <div className="mt-0.5">
                      {(log as any).feedback === 'like' ? (
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] font-bold block">Feedback do Analista</span>
                      <p className="text-[var(--text-main)] italic">"{(log as any).feedbackComment || 'Sem comentários'}"</p>
                    </div>
                  </div>
                )}

                {/* Retrieved Sources (Hidden from Public Chat, Audited Here) */}
                <div className="space-y-1.5 border-t border-[var(--border-main)]/60 pt-2 text-[10px]">
                  <span className="text-[9px] font-semibold text-[var(--text-muted)] block uppercase tracking-wider font-mono">Fontes de Dados Recuperadas (Ocultas do Chat)</span>
                  {log.retrievedDocs.length === 0 ? (
                    <span className="text-rose-400 font-semibold block uppercase text-[9px]">⚠️ NENHUM DOCUMENTO RETRIEVED (FALLBACK OPERATIVO)</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {log.retrievedDocs.map(doc => (
                        <div 
                          key={doc}
                          className="flex items-center justify-between p-1 px-1.5 rounded bg-[var(--bg-body)] text-[var(--text-main)] font-mono text-[9px]"
                        >
                          <span>📄 {doc}</span>
                          <button
                            onClick={() => {
                              const node = allNodes.find(n => n.type === 'document' && n.filename === doc);
                              if (node) onSelectNode(node);
                            }}
                            className="text-[var(--accent-color)] hover:text-[var(--accent-color)] font-sans font-medium flex items-center gap-0.5"
                          >
                            Mapear
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Graph concepts and expansion audit */}
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-[var(--border-main)]/60 pt-2">
                  <div>
                    <span className="text-[var(--text-muted)] font-semibold block uppercase font-mono">Conceitos Diretos</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {log.matchedNodes.length === 0 ? (
                        <span className="text-[var(--text-muted)] italic">Nenhum</span>
                      ) : (
                        log.matchedNodes.map(nodeId => (
                          <span 
                            key={nodeId}
                            onClick={() => {
                              const node = allNodes.find(n => n.id === nodeId);
                              if (node) onSelectNode(node);
                            }}
                            className="px-1 py-0.5 rounded bg-[var(--bg-panel)] text-[var(--accent-color)] cursor-pointer hover:bg-[var(--bg-card-hover)] font-mono"
                          >
                            {getNodeTitle(nodeId).split(' (')[0]}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] font-semibold block uppercase font-mono">Caminho Expandido</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {log.expandedNodes.length === 0 ? (
                        <span className="text-[var(--text-muted)] italic">Nenhum</span>
                      ) : (
                        log.expandedNodes.map(nodeId => (
                          <span 
                            key={nodeId}
                            onClick={() => {
                              const node = allNodes.find(n => n.id === nodeId);
                              if (node) onSelectNode(node);
                            }}
                            className="px-1 py-0.5 rounded bg-[var(--bg-panel)] text-indigo-400 cursor-pointer hover:bg-[var(--bg-card-hover)] font-mono"
                          >
                            {getNodeTitle(nodeId).split(' (')[0]}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Analyis trigger */}
                <div className="pt-2.5 border-t border-[var(--border-main)]/60 flex justify-end">
                  <button
                    onClick={() => setSelectedLogForModal(log)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-card-hover)] text-[var(--accent-color)] hover:text-[var(--text-main)] text-[10px] font-bold border border-[var(--border-main)] transition-colors cursor-pointer"
                  >
                    <span>Analisar Auditoria Completa</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Audit Dossier Modal */}
      {selectedLogForModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-header)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                <span className="font-display font-semibold text-xs tracking-wider uppercase text-[var(--text-main)]">
                  Dossiê de Auditoria Interna
                </span>
              </div>
              <button 
                onClick={() => setSelectedLogForModal(null)}
                className="p-1 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[var(--text-main)]">
              {/* Question */}
              <div className="p-3.5 bg-[var(--bg-body)]/60 border border-[var(--border-main)] rounded-lg">
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">Consulta Submetida</span>
                <p className="font-semibold text-xs text-[var(--text-main)] mt-1 italic">
                  "{selectedLogForModal.query}"
                </p>
              </div>

              {/* Bento Parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-[var(--bg-body)]/40 border border-[var(--border-main)] rounded-lg">
                  <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">Nível de Confiança</span>
                  <span className={`text-[11px] font-bold block mt-1 ${
                    selectedLogForModal.confidence === 'Alta' ? 'text-emerald-400' : selectedLogForModal.confidence === 'Média' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {selectedLogForModal.confidence}
                  </span>
                </div>

                <div className="p-3 bg-[var(--bg-body)]/40 border border-[var(--border-main)] rounded-lg">
                  <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">Intenção Identificada</span>
                  <span className="text-[11px] text-[var(--text-main)] font-semibold block mt-1 truncate">
                    {((selectedLogForModal as any).blocks?.classificacaoIntencao) || 'N/A'}
                  </span>
                </div>

                <div className="p-3 bg-[var(--bg-body)]/40 border border-[var(--border-main)] rounded-lg">
                  <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">Nível de Risco</span>
                  <span className={`text-[11px] font-bold block mt-1 ${
                    ((selectedLogForModal as any).blocks?.sinalizacaoRisco) === 'Alto' ? 'text-rose-400' : ((selectedLogForModal as any).blocks?.sinalizacaoRisco) === 'Médio' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {((selectedLogForModal as any).blocks?.sinalizacaoRisco) || 'Baixo'}
                  </span>
                </div>

                <div className="p-3 bg-[var(--bg-body)]/40 border border-[var(--border-main)] rounded-lg">
                  <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">Carimbo de Data/Hora</span>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono block mt-1">
                    {new Date(selectedLogForModal.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* RAG Context Retrieval Details */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
                  Mecanismo RAG: Ingestão de Documentos do Playbook
                </span>
                
                {selectedLogForModal.retrievedDocs.length === 0 ? (
                  <div className="p-3 bg-rose-950/20 border border-rose-900/30 text-rose-400 rounded text-center font-mono text-[10px]">
                    ⚠️ NENHUM DOCUMENTO ENCONTRADO NO VECTOR DB (EXECUÇÃO DE FALLBACK OPERATIVO)
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {selectedLogForModal.retrievedDocs.map(docId => {
                      const matchedNode = allNodes.find(n => n.type === 'document' && n.filename === docId);
                      return (
                        <div key={docId} className="p-3 bg-[var(--bg-body)]/80 border border-[var(--border-main)] rounded-lg space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[var(--text-main)] font-mono text-[10.5px]">📄 {docId}</span>
                            {matchedNode && matchedNode.type === 'document' && (
                              <span className="text-[9px] text-[var(--accent-alt)] font-semibold uppercase px-1.5 py-0.2 rounded bg-emerald-950/20 border border-emerald-900/30">
                                {matchedNode.topic}
                              </span>
                            )}
                          </div>
                          {matchedNode && matchedNode.type === 'document' && (
                            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed italic line-clamp-3">
                              "{matchedNode.content}"
                            </p>
                          )}
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                if (matchedNode) {
                                  onSelectNode(matchedNode);
                                  setSelectedLogForModal(null);
                                }
                              }}
                              className="text-[10px] text-[var(--accent-color)] font-bold flex items-center gap-1 hover:underline"
                            >
                              <span>Visualizar no Grafo</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Graph concepts mapped */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
                  Mecanismo Cognitivo: Nós de Conceito e Decisão Ativados
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Direct concepts */}
                  <div className="p-3.5 bg-[var(--bg-body)]/40 border border-[var(--border-main)] rounded-lg space-y-2">
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">Nós Mapeados (Diretos)</span>
                    <div className="space-y-1.5">
                      {selectedLogForModal.matchedNodes.length === 0 ? (
                        <span className="text-[var(--text-muted)] italic block text-[10px]">Nenhum nó mapeado diretamente.</span>
                      ) : (
                        selectedLogForModal.matchedNodes.map(nodeId => {
                          const matched = allNodes.find(n => n.id === nodeId);
                          return (
                            <div 
                              key={nodeId}
                              onClick={() => {
                                if (matched) {
                                  onSelectNode(matched);
                                  setSelectedLogForModal(null);
                                }
                              }}
                              className="p-2 rounded bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[var(--accent-color)] transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)] text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]"></span>
                                <span className="truncate">{matched ? matched.title : nodeId}</span>
                              </div>
                              {matched && matched.type === 'concept' && matched.description && (
                                <p className="text-[9px] text-[var(--text-muted)] truncate mt-0.5">{matched.description}</p>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Expanded path */}
                  <div className="p-3.5 bg-[var(--bg-body)]/40 border border-[var(--border-main)] rounded-lg space-y-2">
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">Caminho Expandido (Inferência)</span>
                    <div className="space-y-1.5">
                      {selectedLogForModal.expandedNodes.length === 0 ? (
                        <span className="text-[var(--text-muted)] italic block text-[10px]">Nenhum nó expandido na vizinhança.</span>
                      ) : (
                        selectedLogForModal.expandedNodes.map(nodeId => {
                          const matched = allNodes.find(n => n.id === nodeId);
                          return (
                            <div 
                              key={nodeId}
                              onClick={() => {
                                if (matched) {
                                  onSelectNode(matched);
                                  setSelectedLogForModal(null);
                                }
                              }}
                              className="p-2 rounded bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-indigo-400 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)] text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                <span className="truncate">{matched ? matched.title : nodeId}</span>
                              </div>
                              {matched && matched.type === 'concept' && matched.description && (
                                <p className="text-[9px] text-[var(--text-muted)] truncate mt-0.5">{matched.description}</p>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical API Parameters */}
              <div className="p-3.5 bg-[var(--bg-panel)]/50 border border-[var(--border-main)] rounded-lg space-y-2">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">Configurações Técnicas & Grounding</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[9px] text-[var(--text-muted)]">
                  <div>
                    <span className="font-sans block text-[8px] text-[var(--text-muted)]/70 uppercase">LLM Engine</span>
                    <span className="text-[var(--text-main)] font-semibold">Gemini 2.5 Flash</span>
                  </div>
                  <div>
                    <span className="font-sans block text-[8px] text-[var(--text-muted)]/70 uppercase">Temperature</span>
                    <span className="text-[var(--text-main)] font-semibold">0.15 (Foco estrito)</span>
                  </div>
                  <div>
                    <span className="font-sans block text-[8px] text-[var(--text-muted)]/70 uppercase">Grounding Mode</span>
                    <span className="text-[var(--text-main)] font-semibold">Grafo Híbrido</span>
                  </div>
                  <div>
                    <span className="font-sans block text-[8px] text-[var(--text-muted)]/70 uppercase">Filtro de Segurança</span>
                    <span className="text-emerald-400 font-semibold">Bloqueio ativo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border-main)] bg-[var(--bg-header)] flex justify-between items-center gap-2">
              <span className="text-[10px] text-[var(--text-muted)] font-mono hidden sm:inline">
                Log ID: {selectedLogForModal.id}
              </span>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleExportPDF(selectedLogForModal)}
                  className="px-3.5 py-2 bg-[var(--bg-panel)] hover:bg-[var(--bg-card-hover)] text-[var(--accent-color)] font-bold text-xs rounded border border-[var(--border-main)] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Exportar como PDF para arquivamento ou conformidade"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Exportar PDF</span>
                </button>
                <button
                  onClick={() => setSelectedLogForModal(null)}
                  className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/85 text-black font-bold text-xs rounded transition-all shadow-md cursor-pointer"
                >
                  Fechar Dossiê
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
