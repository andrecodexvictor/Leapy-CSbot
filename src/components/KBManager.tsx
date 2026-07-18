import React, { useState, useEffect } from 'react';
import { Database, PlusCircle, Check, Loader2, Sparkles, FileText, Compass, Link2, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { GraphNode } from '../types';

interface KBManagerProps {
  allNodes: GraphNode[];
  onNodeAdded: () => void;
  initialDraft: any;
  onClearDraft: () => void;
}

export default function KBManager({ allNodes, onNodeAdded, initialDraft, onClearDraft }: KBManagerProps) {
  // Types
  const [activeForm, setActiveForm] = useState<'document' | 'concept' | 'link'>('document');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State: Document
  const [docId, setDocId] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docTopic, setDocTopic] = useState('Plataforma e Automação');
  const [docContent, setDocContent] = useState('');
  const [docKeywords, setDocKeywords] = useState('');

  // Form State: Concept
  const [conceptId, setConceptId] = useState('');
  const [conceptTitle, setConceptTitle] = useState('');
  const [conceptDesc, setConceptDesc] = useState('');
  const [conceptKeywords, setConceptKeywords] = useState('');

  // Form State: Link
  const [linkSource, setLinkSource] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const [linkLabel, setLinkLabel] = useState('Explica');

  // Load draft data if sent via AI Auto-Heal
  useEffect(() => {
    if (initialDraft) {
      setActiveForm('document');
      
      // Auto fill doc
      setDocId(initialDraft.id || 'doc_' + Date.now().toString().slice(-5));
      setDocTitle(initialDraft.title || '');
      setDocTopic(initialDraft.topic || 'Plataforma e Automação');
      setDocContent(initialDraft.content || '');
      setDocKeywords(initialDraft.keywords ? initialDraft.keywords.join(', ') : '');

      // Auto fill associated concept state in case they want to switch
      setConceptId(initialDraft.id ? initialDraft.id.replace('doc', 'concept') : 'concept_' + Date.now().toString().slice(-5));
      setConceptTitle(initialDraft.conceptTitle || '');
      setConceptDesc(initialDraft.conceptDescription || '');
      setConceptKeywords(initialDraft.keywords ? initialDraft.keywords.slice(0, 4).join(', ') : '');
      
      // Select source and target for linkage preview
      setLinkSource(initialDraft.id || '');
      setLinkTarget(initialDraft.id ? initialDraft.id.replace('doc', 'concept') : '');
    }
  }, [initialDraft]);

  const clearForms = () => {
    setDocId('');
    setDocTitle('');
    setDocContent('');
    setDocKeywords('');
    
    setConceptId('');
    setConceptTitle('');
    setConceptDesc('');
    setConceptKeywords('');

    setLinkSource('');
    setLinkTarget('');
    setLinkLabel('Explica');
  };

  const showFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Submit new Document
  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId.trim() || !docTitle.trim() || !docContent.trim()) {
      alert("Por favor, preencha o ID, o título e o conteúdo do documento.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/kb/node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: docId.trim(),
          title: docTitle.trim(),
          type: 'document',
          topic: docTopic,
          content: docContent.trim(),
          keywords: docKeywords.split(',').map(k => k.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        showFeedback("Artigo operacional publicado com sucesso!");
        
        // If there was an initial draft, automatically create and link the concept as well!
        if (initialDraft && initialDraft.conceptTitle) {
          const conceptNodeId = conceptId.trim() || docId.replace('doc', 'concept');
          
          // Create Concept Node
          await fetch('/api/kb/node', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: conceptNodeId,
              title: initialDraft.conceptTitle,
              type: 'concept',
              description: initialDraft.conceptDescription || '',
              keywords: docKeywords.split(',').map(k => k.trim()).filter(Boolean).slice(0, 4)
            })
          });

          // Link them together
          await fetch('/api/kb/edge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: docId.trim(),
              target: conceptNodeId,
              label: 'Define'
            })
          });

          showFeedback("Artigo + Conceito vinculados criados com sucesso no Grafo!");
        }

        clearForms();
        onClearDraft();
        onNodeAdded();
      }
    } catch (err) {
      console.error("Erro ao criar documento:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit new Concept
  const handleSubmitConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptId.trim() || !conceptTitle.trim() || !conceptDesc.trim()) {
      alert("Por favor, preencha o ID, o título e a descrição do conceito.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/kb/node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: conceptId.trim(),
          title: conceptTitle.trim(),
          type: 'concept',
          description: conceptDesc.trim(),
          keywords: conceptKeywords.split(',').map(k => k.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        showFeedback("Conceito teórico publicado no Grafo!");
        clearForms();
        onNodeAdded();
      }
    } catch (err) {
      console.error("Erro ao criar conceito:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit relation Linkage
  const handleSubmitLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkSource || !linkTarget) {
      alert("Selecione os dois nós para estabelecer o vínculo.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/kb/edge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: linkSource,
          target: linkTarget,
          label: linkLabel
        })
      });

      if (res.ok) {
        showFeedback("Conexão entre nós estabelecida com sucesso!");
        clearForms();
        onNodeAdded();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao conectar nós.");
      }
    } catch (err) {
      console.error("Erro ao criar vínculo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete node
  const handleDeleteNode = async (id: string) => {
    if (!confirm("Deseja realmente remover este item e todos os seus vínculos no Grafo de Conhecimento?")) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/kb/node/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showFeedback("Item excluído do Grafo.");
        onNodeAdded();
      }
    } catch (err) {
      console.error("Erro ao deletar nó:", err);
    } finally {
      setLoading(false);
    }
  };

  const docNodes = allNodes.filter(n => n.type === 'document');
  const conceptNodes = allNodes.filter(n => n.type === 'concept');

  return (
    <div className="flex flex-col h-full bg-[var(--bg-app)] border-l border-[var(--border-main)]/80" id="kb-manager-panel">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-main)] bg-[var(--bg-header)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="font-display font-semibold text-xs tracking-wider uppercase text-[var(--text-main)]">
            Gerenciador da Base de Conhecimento
          </span>
        </div>
      </div>

      {/* Draft Notification Alert */}
      {initialDraft && (
        <div className="p-3 bg-[var(--accent-glow)] border-b border-[var(--accent-color)]/20 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5 animate-bounce" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-[var(--accent-color)] uppercase font-mono block">Rascunho Inteligente de IA Carregado</span>
            <p className="text-[10.5px] text-[var(--text-muted)] leading-normal mt-0.5">
              O Leapy compilou um novo artigo e conceito conceitual para sanar a lacuna. Revise os campos e clique em publicar abaixo!
            </p>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={onClearDraft}
                className="px-2 py-0.5 rounded bg-[var(--bg-body)] hover:bg-[var(--bg-card-hover)] text-[9px] text-[var(--text-muted)] font-medium"
              >
                Limpar Rascunho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="p-2.5 bg-emerald-950/35 border-b border-emerald-900/30 text-[11px] text-emerald-400 flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sub tabs for selection */}
      <div className="p-3 bg-[var(--bg-panel)] border-b border-[var(--border-main)] flex gap-1.5">
        <button
          onClick={() => setActiveForm('document')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[10.5px] font-bold transition-all border ${
            activeForm === 'document' 
              ? 'bg-cyan-600/15 text-cyan-400 border-cyan-500/20' 
              : 'bg-[var(--bg-body)] text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-main)] border-[var(--border-main)]/80'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Novo Artigo</span>
        </button>

        <button
          onClick={() => setActiveForm('concept')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[10.5px] font-bold transition-all border ${
            activeForm === 'concept' 
              ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20' 
              : 'bg-[var(--bg-body)] text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-main)] border-[var(--border-main)]/80'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Novo Conceito</span>
        </button>

        <button
          onClick={() => setActiveForm('link')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[10.5px] font-bold transition-all border ${
            activeForm === 'link' 
              ? 'bg-violet-600/15 text-violet-400 border-violet-500/20' 
              : 'bg-[var(--bg-body)] text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-main)] border-[var(--border-main)]/80'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Vincular Nós</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Document creation form */}
        {activeForm === 'document' && (
          <form onSubmit={handleSubmitDocument} className="space-y-3.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
              Registrar Artigo de Playbook / Política de CS
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)] font-bold block">ID DO DOCUMENTO (Único)</label>
                <input
                  type="text"
                  placeholder="ex: doc_ferias_regras"
                  value={docId}
                  onChange={(e) => setDocId(e.target.value)}
                  className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--text-muted)] font-bold block">TEMA / CATEGORIA</label>
                <select
                  value={docTopic}
                  onChange={(e) => setDocTopic(e.target.value)}
                  className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                >
                  <option value="Cotas e Legislação">Cotas e Legislação</option>
                  <option value="Benefícios e RH">Benefícios e RH</option>
                  <option value="Operação e Tributário">Operação e Tributário</option>
                  <option value="Plataforma e Automação">Plataforma e Automação</option>
                  <option value="Transição e Carreira">Transição e Carreira</option>
                  <option value="Objeções de Vendas e Segurança">Objeções de Vendas e Segurança</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">TÍTULO EXIBIDO NO GRAFO</label>
              <input
                type="text"
                placeholder="ex: Guia de Parametrização Tributária de SP"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">CONTEÚDO DO DOCUMENTO (Informação de Suporte)</label>
              <textarea
                placeholder="Insira as regras operacionais, prazos, fluxos e condições estritas..."
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                rows={6}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] font-sans leading-relaxed focus:outline-none focus:border-[var(--accent-color)]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">PALAVRAS-CHAVE INDEXADORAS (Separadas por vírgula)</label>
              <input
                type="text"
                placeholder="ex: ferias, clt, prazo, gestor, aprovação"
                value={docKeywords}
                onChange={(e) => setDocKeywords(e.target.value)}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
              />
              <span className="text-[9px] text-[var(--text-muted)] block">Indexadores dão relevância no mecanismo de recuperação híbrido do chatbot.</span>
            </div>

            {initialDraft && (
              <div className="p-3 bg-[var(--accent-glow)] border border-[var(--accent-color)]/20 rounded text-[10.5px] text-[var(--text-main)] space-y-1.5">
                <span className="font-bold text-[var(--accent-color)] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ativação de Conceito Associado pela IA
                </span>
                <p>Ao salvar este artigo, o Leapy CSbot criará e conectará automaticamente o seguinte conceito:</p>
                <div className="bg-[var(--bg-body)] p-2 rounded border border-[var(--border-main)] font-mono text-[9.5px]">
                  <p><span className="text-indigo-400 font-bold">Conceito:</span> {initialDraft.conceptTitle}</p>
                  <p className="mt-0.5 text-[var(--text-muted)]"><span className="text-indigo-400 font-bold">Definição:</span> {initialDraft.conceptDescription}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-[var(--bg-panel)] disabled:text-[var(--text-muted)] text-white font-bold text-xs rounded transition-all shadow-md"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar Artigo Operacional</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Concept creation form */}
        {activeForm === 'concept' && (
          <form onSubmit={handleSubmitConcept} className="space-y-3.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
              Registrar Conceito / Nó Teórico de Negócio
            </span>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">ID DO CONCEITO (Único)</label>
              <input
                type="text"
                placeholder="ex: cota_pcd_lei"
                value={conceptId}
                onChange={(e) => setConceptId(e.target.value)}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">TÍTULO DO CONCEITO</label>
              <input
                type="text"
                placeholder="ex: Lei de Cotas de PCD"
                value={conceptTitle}
                onChange={(e) => setConceptTitle(e.target.value)}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">DEFINIÇÃO SUCINTA (Visível no Tooltip)</label>
              <textarea
                placeholder="Breve resumo didático da regra constitucional ou tese teórica para o analista..."
                value={conceptDesc}
                onChange={(e) => setConceptDesc(e.target.value)}
                rows={3}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">PALAVRAS-CHAVE (Separadas por vírgula)</label>
              <input
                type="text"
                placeholder="ex: pcd, deficiente, cota, lei, obrigatoriedade"
                value={conceptKeywords}
                onChange={(e) => setConceptKeywords(e.target.value)}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[var(--bg-panel)] disabled:text-[var(--text-muted)] text-white font-bold text-xs rounded transition-all shadow-md"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar Conceito Teórico</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Linkage form */}
        {activeForm === 'link' && (
          <form onSubmit={handleSubmitLink} className="space-y-3.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
              Interconectar Artigos e Conceitos no Grafo
            </span>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">NÓ DE ORIGEM (Source)</label>
              <select
                value={linkSource}
                onChange={(e) => setLinkSource(e.target.value)}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
              >
                <option value="">-- Selecione o nó originário --</option>
                {allNodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.type === 'document' ? '📄 [Doc] ' : '💡 [Conc] '} {n.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">NÓ DE DESTINO (Target)</label>
              <select
                value={linkTarget}
                onChange={(e) => setLinkTarget(e.target.value)}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
              >
                <option value="">-- Selecione o nó de destino --</option>
                {allNodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.type === 'document' ? '📄 [Doc] ' : '💡 [Conc] '} {n.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[var(--text-muted)] font-bold block">RELAÇÃO / VÍNCULO (Label)</label>
              <select
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                className="w-full p-2 bg-[var(--bg-body)] border border-[var(--border-main)] rounded text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
              >
                <option value="Define">Define (Conceitualiza)</option>
                <option value="Explica">Explica (Detala passo-a-passo)</option>
                <option value="Regulamenta">Regulamenta (Normatiza)</option>
                <option value="Responde">Responde (Contorna objeção)</option>
                <option value="Valida">Valida (Comprova)</option>
                <option value="Vinculado">Vinculado (Geral)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-[var(--bg-panel)] disabled:text-[var(--text-muted)] text-white font-bold text-xs rounded transition-all shadow-md"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Conectar Nós no Grafo</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Existing Articles & Nodes management list */}
        <div className="pt-4 border-t border-[var(--border-main)]">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono mb-2">
            Base de Conhecimento Ativa ({allNodes.length})
          </span>

          <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
            {allNodes.map(node => (
              <div 
                key={node.id} 
                className="flex items-center justify-between p-2 rounded bg-[var(--bg-body)]/60 border border-[var(--border-main)] text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {node.type === 'document' ? (
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : (
                    <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="text-[var(--text-main)] font-semibold block truncate">{node.title}</span>
                    <span className="text-[9px] text-[var(--text-muted)] font-mono">ID: {node.id}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteNode(node.id)}
                  className="p-1 rounded bg-[var(--bg-panel)] hover:bg-rose-950/40 text-[var(--text-muted)] hover:text-rose-400 transition-colors shrink-0"
                  title="Excluir do Grafo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
