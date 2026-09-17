from pydantic import BaseModel

class ClaimCheckRequest(BaseModel):
    claim: str
    medicine: str

# class EvidenceItem(BaseModel):
#     text: str
#     document_name: str
#     chunk_index: int
#     distance: float


class ClaimCheckResponse(BaseModel):
    claim: str
    medicine: str
    verdict: str
    confidence: float
    explanation: str
    supported_points: list[str]
    unsupported_points: list[str]
    missing_information: list[str]
    evidence: list[EvidenceItem]

class DocumentItem(BaseModel):
    document_name: str
    medicine: str
    total_pages: int
    chunk_count: int
    status: str


class DocumentListResponse(BaseModel):
    documents: list[DocumentItem]

class EvidenceItem(BaseModel):
    text: str
    document_name: str
    medicine: str
    page: int
    chunk_index: int
    distance: float