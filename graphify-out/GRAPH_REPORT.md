# Graph Report - .  (2026-07-19)

## Corpus Check
- Corpus is ~39,861 words - fits in a single context window. You may not need a graph.

## Summary
- 99 nodes · 120 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Modulo 0|Modulo 0]]
- [[_COMMUNITY_Modulo 1|Modulo 1]]
- [[_COMMUNITY_Modulo 2|Modulo 2]]
- [[_COMMUNITY_Modulo 3|Modulo 3]]
- [[_COMMUNITY_Modulo 4|Modulo 4]]
- [[_COMMUNITY_Modulo 5|Modulo 5]]
- [[_COMMUNITY_Modulo 6|Modulo 6]]
- [[_COMMUNITY_Modulo 7|Modulo 7]]
- [[_COMMUNITY_Modulo 8|Modulo 8]]
- [[_COMMUNITY_Modulo 9|Modulo 9]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `GraphNode` - 11 edges
3. `scripts` - 6 edges
4. `AuditLog` - 5 edges
5. `GraphData` - 4 edges
6. `AuditDashboardProps` - 3 edges
7. `ConceptGraphProps` - 3 edges
8. `GraphEdge` - 3 edges
9. `NODES` - 2 edges
10. `EDGES` - 2 edges

## Surprising Connections (you probably didn't know these)
- `ConceptGraphProps` --references--> `GraphNode`  [EXTRACTED]
  src/components/ConceptGraph.tsx → src/types.ts
- `KBManagerProps` --references--> `GraphNode`  [EXTRACTED]
  src/components/KBManager.tsx → src/types.ts
- `OperationalIntelligenceProps` --references--> `GraphNode`  [EXTRACTED]
  src/components/OperationalIntelligence.tsx → src/types.ts
- `AuditDashboardProps` --references--> `AuditLog`  [EXTRACTED]
  src/components/AuditDashboard.tsx → src/types.ts
- `AuditDashboardProps` --references--> `GraphNode`  [EXTRACTED]
  src/components/AuditDashboard.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "Modulo 0"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+8 more)

### Community 1 - "Modulo 1"
Cohesion: 0.21
Nodes (6): AuditDashboardProps, KBManagerProps, OperationalIntelligenceProps, AuditLog, ChatMessage, GraphNode

### Community 2 - "Modulo 2"
Cohesion: 0.27
Nodes (8): app, auditLogs, EDGES, NODES, retrieveWithGraph(), ConceptNode, DocumentNode, GraphEdge

### Community 3 - "Modulo 3"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, clean, dev, lint, start (+2 more)

### Community 4 - "Modulo 4"
Cohesion: 0.18
Nodes (11): dependencies, dotenv, express, @google/genai, lucide-react, motion, react, react-dom (+3 more)

### Community 5 - "Modulo 5"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, esbuild, tailwindcss, tsx, @types/express, @types/node, typescript (+1 more)

### Community 7 - "Modulo 7"
Cohesion: 0.50
Nodes (3): ConceptGraphProps, SimulatedNode, GraphData

## Knowledge Gaps
- **47 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Modulo 4` to `Modulo 3`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Modulo 5` to `Modulo 3`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Modulo 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._