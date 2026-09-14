from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil

from app.services.pdf_processor import process_pdf
from app.services.embedding_service import create_embedding
from app.services.vector_store import (
    add_chunks,
    list_documents,
    document_exists,
)
from app.schemas import ClaimCheckRequest
from app.services.rag_pipeline import verify_claim_with_rag
from app.schemas import (
    ClaimCheckRequest,
    ClaimCheckResponse,
    DocumentListResponse,
)
from app.services.vector_store import list_documents

app = FastAPI(
    title="Pharma Claims Checker API",
    description="API for verifying pharmaceutical claims using evidence from drug labels.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "pharma-claims-checker",
    }


@app.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    if document_exists(file.filename):
        raise HTTPException(
            status_code=409,
            detail="Document is already indexed."
        )

    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        chunks = process_pdf(str(file_path))

        embeddings = [
            create_embedding(chunk)
            for chunk in chunks
        ]
        medicine = Path(file.filename).stem.lower()
        add_chunks(
            chunks=chunks,
            embeddings=embeddings,
            document_name=file.filename,
            medicine=medicine,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process PDF: {str(e)}"
        )

    return {
        "filename": file.filename,
        "message": "PDF uploaded and stored successfully.",
        "chunk_count": len(chunks),
    }

@app.post(
    "/claims/check",
    response_model=ClaimCheckResponse,
)
async def check_claim(request: ClaimCheckRequest):
    """
    Verify a pharmaceutical claim using
    retrieved evidence from the document store.
    """

    if not request.claim.strip():
        raise HTTPException(
            status_code=400,
            detail="Claim cannot be empty."
        )

    try:
        result = verify_claim_with_rag(
            claim=request.claim,
            medicine=request.medicine,
            top_k=5,
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Claim verification failed: {str(e)}"
        )

@app.get(
    "/documents",
    response_model=DocumentListResponse,
)
async def get_documents():
    """
    Return documents currently indexed in ChromaDB.
    """

    try:
        documents = list_documents()

        return {
            "documents": documents,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve documents: {str(e)}"
        )