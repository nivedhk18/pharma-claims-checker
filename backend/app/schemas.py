from pydantic import BaseModel

class ClaimCheckRequest(BaseModel):
    claim: str
    medicine: str

class EvidenceItem(BaseModel):
    text: str
    document_name: str
    chunk_index: int
    distance: float


class ClaimCheckResponse(BaseModel):
    claim: str
    result: str
    evidence: list[EvidenceItem]

class DocumentItem(BaseModel):
    document_name: str
    chunk_count: int


class DocumentListResponse(BaseModel):
    documents: list[DocumentItem]

class EvidenceItem(BaseModel):
    text: str
    document_name: str
    medicine: str
    chunk_index: int
    distance: float