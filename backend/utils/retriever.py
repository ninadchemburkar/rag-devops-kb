import chromadb

def buildIndex(chunks):
    try:
        client = chromadb.EphemeralClient()
        collection = client.get_or_create_collection(name="devopsKb")
        docs = [c.page_content for c in chunks]
        ids = [f"doc_{i}" for i in range(len(docs))]
        collection.add(documents=docs, ids=ids)
        return collection
    except Exception as e:
        raise ConnectionError(f"Failed to build index: {e}. Check your document format and try again.")

def queryIndex(collection, question, nResults=4):
    try:
        results = collection.query(
            query_texts=[question],
            n_results=nResults
        )
        return results["documents"][0]
    except Exception as e:
        raise RuntimeError(f"Search failed: {e}. Try rephrasing your question.")