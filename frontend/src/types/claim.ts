export type VerdictType =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'UNSUPPORTED'
  | 'MISSING_SAFETY_INFORMATION'
  | 'INSUFFICIENT_EVIDENCE';

export interface EvidenceItem {
  text: string;
  document_name: string;
  medicine: string;
  chunk_index: number;
  distance: number;
  page: number;
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