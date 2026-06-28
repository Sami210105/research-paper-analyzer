import pickle
import faiss
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

COMPARISON_QUERIES = {
    "methodology": "technical approach method system architecture design implementation",
    "results":     "results findings performance accuracy evaluation metrics outcomes",
    "dataset":     "dataset data corpus training evaluation benchmark experiments",
    "limitations": "limitations future work challenges drawbacks constraints"
}

def load_index(index_path="data/papers.index", metadata_path="data/papers_metadata.pkl"):
    index = faiss.read_index(index_path)
    
    with open(metadata_path, "rb") as f:
        chunks = pickle.load(f)
        
    return index, chunks


def retrieve(query, index, chunks, k=3):
    query_embedding = model.encode([query])
    distances, indices = index.search(query_embedding, k)
    
    results = []
    for idx in indices[0]:
        results.append(chunks[idx])
    return results


def retrieve_balanced(query, index, chunks, k_per_paper=3):
    papers = {}
    for i, chunk in enumerate(chunks):
        pid = chunk["paper_id"]
        if pid not in papers:
            papers[pid] = []
        papers[pid].append(i)

    query_embedding = model.encode([query])
    total_chunks = len(chunks)
    distances, indices = index.search(query_embedding, total_chunks)

    seen = {pid: 0 for pid in papers}
    results = []
    for idx in indices[0]:
        chunk = chunks[idx]
        pid = chunk["paper_id"]
        if seen[pid] < k_per_paper:
            results.append(chunk)
            seen[pid] += 1
        if all(seen[pid] >= k_per_paper for pid in papers):
            break

    return results


def retrieve_multi_query(index, chunks, k_per_paper=2):
    seen_texts = set()
    all_results = []

    for aspect, query in COMPARISON_QUERIES.items():
        retrieved = retrieve_balanced(query, index, chunks, k_per_paper=k_per_paper)
        for chunk in retrieved:
            if chunk["text"] not in seen_texts:
                chunk["aspect"] = aspect
                all_results.append(chunk)
                seen_texts.add(chunk["text"])

    return all_results


if __name__ == "__main__":
    index, chunks = load_index()
    
    print("Testing multi-query retrieval...\n")
    results = retrieve_multi_query(index, chunks, k_per_paper=2)
    
    print(f"Total unique chunks retrieved: {len(results)}\n")
    for r in results:
        print(f"--- [{r['aspect']}] (paper: {r['paper_id']}) ---")
        print(r["text"][:150])
        print()