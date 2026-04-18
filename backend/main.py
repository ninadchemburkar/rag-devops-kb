from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from utils.loader import loadDocs
from utils.retriever import buildIndex, queryIndex
from utils.llm import getAnswer
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

indexStore = {}

@app.post("/upload")
async def upload(files: List[UploadFile] = File(...)):
    try:
        chunks = await loadDocs(files)
        collection = buildIndex(chunks)
        indexStore["collection"] = collection
        return {"status": "ok", "chunks": len(chunks)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/ask")
async def ask(question: str = Form(...), apiKey: str = Form(...)):
    try:
        if "collection" not in indexStore:
            return {"status": "error", "message": "No documents indexed yet. Upload your runbooks first."}
        ctx = queryIndex(indexStore["collection"], question)
        answer = getAnswer(apiKey, ctx, question)
        return {"status": "ok", "answer": answer, "sources": ctx}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)