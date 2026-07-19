import json
import os
from pathlib import Path
from graphify.detect import detect
from graphify.extract import collect_files, extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json

def run_pipeline():
    print("Starting Graphify pipeline...")
    
    # 1. Detect files
    det_res = detect(Path('.'))
    os.makedirs('graphify-out', exist_ok=True)
    with open('graphify-out/.graphify_detect.json', 'w', encoding='utf-8') as f:
        json.dump(det_res, f, ensure_ascii=False, indent=2)
        
    print(f"Detected {det_res.get('total_files', 0)} files.")
    
    # 2. Extract AST from code files
    code_files = []
    for f in det_res.get('files', {}).get('code', []):
        if Path(f).is_dir():
            code_files.extend(collect_files(Path(f)))
        else:
            code_files.append(Path(f))
            
    if code_files:
        print(f"Extracting AST from {len(code_files)} code files...")
        ast_res = extract(code_files, cache_root=Path('.'))
    else:
        print("No code files found.")
        ast_res = {'nodes': [], 'edges': [], 'input_tokens': 0, 'output_tokens': 0}
        
    with open('graphify-out/.graphify_ast.json', 'w', encoding='utf-8') as f:
        json.dump(ast_res, f, ensure_ascii=False, indent=2)
        
    # 3. Create empty semantic extraction for docs (since we integrate them in db.ts manually)
    sem_res = {'nodes': [], 'edges': [], 'hyperedges': [], 'input_tokens': 0, 'output_tokens': 0}
    with open('graphify-out/.graphify_semantic.json', 'w', encoding='utf-8') as f:
        json.dump(sem_res, f, ensure_ascii=False, indent=2)
        
    # 4. Merge AST + Semantic
    merged_nodes = list(ast_res.get('nodes', []))
    seen = {n['id'] for n in merged_nodes}
    for n in sem_res.get('nodes', []):
        if n['id'] not in seen:
            merged_nodes.append(n)
            seen.add(n['id'])
            
    merged = {
        'nodes': merged_nodes,
        'edges': ast_res.get('edges', []) + sem_res.get('edges', []),
        'hyperedges': sem_res.get('hyperedges', []),
        'input_tokens': 0,
        'output_tokens': 0
    }
    with open('graphify-out/.graphify_extract.json', 'w', encoding='utf-8') as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
        
    # 5. Build Graph and cluster
    print("Building networkx graph and clustering...")
    G = build_from_json(merged, root='.', directed=False)
    if G.number_of_nodes() == 0:
        print("Graph is empty, adding root node for safety.")
        # Add a placeholder root node so it doesn't fail
        G.add_node("root", label="Root Node", type="code")
        
    communities = cluster(G)
    cohesion = score_all(G, communities)
    
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)
    labels = {cid: f"Modulo {cid}" for cid in communities}
    questions = suggest_questions(G, communities, labels)
    
    # Write graph.json
    wrote = to_json(G, communities, 'graphify-out/graph.json')
    if wrote:
        print("graph.json written successfully.")
        
    # Generate GRAPH_REPORT.md
    report = generate(G, communities, cohesion, labels, gods, surprises, det_res, {'input': 0, 'output': 0}, '.', suggested_questions=questions)
    with open('graphify-out/GRAPH_REPORT.md', 'w', encoding='utf-8') as f:
        f.write(report)
    print("GRAPH_REPORT.md written successfully.")
    
    # Save manifest
    from graphify.detect import save_manifest
    save_manifest(det_res.get('all_files') or det_res['files'], root='.')
    print("Manifest saved. Pipeline completed!")

if __name__ == "__main__":
    run_pipeline()
