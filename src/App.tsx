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
import OperationalIntelligence from './components/OperationalIntelligence';
import KBManager from './components/KBManager';
import { Database, TrendingUp, PlusCircle, Maximize2, Minimize2, Palette } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  
  // Focus mode to expand chat pane to full screen
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Premium Theme switcher state
  const [appTheme, setAppTheme] = useState<'theme-slate-dark' | 'theme-slate-light' | 'theme-nordic-night'>(() => {
    return (localStorage.getItem('leapy-theme') as any) || 'theme-slate-dark';
  });

  const handleThemeChange = (newTheme: 'theme-slate-dark' | 'theme-slate-light' | 'theme-nordic-night') => {
    setAppTheme(newTheme);
    localStorage.setItem('leapy-theme', newTheme);
  };
  
  // Interactive workspace tabs state
  const [activeRightTab, setActiveRightTab] = useState<string>('graph');
  const [kbDraft, setKbDraft] = useState<any>(null);

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

  // Sync header audit toggle with tab selection
  useEffect(() => {
    if (showAuditPanel) {
      setActiveRightTab('audit');
    } else if (activeRightTab === 'audit') {
      setActiveRightTab('graph');
    }
  }, [showAuditPanel]);

  // Sync tab selection back to header state
  useEffect(() => {
    if (activeRightTab === 'audit') {
      setShowAuditPanel(true);
    } else {
      setShowAuditPanel(false);
    }
  }, [activeRightTab]);

  // Recommended playbooks and common CS issues
  const suggestions = [
    {
      label: 'Cotas Aprendiz/PCD',
      text: 'Qual a cota de jovem aprendiz e PCD que somos obrigados a contratar e como a Leapy lida com isso?',
      icon: Building2,
      color: 'border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--accent-color)]/45 hover:bg-[var(--accent-color)]/5 hover:text-[var(--text-main)]'
    },
    {
      label: 'Elegibilidade Estágio',
      text: 'Estagiário tem direito a plano de saúde ou Gympass na Leapy?',
      icon: FileSpreadsheet,
      color: 'border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--accent-color)]/45 hover:bg-[var(--accent-color)]/5 hover:text-[var(--text-main)]'
    },
    {
      label: 'Operação Regional (BA)',
      text: 'A Leapy suporta dissídios retroativos automáticos na Bahia (BA) ou somente no Sudeste?',
      icon: MapPin,
      color: 'border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--accent-color)]/45 hover:bg-[var(--accent-color)]/5 hover:text-[var(--text-main)]'
    },
    {
      label: 'Prazos para Férias',
      text: 'Como funciona a solicitação de férias no portal do colaborador e quais os prazos?',
      icon: CalendarDays,
      color: 'border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--accent-color)]/45 hover:bg-[var(--accent-color)]/5 hover:text-[var(--text-main)]'
    },
    {
      label: 'Efetivação de Estágio',
      text: 'Como funciona a transição e efetivação de estagiário para CLT e qual o piso salarial?',
      icon: RefreshCw,
      color: 'border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--accent-color)]/45 hover:bg-[var(--accent-color)]/5 hover:text-[var(--text-main)]'
    },
    {
      label: 'Integração ERP/LGPD',
      text: 'Como responder à objeção do cliente sobre a integração com ERP Sênior/Totvs e segurança LGPD?',
      icon: ShieldCheck,
      color: 'border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--accent-color)]/45 hover:bg-[var(--accent-color)]/5 hover:text-[var(--text-main)]'
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
    <div className={`flex flex-col w-full h-screen ${appTheme} app-bg-app app-text-primary font-sans antialiased overflow-hidden`}>
      
      {/* Premium Navigation Header */}
      <header className="h-14 border-b app-border app-bg-header px-5 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center text-cyan-400 font-bold text-base tracking-wider">
              L
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border app-border"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-sm tracking-wide text-[var(--text-main)]">Leapy CSbot</span>
              <span className="px-1.5 py-0.5 rounded bg-[var(--bg-body)] text-[var(--text-muted)] text-[8px] font-mono tracking-widest border app-border uppercase">Copiloto</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] tracking-tight">Plataforma de Inteligência Operacional de Customer Success</p>
          </div>
        </div>

        {/* Central status / metrics badge */}
        <div className="hidden lg:flex items-center gap-5 text-[10px] text-[var(--text-muted)] bg-[var(--bg-body)] border app-border rounded-full px-4 py-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Grafo Estruturado Ativo</span>
          </div>
          <span className="text-[var(--border-main)]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>Raciocínio Baseado em Evidências</span>
          </div>
        </div>

        {/* Focus, Theme, and Audit controls */}
        <div className="flex items-center gap-2">
          {/* Theme Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-body)] border app-border rounded px-2.5 py-1 text-xs select-none">
            <Palette className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={appTheme}
              onChange={(e) => handleThemeChange(e.target.value as any)}
              className="bg-transparent border-none text-[11px] font-semibold text-[var(--text-main)] focus:outline-none cursor-pointer"
              id="theme-select"
            >
              <option value="theme-slate-dark" className="bg-[#0c0f17] text-white">Escuro Cósmico</option>
              <option value="theme-slate-light" className="bg-white text-slate-900">Claro Minimalista</option>
              <option value="theme-nordic-night" className="bg-[#0a0f14] text-white">Norte Florestal</option>
            </select>
          </div>

          {/* Focus Mode Button */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold transition-all border ${
              isFocusMode 
                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' 
                : 'bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] app-border'
            }`}
            id="toggle-focus-mode-btn"
            title={isFocusMode ? 'Desativar modo foco' : 'Ativar modo foco'}
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
            <span>{isFocusMode ? 'Foco Ativo' : 'Modo Foco'}</span>
          </button>

          <button
            onClick={() => setShowAuditPanel(!showAuditPanel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-medium transition-all border ${
              showAuditPanel 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                : 'bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] app-border'
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
        <div className={`flex flex-col h-full bg-[var(--bg-app)] transition-all duration-300 ${isFocusMode ? 'w-full border-r-0' : 'w-1/2 border-r app-border'}`} id="chat-section">
          
          {/* Scrollable container for Assistant Decisions & Playbook selections */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" id="chat-scroller">
            
            {/* If no question has been asked, show welcoming intro card */}
            {messages.length <= 1 && (
              <div className="p-4 bg-[var(--bg-body)] border app-border rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono uppercase">
                  <Cpu className="w-4 h-4" />
                  <span>Ambiente de Decisão Homologado</span>
                </div>
                <p className="text-xs text-[var(--text-main)] leading-relaxed">
                  O Leapy CSbot foi desenvolvido especificamente para apoiar o time de Suporte e Customer Success. 
                  Diferente de chatbots genéricos, ele cruza as perguntas dos analistas com nossa base documental indexada em grafo, prevenindo alucinações legais.
                </p>
                <div className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                  Use os playbooks rápidos abaixo para testar fluxos reais ou descreva o problema do seu cliente na caixa de texto.
                </div>
              </div>
            )}

            {/* Render decision panel of the LATEST active query prominently */}
            {latestBotResponse && (
              <div className="space-y-4" id="active-decision-panel">
                
                {/* Visual Indicator of current query */}
                <div className="bg-[var(--bg-body)] p-3 rounded-lg border border-[var(--border-main)] flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-muted)] font-medium">Última Pergunta Auditada:</span>
                  </div>
                  <span className="text-[var(--text-main)] font-semibold italic truncate max-w-[240px]">
                    "{[...messages].reverse().find(m => m.sender === 'user')?.text || 'Consulta de boas-vindas'}"
                  </span>
                </div>

                {/* Main Core Assistant Answer Block */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl overflow-hidden shadow-lg">
                  
                  {/* Top indicators */}
                  <div className="p-3 bg-[var(--bg-panel)] border-b border-[var(--border-main)] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Copiloto de Decisão Assistida</span>
                    </div>
                    {latestBotResponse.blocks?.classificacaoIntencao && (
                      <span className="text-[9px] bg-[var(--bg-body)] text-[var(--text-muted)] border border-[var(--border-main)] font-mono px-2 py-0.5 rounded">
                        {latestBotResponse.blocks.classificacaoIntencao}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-4">
                    
                    {/* Resumo do Caso */}
                    {latestBotResponse.blocks?.resumoCaso && (
                      <div className="space-y-1 bg-[var(--bg-body)] p-3 rounded-lg border border-[var(--border-main)]/85">
                        <span className="text-[9px] font-bold text-cyan-400/90 uppercase tracking-wider font-mono block">Resumo do Caso (Contexto CS)</span>
                        <p className="text-xs text-[var(--text-main)] font-medium leading-relaxed">
                          {latestBotResponse.blocks.resumoCaso}
                        </p>
                      </div>
                    )}

                    {/* Block 1: Resposta Objetiva */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono block">1. Diretriz Operacional</span>
                      <div className="p-3 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent-color)]/20 text-xs text-[var(--text-main)] leading-relaxed">
                        {latestBotResponse.blocks?.respostaObjetiva}
                      </div>
                    </div>

                    {/* Block 2: Justificativa */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono block">2. Justificativa de Decisão</span>
                      <p className="text-xs text-[var(--text-main)] leading-relaxed pl-1">
                        {latestBotResponse.blocks?.justificativa}
                      </p>
                    </div>

                    {/* Block 3: Recommended tactical actions */}
                    {latestBotResponse.blocks?.proximaAcaoRecomendada && (
                      <div className="pt-3 border-t border-[var(--border-main)]/60 space-y-1">
                        <span className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-wider font-mono flex items-center gap-1">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          Ação Recomendada para o Analista (CS)
                        </span>
                        <div className="p-2.5 rounded bg-[var(--bg-body)] border border-[var(--border-main)] text-xs text-[var(--accent-color)] font-medium leading-relaxed">
                          {latestBotResponse.blocks.proximaAcaoRecomendada}
                        </div>
                      </div>
                    )}

                    {/* Meta & Risks Bar */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border-main)]/50 text-[11px]">
                      
                      {/* Risk evaluation */}
                      <div className="space-y-1">
                        <span className="text-[var(--text-muted)] font-mono block uppercase text-[9px]">Sinalização de Risco</span>
                        <div className="flex items-center gap-1.5">
                          {latestBotResponse.blocks?.sinalizacaoRisco === 'Alto' ? (
                            <span className="flex items-center gap-1 font-semibold bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border border-[var(--badge-danger-border)] px-2 py-0.5 rounded text-[10px]">
                              <AlertOctagon className="w-3.5 h-3.5" />
                              Alto Risco
                            </span>
                          ) : latestBotResponse.blocks?.sinalizacaoRisco === 'Médio' ? (
                            <span className="flex items-center gap-1 font-semibold bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border border-[var(--badge-warning-border)] px-2 py-0.5 rounded text-[10px]">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Médio Risco
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 font-semibold bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border border-[var(--badge-success-border)] px-2 py-0.5 rounded text-[10px]">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Baixo Risco
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Confidence evaluation */}
                      <div className="space-y-1">
                        <span className="text-[var(--text-muted)] font-mono block uppercase text-[9px]">Grau de Confiança</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          latestBotResponse.blocks?.confianca === 'Alta' 
                            ? 'bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--badge-success-border)]' 
                            : latestBotResponse.blocks?.confianca === 'Média'
                            ? 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-[var(--badge-warning-border)]'
                            : 'bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border-[var(--badge-danger-border)]'
                        }`}>
                          {latestBotResponse.blocks?.confianca}
                        </span>
                      </div>
                    </div>

                    {/* Warnings & Caveats */}
                    {latestBotResponse.blocks?.ressalvas && (
                      <div className="p-2.5 rounded bg-[var(--warning-color)]/10 border border-[var(--warning-color)]/20 flex gap-2 items-start text-[10px] text-[var(--text-main)]">
                        <Info className="w-3.5 h-3.5 text-[var(--warning-color)] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[var(--warning-color)]">Observação Técnica:</span> {latestBotResponse.blocks.ressalvas}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Feedback interface for operational auditing */}
                  {(latestBotResponse as any).logId && (
                    <div className="p-3 bg-[var(--bg-panel)] border-t border-[var(--border-main)] flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                        <div className="flex items-center gap-1">
                          <ClipboardCheck className="w-3.5 h-3.5 text-[var(--text-muted)]/70" />
                          <span>Esta resposta resolve a dúvida ou aponta lacuna na base?</span>
                        </div>
                        
                        {feedbackSubmitted === (latestBotResponse as any).logId ? (
                          <span className="text-emerald-500 font-semibold flex items-center gap-1 text-[10px]">
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
                              className={`p-1.5 rounded border transition-colors ${feedbackType === 'like' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' : 'bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] border-[var(--border-main)]/50'}`}
                              title="Diretriz Correta"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setFeedbackType('dislike');
                                setShowFeedbackInput(true);
                              }}
                              className={`p-1.5 rounded border transition-colors ${feedbackType === 'dislike' ? 'bg-rose-500/15 text-rose-600 border-rose-500/30' : 'bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] border-[var(--border-main)]/50'}`}
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
                            className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)]"
                          />
                          <div className="flex justify-end gap-1.5 text-[10px]">
                            <button
                              onClick={() => setShowFeedbackInput(false)}
                              className="px-2.5 py-1 text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => submitFeedback((latestBotResponse as any).logId)}
                              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded"
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
              <div className="p-4 bg-[var(--bg-panel)]/30 border border-[var(--border-main)] rounded-xl flex items-center gap-3" id="active-thinking">
                <Sparkles className="w-4 h-4 text-[var(--accent-color)] animate-spin" />
                <span className="text-xs text-[var(--text-muted)]">Consultando base estruturada e gerando diretrizes operacionais...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions area */}
          <div className="px-5 py-3.5 bg-[var(--bg-panel)]/50 border-t border-[var(--border-main)]">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[var(--accent-color)]" />
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
                  <sug.icon className="w-3.5 h-3.5 shrink-0 text-[var(--accent-color)] mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold block text-[var(--text-main)] tracking-wide text-[10.5px]">{sug.label}</span>
                    <span className="text-[var(--text-muted)] block truncate text-[9px] mt-0.5">{sug.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Form Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-4 border-t app-border bg-[var(--bg-app)] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Digite sua dúvida operacional ou objeção de cliente..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[var(--bg-body)] border app-border rounded-lg text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-60 font-medium"
              id="chat-query-input"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-[var(--bg-body)] disabled:text-[var(--text-muted)] text-white font-semibold transition-all shadow-md flex items-center justify-center shrink-0 text-xs"
              title="Analisar Caso"
              id="chat-send-submit"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>Analisar</span>
            </button>
          </form>
        </div>

        {/* Right Side: Tabbed Interactive Visualizations (Concept Graph, Stats, KB Manager, or Auditor Panel) */}
        <div className={`h-full flex flex-col relative bg-[var(--bg-app)] border-l app-border transition-all duration-300 ${isFocusMode ? 'w-0 overflow-hidden opacity-0 pointer-events-none hidden' : 'w-1/2'}`} id="visualization-section">
          
          {/* Workstation Top Tab Bar */}
          {!isFocusMode && (
            <div className="h-12 border-b app-border bg-[var(--bg-panel)] px-4 flex items-center justify-between z-10 shrink-0 select-none">
              <div className="flex gap-1.5 h-full items-center">
                {/* Tab 1: Graph */}
                <button
                  onClick={() => setActiveRightTab('graph')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeRightTab === 'graph'
                      ? 'bg-cyan-600/15 text-[var(--accent-color)] border border-[var(--accent-color)]/25'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent'
                  }`}
                  id="tab-btn-graph"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Grafo</span>
                </button>

                {/* Tab 2: Operational Intelligence */}
                <button
                  onClick={() => setActiveRightTab('stats')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeRightTab === 'stats'
                      ? 'bg-cyan-600/15 text-[var(--accent-color)] border border-[var(--accent-color)]/25'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent'
                  }`}
                  id="tab-btn-stats"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Inteligência & Gaps</span>
                </button>

                {/* Tab 3: KB Manager */}
                <button
                  onClick={() => setActiveRightTab('kb')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all relative ${
                    activeRightTab === 'kb'
                      ? 'bg-cyan-600/15 text-[var(--accent-color)] border border-[var(--accent-color)]/25'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent'
                  }`}
                  id="tab-btn-kb"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Gerenciar Base (KB)</span>
                  {kbDraft && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent-color)] rounded-full animate-pulse border border-[var(--bg-panel)]" />
                  )}
                </button>

                {/* Tab 4: Audit Dashboard */}
                <button
                  onClick={() => setActiveRightTab('audit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeRightTab === 'audit'
                      ? 'bg-cyan-600/15 text-[var(--accent-color)] border border-[var(--accent-color)]/25'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent'
                  }`}
                  id="tab-btn-audit"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Auditoria</span>
                </button>
              </div>

              <div className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase hidden sm:block">
                {activeRightTab === 'graph' && 'Mapeamento de Conceitos'}
                {activeRightTab === 'stats' && 'Métricas Operacionais'}
                {activeRightTab === 'kb' && 'Edição de Playbooks'}
                {activeRightTab === 'audit' && 'Terminal de Auditoria'}
              </div>
            </div>
          )}

          {/* Main dynamic viewport panel */}
          <div className="flex-1 h-full min-h-0 relative overflow-hidden">
            {activeRightTab === 'graph' && (
              <div className="w-full h-full">
                <ConceptGraph 
                  graphData={graphData} 
                  highlightedNodeIds={highlightedNodeIds}
                  onSelectNode={handleSelectNodeFromGraph}
                />
              </div>
            )}

            {activeRightTab === 'stats' && (
              <div className="w-full h-full">
                <OperationalIntelligence
                  logs={auditLogs}
                  allNodes={graphData.nodes}
                  onSelectNode={handleSelectNodeFromGraph}
                  onSelectTab={(tab, draftData) => {
                    setActiveRightTab(tab);
                    if (draftData) setKbDraft(draftData);
                  }}
                />
              </div>
            )}

            {activeRightTab === 'kb' && (
              <div className="w-full h-full">
                <KBManager
                  allNodes={graphData.nodes}
                  onNodeAdded={fetchGraph}
                  initialDraft={kbDraft}
                  onClearDraft={() => setKbDraft(null)}
                />
              </div>
            )}

            {activeRightTab === 'audit' && (
              <div className="w-full h-full">
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
                className="absolute top-0 right-0 w-[420px] h-full bg-[var(--bg-card)] border-l border-[var(--border-main)] shadow-2xl z-40 flex flex-col"
                id="node-detail-panel"
              >
                {/* Panel Header */}
                <div className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-header)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedNode.type === 'document' ? (
                      <div className="p-1.5 rounded bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-color)]/30">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Compass className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-mono block">Detalhes do {selectedNode.type === 'document' ? 'Documento' : 'Conceito'}</span>
                      <span className="font-display font-semibold text-xs text-[var(--text-main)] block truncate">{selectedNode.title}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-main)]/60"
                    id="btn-close-node-details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Panel Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Topic Tag */}
                  {selectedNode.type === 'document' && (
                    <div className="p-2.5 rounded bg-[var(--bg-body)] border border-[var(--border-main)]">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase mb-1">Tema / Categoria de Negócio</span>
                      <span className="text-xs text-[var(--text-main)] font-semibold">{selectedNode.topic}</span>
                    </div>
                  )}

                  {/* Document Content / Concept Description */}
                  <div className="p-3 bg-[var(--bg-panel)]/40 border border-[var(--border-main)] rounded">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase mb-1.5 font-mono">
                      {selectedNode.type === 'document' ? 'Conteúdo da Base Documental' : 'Definição do Conceito'}
                    </span>
                    <p className="text-xs text-[var(--text-main)] leading-relaxed whitespace-pre-line font-sans">
                      {selectedNode.type === 'document' ? (selectedNode as any).content : (selectedNode as any).description}
                    </p>
                  </div>

                  {/* Document Meta / Keywords */}
                  {selectedNode.keywords && selectedNode.keywords.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase mb-2 font-mono">Palavras-Chave do Nó</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.keywords.map(kw => (
                          <span key={kw} className="px-2 py-0.5 rounded bg-[var(--bg-panel)] text-[10px] text-[var(--text-muted)] border border-[var(--border-main)]">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connected nodes (Traverse and list matching connections) */}
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] block uppercase mb-2 font-mono">Artigos e Conceitos Relacionados</span>
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
                              className="flex items-center justify-between p-2 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-main)] cursor-pointer text-xs transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${otherNode.type === 'document' ? 'bg-cyan-400' : 'bg-indigo-400'}`}></span>
                                <span className="text-[var(--text-main)] truncate font-medium max-w-[260px]">{otherNode.title}</span>
                              </div>
                              <span className="text-[9px] font-mono uppercase bg-[var(--bg-body)] px-1.5 py-0.5 rounded text-[var(--text-muted)] border border-[var(--border-main)]/50">
                                {edge.label || 'Vinculado'}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Audit Safety Warning */}
                <div className="p-3 bg-[var(--bg-panel)] border-t border-[var(--border-main)] text-[10px] text-[var(--text-muted)] flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[var(--text-muted)]/70 shrink-0" />
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
