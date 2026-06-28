import os
import pickle
import faiss
import numpy as np

from loader import load_pdfs
from chunker import chunk_documents
from embedder import embed_chunks

# load the pipeline so far
docs = load_pdfs("../papers")
chunks = chunk_documents(docs)
embeddings = embed_chunks(chunks)

print(f"Loaded {len(docs)} documents --> {len(chunks)} chunks --> embeddings shape {embeddings.shape}")

# build the FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings).astype("float32"))
print(f"FAISS index built with {index.ntotal} vectors")

#output
os.makedirs("../data", exist_ok=True)
faiss.write_index(index, "../data/papers.index")
with open("../data/papers_metadata.pkl", "wb") as f:
    pickle.dump(chunks, f)
print("Saved index and metadata to ../data/")
