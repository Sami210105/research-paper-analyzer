import os
import shutil
import traceback
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from report import generate_report
from retrieval.retriever import load_index

app = FastAPI(title="Research Paper Analyser API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PAPERS_FOLDER = "papers"
os.makedirs(PAPERS_FOLDER, exist_ok=True)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/upload")
async def upload_papers(files: List[UploadFile] = File(...)):
    saved = []
    for file in files:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"{file.filename} is not a PDF")
        
        dest = os.path.join(PAPERS_FOLDER, file.filename)
        with open(dest, "wb") as f:
            shutil.copyfileobj(file.file, f)
        saved.append(file.filename)
    
    return {"uploaded": saved, "count": len(saved)}

@app.post("/report")
def get_report():
    try:
        report, chunks = generate_report(PAPERS_FOLDER)
        return {
            "report": report,
            "total_chunks": len(chunks)
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/chunk/{chunk_index}")
def get_chunk(chunk_index: int):
    try:
        _, chunks = load_index()
        chunks_by_index = {c["chunk_index"]: c for c in chunks}
        
        if chunk_index not in chunks_by_index:
            raise HTTPException(status_code=404, detail=f"Chunk {chunk_index} not found")
        
        chunk = chunks_by_index[chunk_index]
        return {
            "chunk_index": chunk_index,
            "paper_id": chunk["paper_id"],
            "text": chunk["text"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))