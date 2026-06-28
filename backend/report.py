import os
import json
import pickle
import uuid
import shutil
import faiss
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed
from retrieval.retriever import retrieve_balanced, retrieve_multi_query
from llm.comparator import compare_papers_hierarchical
from llm.extractor import extract_methodology
from llm.flowchart import generate_mermaid
from ingestion.loader import load_pdfs
from ingestion.chunker import chunk_documents
from ingestion.embedder import embed_chunks

SESSIONS_DIR = "sessions"
os.makedirs(SESSIONS_DIR, exist_ok=True)


def create_session():
    session_id = str(uuid.uuid4())[:8]
    session_dir = os.path.join(SESSIONS_DIR, session_id)
    os.makedirs(os.path.join(session_dir, "papers"), exist_ok=True)
    os.makedirs(os.path.join(session_dir, "index"), exist_ok=True)
    return session_id


def get_session_paths(session_id):
    base = os.path.join(SESSIONS_DIR, session_id)
    return {
        "papers": os.path.join(base, "papers"),
        "index":  os.path.join(base, "index", "papers.index"),
        "chunks": os.path.join(base, "index", "chunks.pkl"),
    }


def cleanup_session(session_id):
    session_dir = os.path.join(SESSIONS_DIR, session_id)
    if os.path.exists(session_dir):
        shutil.rmtree(session_dir)
        print(f"Session {session_id} cleaned up")


def build_session_index(session_id):
    paths = get_session_paths(session_id)

    print(f"Loading PDFs from session {session_id}...")
    docs = load_pdfs(paths["papers"])

    if not docs:
        raise ValueError("No PDFs found in session. Upload papers first.")

    print(f"Embedding {len(docs)} papers...")
    chunks = chunk_documents(docs)

    for i, chunk in enumerate(chunks):
        chunk["chunk_index"] = i

    embeddings = embed_chunks(chunks)

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings).astype("float32"))

    # save to session folder — isolated per user
    faiss.write_index(index, paths["index"])
    with open(paths["chunks"], "wb") as f:
        pickle.dump(chunks, f)

    print(f"Index built: {len(chunks)} chunks from {len(docs)} papers")
    return index, chunks


def load_session_index(session_id):
    paths = get_session_paths(session_id)
    index = faiss.read_index(paths["index"])
    with open(paths["chunks"], "rb") as f:
        chunks = pickle.load(f)
    return index, chunks


def extract_methodology_for_paper(pid, index, chunks):
    """Single paper methodology extraction — runs in thread pool"""
    retrieved = retrieve_balanced(
        "methodology approach technical steps implementation system architecture",
        index, chunks, k_per_paper=5
    )
    paper_chunks = [c for c in retrieved if c["paper_id"] == pid]
    methodology = extract_methodology(pid, paper_chunks)
    mermaid = generate_mermaid(methodology)
    return methodology, {"paper_id": pid, "mermaid": mermaid}


def generate_report(session_id):
    print("Step 1: Building session index...")
    index, chunks = build_session_index(session_id)

    paper_ids = list(set(c["paper_id"] for c in chunks))
    print(f"Generating report for {len(paper_ids)} papers")

    print("\nStep 2: Running comparison...")
    comparison_chunks = retrieve_multi_query(index, chunks, k_per_paper=2)
    comparison = compare_papers_hierarchical(comparison_chunks)

    print("\nStep 3: Extracting methodology per paper (parallel)...")
    methodologies = []
    flowcharts = []

    # run all methodology extractions in parallel
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(extract_methodology_for_paper, pid, index, chunks): pid
            for pid in paper_ids
        }
        for future in as_completed(futures):
            pid = futures[future]
            try:
                methodology, flowchart = future.result()
                methodologies.append(methodology)
                flowcharts.append(flowchart)
                print(f"  ✓ {pid}")
            except Exception as e:
                print(f"  ✗ {pid}: {e}")

    print("\nStep 4: Assembling final report...")
    report = {
        "papers":        comparison.get("papers", []),
        "comparisons":   comparison.get("comparisons", []),
        "methodologies": methodologies,
        "flowcharts":    flowcharts,
    }

    return report, chunks