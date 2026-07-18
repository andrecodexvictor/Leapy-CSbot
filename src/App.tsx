import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  MessageSquare, 
  Network, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  FileText, 
  Compass, 
  ChevronRight, 
  Info, 
  Lock, 
  User, 
  X, 
  ShieldCheck,
  Building2,
  MapPin,
  CalendarDays,
  FileSpreadsheet,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Cpu,
  AlertOctagon,
  CornerDownRight,
  ClipboardCheck
} from 'lucide-react';
import { GraphData, GraphNode, ChatMessage, AuditLog } from './types';
import ConceptGraph from './components/ConceptGraph';
import AuditDashboard from './components/AuditDashboard';

export default function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  
  // Graph & Logs Data
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Active feedback state for the latest answer
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(null); // logId of submitted feedback
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackType, setFeedbackType] = useState<'like' | 'dislike' | null>(null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Recommended playbooks and common CS issues
  const suggestions = [
    {
      label: 'Cotas Aprendiz/PCD',
      text: 'Qual a cota de jovem aprendiz e PCD que somos obrigados a contratar e como a Leapy lida com isso?',
      icon: Building2,
      color: 'border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/5'
    },
    {
      label: 'Elegibilidade Estágio',
      text: 'Estagiário tem direito a plano de saúde ou Gympass na Leapy?',
      icon: FileSpreadsheet,
      color: 'border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/5'
    },
    {
      label: 'Operação Regional (BA)',
      text: 'A Leapy suporta dissídios retroativos automáticos na Bahia (BA) ou somente no Sudeste?',
      icon: MapPin,
      color: 'border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/5'
    },
    {
      label: 'Prazos para Férias',
      text: 'Como funciona a solicitação de férias no portal do colaborador e quais os prazos?',
      icon: CalendarDays,
      color: 'border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/5'
    },
    {
      label: 'Efetivação de Estágio',
      text: 'Como funciona a transição e efetivação de estagiário para CLT e qual o piso salarial?',
      icon: RefreshCw,
      color: 'border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/5'
    },
    {
      label: 'Integração ERP/LGPD',
      text: 'Como responder à objeção do cliente sobre a integração com ERP Sênior/Totvs e segurança LGPD?',
      icon: ShieldCheck,
      color: 'border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/5'
    }
  ];

  // Fetch initial graph data & initial logs
  useEffect(() => {
    fetchGraph();
    fetchLogs();
    
    // Initial setup with a highly professional intro
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Bem-vindo ao Leapy CSbot, o copiloto operacional de Customer Success da Leapy.',
        timestamp: new Date().toLocaleTimeString(),
        blocks: {
          respostaObjetiva: 'Selecione um dos playbooks recomendados abaixo ou faça uma pergunta específica para receber as diretrizes assistidas homologadas pela Leapy.',
          justificativa: 'Este copiloto consulta um grafo de conceitos operacionais para estruturar a tomada de decisões, mapeando riscos jurídicos e mitigando alucinações comerciais.',
          confianca: 'Alta',
          classificacaoIntencao: 'Boas-vindas à Operação',
          sinalizacaoRisco: 'Baixo',
          proximaAcaoRecomendada: 'Selecione uma dúvida comum no menu de playbooks para iniciar a análise.',
          resumoCaso: 'Portal operacional pronto para apoio de suporte e regulação.'
        }
      }
    ]);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchGraph = async () => {
    try {
      const res = await fetch('/api/graph');
      const data = await res.json();
      setGraphData(data);
    } catch (e) {
      console.error('Erro ao buscar o grafo de conceitos:', e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setAuditLogs(data);
    } catch (e) {
      console.error('Erro ao buscar logs de auditoria:', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const activeQuery = textToSend || query;
    if (!activeQuery.trim()) return;

    if (!textToSend) setQuery('');

    // Reset feedback state for new query
    setFeedbackSubmitted(null);
    setFeedbackType(null);
    setFeedbackComment('');
    setShowFeedbackInput(false);

    // Append user message
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: activeQuery,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery })
      });
      const data = await res.json();

      // Append bot message with the structured blocks
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
        blocks: data.blocks,
        highlightedNodes: data.highlightedNodes,
        isFallback: data.isFallback
      };

      // Store the server's generated audit logId directly on the message
      (botMsg as any).logId = data.logId;

      setMessages(prev => [...prev, botMsg]);
      
      // Highlight graph
      if (data.highlightedNodes) {
        setHighlightedNodeIds(data.highlightedNodes);
      }

      // Refresh Audit logs
      fetchLogs();
    } catch (e) {
      console.error('Erro ao realizar a busca:', e);
      const errMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'bot',
        text: 'Desculpe, ocorreu uma falha de conexão com o servidor da Leapy.',
        timestamp: new Date().toLocaleTimeString(),
        blocks: {
          respostaObjetiva: 'Ocorreu um erro ao processar sua requisição.',
          justificativa: 'Não foi possível completar a rota HTTP de chat. Verifique se o backend está ativo.',
          confianca: 'Nenhuma',
          classificacaoIntencao: 'Erro de Conexão',
          sinalizacaoRisco: 'Alto',
          proximaAcaoRecomendada: 'Tentar recarregar a página ou verificar o status do contêiner.',
          resumoCaso: 'Erro de infraestrutura ao bater no endpoint /api/chat.'
        }
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/logs/clear', { method: 'POST' });
      fetchLogs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectNodeFromGraph = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const submitFeedback = async (logId: string) => {
    if (!logId || !feedbackType) return;
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId: logId,
          feedback: feedbackType,
          comment: feedbackComment
        })
      });
      if (res.ok) {
        setFeedbackSubmitted(logId);
        setShowFeedbackInput(false);
        fetchLogs();
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    }
  };

  // Get latest bot response to render prominently
  const latestBotResponse = [...messages].reverse().find(m => m.sender === 'bot');

  return (
    <div className="flex flex-col w-full h-screen bg-[#090b11] text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* Premium Navigation Header */}
      <header className="h-14 border-b border-slate-800 bg-[#0c0f17]/95 px-5 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center text-cyan-400 font-bold text-base tracking-wider">
              L
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#090b11]"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-sm tracking-wide text-slate-100">Leapy CSbot</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-850 text-slate-400 text-[8px] font-mono tracking-widest border border-slate-800 uppercase">Copiloto</span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-tight">Plataforma de Inteligência Operacional de Customer Success</p>
          </div>
        </div>

        {/* Central status / metrics badge */}
        <div className="hidden lg:flex items-center gap-5 text-[10px] text-slate-400 bg-slate-900/60 border border-slate-800/80 rounded-full px-4 py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Grafo Estruturado Ativo</span>
          </div>
          <span className="text-slate-750">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>Raciocínio Baseado em Evidências</span>
          </div>
        </div>

        {/* Audit mode controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAuditPanel(!showAuditPanel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-medium transition-all border ${
              showAuditPanel 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800'
            }`}
            id="toggle-audit-mode-btn"
          >
            {showAuditPanel ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showAuditPanel ? 'Modo Auditoria Ativo' : 'Ver Auditoria Interna'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Split Area */}
      <div className="flex-1 flex w-full overflow-hidden" id="workspace-container">
        
        {/* Left Side: Professional Decision & Assistant Hub */}
        <div className="w-1/2 flex flex-col h-full border-r border-slate-800 bg-[#090b11]" id="chat-section">
          
          {/* Scrollable container for Assistant Decisions & Playbook selections */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" id="chat-scroller">
            
            {/* If no question has been asked, show welcoming intro card */}
            {messages.length <= 1 && (
              <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono uppercase">
                  <Cpu className="w-4 h-4" />
                  <span>Ambiente de Decisão Homologado</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O Leapy CSbot foi desenvolvido especificamente para apoiar o time de Suporte e Customer Success. 
                  Diferente de chatbots genéricos, ele cruza as perguntas dos analistas com nossa base documental indexada em grafo, prevenindo alucinações legais.
                </p>
                <div className="text-[10px] text-slate-500 leading-relaxed">
                  Use os playbooks rápidos abaixo para testar fluxos reais ou descreva o problema do seu cliente na caixa de texto.
                </div>
              </div>
            )}

            {/* Render decision panel of the LATEST active query prominently */}
            {latestBotResponse && (
              <div className="space-y-4" id="active-decision-panel">
                
                {/* Visual Indicator of current query */}
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400 font-medium">Última Pergunta Auditada:</span>
                  </div>
                  <span className="text-slate-300 font-semibold italic truncate max-w-[240px]">
                    "{[...messages].reverse().find(m => m.sender === 'user')?.text || 'Consulta de boas-vindas'}"
                  </span>
                </div>

                {/* Main Core Assistant Answer Block */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                  
                  {/* Top indicators */}
                  <div className="p-3 bg-[#0d101a] border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Copiloto de Decisão Assistida</span>
                    </div>
                    {latestBotResponse.blocks?.classificacaoIntencao && (
                      <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700 font-mono px-2 py-0.5 rounded">
                        {latestBotResponse.blocks.classificacaoIntencao}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-4">
                    
                    {/* Block 1: Resposta Objetiva */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">1. Diretriz Operacional</span>
                      <div className="p-3 rounded-lg bg-cyan-950/10 border border-cyan-900/20 text-xs text-slate-200 leading-relaxed">
                        {latestBotResponse.blocks?.respostaObjetiva}
                      </div>
                    </div>

                    {/* Block 2: Justificativa */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">2. Justificativa de Decisão</span>
                      <p className="text-xs text-slate-300 leading-relaxed pl-1">
                        {latestBotResponse.blocks?.justificativa}
                      </p>
                    </div>

                    {/* Block 3: Recommended tactical actions */}
                    {latestBotResponse.blocks?.proximaAcaoRecomendada && (
                      <div className="pt-3 border-t border-slate-800/60 space-y-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          Ação Recomendada para o Analista (CS)
                        </span>
                        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-850 text-xs text-cyan-200 font-medium leading-relaxed">
                          {latestBotResponse.blocks.proximaAcaoRecomendada}
                        </div>
                      </div>
                    )}

                    {/* Meta & Risks Bar */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/50 text-[11px]">
                      
                      {/* Risk evaluation */}
                      <div className="space-y-1">
                        <span className="text-slate-500 font-mono block uppercase text-[9px]">Sinalização de Risco</span>
                        <div className="flex items-center gap-1.5">
                          {latestBotResponse.blocks?.sinalizacaoRisco === 'Alto' ? (
                            <span className="flex items-center gap-1 text-rose-400 font-semibold bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/30 text-[10px]">
                              <AlertOctagon className="w-3.5 h-3.5" />
                              Alto Risco
                            </span>
                          ) : latestBotResponse.blocks?.sinalizacaoRisco === 'Médio' ? (
                            <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30 text-[10px]">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Médio Risco
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30 text-[10px]">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Baixo Risco
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Confidence evaluation */}
                      <div className="space-y-1">
                        <span className="text-slate-500 font-mono block uppercase text-[9px]">Grau de Confiança</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          latestBotResponse.blocks?.confianca === 'Alta' 
                            ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                            : latestBotResponse.blocks?.confianca === 'Média'
                            ? 'bg-amber-950/20 text-amber-400 border border-amber-900/30'
                            : 'bg-rose-950/20 text-rose-400 border border-rose-900/30'
                        }`}>
                          {latestBotResponse.blocks?.confianca}
                        </span>
                      </div>
                    </div>

                    {/* Warnings & Caveats */}
                    {latestBotResponse.blocks?.ressalvas && (
                      <div className="p-2.5 rounded bg-amber-950/10 border border-amber-900/20 flex gap-2 items-start text-[10px] text-slate-350">
                        <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-amber-400">Observação Técnica:</span> {latestBotResponse.blocks.ressalvas}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Feedback interface for operational auditing */}
                  {(latestBotResponse as any).logId && (
                    <div className="p-3 bg-slate-950/80 border-t border-slate-850 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <ClipboardCheck className="w-3.5 h-3.5 text-slate-500" />
                          <span>Esta resposta resolve a dúvida ou aponta lacuna na base?</span>
                        </div>
                        
                        {feedbackSubmitted === (latestBotResponse as any).logId ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Auditoria enviada!
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setFeedbackType('like');
                                setShowFeedbackInput(true);
                              }}
                              className={`p-1.5 rounded transition-colors ${feedbackType === 'like' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 hover:bg-slate-850 text-slate-400'}`}
                              title="Diretriz Correta"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setFeedbackType('dislike');
                                setShowFeedbackInput(true);
                              }}
                              className={`p-1.5 rounded transition-colors ${feedbackType === 'dislike' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900 hover:bg-slate-850 text-slate-400'}`}
                              title="Diretriz com Lacuna / Errada"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comment sub-menu */}
                      {showFeedbackInput && feedbackSubmitted !== (latestBotResponse as any).logId && (
                        <div className="space-y-1.5 pt-1">
                          <textarea
                            placeholder={feedbackType === 'like' ? 'Opcional: Deixe observações adicionais para auditoria...' : 'Descreva qual lacuna ou erro encontrou para revisão do manual de CS...'}
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            rows={2}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                          />
                          <div className="flex justify-end gap-1.5 text-[10px]">
                            <button
                              onClick={() => setShowFeedbackInput(false)}
                              className="px-2.5 py-1 text-slate-400 hover:text-slate-200"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => submitFeedback((latestBotResponse as any).logId)}
                              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded"
                            >
                              Registrar Feedback
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* simulated thinking container */}
            {loading && (
              <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-xl flex items-center gap-3" id="active-thinking">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs text-slate-400">Consultando base estruturada e gerando diretrizes operacionais...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions area */}
          <div className="px-5 py-3.5 bg-slate-950/50 border-t border-slate-800/85">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Menu de Playbooks de Operação de CS
            </span>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((sug) => (
                <button
                  key={sug.label}
                  onClick={() => handleSendMessage(sug.text)}
                  disabled={loading}
                  id={`sug-btn-${sug.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`text-[10px] p-2 text-left rounded-lg border transition-all flex gap-2 items-start disabled:opacity-40 ${sug.color}`}
                >
                  <sug.icon className="w-3.5 h-3.5 shrink-0 text-cyan-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold block text-slate-200 tracking-wide text-[10.5px]">{sug.label}</span>
                    <span className="text-slate-400 block truncate text-[9px] mt-0.5">{sug.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Form Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-4 border-t border-slate-800 bg-[#090b11] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Digite sua dúvida operacional ou objeção de cliente..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60 font-medium"
              id="chat-query-input"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold transition-all shadow-md flex items-center justify-center shrink-0 text-xs"
              title="Analisar Caso"
              id="chat-send-submit"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>Analisar</span>
            </button>
          </form>
        </div>

        {/* Right Side: Tabbed Interactive Visualizations (Concept Graph or Auditor Panel) */}
        <div className={`h-full flex relative transition-all duration-300 ${showAuditPanel ? 'w-1/2' : 'w-1/2'}`} id="visualization-section">
          
          {/* Main dynamic viewport panel */}
          <div className="flex-1 h-full flex">
            {/* The Obsidian-like Concept Graph stays active on the left of this split if audit panel is shown, or occupies 100% */}
            <div className={`h-full transition-all duration-300 ${showAuditPanel ? 'w-1/2' : 'w-full'}`}>
              <ConceptGraph 
                graphData={graphData} 
                highlightedNodeIds={highlightedNodeIds}
                onSelectNode={handleSelectNodeFromGraph}
              />
            </div>

            {/* Audit panel slides in or renders dynamically if enabled */}
            {showAuditPanel && (
              <div className="w-1/2 h-full">
                <AuditDashboard 
                  logs={auditLogs}
                  allNodes={graphData.nodes}
                  onClearLogs={handleClearLogs}
                  onSelectNode={handleSelectNodeFromGraph}
                />
              </div>
            )}
          </div>

          {/* Slide-over Node Detail panel for complete background transparency */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 w-[420px] h-full bg-[#0d101a] border-l border-slate-800 shadow-2xl z-40 flex flex-col"
                id="node-detail-panel"
              >
                {/* Panel Header */}
                <div className="p-4 border-b border-slate-800 bg-[#0a0d15] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedNode.type === 'document' ? (
                      <div className="p-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/50">
                        <Compass className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block">Detalhes do {selectedNode.type === 'document' ? 'Documento' : 'Conceito'}</span>
                      <span className="font-display font-semibold text-xs text-slate-200 block truncate">{selectedNode.title}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                    id="btn-close-node-details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Panel Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Topic Tag */}
                  {selectedNode.type === 'document' && (
                    <div className="p-2.5 rounded bg-[#0d101a] border border-slate-800/85">
                      <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Tema / Categoria de Negócio</span>
                      <span className="text-xs text-slate-300 font-semibold">{selectedNode.topic}</span>
                    </div>
                  )}

                  {/* Document Content / Concept Description */}
                  <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1.5 font-mono">
                      {selectedNode.type === 'document' ? 'Conteúdo da Base Documental' : 'Definição do Conceito'}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-serif">
                      {selectedNode.type === 'document' ? (selectedNode as any).content : (selectedNode as any).description}
                    </p>
                  </div>

                  {/* Document Meta / Keywords */}
                  {selectedNode.keywords && selectedNode.keywords.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block uppercase mb-2 font-mono">Palavras-Chave do Nó</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.keywords.map(kw => (
                          <span key={kw} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700/60">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connected nodes (Traverse and list matching connections) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block uppercase mb-2 font-mono">Artigos e Conceitos Relacionados</span>
                    <div className="space-y-1.5">
                      {graphData.edges
                        .filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id)
                        .map((edge, i) => {
                          const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                          const otherNode = graphData.nodes.find(n => n.id === otherId);
                          if (!otherNode) return null;

                          return (
                            <div 
                              key={i}
                              onClick={() => setSelectedNode(otherNode)}
                              className="flex items-center justify-between p-2 rounded bg-[#101422]/60 hover:bg-[#151a2d]/80 border border-slate-800/60 cursor-pointer text-xs transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${otherNode.type === 'document' ? 'bg-cyan-400' : 'bg-indigo-400'}`}></span>
                                <span className="text-slate-300 truncate font-medium max-w-[260px]">{otherNode.title}</span>
                              </div>
                              <span className="text-[9px] font-mono uppercase bg-slate-950 px-1.5 py-0.5 rounded text-slate-500">
                                {edge.label || 'Vinculado'}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Audit Safety Warning */}
                <div className="p-3 bg-slate-950/80 border-t border-slate-850 text-[10px] text-slate-400 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Ambiente de auditoria interno. Conteúdo restrito de CS.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
