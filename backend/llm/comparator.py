import json
import random
from llm.ollama_client import call_ollama as call_groq
from llm.prompts import build_comparison_prompt, build_synthesis_prompt


def format_chunks_for_prompt(chunks):
    formatted = ""
    for chunk in chunks:
        aspect = chunk.get("aspect", "general")
        chunk_index = chunk.get("chunk_index", "?")
        formatted += f"\n--- From paper: {chunk['paper_id']} [{aspect}] [chunk_index: {chunk_index}] ---\n"
        formatted += chunk["text"] + "\n"
    return formatted


def compare_papers(chunks):
    formatted_input = format_chunks_for_prompt(chunks)

    messages = [
        {
            "role": "system",
            "content": build_comparison_prompt()
        },
        {
            "role": "user",
            "content": f"Here are the research paper chunks to compare:\n{formatted_input}"
        }
    ]

    raw_response = call_groq(messages, json_mode=True, max_tokens=2048)
    parsed = json.loads(raw_response)
    return parsed


def compare_group(chunks):
    return compare_papers(chunks)


def synthesize_comparisons(group_results):
    combined = json.dumps(group_results, indent=2)

    messages = [
        {
            "role": "system",
            "content": build_synthesis_prompt()
        },
        {
            "role": "user",
            "content": f"Here are the group comparison results to synthesize:\n{combined}"
        }
    ]

    raw_response = call_groq(messages, json_mode=True, max_tokens=4096)
    parsed = json.loads(raw_response)
    return parsed


def compare_papers_hierarchical(chunks, threshold=5, group_size=5):
    paper_ids = list(set(c["paper_id"] for c in chunks))
    total_papers = len(paper_ids)

    if total_papers <= threshold:
        print(f"  {total_papers} papers — using simple comparison")
        return compare_papers(chunks)

    print(f"  {total_papers} papers — using hierarchical comparison")

    random.shuffle(paper_ids)

    groups = [
        paper_ids[i:i + group_size]
        for i in range(0, total_papers, group_size)
    ]
    print(f"  Split into {len(groups)} groups of up to {group_size} papers each")

    group_results = []
    for i, group in enumerate(groups):
        print(f"  Comparing group {i+1}/{len(groups)}: {group}")
        group_chunks = [c for c in chunks if c["paper_id"] in group]
        result = compare_group(group_chunks)
        group_results.append(result)

    print("  Synthesizing group results...")
    final = synthesize_comparisons(group_results)
    return final


if __name__ == "__main__":
    import sys
    sys.path.append("..")
    from retrieval.retriever import load_index, retrieve_balanced

    index, chunks = load_index()
    query = "What methods and techniques are used?"
    retrieved = retrieve_balanced(query, index, chunks, k_per_paper=3)

    print("Running comparison...\n")
    result = compare_papers_hierarchical(retrieved)
    print(json.dumps(result, indent=2))