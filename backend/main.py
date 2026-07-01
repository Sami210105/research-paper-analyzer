import os
import shutil
import traceback
import pickle
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from report import create_session, generate_report, cleanup_session, get_session_paths

app = FastAPI(title="Research Paper Analyser API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/session")
def new_session():
    session_id = create_session()
    return {"session_id": session_id}


@app.post("/upload/{session_id}")
async def upload_papers(session_id: str, files: List[UploadFile] = File(...)):
    paths = get_session_paths(session_id)

    if not os.path.exists(paths["papers"]):
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")

    saved = []
    for file in files:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"{file.filename} is not a PDF")
        dest = os.path.join(paths["papers"], file.filename)
        with open(dest, "wb") as f:
            shutil.copyfileobj(file.file, f)
        saved.append(file.filename)

    return {"session_id": session_id, "uploaded": saved, "count": len(saved)}


@app.post("/report/{session_id}")
def get_report(session_id: str):
    paths = get_session_paths(session_id)

    if not os.path.exists(paths["papers"]):
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")

    try:
        report, chunks = generate_report(session_id)
        with open(paths["chunks"], "wb") as f:
            pickle.dump(chunks, f)
        return {
            "session_id": session_id,
            "report": report,
            "total_chunks": len(chunks)
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/chunk/{session_id}/{chunk_index}")
def get_chunk(session_id: str, chunk_index: int):
    paths = get_session_paths(session_id)

    if not os.path.exists(paths["chunks"]):
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")

    try:
        with open(paths["chunks"], "rb") as f:
            chunks = pickle.load(f)

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


@app.delete("/session/{session_id}")
def delete_session(session_id: str):
    try:
        cleanup_session(session_id)
        return {"deleted": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))