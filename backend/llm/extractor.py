import json
from llm.gemini_client import call_gemini as call_groq
from llm.prompts import METHODOLOGY_SYSTEM_PROMPT


def extract_methodology(paper_id, chunks):
    formatted = ""
    for chunk in chunks:
        formatted += f"\n--- chunk ---\n{chunk['text']}\n"

    messages = [
        {
            "role": "system",
            "content": METHODOLOGY_SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": f"Extract the methodology steps for paper '{paper_id}':\n{formatted}"
        }
    ]

    raw_response = call_groq(messages, json_mode=True, max_tokens=2048)
    parsed = json.loads(raw_response)
    return parsed


if __name__ == "__main__":
    import sys
    import json
    sys.path.append("..")
    from retrieval.retriever import load_index, retrieve_balanced

    index, chunks = load_index()

    paper_ids = list(set(c["paper_id"] for c in chunks))

    for pid in paper_ids:
        retrieved = retrieve_balanced(
            "methodology approach technical steps implementation",
            index, chunks, k_per_paper=5
        )
        paper_chunks = [c for c in retrieved if c["paper_id"] == pid]
        print(f"\nExtracting methodology for: {pid}")
        result = extract_methodology(pid, paper_chunks)
        print(json.dumps(result, indent=2))