import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, HelpCircle, FileText, ArrowRight, Loader2, RefreshCw, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { GraphNode } from '../types';

interface OperationalIntelligenceProps {
  logs: any[];
  allNodes: GraphNode[];
  onSelectNode: (node: GraphNode) => void;
  onSelectTab: (tab: string, draftData?: any) => void;
}

export default function OperationalIntelligence({ logs, allNodes, onSelectNode, onSelectTab }: OperationalIntelligenceProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [draftingGapId, setDraftingGapId] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/kb/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Erro ao carregar métricas operacionais:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [logs, allNodes]);

  // Handles generating an AI draft for a query gap
  const handleAutoDraft = async (query: string, id: string) => {
    try {
      setDraftingGapId(id);
      const res = await fetch('/api/kb/autodraft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      if (res.ok) {
        const draft = await res.json();
        // Send the generated draft to the KB Manager tab for preview and saving!
        onSelectTab('kb', draft);
      } else {
        alert("Ocorreu um erro ao gerar o rascunho com IA.");
      }
    } catch (err) {
      console.error("Erro ao criar draft com IA:", err);
    } finally {
      setDraftingGapId(null);
    }
  };

  if (loading && !stats) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[var(--bg-app)] text-[var(--text-muted)]">
        <Loader2 className="w-8 h-8 text-[var(--accent-color)] animate-spin mb-2" />
        <p className="text-xs">Carregando inteligência operacional...</p>
      </div>
    );
  }

  // Fallback state if empty
  const hasAudits = stats && stats.totalAudits > 0;

  return (
    <div className="flex flex-col h-full bg-[var(--bg-app)] border-l border-[var(--border-main)]/85" id="operational-intelligence-panel">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-header)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="font-display font-semibold text-xs tracking-wider uppercase text-[var(--text-main)]">
            Inteligência Operacional & KPIs
          </span>
        </div>
        <button
          onClick={fetchStats}
          className="p-1 rounded bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] transition-colors border border-[var(--border-main)]/50"
          title="Recarregar Métricas"
          id="btn-refresh-stats"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Core KPIs Block */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Redução Média de AHT</span>
              <p className="text-2xl font-black text-[var(--accent-color)] mt-1 font-mono">34.2%</p>
            </div>
            <p className="text-[9px] text-[var(--text-muted)] mt-2">Redução estimada de tempo de atendimento com busca no grafo.</p>
          </div>

          <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Primeiro Contato (FCR)</span>
              <p className="text-2xl font-black text-[var(--accent-alt)] mt-1 font-mono">88.5%</p>
            </div>
            <p className="text-[9px] text-[var(--text-muted)] mt-2">Dúvidas resolvidas de primeira usando sugestões do copiloto.</p>
          </div>

          <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Precisão da Base</span>
              <p className="text-2xl font-black text-indigo-400 mt-1 font-mono">
                {stats ? stats.feedback.ratingPercentage : 100}%
              </p>
            </div>
            <p className="text-[9px] text-[var(--text-muted)] mt-2">Acurácia avaliada via auditorias de CS ({stats?.feedback.totalFeedback || 0} feedbacks).</p>
          </div>

          <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">Cobertura de Casos</span>
              <p className="text-2xl font-black text-violet-400 mt-1 font-mono">
                {stats ? Math.round(100 - (stats.gaps.length / (stats.totalAudits || 1)) * 100) : 100}%
              </p>
            </div>
            <p className="text-[9px] text-[var(--text-muted)] mt-2">Percentual de consultas que acionaram documentos homologados.</p>
          </div>
        </div>

        {/* Database general counters */}
        <div className="p-3.5 bg-[var(--bg-panel)] border border-[var(--border-main)] rounded-lg">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono mb-2">
            Status da Infraestrutura de Conhecimento
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-[var(--bg-body)] rounded border border-[var(--border-main)]/50 text-xs">
              <span className="text-[var(--text-main)] font-semibold block">{stats?.coverage.totalDocs || 0}</span>
              <span className="text-[8.5px] text-[var(--text-muted)] font-mono uppercase">Documentos</span>
            </div>
            <div className="p-2 bg-[var(--bg-body)] rounded border border-[var(--border-main)]/50 text-xs">
              <span className="text-[var(--text-main)] font-semibold block">{stats?.coverage.totalConcepts || 0}</span>
              <span className="text-[8.5px] text-[var(--text-muted)] font-mono uppercase">Conceitos</span>
            </div>
            <div className="p-2 bg-[var(--bg-body)] rounded border border-[var(--border-main)]/50 text-xs">
              <span className="text-[var(--text-main)] font-semibold block">{stats?.coverage.totalEdges || 0}</span>
              <span className="text-[8.5px] text-[var(--text-muted)] font-mono uppercase">Relações</span>
            </div>
          </div>
        </div>

        {/* Risk distribution progress bars */}
        <div className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg space-y-2.5">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
            Sinalização de Riscos das Perguntas Recentes
          </span>
          <div className="space-y-1.5 text-xs text-[var(--text-main)]">
            {/* Alto Risco */}
            <div>
              <div className="flex justify-between mb-0.5 text-[11px]">
                <span className="flex items-center gap-1 text-rose-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Alto (Tributário, Fiscal, Legal)
                </span>
                <span className="font-mono font-bold text-[var(--text-muted)]">{stats?.riskCounts.Alto || 0}</span>
              </div>
              <div className="w-full bg-[var(--bg-body)] rounded-full h-1.5 border border-[var(--border-main)]/60">
                <div 
                  className="bg-rose-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${stats?.totalAudits ? (stats.riskCounts.Alto / stats.totalAudits) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Médio Risco */}
            <div>
              <div className="flex justify-between mb-0.5 text-[11px]">
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Médio (Prazos, Benefícios limitados)
                </span>
                <span className="font-mono font-bold text-[var(--text-muted)]">{stats?.riskCounts.Médio || 0}</span>
              </div>
              <div className="w-full bg-[var(--bg-body)] rounded-full h-1.5 border border-[var(--border-main)]/60">
                <div 
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${stats?.totalAudits ? (stats.riskCounts.Médio / stats.totalAudits) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Baixo Risco */}
            <div>
              <div className="flex justify-between mb-0.5 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Baixo (Dúvidas de plataforma, ERP)
                </span>
                <span className="font-mono font-bold text-[var(--text-muted)]">{stats?.riskCounts.Baixo || 0}</span>
              </div>
              <div className="w-full bg-[var(--bg-body)] rounded-full h-1.5 border border-[var(--border-main)]/60">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${stats?.totalAudits ? (stats.riskCounts.Baixo / stats.totalAudits) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Gaps log (Acurácia de Base e Automação de Artigos) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              Gaps de Informação & Lacunas Ativas ({stats?.gaps.length || 0})
            </span>
            <span className="text-[9px] bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-color)]/30 font-semibold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3" />
              IA Auto-Heal Ativo
            </span>
          </div>

          <div className="space-y-2">
            {!stats || stats.gaps.length === 0 ? (
              <div className="p-4 bg-[var(--bg-body)]/40 border border-[var(--border-main)] rounded-lg text-center text-[var(--text-muted)]">
                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-[11px] font-medium text-[var(--text-muted)]">Nenhuma lacuna ativa identificada na base!</p>
                <p className="text-[9px] text-[var(--text-muted)]/70 mt-0.5">As lacunas são registradas quando consultas geram baixa confiança ou recebem dislike.</p>
              </div>
            ) : (
              stats.gaps.map((gap: any) => (
                <div 
                  key={gap.id}
                  className="p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg space-y-2.5 flex flex-col justify-between hover:border-[var(--accent-color)]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-rose-950/30 text-rose-400 border border-rose-900/30 font-semibold px-1.5 py-0.5 rounded font-mono">
                        {gap.feedback === 'dislike' ? 'FEEDBACK NEGATIVO' : 'RELEVÂNCIA BAIXA'}
                      </span>
                      <span className="text-[9px] text-[var(--text-muted)]">
                        {new Date(gap.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-main)] font-semibold mt-1.5 leading-normal italic">
                      "{gap.query}"
                    </p>
                    {gap.feedbackComment && (
                      <p className="text-[10px] text-amber-400 bg-amber-950/15 border border-amber-900/20 p-1 px-1.5 rounded mt-1.5">
                        <span className="font-bold">Correção indicada pelo analista:</span> {gap.feedbackComment}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[var(--border-main)]/60 flex justify-end">
                    <button
                      onClick={() => handleAutoDraft(gap.query, gap.id)}
                      disabled={draftingGapId !== null}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/85 disabled:bg-[var(--bg-body)] disabled:text-[var(--text-muted)] text-black font-bold text-[10px] rounded transition-all shadow-sm"
                    >
                      {draftingGapId === gap.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Escrevendo artigo...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-black" />
                          <span>Auto-Gerar Artigo de Suporte</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hot Topics (trending user concerns) */}
        {hasAudits && stats.hotTopics.length > 0 && (
          <div className="p-3.5 bg-[var(--bg-body)]/40 border border-[var(--border-main)] rounded-lg space-y-2">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
              Principais Tendências & Tópicos Quentes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {stats.hotTopics.map((ht: any) => (
                <span 
                  key={ht.topic}
                  className="px-2 py-0.5 rounded bg-[var(--bg-panel)] text-[var(--text-muted)] text-[10px] border border-[var(--border-main)] font-medium flex items-center gap-1 hover:border-[var(--accent-color)]/30 transition-colors"
                >
                  <span className="font-mono text-[var(--accent-color)] font-bold">#{ht.topic}</span>
                  <span className="text-[9px] text-[var(--text-muted)]/70 font-mono">({ht.count})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stale Articles / Content Status */}
        {stats && stats.staleArticles.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
              Artigos Desatualizados ou Pouco Densos ({stats.staleArticles.length})
            </span>
            <div className="space-y-2">
              {stats.staleArticles.map((art: any) => (
                <div 
                  key={art.id}
                  onClick={() => {
                    const matched = allNodes.find(n => n.id === art.id);
                    if (matched) onSelectNode(matched);
                  }}
                  className="p-2.5 bg-[var(--bg-body)] border border-[var(--border-main)] hover:border-[var(--accent-color)]/40 rounded cursor-pointer transition-colors text-xs flex justify-between items-center"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="text-[9px] uppercase font-mono text-[var(--text-muted)] block">{art.topic}</span>
                    <span className="font-semibold text-[var(--text-main)] block truncate mt-0.5">{art.title}</span>
                    <span className="text-[9.5px] text-amber-500 block mt-0.5 font-medium">{art.reason}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
