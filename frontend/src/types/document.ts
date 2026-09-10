export interface DocumentMetadata {
  document_id: string;
  filename: string;
  medicine: string;
  total_pages: number;
  total_chunks: number;
  upload_date: string;
  document_hash: string;
  status: 'ingested' | 'processing' | 'failed';
}

export interface DocumentUploadResponse {
  message: string;
  document: DocumentMetadata;
}
