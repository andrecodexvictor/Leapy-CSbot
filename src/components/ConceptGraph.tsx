import { useState, useEffect, useRef, MouseEvent, WheelEvent } from 'react';
import { GraphData, GraphNode, GraphEdge } from '../types';
import { Network, FileText, Compass, Sparkles, Sliders, RefreshCw, ZoomIn, ZoomOut, HelpCircle, Filter, Search, X } from 'lucide-react';

interface SimulatedNode {
  id: string;
  title: string;
  type: 'document' | 'concept';
  topic?: string;
  keywords: string[];
  description?: string;
  content?: string;
  sourceType?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface ConceptGraphProps {
  graphData: GraphData;
  highlightedNodeIds: string[];
  onSelectNode: (node: GraphNode) => void;
  theme?: string;
}

export default function ConceptGraph({ graphData, highlightedNodeIds, onSelectNode, theme }: ConceptGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isLightTheme = theme === 'theme-slate-light';
  
  // Theme-specific color mappings for canvas SVG
  const textColorMain = isLightTheme ? '#0F172A' : '#F1F5F9';
  const textColorMuted = isLightTheme ? '#475569' : '#94A3B8';
  const edgeColorNormal = isLightTheme ? '#CBD5E1' : '#1e293b';
  const edgeColorHighlighted = isLightTheme ? '#0284C7' : '#38bdf8';
  const nodeDocFill = isLightTheme ? '#F1F5F9' : '#0B1114';
  const nodeConceptFill = isLightTheme ? '#E2E8F0' : '#162229';
  const nodeDocFillHighlighted = isLightTheme ? '#bae6fd' : '#144656';
  const nodeConceptFillHighlighted = isLightTheme ? '#ddd6fe' : '#2A3C46';
  
  const nodeDocStroke = isLightTheme ? '#0284C7' : '#4DBA8A';
  const nodeConceptStroke = isLightTheme ? '#475569' : '#9AA8AE';
  const nodeHighlightedStroke = isLightTheme ? '#0284C7' : '#4FB8D6';
  const gridDotColor = isLightTheme ? '#cbd5e1' : '#24343B';
  const [nodes, setNodes] = useState<SimulatedNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  
  // Viewport transformations for zoom & pan
  const [pan, setPan] = useState({ x: 300, y: 300 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  // UI Controls
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [tooltipNode, setTooltipNode] = useState<SimulatedNode | null>(null);
  const [isCustomFilterOpen, setIsCustomFilterOpen] = useState(false);
  const [customSearch, setCustomSearch] = useState('');
  const [customNodeType, setCustomNodeType] = useState<'all' | 'document' | 'concept'>('all');
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [connectedToDecisionOnly, setConnectedToDecisionOnly] = useState(false);
  const [syntheticOnly, setSyntheticOnly] = useState(false);

  // Initialize nodes in circular layouts
  useEffect(() => {
    if (!graphData.nodes || graphData.nodes.length === 0) return;

    const initialized = graphData.nodes.map((node, i) => {
      const angle = (i / graphData.nodes.length) * 2 * Math.PI;
      const radius = node.type === 'document' ? 140 : 250;
      return {
        id: node.id,
        title: node.title,
        type: node.type,
        topic: node.type === 'document' ? node.topic : 'Conceito',
        keywords: node.keywords || [],
        description: node.type === 'concept' ? node.description : undefined,
        content: node.type === 'document' ? node.content : undefined,
        sourceType: node.type === 'document' ? node.source_type : undefined,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: node.type === 'document' ? 10 : 7,
      };
    });

    setNodes(initialized);
    setEdges(graphData.edges || []);

    // Center viewport on load
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: rect.height / 2 });
    }
  }, [graphData]);

