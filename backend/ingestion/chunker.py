def chunk_text(text, chunk_size=50, overlap=10):
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)        
        start += chunk_size - overlap        
    return chunks

def chunk_documents(documents, chunk_size=50, overlap=10):
    all_chunks = []
    for doc in documents:
        pieces = chunk_text(doc["text"], chunk_size, overlap)
        for piece in pieces:
            all_chunks.append({
                "text": piece,
                "source": doc["source"],
                "paper_id": doc.get("paper_id", doc["source"])
            })
    return all_chunks

if __name__ == "__main__":
    from loader import load_pdfs
    
    docs = load_pdfs("../papers")
    chunks = chunk_documents(docs)
    
    print(f"Total chunks: {len(chunks)}")
    for i, c in enumerate(chunks):
        print(f"\n-- chunk {i} (paper: {c['paper_id']})---")
        print(c["text"])