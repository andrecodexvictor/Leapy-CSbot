import { useState, useEffect, useRef, MouseEvent, WheelEvent } from 'react';
import { GraphData, GraphNode, GraphEdge } from '../types';
import { Network, FileText, Compass, Sparkles, Sliders, RefreshCw, ZoomIn, ZoomOut, HelpCircle } from 'lucide-react';

interface SimulatedNode {
  id: string;
  title: string;
  type: 'document' | 'concept';
  topic?: string;
  keywords: string[];
  description?: string;
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
}

export default function ConceptGraph({ graphData, highlightedNodeIds, onSelectNode }: ConceptGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
  const handleRecenter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: rect.height / 2 });
      setZoom(0.85);
    }
  };

  const [showDocuments, setShowDocuments] = useState(true);
  const topics = ['All', 'Cotas e Legislação', 'Benefícios e RH', 'Operação e Tributário', 'Plataforma e Automação', 'Transição e Carreira', 'Objeções de Vendas e Segurança'];

  // Filter nodes and edges dynamically
  const filteredNodes = nodes.filter(node => {
    if (!showDocuments && node.type === 'document') return false;
    if (selectedTopic !== 'All' && node.topic !== selectedTopic && node.type === 'document') return false;
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 font-display font-semibold text-xs tracking-wider uppercase">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Mapeamento de Conceitos e Decisões</span>
          </div>
          <div className="flex gap-1.5 items-center">
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

            <div className="h-4 w-px bg-slate-800" />

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
              onClick={handleRecenter}
              className="p-1 rounded bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] transition-colors border app-border"
              title="Centralizar"
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
                        ? 'var(--accent-color, #4FB8D6)' 
                        : isHighlighted 
                        ? 'var(--accent-color, #4FB8D6)' 
                        : 'var(--border-main, #24343B)'
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
                      fill="var(--accent-color, #4FB8D6)"
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
                  stroke="var(--accent-color, #4FB8D6)"
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
                      stroke={isHighlighted ? 'var(--accent-color, #4FB8D6)' : 'var(--text-muted, #9AA8AE)'}
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
                    stroke={isHighlighted ? 'var(--accent-color, #4FB8D6)' : 'transparent'}
                    strokeWidth="1"
                  />

                  {/* Core circle */}
                  <circle
                    r={node.radius}
                    fill={isHighlighted ? (node.type === 'document' ? '#144656' : '#2A3C46') : (node.type === 'document' ? 'var(--bg-body, #0B1114)' : 'var(--bg-panel, #162229)')}
                    stroke={isHighlighted ? 'var(--accent-color, #4FB8D6)' : node.type === 'document' ? 'var(--accent-alt, #4DBA8A)' : 'var(--text-muted, #9AA8AE)'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    className="transition-all duration-350"
                  />

                  {/* Text label */}
                  <text
                    y={node.radius + 12}
                    textAnchor="middle"
                    fill={isHighlighted ? 'var(--text-main, #E8EEF0)' : 'var(--text-muted, #9AA8AE)'}
                    fontSize="8.5"
                    fontWeight={isHighlighted ? '600' : '500'}
                    className="select-none pointer-events-none font-sans"
                  >
                    {node.title.length > 20 ? node.title.substring(0, 18) + '...' : node.title}
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
