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
    medicine: str,
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
        "medicine": medicine,
        "chunk_index": index,
    }
    for index in range(len(chunks))
]
    )


def search_chunks(
    query_embedding: list[float],
    medicine: str,
    top_k: int = 5,
) -> list[dict]:

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={
        "medicine": medicine.lower()
    },
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    retrieved_chunks = []

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances,
    ):
        retrieved_chunks.append(
            {
                "text": document,
                "document_name": metadata["document_name"],
                "medicine": metadata["medicine"],
                "chunk_index": metadata["chunk_index"],
                "distance": distance,
            }
        )

    return retrieved_chunks

def list_documents() -> list[dict]:
    """
    Return all documents currently indexed in ChromaDB.
    """

    results = collection.get(
        include=["metadatas"]
    )

    document_counts = {}

    for metadata in results["metadatas"]:
        document_name = metadata["document_name"]

        document_counts[document_name] = (
            document_counts.get(document_name, 0) + 1
        )

    return [
        {
            "document_name": document_name,
            "chunk_count": chunk_count,
        }
        for document_name, chunk_count in document_counts.items()
    ]

def document_exists(document_name: str) -> bool:
    """
    Check whether a document is already indexed in ChromaDB.
    """

    results = collection.get(
        where={
            "document_name": document_name
        },
        limit=1,
    )

    return len(results["ids"]) > 0

