export interface DocumentNode {
  id: string;
  title: string;
  type: 'document';
  filename: string;
  topic: string;
  content: string;
  keywords: string[];
  audience?: string;
  source_type?: string;
  updated_at?: string;
}

export interface ConceptNode {
  id: string;
  title: string;
  type: 'concept';
  description: string;
  keywords: string[];
}

export type GraphNode = DocumentNode | ConceptNode;

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  // For bot responses, the required visible blocks and operational aids
  blocks?: {
    respostaObjetiva: string;
    fontes: string[];
    justificativa: string;
    confianca: 'Alta' | 'Média' | 'Baixa' | 'Nenhuma';
    ressalvas?: string;
    // Operational enhancements for CS Copilot
    classificacaoIntencao?: string;
    sinalizacaoRisco?: 'Baixo' | 'Médio' | 'Alto';
    proximaAcaoRecomendada?: string;
    resumoCaso?: string;
  };
  // Graph visual highlighting information (internal context, hidden from user bubble but used to highlight the graph)
  highlightedNodes?: string[];
  isFallback?: boolean;
  provider?: string;
  // User feedback
  feedback?: 'like' | 'dislike';
  feedbackComment?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  query: string;
  matchedNodes: string[];
  expandedNodes: string[];
  confidence: string;
  retrievedDocs: string[];
  blocks?: ChatMessage['blocks'];
  feedback?: 'like' | 'dislike';
  feedbackComment?: string;
}
