export type VerdictType = 
  | 'SUPPORTED' 
  | 'PARTIALLY_SUPPORTED' 
  | 'UNSUPPORTED' 
  | 'MISSING_SAFETY_INFORMATION' 
  | 'INSUFFICIENT_EVIDENCE';

export interface EvidenceItem {
  document_name: string;
  medicine: string;
  page: number;
  chunk_id: string;
  text: string;
  score?: number;
}

export interface ClaimCheckRequest {
  medicine: string;
  claim: string;
}

export interface ClaimCheckResult {
  claim: string;
  medicine: string;
  verdict: VerdictType;
  confidence: number;
  explanation: string;
  supported_points: string[];
  unsupported_points: string[];
  missing_information: string[];
  evidence: EvidenceItem[];
}
