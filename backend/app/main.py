from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil

from app.services.pdf_processor import process_pdf
from app.services.embedding_service import create_embedding
from app.services.vector_store import (
    add_chunks,
    list_documents,
    list_medicines,
    document_exists,
    delete_document,
)                                                                                                                           
from app.services.rag_pipeline import verify_claim_with_rag
from app.schemas import (
    ClaimCheckRequest,
    ClaimCheckResponse,
    DocumentListResponse,
)

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
async def upload_document(
    file: UploadFile = File(...),
    medicine: str = Form(...),
):

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
            create_embedding(chunk["text"])
            for chunk in chunks
        ]
        medicine = medicine.strip().lower()
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
        verification = result["result"]

        return {
            "claim": result["claim"],
            "medicine": result["medicine"],
            "verdict": verification["verdict"],
            "confidence": verification["confidence"],
            "explanation": verification["explanation"],
            "supported_points": verification["supported_points"],
            "unsupported_points": verification["unsupported_points"],
            "missing_information": verification["missing_information"],
            "evidence": result["evidence"],
        }

    except Exception as e:
        error_message = str(e)
        if "429" in error_message or "quota" in error_message.lower():
            raise HTTPException(
                status_code=503,
                detail=(
                    "The AI verification service is temporarily "
                    "unavailable because the API quota has been reached. "
                    "Please try again later."
                )
            )
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

    
@app.delete("/documents/{document_name}")
async def remove_document(document_name: str):
    """
    Delete a document from ChromaDB and local storage.
    """

    file_path = UPLOAD_DIR / document_name

    deleted_from_chroma = delete_document(
        document_name
    )

    if not deleted_from_chroma:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    if file_path.exists():
        file_path.unlink()

    return {
        "message": (
            f"Document '{document_name}' "
            "deleted successfully."
        )
    }    

@app.get("/medicines")
async def get_medicines():
    """
    Return unique medicines with indexed documents.
    """

    try:
        medicines = list_medicines()

        return medicines

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve medicines: {str(e)}"
        )