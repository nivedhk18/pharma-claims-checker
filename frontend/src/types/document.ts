export interface DocumentMetadata {
  document_name: string;
  medicine: string;
  total_pages: number;
  chunk_count: number;
  status: 'ingested' | 'processing' | 'failed';
}

export interface DocumentUploadResponse {
  filename: string;
  message: string;
  chunk_count: number;
}