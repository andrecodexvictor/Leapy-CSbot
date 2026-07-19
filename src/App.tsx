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
  ClipboardCheck,
  History
} from 'lucide-react';
import { GraphData, GraphNode, ChatMessage, AuditLog } from './types';
import ConceptGraph from './components/ConceptGraph';
import AuditDashboard from './components/AuditDashboard';
import OperationalIntelligence from './components/OperationalIntelligence';
import KBManager from './components/KBManager';
import QuestionHistory from './components/QuestionHistory';
import { Database, TrendingUp, PlusCircle, Maximize2, Minimize2, Palette, Settings } from 'lucide-react';

export function LeapyPropellerIcon({ className = "w-4 h-4", color = "currentColor" }: { className?: string, color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {/* High-fidelity stylized "y" logo mark from Leapy wordmark */}
      {/* Left arm: curves up-left */}
      <path d="M12 11.5C9.5 8.5 6 6 6 6" />
      {/* Right arm: curves up-right */}
      <path d="M12 11.5C14.5 8.5 18 6 18 6" />
      {/* Tail leg: curves down-left */}
      <path d="M12 11.5C12 15 11 19 9.5 20" />
    </svg>
  );
}

export function getConfidenceDetails(level?: string) {
  switch (level) {
    case 'Alta':
      return { percent: 96, label: 'Alta (96%)', color: 'bg-emerald-500', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/30', bgClass: 'bg-emerald-500/10' };
    case 'Média':
      return { percent: 74, label: 'Média (74%)', color: 'bg-amber-500', textClass: 'text-amber-400', borderClass: 'border-amber-500/30', bgClass: 'bg-amber-500/10' };
    case 'Baixa':
      return { percent: 38, label: 'Baixa (38%)', color: 'bg-orange-500', textClass: 'text-orange-400', borderClass: 'border-orange-500/30', bgClass: 'bg-orange-500/10' };
    case 'Nenhuma':
    default:
      return { percent: 12, label: 'Nenhuma (12%)', color: 'bg-rose-500', textClass: 'text-rose-400', borderClass: 'border-rose-500/30', bgClass: 'bg-rose-500/10' };
  }
}

export default function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Iniciando busca cognitiva...");
  const [showAuditPanel, setShowAuditPanel] = useState(false);

  // Focus mode to expand chat pane to full screen
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Premium Theme switcher state
  const [appTheme, setAppTheme] = useState<'theme-leapy-premium' | 'theme-slate-dark' | 'theme-slate-light' | 'theme-nordic-night'>(() => {
    return (localStorage.getItem('leapy-theme') as any) || 'theme-slate-light';
  });

  const handleThemeChange = (newTheme: 'theme-leapy-premium' | 'theme-slate-dark' | 'theme-slate-light' | 'theme-nordic-night') => {
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

  // User API credentials states for recruiter custom key integrations
  const [apiProvider, setApiProvider] = useState<'simulation' | 'gemini' | 'openai' | 'openrouter' | 'nvidia'>(() => {
    return (localStorage.getItem('leapy-api-provider') as any) || 'simulation';
  });
  const [userApiKey, setUserApiKey] = useState(() => {
    return localStorage.getItem('leapy-user-api-key') || '';
  });
  const [userModelName, setUserModelName] = useState(() => {
    return localStorage.getItem('leapy-user-model-name') || '';
  });

  const handleSaveApiSettings = (provider: 'simulation' | 'gemini' | 'openai' | 'openrouter' | 'nvidia', key: string, model: string) => {
    setApiProvider(provider);
    setUserApiKey(key);
    setUserModelName(model);
    localStorage.setItem('leapy-api-provider', provider);
    localStorage.setItem('leapy-user-api-key', key);
    localStorage.setItem('leapy-user-model-name', model);
  };

  // Spreadsheet visualizer states
  const [sheetSearch, setSheetSearch] = useState('');
  const [sheetTopicFilter, setSheetTopicFilter] = useState('all');
  const [sheetDetailModalNode, setSheetDetailModalNode] = useState<GraphNode | null>(null);

  const handleOpenSheetDetailModal = (node: GraphNode) => {
    setSheetDetailModalNode(node);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!loading) return;
    
    const statuses = [
      "Buscando correspondências lexicais na base...",
      "Expandindo termos pelo grafo de conceitos...",
      "Cruzando dados operacionais e de legislação...",
      "Sintetizando resposta com o modelo de IA...",
      "Validando consistência jurídica e calculando nível de risco..."
    ];
    
    let index = 0;
    setLoadingStatus(statuses[0]);
    
    const interval = setInterval(() => {
      index = (index + 1) % statuses.length;
      setLoadingStatus(statuses[index]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [loading]);

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
          respostaObjetiva: 'Selecione um dos playbooks recomendados abaixo ou faça uma pergunta específica para receber uma orientação rastreável na base de demonstração.',
          fontes: ['DOC-007 §7.2', 'DOC-013 §13.2'],
          justificativa: 'Este protótipo consulta um grafo de conceitos para estruturar a análise. As respostas não substituem validação jurídica, operacional ou comercial.',
          confianca: 'Alta',
          classificacaoIntencao: 'Boas-vindas à Operação',
          sinalizacaoRisco: 'Baixo',
          proximaAcaoRecomendada: 'Selecione uma dúvida comum no menu de playbooks para iniciar a análise.',
          resumoCaso: 'Protótipo pronto para demonstrar suporte e rastreabilidade documental.'
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
        body: JSON.stringify({
          query: activeQuery,
          provider: apiProvider,
          apiKey: userApiKey,
          model: userModelName
        })
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
        isFallback: data.isFallback,
        provider: data.provider
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
          fontes: [],
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

  const handleReuseQuestion = (previousQuestion: string) => {
    setQuery(previousQuestion);
    requestAnimationFrame(() => queryInputRef.current?.focus());
  };

  const handleSelectNodeFromGraph = (node: GraphNode) => {
    setSelectedNode(node);
    
    // Find all edges connected to this node
    const connectedNodeIds = graphData.edges
      .filter(edge => edge.source === node.id || edge.target === node.id)
      .map(edge => edge.source === node.id ? edge.target : edge.source);
    
    // Highlight the selected node AND its neighbors in the graph visualizer
    setHighlightedNodeIds([node.id, ...connectedNodeIds]);
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
      
      {/* Primary product navigation */}
      <header className="h-16 border-b app-border app-bg-header px-5 flex items-center justify-between gap-4 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2">
            <div className="brand-logo-frame relative w-9 h-9 bg-[var(--bg-body)] border app-border rounded-lg flex items-center justify-center text-[var(--accent-color)]">
              <LeapyPropellerIcon className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-[var(--bg-header)]"></span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-[15px] tracking-tight text-[var(--text-main)]">Leapy CSbot</span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--bg-body)] text-[var(--text-muted)] text-[10px] font-medium border app-border">Copiloto</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] tracking-tight hidden sm:block">Inteligência operacional para Customer Success</p>
          </div>
        </div>

        {/* Central status / metrics badge */}
        <div className="hidden 2xl:flex items-center gap-4 text-[11px] text-[var(--text-muted)] bg-[var(--bg-body)] border app-border rounded-full px-4 py-1.5">
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
          <div className="flex items-center gap-1.5 min-h-9 bg-[var(--bg-body)] border app-border rounded-lg px-2.5 text-xs select-none">
            <Palette className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={appTheme}
              onChange={(e) => handleThemeChange(e.target.value as any)}
              className="bg-transparent border-none text-xs font-medium text-[var(--text-main)] focus:outline-none cursor-pointer"
              id="theme-select"
              aria-label="Tema da interface"
            >
              <option value="theme-slate-light" className="bg-white text-slate-900">Claro</option>
              <option value="theme-slate-dark" className="bg-[#0c0f17] text-white">Escuro</option>
              <option value="theme-leapy-premium" className="bg-[#0c0f17] text-white">Leapy</option>
              <option value="theme-nordic-night" className="bg-[#0a0f14] text-white">Florestal</option>
            </select>
          </div>

          {/* Focus Mode Button */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`min-h-9 flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium transition-colors border ${
              isFocusMode 
                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' 
                : 'bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] app-border'
            }`}
            id="toggle-focus-mode-btn"
            title={isFocusMode ? 'Desativar modo foco' : 'Ativar modo foco'}
            aria-pressed={isFocusMode}
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
            <span className="hidden xl:inline">{isFocusMode ? 'Foco Ativo' : 'Modo Foco'}</span>
          </button>

          <button
            onClick={() => setShowAuditPanel(!showAuditPanel)}
            className={`min-h-9 flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium transition-colors border ${
              showAuditPanel 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                : 'bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] app-border'
            }`}
            id="toggle-audit-mode-btn"
            title={showAuditPanel ? 'Voltar ao grafo' : 'Abrir auditoria interna'}
            aria-pressed={showAuditPanel}
          >
            {showAuditPanel ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline">{showAuditPanel ? 'Auditoria Ativa' : 'Auditoria'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Split Area */}
      <div className="flex-1 flex w-full overflow-hidden" id="workspace-container">
        
        {/* Left Side: Professional Decision & Assistant Hub */}
        <div className={`flex flex-col h-full bg-[var(--bg-app)] transition-all duration-200 ${isFocusMode ? 'w-full border-r-0' : 'w-full lg:w-[54%] lg:border-r app-border'}`} id="chat-section">
          
          {/* Scrollable container for Assistant Decisions & Playbook selections */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" id="chat-scroller">
            
            {/* If no question has been asked, show welcoming intro card */}
            {messages.length <= 1 && (
              <div className="p-4 bg-[var(--bg-body)] border app-border rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono uppercase">
                  <Cpu className="w-4 h-4" />
                  <span>Ambiente de Decisão Rastreável</span>
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
                <div className="bg-[var(--bg-body)] px-3 py-2.5 rounded-lg border border-[var(--border-main)] flex justify-between items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-muted)] font-medium">Consulta atual</span>
                  </div>
                  <span className="text-[var(--text-main)] font-semibold italic truncate max-w-[240px]">
                    "{[...messages].reverse().find(m => m.sender === 'user')?.text || 'Consulta de boas-vindas'}"
                  </span>
                </div>

                {/* Main Core Assistant Answer Block */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl overflow-hidden">
                  
                  {/* Top indicators */}
                  <div className="p-3 bg-[var(--bg-panel)] border-b border-[var(--border-main)] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                      <LeapyPropellerIcon className="w-4 h-4 shrink-0" color="var(--accent-color)" />
                      <span>Copiloto de Decisão Assistida</span>
                      {latestBotResponse.provider && (
                        <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded font-mono ml-2">
                          {latestBotResponse.provider}
                        </span>
                      )}
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
                        <span className="text-xs font-semibold text-[var(--text-muted)] block">Contexto do caso</span>
                        <p className="text-sm text-[var(--text-main)] font-medium leading-relaxed">
                          {latestBotResponse.blocks.resumoCaso}
                        </p>
                      </div>
                    )}

                    {/* Block 1: Resposta Objetiva */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-[var(--text-main)] block">Diretriz operacional</span>
                      <div className="p-3.5 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent-color)]/20 text-sm text-[var(--text-main)] leading-relaxed">
                        {latestBotResponse.blocks?.respostaObjetiva}
                      </div>
                    </div>

                    {/* Block 2: Justificativa */}
                    <div className="space-y-1 pt-1">
                      <span className="text-xs font-semibold text-[var(--text-main)] block">Por que esta é a orientação</span>
                      <p className="text-sm text-[var(--text-main)] leading-relaxed">
                        {latestBotResponse.blocks?.justificativa}
                      </p>
                    </div>

                    {/* Block 3: Exact source references */}
                    {latestBotResponse.blocks?.fontes && latestBotResponse.blocks.fontes.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-[var(--border-main)]/50">
                        <span className="text-xs font-semibold text-[var(--text-main)] block">Fontes exatas</span>
                        <div className="flex flex-wrap gap-2">
                          {latestBotResponse.blocks.fontes.slice(0, 3).map(source => {
                            const sourceNode = graphData.nodes.find(node =>
                              node.type === 'document' && node.title.startsWith(source)
                            );
                            return sourceNode ? (
                              <button
                                key={source}
                                type="button"
                                onClick={() => handleSelectNodeFromGraph(sourceNode)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--accent-color)]/30 bg-[var(--accent-glow)] px-2.5 py-1 text-[11px] font-mono font-semibold text-[var(--accent-color)] hover:bg-[var(--bg-card-hover)] transition-colors"
                                title={`Abrir ${source} no grafo`}
                                aria-label={`Abrir fonte ${source} no grafo`}
                              >
                                <FileText className="w-3 h-3" />
                                {source}
                              </button>
                            ) : (
                              <span key={source} className="rounded-md border border-[var(--border-main)] bg-[var(--bg-body)] px-2.5 py-1 text-[11px] font-mono text-[var(--text-muted)]">
                                {source}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Caminho do Raciocínio (AI Reasoning Trace) */}
                    {latestBotResponse.highlightedNodes && latestBotResponse.highlightedNodes.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-[var(--border-main)]/50">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Network className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                          Mapeamento de Evidências RAG & Grafo
                        </span>
                        
                        <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-[var(--bg-body)] border border-[var(--border-main)]/60">
                          {/* Reasoning Step-by-Step Chain */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono font-bold select-none">
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                              1. Input
                            </span>
                            <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                              2. Recuperação
                            </span>
                            <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
                            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                              3. Grafo
                            </span>
                            <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                              4. Análise
                            </span>
                          </div>

                          {/* Node Lists */}
                          <div className="text-[10px] space-y-2 text-[var(--text-muted)] mt-1">
                            {/* Documents */}
                            {latestBotResponse.highlightedNodes.some(id => {
                              const node = graphData.nodes.find(n => n.id === id);
                              return node && node.type === 'document';
                            }) && (
                              <div className="flex items-start gap-1">
                                <span className="font-bold text-[9px] uppercase tracking-wide text-emerald-400 shrink-0 w-16 mt-1">Documentos:</span>
                                <div className="flex flex-wrap gap-1">
                                  {latestBotResponse.highlightedNodes.map(id => {
                                    const node = graphData.nodes.find(n => n.id === id);
                                    if (!node || node.type !== 'document') return null;
                                    return (
                                      <button
                                        key={id}
                                        type="button"
                                        onClick={() => handleSelectNodeFromGraph(node)}
                                        className="px-2 py-0.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-card-hover)] hover:text-white border border-[var(--border-main)] text-[9px] font-medium text-emerald-300 transition-all flex items-center gap-1 shadow-sm"
                                        title="Clique para localizar no Grafo"
                                      >
                                        <FileText className="w-2.5 h-2.5 text-emerald-400" />
                                        <span>{node.id.toUpperCase().replace('_', '-')}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Concepts */}
                            {latestBotResponse.highlightedNodes.some(id => {
                              const node = graphData.nodes.find(n => n.id === id);
                              return node && node.type === 'concept';
                            }) && (
                              <div className="flex items-start gap-1">
                                <span className="font-bold text-[9px] uppercase tracking-wide text-indigo-400 shrink-0 w-16 mt-1">Conceitos:</span>
                                <div className="flex flex-wrap gap-1">
                                  {latestBotResponse.highlightedNodes.map(id => {
                                    const node = graphData.nodes.find(n => n.id === id);
                                    if (!node || node.type !== 'concept') return null;
                                    return (
                                      <button
                                        key={id}
                                        type="button"
                                        onClick={() => handleSelectNodeFromGraph(node)}
                                        className="px-2 py-0.5 rounded bg-[var(--bg-panel)] hover:bg-[var(--bg-card-hover)] hover:text-white border border-[var(--border-main)] text-[9px] font-medium text-indigo-300 transition-all flex items-center gap-1 shadow-sm"
                                        title="Clique para localizar no Grafo"
                                      >
                                        <Cpu className="w-2.5 h-2.5 text-indigo-400" />
                                        <span>{node.title}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-[8.5px] text-[var(--text-muted)] font-mono border-t border-[var(--border-main)]/45 pt-1.5 mt-0.5 flex justify-between items-center">
                            <span>A IA cruzou os nós acima para fundamentar a decisão</span>
                            <span className="text-[var(--accent-color)] animate-pulse">● Conexões Mapeadas</span>
                          </div>
                        </div>
                      </div>
                    )}

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
                      {(() => {
                        const details = getConfidenceDetails(latestBotResponse.blocks?.confianca);
                        return (
                          <div className="space-y-1">
                            <span className="text-[var(--text-muted)] font-mono block uppercase text-[9px]">Grau de Confiança</span>
                            <div className="flex items-center gap-2">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${details.bgClass} ${details.textClass} ${details.borderClass}`}>
                                {details.label}
                              </span>
                            </div>
                            {/* Horizontal Confidence Gauge Bar */}
                            <div className="w-full max-w-[140px] bg-[var(--bg-body)] h-1.5 rounded-full overflow-hidden border border-[var(--border-main)]/60 mt-1">
                              <div className={`h-full rounded-full transition-all duration-500 ${details.color}`} style={{ width: `${details.percent}%` }}></div>
                            </div>
                          </div>
                        );
                      })()}
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

            {loading && (
              <div className="p-4 bg-[var(--bg-panel)]/30 border border-[var(--border-main)] rounded-xl flex items-center gap-3" id="active-thinking">
                <LeapyPropellerIcon className="w-4 h-4 animate-spin shrink-0" color="var(--accent-color)" />
                <span className="text-xs text-[var(--text-muted)] font-medium">{loadingStatus}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions area */}
          <div className="px-5 py-3 bg-[var(--bg-panel)] border-t border-[var(--border-main)]">
            <span className="text-xs font-semibold text-[var(--text-main)] block mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              Playbooks rápidos
            </span>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((sug) => (
                <button
                  key={sug.label}
                  onClick={() => handleSendMessage(sug.text)}
                  disabled={loading}
                  id={`sug-btn-${sug.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`min-h-12 text-xs p-2.5 text-left rounded-lg border transition-colors flex gap-2 items-start disabled:opacity-40 ${sug.color}`}
                >
                  <sug.icon className="w-3.5 h-3.5 shrink-0 text-[var(--accent-color)] mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold block text-[var(--text-main)] text-xs">{sug.label}</span>
                    <span className="text-[var(--text-muted)] block truncate text-[11px]">{sug.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Form Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-4 border-t app-border bg-[var(--bg-card)] flex items-center gap-2"
          >
            <input
              ref={queryInputRef}
              type="text"
              placeholder="Digite sua dúvida operacional ou objeção de cliente..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="flex-1 min-h-11 px-4 py-2.5 bg-[var(--bg-body)] border app-border rounded-lg text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] transition-colors disabled:opacity-60"
              id="chat-query-input"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="min-h-11 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-[var(--bg-body)] disabled:text-[var(--text-muted)] text-white font-semibold transition-colors flex items-center justify-center shrink-0 text-sm"
              title="Analisar Caso"
              id="chat-send-submit"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>Analisar</span>
            </button>
          </form>
        </div>

        {/* Right Side: Tabbed Interactive Visualizations (Concept Graph, Stats, KB Manager, or Auditor Panel) */}
        <div className={`h-full flex-col relative bg-[var(--bg-app)] border-l app-border transition-all duration-200 ${isFocusMode ? 'w-0 overflow-hidden opacity-0 pointer-events-none hidden' : 'hidden lg:flex lg:w-[46%]'}`} id="visualization-section">
          
          {/* Workstation Top Tab Bar */}
          {!isFocusMode && (
            <div className="h-13 border-b app-border bg-[var(--bg-panel)] px-3 flex items-center justify-between gap-2 z-10 shrink-0 select-none">
              <div className="flex gap-0.5 h-full items-center overflow-x-auto">
                {/* Tab 1: Graph */}
                <button
                  onClick={() => setActiveRightTab('graph')}
                  className={`h-full flex items-center gap-1.5 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeRightTab === 'graph'
                      ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-transparent'
                  }`}
                  id="tab-btn-graph"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Grafo</span>
                </button>

                {/* Tab 1.5: Question History */}
                <button
                  onClick={() => setActiveRightTab('history')}
                  className={`relative h-9 w-9 shrink-0 self-center flex items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                    activeRightTab === 'history'
                      ? 'text-[var(--accent-color)] border-[var(--accent-color)] bg-[var(--accent-glow)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border-transparent'
                  }`}
                  id="tab-btn-history"
                  title="Histórico de perguntas"
                  aria-label={`Histórico de perguntas${auditLogs.length > 0 ? `, ${auditLogs.length} ${auditLogs.length === 1 ? 'pergunta' : 'perguntas'}` : ''}`}
                  aria-pressed={activeRightTab === 'history'}
                >
                  <History className="w-3.5 h-3.5" />
                  {auditLogs.length > 0 && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" aria-hidden="true" />
                  )}
                </button>

                {/* Tab 2: Operational Intelligence */}
                <button
                  onClick={() => setActiveRightTab('stats')}
                  className={`h-full flex items-center gap-1.5 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeRightTab === 'stats'
                      ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-transparent'
                  }`}
                  id="tab-btn-stats"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Inteligência & Gaps</span>
                </button>

                {/* Tab 3: KB Manager */}
                <button
                  onClick={() => setActiveRightTab('kb')}
                  className={`h-full flex items-center gap-1.5 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors relative ${
                    activeRightTab === 'kb'
                      ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-transparent'
                  }`}
                  id="tab-btn-kb"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Gerenciar Base (KB)</span>
                  {kbDraft && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent-color)] rounded-full animate-pulse border border-[var(--bg-panel)]" />
                  )}
                </button>

                {/* Tab 3.5: Planilha */}
                <button
                  onClick={() => setActiveRightTab('sheet')}
                  className={`h-full flex items-center gap-1.5 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeRightTab === 'sheet'
                      ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-transparent'
                  }`}
                  id="tab-btn-sheet"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Planilha RAG</span>
                </button>

                {/* Tab 4: Audit Dashboard */}
                <button
                  onClick={() => setActiveRightTab('audit')}
                  className={`h-full flex items-center gap-1.5 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeRightTab === 'audit'
                      ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-transparent'
                  }`}
                  id="tab-btn-audit"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Auditoria</span>
                </button>

                {/* Tab 5: Settings Dashboard */}
                <button
                  onClick={() => setActiveRightTab('settings')}
                  className={`h-full flex items-center gap-1.5 px-3 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeRightTab === 'settings'
                      ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-transparent'
                  }`}
                  id="tab-btn-settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Chaves de API</span>
                </button>
              </div>

              {activeRightTab !== 'history' && (
                <div className="workspace-secondary-label text-[11px] text-[var(--text-muted)] font-medium hidden 2xl:block whitespace-nowrap">
                  {activeRightTab === 'graph' && 'Mapeamento de Conceitos'}
                  {activeRightTab === 'stats' && 'Métricas Operacionais'}
                  {activeRightTab === 'kb' && 'Edição de Playbooks'}
                  {activeRightTab === 'sheet' && 'Planilha RAG'}
                  {activeRightTab === 'audit' && 'Terminal de Auditoria'}
                  {activeRightTab === 'settings' && 'Configurações de Provedores'}
                </div>
              )}
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
                  theme={appTheme}
                />
              </div>
            )}

            {activeRightTab === 'history' && (
              <div className="w-full h-full">
                <QuestionHistory
                  logs={auditLogs}
                  onReuseQuestion={handleReuseQuestion}
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
            {activeRightTab === 'sheet' && (
              <div className="w-full h-full flex flex-col p-4 space-y-4 overflow-hidden bg-[var(--bg-app)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">Planilha Consolidada da Base RAG</h3>
                      <p className="text-[10px] text-[var(--text-muted)]">Visualização tabular dos chunks indexados no Grafo de CS</p>
                    </div>
                  </div>
                  {/* Filters */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Pesquisar na planilha..."
                      id="search-sheet-input"
                      className="px-2.5 py-1 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-500/50"
                      value={sheetSearch}
                      onChange={(e) => setSheetSearch(e.target.value)}
                    />
                    <select
                      id="filter-sheet-topic"
                      className="px-2.5 py-1 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none"
                      value={sheetTopicFilter}
                      onChange={(e) => setSheetTopicFilter(e.target.value)}
                    >
                      <option value="all">Todos os Tópicos</option>
                      <option value="visao-geral">Visão Geral</option>
                      <option value="cota">Cotas e Aprendizagem</option>
                      <option value="elegibilidade">Benefícios / Elegibilidade</option>
                      <option value="operacao">Operação Regional</option>
                      <option value="plataforma">Plataforma e Dados</option>
                      <option value="efetivacao">Efetivação e Carreira</option>
                      <option value="objecao">Objeções e Segurança</option>
                      <option value="Infraestrutura e Stack">Tecnologia e Stack</option>
                      <option value="Processo e Negócio">Processo e Negócio</option>
                    </select>
                  </div>
                </div>

                {/* Table Viewport */}
                <div className="flex-1 border border-[var(--border-main)] rounded-lg overflow-auto bg-[var(--bg-card)] shadow-md">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead className="sticky top-0 bg-[var(--bg-panel)] text-[var(--text-muted)] font-mono uppercase text-[9px] border-b border-[var(--border-main)] z-10">
                      <tr>
                        <th className="p-2.5 border-r border-[var(--border-main)] w-20">ID</th>
                        <th className="p-2.5 border-r border-[var(--border-main)] w-28">Categoria</th>
                        <th className="p-2.5 border-r border-[var(--border-main)] w-48">Título / Seção</th>
                        <th className="p-2.5 border-r border-[var(--border-main)]">Conteúdo Integral (Clique para Selecionar)</th>
                        <th className="p-2.5 border-r border-[var(--border-main)] w-24">Público</th>
                        <th className="p-2.5 w-20 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-main)]">
                      {graphData.nodes
                        .filter(node => node.type === 'document')
                        .filter(node => {
                          if (sheetTopicFilter === 'all') return true;
                          return node.topic === sheetTopicFilter ||
                                 (sheetTopicFilter === 'elegibilidade' && node.topic?.includes('elegibilidade')) ||
                                 (sheetTopicFilter === 'operacao' && node.topic?.includes('operacao')) ||
                                 (sheetTopicFilter === 'cota' && node.topic?.includes('cota')) ||
                                 (sheetTopicFilter === 'objecao' && node.topic?.includes('objecao'));
                        })
                        .filter(node => {
                          const query = sheetSearch.toLowerCase();
                          return node.title.toLowerCase().includes(query) ||
                                 ((node as any).content && (node as any).content.toLowerCase().includes(query));
                        })
                        .map((node) => (
                          <tr
                            key={node.id}
                            onClick={() => handleSelectNodeFromGraph(node)}
                            className="hover:bg-[var(--bg-card-hover)]/40 cursor-pointer transition-colors duration-150"
                          >
                            <td className="p-2.5 border-r border-[var(--border-main)] font-mono text-[10px] text-cyan-400 font-semibold">{node.id}</td>
                            <td className="p-2.5 border-r border-[var(--border-main)] font-mono text-[9px] text-[var(--text-muted)] truncate max-w-[110px]">{node.topic || 'Outros'}</td>
                            <td className="p-2.5 border-r border-[var(--border-main)] font-bold text-[var(--text-main)] truncate max-w-[190px]" title={node.title}>{node.title}</td>
                            <td className="p-2.5 border-r border-[var(--border-main)] text-[var(--text-muted)] font-medium max-w-[360px] truncate" title="Clique para abrir detalhes na íntegra">
                              {(node as any).content}
                            </td>
                            <td className="p-2.5 border-r border-[var(--border-main)] text-[var(--text-muted)] font-semibold text-[9px] uppercase">
                              {(node as any).audience || 'interno'}
                            </td>
                            <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenSheetDetailModal(node)}
                                className="px-2 py-0.5 bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-white rounded text-[9px] font-bold"
                              >
                                Ler Tudo
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center text-[9px] text-[var(--text-muted)] font-mono shrink-0">
                  <span>Registros Encontrados: {graphData.nodes.filter(n => n.type === 'document').length} Chunks</span>
                  <span>Clique em qualquer linha para abrir a barra lateral de detalhes</span>
                </div>
              </div>
            )}
            {activeRightTab === 'settings' && (
              <div className="w-full h-full p-5 overflow-y-auto space-y-6">
                <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono uppercase">
                    <Settings className="w-4 h-4 animate-pulse" />
                    <span>Configuração de Chaves & Assinaturas</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Configure abaixo as suas credenciais. Elas são gravadas localmente no seu navegador e enviadas diretamente nas consultas, sem armazenamento no servidor.
                  </p>
                  
                  {/* Select Provider */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">1. Provedor de IA</label>
                    <select
                      value={apiProvider}
                      onChange={(e) => {
                        const prov = e.target.value as any;
                        let defaultModel = "";
                        if (prov === 'gemini') defaultModel = 'gemini-3.5-flash';
                        if (prov === 'openai') defaultModel = 'gpt-4o-mini';
                        if (prov === 'openrouter') defaultModel = 'google/gemini-2.5-flash';
                        if (prov === 'nvidia') defaultModel = 'minimaxai/minimax-m3';
                        handleSaveApiSettings(prov, userApiKey, defaultModel);
                      }}
                      className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded-lg text-xs text-[var(--text-main)] focus:outline-none"
                    >
                      <option value="simulation">Simulação Local (Sem Chave / Gratuito)</option>
                      <option value="gemini">Google Gemini (AI Studio)</option>
                      <option value="openai">OpenAI (ChatGPT API)</option>
                      <option value="openrouter">OpenRouter API (Llama, Gemini, etc.)</option>
                      <option value="nvidia">NVIDIA NIM (Minimax M3)</option>
                    </select>
                  </div>

                  {/* API Key */}
                  {apiProvider !== 'simulation' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">2. Chave de API ({apiProvider.toUpperCase()})</label>
                      <input
                        type="password"
                        placeholder={`Insira sua chave para ${apiProvider.toUpperCase()} (ex: sk-... ou nvapi-...)`}
                        value={userApiKey}
                        onChange={(e) => handleSaveApiSettings(apiProvider, e.target.value, userModelName)}
                        className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded-lg text-xs text-[var(--text-main)] focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Model Name */}
                  {apiProvider !== 'simulation' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">3. Nome do Modelo</label>
                      <input
                        type="text"
                        placeholder="Nome do modelo (ex: gpt-4o-mini, gemini-3.5-flash)"
                        value={userModelName}
                        onChange={(e) => handleSaveApiSettings(apiProvider, userApiKey, e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded-lg text-xs text-[var(--text-main)] focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="pt-2">
                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-1 rounded inline-block">
                      ✓ Salvo e configurado no navegador!
                    </span>
                  </div>
                </div>

                {/* Helpful API Key Resources */}
                <div className="p-4 bg-[var(--bg-card)]/50 border border-[var(--border-main)]/60 rounded-lg space-y-2">
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Onde obter chaves de API gratuitas:</span>
                  <ul className="text-[10.5px] text-[var(--text-muted)] space-y-1.5 list-disc pl-4">
                    <li><strong>Google Gemini Key:</strong> Obtenha gratuitamente no <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Google AI Studio</a>.</li>
                    <li><strong>OpenRouter Key:</strong> Crie chaves e acesse modelos gratuitos (com sufixo <code>:free</code>) em <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="text-cyan-400 underline">openrouter.ai</a>.</li>
                    <li><strong>NVIDIA NIM Key:</strong> Registre-se e receba créditos no <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">NVIDIA Build Console</a>.</li>
                  </ul>
                </div>
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
                              onClick={() => handleSelectNodeFromGraph(otherNode)}
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

          {/* Spreadsheet Detail Modal to view documents na íntegra */}
          <AnimatePresence>
            {sheetDetailModalNode && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
                >
                  {/* Modal Header */}
                  <div className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-panel)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-mono block">Leitura na Íntegra ({sheetDetailModalNode.id})</span>
                        <h4 className="font-semibold text-xs text-[var(--text-main)]">{sheetDetailModalNode.title}</h4>
                      </div>
                    </div>
                    <button
                      onClick={() => setSheetDetailModalNode(null)}
                      className="p-1 rounded bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] border border-[var(--border-main)]/60"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Topic/Category Banner */}
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-semibold uppercase">
                        Tópico: {sheetDetailModalNode.topic}
                      </span>
                      {sheetDetailModalNode.keywords && sheetDetailModalNode.keywords.length > 0 && (
                        <span className="text-[10px] bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-main)] px-2 py-0.5 rounded font-mono">
                          Tag: #{sheetDetailModalNode.keywords[0]}
                        </span>
                      )}
                    </div>

                    {/* Main text area */}
                    <div className="p-4 bg-[var(--bg-body)] border border-[var(--border-main)] rounded-lg">
                      <p className="text-xs text-[var(--text-main)] leading-relaxed whitespace-pre-line font-sans select-text">
                        {(sheetDetailModalNode as any).content || (sheetDetailModalNode as any).description}
                      </p>
                    </div>

                    {/* Metadata attributes list */}
                    <div className="grid grid-cols-2 gap-3 text-[10px] text-[var(--text-muted)] p-2.5 bg-[var(--bg-panel)]/30 rounded border border-[var(--border-main)]/50 font-mono">
                      <div>
                        <span className="block font-bold">PÚBLICO-ALVO:</span>
                        <span className="text-[var(--text-main)] font-semibold uppercase">{(sheetDetailModalNode as any).audience || 'interno'}</span>
                      </div>
                      <div>
                        <span className="block font-bold">ÚLTIMA ATUALIZAÇÃO:</span>
                        <span className="text-[var(--text-main)] font-semibold">{(sheetDetailModalNode as any).updated_at || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-3 bg-[var(--bg-panel)] border-t border-[var(--border-main)] flex justify-between items-center text-[10px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      Conteúdo Documentado na Base
                    </span>
                    <button
                      onClick={() => setSheetDetailModalNode(null)}
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded text-xs transition-colors"
                    >
                      Fechar Documento
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
