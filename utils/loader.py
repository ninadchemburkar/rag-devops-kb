import os
from langchain.text_splitter import RecursiveCharacterTextSplitter

def loadDocs(uploadedFiles):
    raw = []
    for f in uploadedFiles:
        try:
            content = f.read().decode("utf-8")
            raw.append(content)
        except Exception as e:
            raise ValueError(f"Could not read '{f.name}': {e}. Make sure it's a plain .txt file.")
    
    if not raw:
        raise ValueError("No documents loaded. Please upload at least one .txt file.")
    
    splitter = RecursiveCharacterTextSplitter(
        chunkSize=500,
        chunkOverlap=50
    )
    chunks = splitter.create_documents(raw)
    return chunks