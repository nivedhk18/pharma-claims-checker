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
    chunks: list[dict],
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

        documents=[
            chunk["text"]
            for chunk in chunks
        ],

        embeddings=embeddings,

        metadatas=[
            {
                "document_name": document_name,
                "medicine": medicine,
                "page": chunk["page"],
                "chunk_index": index,
            }
            for index, chunk in enumerate(chunks)
        ],
    )
    
def search_chunks(
    query_embedding: list[float],
    medicine: str,
    top_k: int = 5,
    max_distance: float = 0.65,
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
        if distance > max_distance:
            continue
        retrieved_chunks.append(
            {
                "text": document,
                "document_name": metadata["document_name"],
                "medicine": metadata["medicine"],
                "page": metadata["page"],
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

    documents = {}

    for metadata in results["metadatas"]:
        document_name = metadata["document_name"]

        if document_name not in documents:
            documents[document_name] = {
                "document_name": document_name,
                "medicine": metadata["medicine"],
                "pages": set(),
                "chunk_count": 0,
            }

        documents[document_name]["pages"].add(
            metadata["page"]
        )

        documents[document_name]["chunk_count"] += 1

    return [
        {
            "document_name": document["document_name"],
            "medicine": document["medicine"],
            "total_pages": len(document["pages"]),
            "chunk_count": document["chunk_count"],
            "status": "ingested",
        }
        for document in documents.values()
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
def delete_document(document_name: str) -> bool:
    """
    Delete all chunks belonging to a document from ChromaDB.
    """

    results = collection.get(
        where={
            "document_name": document_name
        },
    )

    document_ids = results["ids"]

    if not document_ids:
        return False

    collection.delete(
        ids=document_ids
    )

    return True
def list_medicines() -> list[str]:
    """
    Return unique medicine names from indexed documents.
    """

    results = collection.get(
        include=["metadatas"]
    )

    medicines = set()

    for metadata in results["metadatas"]:
        medicines.add(
            metadata["medicine"]
        )

    return sorted(medicines)