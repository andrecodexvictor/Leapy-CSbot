import { useState } from 'react';
import { AuditLog, GraphNode } from '../types';
import { Activity, Clock, ShieldAlert, CheckCircle, FileCode, Trash2, ArrowUpRight, Search, Server, Cpu, Database, Award, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface AuditDashboardProps {
  logs: AuditLog[];
  allNodes: GraphNode[];
  onClearLogs: () => void;
  onSelectNode: (node: GraphNode) => void;
}

export default function AuditDashboard({ logs, allNodes, onClearLogs, onSelectNode }: AuditDashboardProps) {
  const [filterQuery, setFilterQuery] = useState('');

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
      className="flex flex-col h-full bg-[#0d111d] border-l border-slate-800/80"
      id="audit-dashboard"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-[#0f1424]/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-display font-semibold text-xs tracking-wider uppercase text-slate-200">Terminal de Auditoria Operacional</span>
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
      <div className="p-4 bg-slate-950/60 border-b border-slate-800/60 text-[11px] text-slate-400 space-y-3">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stack Tecnológica & Homologação</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/80 p-2.5 rounded border border-slate-800/60">
          <div className="space-y-1">
            <span className="text-slate-500 font-medium block">FRONTEND ARCHITECTURE</span>
            <ul className="list-disc pl-3 text-slate-400 space-y-0.5 font-mono text-[9px]">
              <li>React 18 + TS + Vite</li>
              <li>Tailwind CSS Utility Engine</li>
              <li>Obsidian-style Concept Graph</li>
              <li>Zustand Operational State</li>
            </ul>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-medium block">BACKEND & AI COGNITION</span>
            <ul className="list-disc pl-3 text-slate-400 space-y-0.5 font-mono text-[9px]">
              <li>Node.js / Express Service</li>
              <li>Google GenAI (Gemini SDK)</li>
              <li>ChromaDB Local Vector Mock</li>
              <li>Graph Retrieval Index</li>
            </ul>
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="bg-slate-900/50 p-2 rounded border border-slate-800/40">
            <span className="text-slate-500 text-[9px] block uppercase font-mono">Artigos</span>
            <span className="text-xs font-bold text-slate-200">{totalDocs} docs</span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded border border-slate-800/40">
            <span className="text-slate-500 text-[9px] block uppercase font-mono">Conceitos</span>
            <span className="text-xs font-bold text-slate-200">{totalConcepts} nós</span>
          </div>
          <div className="bg-slate-900/50 p-2 rounded border border-slate-800/40">
            <span className="text-slate-500 text-[9px] block uppercase font-mono">Confiança</span>
            <span className="text-xs font-bold text-emerald-400">{confidenceRatio}%</span>
          </div>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="p-2.5 border-b border-slate-800 bg-[#0a0d16]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar auditorias..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900/40 border border-slate-800 rounded text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
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
                className="p-3.5 bg-[#121624]/60 border border-slate-850 rounded-lg flex flex-col gap-3 hover:border-slate-700/60 transition-all"
                id={`audit-log-item-${log.id}`}
              >
                {/* Log Header */}
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
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
                  <span className="text-[9px] font-semibold text-slate-500 block uppercase tracking-wider font-mono">Pergunta do Analista</span>
                  <p className="text-slate-200 mt-0.5 font-medium italic">"{log.query}"</p>
                </div>

                {/* Enriched Operational Blocks (Intenção, Risco, Recomendação) */}
                {extra.classificacaoIntencao && (
                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/40 p-2 rounded border border-slate-850/60">
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase tracking-wider font-mono text-[8px]">Intenção Identificada</span>
                      <span className="text-slate-300 font-medium block mt-0.5">{extra.classificacaoIntencao}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase tracking-wider font-mono text-[8px]">Sinalização de Risco</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold inline-block mt-1 ${riskColors[extra.sinalizacaoRisco as 'Alto'|'Médio'|'Baixo'] || 'bg-slate-800 text-slate-400'}`}>
                        {extra.sinalizacaoRisco || 'Baixo'}
                      </span>
                    </div>
                  </div>
                )}

                {extra.proximaAcaoRecomendada && (
                  <div className="text-[10px] bg-slate-950/30 p-2 rounded border border-slate-850/40">
                    <span className="text-cyan-400 font-semibold block uppercase tracking-wider font-mono text-[8.5px]">Próxima Ação Sugerida (Tática)</span>
                    <p className="text-slate-300 mt-0.5">{extra.proximaAcaoRecomendada}</p>
                  </div>
                )}

                {/* User Feedback in Log */}
                {((log as any).feedback || (log as any).feedbackComment) && (
                  <div className="text-[10px] bg-cyan-950/20 p-2 rounded border border-cyan-900/20 flex gap-2">
                    <div className="mt-0.5">
                      {(log as any).feedback === 'like' ? (
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">Feedback do Analista</span>
                      <p className="text-slate-300 italic">"{(log as any).feedbackComment || 'Sem comentários'}"</p>
                    </div>
                  </div>
                )}

                {/* Retrieved Sources (Hidden from Public Chat, Audited Here) */}
                <div className="space-y-1.5 border-t border-slate-850/60 pt-2 text-[10px]">
                  <span className="text-[9px] font-semibold text-slate-500 block uppercase tracking-wider font-mono">Fontes de Dados Recuperadas (Ocultas do Chat)</span>
                  {log.retrievedDocs.length === 0 ? (
                    <span className="text-rose-400 font-semibold block uppercase text-[9px]">⚠️ NENHUM DOCUMENTO RETRIEVED (FALLBACK OPERATIVO)</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {log.retrievedDocs.map(doc => (
                        <div 
                          key={doc}
                          className="flex items-center justify-between p-1 px-1.5 rounded bg-slate-950 text-slate-300 font-mono text-[9px]"
                        >
                          <span>📄 {doc}</span>
                          <button
                            onClick={() => {
                              const node = allNodes.find(n => n.type === 'document' && n.filename === doc);
                              if (node) onSelectNode(node);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 font-sans font-medium flex items-center gap-0.5"
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
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-slate-850/60 pt-2">
                  <div>
                    <span className="text-slate-500 font-semibold block uppercase font-mono">Conceitos Diretos</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {log.matchedNodes.length === 0 ? (
                        <span className="text-slate-600 italic">Nenhum</span>
                      ) : (
                        log.matchedNodes.map(nodeId => (
                          <span 
                            key={nodeId}
                            onClick={() => {
                              const node = allNodes.find(n => n.id === nodeId);
                              if (node) onSelectNode(node);
                            }}
                            className="px-1 py-0.5 rounded bg-slate-800 text-cyan-400 cursor-pointer hover:bg-slate-700 font-mono"
                          >
                            {getNodeTitle(nodeId).split(' (')[0]}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block uppercase font-mono">Caminho Expandido</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {log.expandedNodes.length === 0 ? (
                        <span className="text-slate-600 italic">Nenhum</span>
                      ) : (
                        log.expandedNodes.map(nodeId => (
                          <span 
                            key={nodeId}
                            onClick={() => {
                              const node = allNodes.find(n => n.id === nodeId);
                              if (node) onSelectNode(node);
                            }}
                            className="px-1 py-0.5 rounded bg-slate-800 text-indigo-400 cursor-pointer hover:bg-slate-700 font-mono"
                          >
                            {getNodeTitle(nodeId).split(' (')[0]}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
