import chromadb


CHROMA_PATH = "chroma_db"
COLLECTION_NAME = "pharma_documents"


client = chromadb.PersistentClient(
    path=CHROMA_PATH
)


collection = client.get_or_create_collection(
    name=COLLECTION_NAME
)


def add_chunks(
    chunks: list[str],
    embeddings: list[list[float]],
    document_name: str,
) -> None:

    ids = [
        f"{document_name}_{index}"
        for index in range(len(chunks))
    ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=[
            {
                "document_name": document_name,
                "chunk_index": index,
            }
            for index in range(len(chunks))
        ],
    )


def search_chunks(
    query_embedding: list[float],
    top_k: int = 5,
) -> dict:

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    return results 