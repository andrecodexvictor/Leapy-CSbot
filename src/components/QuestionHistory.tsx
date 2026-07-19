import { useMemo, useState } from 'react';
import { Clock3, FileText, History, MessageSquare, RotateCcw, Search } from 'lucide-react';
import { AuditLog } from '../types';

interface QuestionHistoryProps {
  logs: AuditLog[];
  onReuseQuestion: (question: string) => void;
}

const confidenceStyles: Record<string, string> = {
  Alta: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  Média: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  Baixa: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
  Nenhuma: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
};

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return timestamp;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function QuestionHistory({ logs, onReuseQuestion }: QuestionHistoryProps) {
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');

    if (!normalizedSearch) return logs;

    return logs.filter(log => log.query.toLocaleLowerCase('pt-BR').includes(normalizedSearch));
  }, [logs, search]);

  return (
    <section className="h-full flex flex-col bg-[var(--bg-app)]" aria-labelledby="question-history-title">
      <header className="p-4 border-b app-border bg-[var(--bg-panel)] shrink-0 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-glow)] text-[var(--accent-color)] flex items-center justify-center shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 id="question-history-title" className="text-sm font-semibold text-[var(--text-main)]">
                Histórico de perguntas
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Consulte e reutilize dúvidas enviadas anteriormente.
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded-full bg-[var(--bg-body)] border app-border text-[10px] font-medium text-[var(--text-muted)] shrink-0">
            {logs.length} {logs.length === 1 ? 'pergunta' : 'perguntas'}
          </span>
        </div>

        <label className="relative block">
          <span className="sr-only">Buscar no histórico</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Buscar pergunta anterior..."
            className="w-full min-h-9 pl-9 pr-3 rounded-lg bg-[var(--bg-body)] border app-border text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)]"
            id="question-history-search"
          />
        </label>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {filteredLogs.length > 0 ? (
          <ol className="divide-y divide-[var(--border-main)]">
            {filteredLogs.map(log => {
              const evidenceCount = new Set([...log.matchedNodes, ...log.expandedNodes]).size;
              const confidenceClass = confidenceStyles[log.confidence] || confidenceStyles.Nenhuma;

              return (
                <li key={log.id} className="px-4 py-3.5 hover:bg-[var(--bg-card-hover)] transition-colors">
                  <article className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3 text-[10px] text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <Clock3 className="w-3 h-3 shrink-0" />
                        <time dateTime={log.timestamp}>{formatTimestamp(log.timestamp)}</time>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full border font-medium ${confidenceClass}`}>
                        Confiança {log.confidence.toLocaleLowerCase('pt-BR')}
                      </span>
                    </div>

                    <p className="text-sm font-medium leading-relaxed text-[var(--text-main)] text-pretty">
                      {log.query}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {log.retrievedDocs.length} {log.retrievedDocs.length === 1 ? 'fonte' : 'fontes'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {evidenceCount} {evidenceCount === 1 ? 'evidência' : 'evidências'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onReuseQuestion(log.query)}
                        className="min-h-8 px-2.5 rounded-lg border app-border bg-[var(--bg-body)] text-[11px] font-semibold text-[var(--text-main)] hover:bg-[var(--accent-glow)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/35 transition-colors flex items-center gap-1.5 shrink-0"
                        aria-label={`Reutilizar pergunta: ${log.query}`}
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reutilizar
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="h-full min-h-64 flex items-center justify-center p-6 text-center">
            <div className="max-w-xs">
              <div className="w-10 h-10 mx-auto rounded-lg bg-[var(--accent-glow)] text-[var(--accent-color)] flex items-center justify-center mb-3">
                {logs.length === 0 ? <History className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                {logs.length === 0 ? 'Nenhuma pergunta registrada' : 'Nenhuma pergunta encontrada'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                {logs.length === 0
                  ? 'As próximas perguntas enviadas no chat aparecerão aqui automaticamente.'
                  : 'Tente buscar por outro termo ou limpe o campo de pesquisa.'}
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="mt-3 min-h-8 px-3 rounded-lg bg-[var(--accent-glow)] text-[var(--accent-color)] text-xs font-semibold hover:opacity-80 transition-opacity"
                >
                  Limpar busca
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
