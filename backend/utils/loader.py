from langchain.text_splitter import RecursiveCharacterTextSplitter

async def loadDocs(uploadedFiles):
    raw = []
    for f in uploadedFiles:
        try:
            content = await f.read()
            raw.append(content.decode("utf-8"))
        except Exception as e:
            raise ValueError(f"Could not read '{f.filename}': {e}. Make sure it's a plain .txt file.")

    if not raw:
        raise ValueError("No documents loaded. Please upload at least one .txt file.")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.create_documents(raw)
    return chunks