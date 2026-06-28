def generate_mermaid(methodology_json):
    paper_id = methodology_json["paper_id"]
    steps = methodology_json["methodology_steps"]

    lines = ["flowchart TD"]

    for i, step in enumerate(steps):
        node_id = f"S{step['step']}"
        label = f"{step['title']}"
        lines.append(f'    {node_id}["{label}"]')

    for i in range(len(steps) - 1):
        current = f"S{steps[i]['step']}"
        next_node = f"S{steps[i+1]['step']}"
        lines.append(f"    {current} --> {next_node}")

    return "\n".join(lines)


if __name__ == "__main__":
    import sys
    import json
    sys.path.append("..")
    from retrieval.retriever import load_index, retrieve_balanced
    from llm.extractor import extract_methodology

    index, chunks = load_index()
    paper_ids = list(set(c["paper_id"] for c in chunks))

    for pid in paper_ids:
        retrieved = retrieve_balanced(
            "methodology approach technical steps implementation",
            index, chunks, k_per_paper=5
        )
        paper_chunks = [c for c in retrieved if c["paper_id"] == pid]
        methodology = extract_methodology(pid, paper_chunks)

        mermaid = generate_mermaid(methodology)
        print(f"\n--- Mermaid flowchart for: {pid} ---")
        print(mermaid)