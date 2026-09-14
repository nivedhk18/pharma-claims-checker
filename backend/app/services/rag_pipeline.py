from app.services.embedding_service import create_embedding
from app.services.vector_store import search_chunks
from app.services.claim_verifier import verify_claim


def verify_claim_with_rag(
    claim: str,
    medicine: str,
    top_k: int = 5,
) -> dict:
    """
    Verify a pharmaceutical claim using
    retrieved evidence from the vector database.
    """

    # Step 1: Embed the user's claim
    query_embedding = create_embedding(claim)

    # Step 2: Retrieve relevant chunks
    retrieved_chunks = search_chunks(
        query_embedding=query_embedding,
        medicine=medicine,
        top_k=top_k,
    )

    # Step 3: Extract only the text for Gemini
    evidence_chunks = [
        chunk["text"]
        for chunk in retrieved_chunks
    ]

    # Step 4: Verify the claim using the retrieved evidence
    verification_result = verify_claim(
        claim=claim,
        evidence_chunks=evidence_chunks,
    )

    # Step 5: Return verification + source information
    return {
        "claim": claim,
        "medicine": medicine,
        "result": verification_result,
        "evidence": retrieved_chunks,
    }

