from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')

def embed_chunks(chunks):
    texts = [c["text"] for c in chunks]
    embeddings = model.encode(texts, show_progress_bar=True)
    return embeddings

if __name__ == "__main__":
    from loader import load_documents
    from chunker import chunk_documents
    
    docs = load_documents("../lore")
    chunks = chunk_documents(docs)
    embeddings = embed_chunks(chunks)
    
    print(f"Number of chunks: {len(chunks)}")
    print(f"Embeddings shape: {embeddings.shape}")
    print(f"First embedding (first 5 values): {embeddings[0][:5]}")
    