  // Physics Simulation Loop
  useEffect(() => {
    if (!physicsEnabled || nodes.length === 0) return;

    let animFrameId: number;
    
    const simulate = () => {
      setNodes(prevNodes => {
        // Create working copy
        const current = prevNodes.map(n => ({ ...n }));

        // 1. Repulsion force between all nodes
        for (let i = 0; i < current.length; i++) {
          for (let j = i + 1; j < current.length; j++) {
            const n1 = current[i];
            const n2 = current[j];
            
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            const minDesiredDist = n1.type === 'document' || n2.type === 'document' ? 120 : 180;
            if (dist < minDesiredDist) {
              const force = (minDesiredDist - dist) * 0.08;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              
              if (n1.id !== draggedNodeId) {
                n1.vx -= fx;
                n1.vy -= fy;
              }
              if (n2.id !== draggedNodeId) {
                n2.vx += fx;
                n2.vy += fy;
              }
            }
          }
        }

        // 2. Attraction force along edges
        edges.forEach(edge => {
          const sourceNode = current.find(n => n.id === edge.source);
          const targetNode = current.find(n => n.id === edge.target);
          
          if (sourceNode && targetNode) {
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            const restLength = 110;
            const k = 0.02; // spring constant
            const force = (dist - restLength) * k;
            
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            if (sourceNode.id !== draggedNodeId) {
              sourceNode.vx += fx;
              sourceNode.vy += fy;
            }
            if (targetNode.id !== draggedNodeId) {
              targetNode.vx -= fx;
              targetNode.vy -= fy;
            }
          }
        });

        // 3. Center gravity force (pull back to origin 0,0)
        current.forEach(node => {
          if (node.id === draggedNodeId) return;
          
          const distToOrigin = Math.sqrt(node.x * node.x + node.y * node.y) || 1;
          const gravityK = 0.004;
          node.vx -= node.x * gravityK;
          node.vy -= node.y * gravityK;
          
          // Apply velocity friction & update positions
          node.vx *= 0.85;
          node.vy *= 0.85;
          
          node.x += node.vx;
          node.y += node.vy;
        });

        return current;
      });

      animFrameId = requestAnimationFrame(simulate);
    };

    animFrameId = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animFrameId);
  }, [edges, physicsEnabled, draggedNodeId, nodes.length]);

  // Drag and drop mechanics
  const handleNodeMouseDown = (e: MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedNodeId) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      
      const newX = (clientX - pan.x) / zoom;
      const newY = (clientY - pan.y) / zoom;
      
      setNodes(prev => prev.map(n => {
        if (n.id === draggedNodeId) {
          return { ...n, x: newX, y: newY, vx: 0, vy: 0 };
        }
        return n;
      }));
    } else if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan({ x: pan.x + dx, y: pan.y + dy });
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  const handleBackgroundMouseDown = (e: MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    let newZoom = zoom;
    if (e.deltaY < 0) {
      newZoom = Math.min(zoom * zoomFactor, 3);
    } else {
      newZoom = Math.max(zoom / zoomFactor, 0.4);
    }
    setZoom(newZoom);
  };

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.2, 0.4));
  const handleResetView = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setDraggedNodeId(null);
    setIsPanning(false);
    setPanStart({ x: 0, y: 0 });
    setPan({ x: rect.width / 2, y: rect.height / 2 });
    setZoom(1);
  };

  const [showDocuments, setShowDocuments] = useState(true);
  const topics = ['All', 'Cotas e Legislação', 'Benefícios e RH', 'Operação e Tributário', 'Plataforma e Automação', 'Transição e Carreira', 'Objeções de Vendas e Segurança'];
  const availableCustomTopics: string[] = Array.from(
    new Set<string>(
      nodes
        .filter(node => node.type === 'document' && Boolean(node.topic))
        .map(node => node.topic as string)
    )
  ).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const decisionNeighborhoodIds = new Set<string>(highlightedNodeIds);
  edges.forEach(edge => {
    if (highlightedNodeIds.includes(edge.source)) decisionNeighborhoodIds.add(edge.target);
    if (highlightedNodeIds.includes(edge.target)) decisionNeighborhoodIds.add(edge.source);
  });

  const toggleCustomTopic = (topic: string) => {
    setCustomTopics(current => current.includes(topic)
      ? current.filter(item => item !== topic)
      : [...current, topic]
    );
  };

  const resetCustomFilter = () => {
    setCustomSearch('');
    setCustomNodeType('all');
    setCustomTopics([]);
    setConnectedToDecisionOnly(false);
    setSyntheticOnly(false);
  };

  const resetAllGraphFilters = () => {
    resetCustomFilter();
    setSelectedTopic('All');
    setShowDocuments(true);
  };

  const customFilterCount = [
    customSearch.trim().length > 0,
    customNodeType !== 'all',
    customTopics.length > 0,
    connectedToDecisionOnly,
    syntheticOnly,
  ].filter(Boolean).length;

  useEffect(() => {
    if (highlightedNodeIds.length === 0 && connectedToDecisionOnly) {
      setConnectedToDecisionOnly(false);
    }
  }, [highlightedNodeIds.length, connectedToDecisionOnly]);

  // Helper to match database topic strings with selected UI topics
  const matchTopic = (nodeTopic?: string, selected?: string) => {
    if (!selected || selected === 'All') return true;
    if (!nodeTopic) return false;
    
    const cleanSelected = selected.toLowerCase();
    const cleanNode = nodeTopic.toLowerCase();
    
    if (cleanSelected.includes('cota') && cleanNode.includes('cota')) return true;
    if (cleanSelected.includes('benefício') && (cleanNode.includes('beneficio') || cleanNode.includes('rh') || cleanNode.includes('férias'))) return true;
    if (cleanSelected.includes('opera') && (cleanNode.includes('operacao') || cleanNode.includes('geral') || cleanNode.includes('guard'))) return true;
    if (cleanSelected.includes('plataforma') && cleanNode.includes('plataforma')) return true;
    if (cleanSelected.includes('transi') && cleanNode.includes('transicao')) return true;
    if (cleanSelected.includes('objeç') && (cleanNode.includes('obje') || cleanNode.includes('comercial') || cleanNode.includes('seguranca'))) return true;
    
    return false;
  };

  // Filter nodes and edges dynamically
  const filteredNodes = nodes.filter(node => {
    if (node.type === 'document') {
      if (!showDocuments) return false;
      if (selectedTopic !== 'All') {
        return matchTopic(node.topic, selectedTopic);
      }
    }

    if (customNodeType !== 'all' && node.type !== customNodeType) return false;

    if (customTopics.length > 0 && (node.type !== 'document' || !node.topic || !customTopics.includes(node.topic))) {
      return false;
    }

    if (syntheticOnly && node.sourceType !== 'demonstracao-ficticia') return false;

    if (connectedToDecisionOnly && !decisionNeighborhoodIds.has(node.id)) return false;

    const normalizedSearch = customSearch.trim().toLocaleLowerCase('pt-BR');
    if (normalizedSearch) {
      const searchableText = [node.title, node.topic, node.description, node.content, ...node.keywords]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('pt-BR');
      if (!searchableText.includes(normalizedSearch)) return false;
    }

    return true;
  });

  const filteredEdges = edges.filter(edge => {
    const source = filteredNodes.find(n => n.id === edge.source);
    const target = filteredNodes.find(n => n.id === edge.target);
    return !!source && !!target;
  });

  // Top 5 most relevant nodes (from current search or fallback to connection degrees)
  const top5NodeIds = (() => {
    if (highlightedNodeIds && highlightedNodeIds.length > 0) {
      return highlightedNodeIds.slice(0, 5);
    } else {
      const counts: Record<string, number> = {};
      edges.forEach(e => {
        counts[e.source] = (counts[e.source] || 0) + 1;
        counts[e.target] = (counts[e.target] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);
    }
  })();

  // Identify edges in the "Decision Path" (caminho de decisão)
  const isDecisionPathEdge = (edge: GraphEdge) => {
    if (highlightedNodeIds.length < 2) return false;
    const isSrcHl = highlightedNodeIds.includes(edge.source);
    const isTgtHl = highlightedNodeIds.includes(edge.target);
    const isTopRelevant = top5NodeIds.slice(0, 3).includes(edge.source) || top5NodeIds.slice(0, 3).includes(edge.target);
    return isSrcHl && isTgtHl && isTopRelevant;
  };

  // 1-line relevance explanations for tooltips
  const getRelevanceExplanation = (node: SimulatedNode) => {
    const isHighlighted = highlightedNodeIds.includes(node.id);
    const isTop5 = top5NodeIds.includes(node.id);
    if (isHighlighted) {
      if (node.type === 'document') {
        return "Relevante: Base documental que fundamenta as regras do caso.";
      } else {
        return "Decisão: Conceito lógico ativado para a resolução.";
      }
    } else if (isTop5) {
      return "Conexão Central: Um dos 5 nós mais influentes da base operacional.";
    } else {
      return "Contexto: Conexão complementar de auditoria secundária.";
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-[var(--bg-app)] border-l app-border relative select-none overflow-hidden"
      id="graph-panel"
    >
      {/* Header controls */}
      <div className="p-4 border-b app-border bg-[var(--bg-panel)] flex flex-col gap-2.5 z-10">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-[var(--text-main)] font-display font-semibold text-xs">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Mapeamento de Conceitos e Decisões</span>
          </div>
          <div className="flex gap-1.5 items-center flex-wrap justify-end">
            {/* Toggle Documentos / Auditoria */}
            <button 
              onClick={() => setShowDocuments(!showDocuments)}
              className={`px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 ${
                showDocuments 
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35' 
                  : 'bg-[var(--bg-body)] text-[var(--text-muted)] app-border hover:bg-[var(--bg-card-hover)]'
              }`}
              title={showDocuments ? "Ocultar Documentos (Ver apenas Conceitos)" : "Exibir Documentos de Auditoria"}
              id="btn-toggle-docs-visibility"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">Docs (Auditoria)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomFilterOpen(current => !current)}
              className={`min-h-7 px-2.5 rounded border transition-colors flex items-center gap-1.5 ${
                isCustomFilterOpen || customFilterCount > 0
                  ? 'bg-[var(--accent-glow)] text-[var(--accent-color)] border-[var(--accent-color)]/35'
                  : 'bg-[var(--bg-body)] text-[var(--text-muted)] app-border hover:bg-[var(--bg-card-hover)]'
              }`}
              id="btn-custom-graph-filter"
              aria-expanded={isCustomFilterOpen}
              aria-controls="custom-graph-filter-panel"
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold">Filtro personalizado</span>
              {customFilterCount > 0 && (
                <span className="min-w-4 h-4 px-1 rounded-full bg-[var(--accent-color)] text-white text-[9px] font-semibold flex items-center justify-center">
                  {customFilterCount}
                </span>
              )}
            </button>

            <div className="h-4 w-px bg-[var(--border-main)]" />

            <button 
              onClick={handleZoomIn}
              className="p-1 rounded bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] transition-colors border app-border"
              title="Aumentar Zoom"
              id="btn-zoom-in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-1 rounded bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] transition-colors border app-border"
              title="Diminuir Zoom"
              id="btn-zoom-out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button 
              type="button"
              onClick={handleResetView}
              className="p-1 rounded bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] transition-colors border app-border"
              title="Restaurar visualização"
              aria-label="Restaurar posição e zoom do grafo"
              id="btn-recenter"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setPhysicsEnabled(!physicsEnabled)}
              className={`p-1 rounded transition-all border ${physicsEnabled ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] app-border'}`}
              title={physicsEnabled ? "Pausar Dinâmica" : "Ativar Dinâmica"}
              id="btn-toggle-physics"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filters and legend */}
        <div className="flex flex-wrap gap-1 mt-1">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              disabled={!showDocuments && t !== 'All'}
              id={`topic-filter-${t.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                selectedTopic === t 
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' 
                  : 'bg-[var(--bg-body)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] border app-border disabled:opacity-30 disabled:pointer-events-none'
              }`}
            >
              {t === 'All' ? 'Todos os Nós' : t.split(' e ')[0]}
            </button>
          ))}
        </div>

        {isCustomFilterOpen && (
          <div
            id="custom-graph-filter-panel"
            className="bg-[var(--bg-card)] border app-border rounded-xl overflow-hidden"
          >
            <div className="px-3 py-2.5 flex items-center justify-between gap-3 border-b app-border">
              <div>
                <p className="text-xs font-semibold text-[var(--text-main)]">Monte sua visão do grafo</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {filteredNodes.length} de {nodes.length} nós visíveis
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {customFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetCustomFilter}
                    className="min-h-7 px-2.5 rounded-lg text-[11px] font-medium text-[var(--accent-color)] hover:bg-[var(--accent-glow)] transition-colors"
                  >
                    Limpar filtros
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsCustomFilterOpen(false)}
                  className="w-7 h-7 rounded-lg border app-border bg-[var(--bg-body)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-colors"
                  aria-label="Fechar filtro personalizado"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 space-y-3">
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto] gap-3 items-end">
                <label className="space-y-1 min-w-0">
                  <span className="text-[11px] font-semibold text-[var(--text-main)]">Buscar no conteúdo</span>
                  <span className="relative block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
                    <input
                      type="search"
                      value={customSearch}
                      onChange={(event) => setCustomSearch(event.target.value)}
                      placeholder="Título, palavra-chave ou conteúdo…"
                      className="w-full min-h-9 pl-9 pr-3 rounded-lg bg-[var(--bg-body)] border app-border text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--accent-color)] focus:outline-none select-text"
                    />
                  </span>
                </label>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[var(--text-main)] block">Tipo de nó</span>
                  <div className="flex p-0.5 rounded-lg bg-[var(--bg-body)] border app-border">
                    {([
                      ['all', 'Todos'],
                      ['document', 'Documentos'],
                      ['concept', 'Conceitos'],
                    ] as const).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setCustomNodeType(value);
                          if (value === 'document') setShowDocuments(true);
                        }}
                        className={`min-h-7 px-2.5 rounded-md text-[11px] font-medium transition-colors ${
                          customNodeType === value
                            ? 'bg-[var(--bg-card)] text-[var(--text-main)] border app-border'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent'
                        }`}
                        aria-pressed={customNodeType === value}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[var(--text-main)]">Tópicos da base</span>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                  {availableCustomTopics.map(topic => {
                    const isSelected = customTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          toggleCustomTopic(topic);
                          if (!isSelected) {
                            setCustomNodeType('document');
                            setShowDocuments(true);
                          }
                        }}
                        className={`min-h-7 px-2.5 rounded-full border text-[11px] font-medium transition-colors ${
                          isSelected
                            ? 'bg-[var(--accent-glow)] text-[var(--accent-color)] border-[var(--accent-color)]/35'
                            : 'bg-[var(--bg-body)] text-[var(--text-muted)] app-border hover:text-[var(--text-main)]'
                        }`}
                        aria-pressed={isSelected}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 border-t app-border">
                <label className={`flex items-center gap-2 text-[11px] ${highlightedNodeIds.length === 0 ? 'text-[var(--text-muted)] opacity-60' : 'text-[var(--text-main)]'}`}>
                  <input
                    type="checkbox"
                    checked={connectedToDecisionOnly}
                    onChange={(event) => setConnectedToDecisionOnly(event.target.checked)}
                    disabled={highlightedNodeIds.length === 0}
                    className="w-3.5 h-3.5 accent-[var(--accent-color)]"
                  />
                  Conectados à decisão atual
                </label>
                <label className="flex items-center gap-2 text-[11px] text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={syntheticOnly}
                    onChange={(event) => {
                      setSyntheticOnly(event.target.checked);
                      if (event.target.checked) {
                        setCustomNodeType('document');
                        setShowDocuments(true);
                      }
                    }}
                    className="w-3.5 h-3.5 accent-[var(--accent-color)]"
                  />
                  Somente documentos de demonstração
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SVG Stage */}
      <div 
        ref={containerRef}
        className="flex-1 w-full relative outline-none cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleBackgroundMouseDown}
        onWheel={handleWheel}
        id="graph-canvas-container"
      >
        {filteredNodes.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-6 pointer-events-none">
            <div className="max-w-sm rounded-xl bg-[var(--bg-card)] border app-border p-4 text-center pointer-events-auto">
              <div className="w-9 h-9 mx-auto rounded-lg bg-[var(--accent-glow)] text-[var(--accent-color)] flex items-center justify-center mb-2.5">
                <Search className="w-4.5 h-4.5" />
              </div>
              <p className="text-sm font-semibold text-[var(--text-main)]">Nenhum nó corresponde ao filtro</p>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-3">Remova uma condição ou volte à visão completa do grafo.</p>
              <button
                type="button"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={resetAllGraphFilters}
                className="min-h-9 px-3.5 rounded-lg bg-[var(--accent-color)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Mostrar todos os nós
              </button>
            </div>
          </div>
        )}
        <svg 
          className="w-full h-full"
          style={{ backgroundImage: 'radial-gradient(var(--border-main, #24343B) 0.75px, transparent 0.75px)', backgroundSize: '20px 20px', opacity: 0.85 }}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            
            {/* Edges Link Lines */}
            {filteredEdges.map((edge, index) => {
              const source = filteredNodes.find(n => n.id === edge.source);
              const target = filteredNodes.find(n => n.id === edge.target);
              if (!source || !target) return null;

              const isSourceHighlighted = highlightedNodeIds.includes(edge.source);
              const isTargetHighlighted = highlightedNodeIds.includes(edge.target);
              const isHighlighted = isSourceHighlighted && isTargetHighlighted;
              const isDecisionPath = isDecisionPathEdge(edge);

              return (
                <g key={`edge-${index}`}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={
                      isDecisionPath 
                        ? edgeColorHighlighted 
                        : isHighlighted 
                        ? edgeColorHighlighted 
                        : edgeColorNormal
                    }
                    strokeWidth={isDecisionPath ? 2.5 : isHighlighted ? 1.6 : 0.8}
                    strokeOpacity={isDecisionPath ? 0.95 : isHighlighted ? 0.8 : 0.3}
                    strokeDasharray={isDecisionPath ? '5,5' : edge.label === 'Define' ? '3,3' : undefined}
                    className={isDecisionPath ? 'animate-pulse' : undefined}
                  />
                  {edge.label && isHighlighted && (
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 3}
                      fill={edgeColorHighlighted}
                      fontSize="7.5"
                      fontWeight="600"
                      textAnchor="middle"
                      className="select-none pointer-events-none opacity-80 font-mono"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Glowing halos for highlighted nodes (subtle, non-neon, pulse) */}
            {filteredNodes.map(node => {
              const isHighlighted = highlightedNodeIds.includes(node.id);
              if (!isHighlighted) return null;

              return (
                <circle
                  key={`halo-${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 8}
                  fill="none"
                  stroke={edgeColorHighlighted}
                  strokeWidth="1.5"
                  strokeOpacity="0.25"
                  className="animate-pulse"
                  style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: '4s' }}
                />
              );
            })}

            {/* Actual Nodes */}
            {filteredNodes.map(node => {
              const isHighlighted = highlightedNodeIds.includes(node.id);
              const isTopRelevant = top5NodeIds.includes(node.id);
              
              // Clean DOC prefix from titles in the graph for descritive display
              const cleanTitle = node.title.split(' — ').length > 1 ? node.title.split(' — ')[1] : node.title;

              // Obsidian style: esmaecer nós que não estão destacados se houver uma consulta ativa
              const hasActiveSearch = highlightedNodeIds.length > 0;
              let opacity = 1;
              if (hasActiveSearch && !isHighlighted) {
                opacity = 0.35; // esmaecido discreto para contexto estruturado
              }

              return (
                <g 
                  key={`node-${node.id}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onMouseEnter={() => setTooltipNode(node)}
                  onMouseLeave={() => setTooltipNode(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    const rawNode = graphData.nodes.find(n => n.id === node.id);
                    if (rawNode) onSelectNode(rawNode);
                  }}
                  className="cursor-pointer select-none"
                  style={{ opacity, transition: 'opacity 0.4s ease' }}
                  id={`node-element-${node.id}`}
                >
                  {/* Outer ring for top 5 most relevant nodes */}
                  {isTopRelevant && (
                    <circle
                      r={node.radius + 5}
                      fill="transparent"
                      stroke={isHighlighted ? edgeColorHighlighted : textColorMuted}
                      strokeWidth="1.2"
                      strokeDasharray="2,2"
                      className="animate-spin"
                      style={{ transformOrigin: '0px 0px', animationDuration: '12s' }}
                    />
                  )}

                  {/* Outer ring for general selection */}
                  <circle
                    r={node.radius + 3}
                    fill="transparent"
                    stroke={isHighlighted ? edgeColorHighlighted : 'transparent'}
                    strokeWidth="1"
                  />

                  {/* Core circle */}
                  <circle
                    r={node.radius}
                    fill={isHighlighted ? (node.type === 'document' ? nodeDocFillHighlighted : nodeConceptFillHighlighted) : (node.type === 'document' ? nodeDocFill : nodeConceptFill)}
                    stroke={isHighlighted ? nodeHighlightedStroke : node.type === 'document' ? nodeDocStroke : nodeConceptStroke}
                    strokeWidth={isHighlighted ? 2 : 1}
                    className="transition-all duration-350"
                  />

                  {/* Text label */}
                  <text
                    y={node.radius + 12}
                    textAnchor="middle"
                    fill={isHighlighted ? textColorMain : textColorMuted}
                    fontSize="8.5"
                    fontWeight={isHighlighted ? '600' : '500'}
                    className="select-none pointer-events-none font-sans"
                  >
                    {cleanTitle.length > 20 ? cleanTitle.substring(0, 18) + '...' : cleanTitle}
                  </text>

                  {/* Star/Top relevance mini-dot */}
                  {isTopRelevant && (
                    <circle
                      cx={node.radius - 2}
                      cy={-node.radius + 2}
                      r="2.5"
                      fill="var(--warning-color, #D7A54C)"
                      stroke="var(--bg-card)"
                      strokeWidth="0.5"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Live hovering Obsidian Tooltip */}
        {tooltipNode && (
          <div 
            className="absolute p-3 bg-[var(--bg-card)] border app-border rounded shadow-xl text-xs max-w-xs z-50 pointer-events-none animate-fadeIn backdrop-blur-md"
            style={{
              left: `${Math.min((tooltipNode.x * zoom + pan.x) + 15, (containerRef.current?.getBoundingClientRect().width || 600) - 230)}px`,
              top: `${Math.max((tooltipNode.y * zoom + pan.y) - 40, 10)}px`
            }}
            id="node-hover-tooltip"
          >
            <div className="flex items-center gap-1.5 font-display font-semibold text-[var(--text-main)] border-b app-border pb-1.5 mb-1.5">
              {tooltipNode.type === 'document' ? (
                <FileText className="w-3.5 h-3.5 text-[var(--accent-alt, #4DBA8A)]" />
              ) : (
                <Compass className="w-3.5 h-3.5 text-[var(--accent-color, #4FB8D6)]" />
              )}
              <span className="truncate max-w-[170px]">{tooltipNode.title}</span>
              {top5NodeIds.includes(tooltipNode.id) && (
                <span className="ml-auto text-[8px] bg-amber-500/10 text-amber-400 px-1 py-0.2 rounded border border-amber-500/20 font-bold uppercase">Top 5</span>
              )}
            </div>
            
            {/* 1-line Relevance Explanation (MANDATORY REQUIREMENT) */}
            <p className="text-[var(--text-highlight)] font-medium mb-1.5 leading-relaxed text-[10px] italic border-l-2 border-[var(--accent-color)] pl-1.5">
              {getRelevanceExplanation(tooltipNode)}
            </p>

            {tooltipNode.description && (
              <p className="text-slate-400 mb-2 leading-relaxed text-[11px]">{tooltipNode.description}</p>
            )}

            {tooltipNode.topic && tooltipNode.type === 'document' && (
              <div className="mb-2 text-slate-300 text-[11px]">
                <span className="text-[9px] font-semibold text-slate-500 block uppercase tracking-wider">Tema de Operação</span>
                <span>{tooltipNode.topic}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1 mt-1">
              {tooltipNode.keywords.slice(0, 4).map(kw => (
                <span key={kw} className="px-1.5 py-0.5 rounded bg-[var(--bg-body)] text-[9px] text-[var(--text-muted)] border app-border">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic empty canvas helper */}
        <div className="absolute bottom-3 left-3 bg-[var(--bg-body)] border border-[var(--border-main)]/60 rounded px-2.5 py-1 text-[9px] text-[var(--text-muted)] pointer-events-none flex items-center gap-1.5 shadow-sm">
          <HelpCircle className="w-3 h-3 text-[var(--text-muted)]" />
          <span>Arraste os nós para organizar. Use o Scroll para dar Zoom.</span>
        </div>
      </div>
    </div>
  );
}
