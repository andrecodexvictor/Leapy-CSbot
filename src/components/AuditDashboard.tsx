import { useState } from 'react';
import { AuditLog, GraphNode } from '../types';
import { Activity, Clock, ShieldAlert, CheckCircle, FileCode, Trash2, ArrowUpRight, Search, Server, Cpu, Database, Award, ThumbsUp, ThumbsDown, MessageSquare, X, ShieldCheck } from 'lucide-react';

interface AuditDashboardProps {
  logs: AuditLog[];
  allNodes: GraphNode[];
  onClearLogs: () => void;
  onSelectNode: (node: GraphNode) => void;
}

export default function AuditDashboard({ logs, allNodes, onClearLogs, onSelectNode }: AuditDashboardProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedLogForModal, setSelectedLogForModal] = useState<AuditLog | null>(null);

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
              <div className="p-3.5 bg-[var(--bg-body)]/60 border border-[var(--border-main)] rounded-lg border-l-4 border-l-[var(--accent-color)]">
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
                    <span className="text-emerald-400 font-semibold">Ativo (100% Block)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border-main)] bg-[var(--bg-header)] flex justify-between items-center">
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                Log ID: {selectedLogForModal.id}
              </span>
              <button
                onClick={() => setSelectedLogForModal(null)}
                className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/85 text-black font-bold text-xs rounded transition-all shadow-md cursor-pointer"
              >
                Fechar Dossiê
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
