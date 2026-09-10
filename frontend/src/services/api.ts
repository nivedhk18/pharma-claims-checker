import axios from 'axios';
import type { ClaimCheckRequest, ClaimCheckResult } from '../types/claim';
import type { DocumentMetadata, DocumentUploadResponse } from '../types/document';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getMedicines = async (): Promise<string[]> => {
  const response = await api.get('/api/medicines');
  return response.data;
};

export const checkClaim = async (data: ClaimCheckRequest): Promise<ClaimCheckResult> => {
  const response = await api.post('/api/claims/check', data);
  return response.data;
};

export const getDocuments = async (): Promise<DocumentMetadata[]> => {
  const response = await api.get('/api/documents');
  return response.data;
};

export const uploadDocument = async (file: File, medicine: string): Promise<DocumentUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('medicine', medicine);

  const response = await api.post('/api/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocument = async (documentId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/api/documents/${documentId}`);
  return response.data;
};

export default api;

