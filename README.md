# DevOps Knowledge Base

A RAG-powered internal knowledge base that lets DevOps teams chat with their runbooks and documentation. Upload your .txt runbooks, index them, and ask questions in plain English — answers are pulled directly from your docs with source references.

Built this because I got tired of ctrl+F-ing through 40-page runbooks at 2am during incidents.

---

## What it does

- Upload multiple runbook .txt files
- Chunks and embeds them into a vector store (ChromaDB)
- Ask questions in natural language
- Get answers grounded in your actual docs, with source chunks shown

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript |
| Backend | FastAPI + Python |
| LLM | LLaMA 3.3 70B via Groq API |
| Vector store | ChromaDB (in-memory) |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |

## Running locally

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm start
```

Then open `http://localhost:3000`, paste your Groq API key in the sidebar, upload a `.txt` runbook and start asking questions.

## Getting a Groq API key

Free at [groq.com](https://groq.com) — no credit card needed. The free tier is more than enough for this.

## Known limitations

- In-memory vector store resets on server restart — re-upload your docs each session
- Only supports `.txt` files right now, PDF support is on the TODO list
- No auth — don't expose the backend port publicly without adding a key

## Project structure

```
rag-devops-kb/
├── backend/
│   ├── utils/
│   │   ├── loader.py      # doc ingestion + chunking
│   │   ├── retriever.py   # chroma indexing + querying
│   │   └── llm.py         # groq api call
│   └── main.py            # fastapi server
├── frontend/
│   └── src/
│       └── App.tsx        # react UI
└── sample_docs/           # sample runbooks to test with
```