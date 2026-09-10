import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert, HelpCircle } from 'lucide-react';
import type { ClaimCheckResult, VerdictType } from '../types/claim';

interface VerdictCardProps {
  result: ClaimCheckResult;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ result }) => {
  const getVerdictDetails = (verdict: VerdictType) => {
    switch (verdict) {
      case 'SUPPORTED':
        return {
          label: 'SUPPORTED',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          description: 'The claim is supported by the approved product labeling.'
        };
      case 'PARTIALLY_SUPPORTED':
        return {
          label: 'PARTIALLY SUPPORTED',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          description: 'The claim is partially supported, but includes unverified or exaggerated assertions.'
        };
      case 'UNSUPPORTED':
        return {
          label: 'UNSUPPORTED',
          badgeClass: 'bg-red-50 text-red-700 border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600',
          description: 'The claim is unsupported or contradicted by the approved product labeling.'
        };
      case 'MISSING_SAFETY_INFORMATION':
        return {
          label: 'MISSING SAFETY INFORMATION',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: ShieldAlert,
          iconColor: 'text-amber-600',
          description: 'The claim omits mandatory safety disclosures or warnings required by labeling.'
        };
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return {
          label: 'INSUFFICIENT EVIDENCE',
          badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: HelpCircle,
          iconColor: 'text-gray-500',
          description: 'Insufficient information was found in the approved labeling to verify this claim.'
        };
    }
  };

  const details = getVerdictDetails(result.verdict);
  const VerdictIcon = details.icon;
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Verification Assessment</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Product: <span className="font-semibold text-gray-800 capitalize">{result.medicine}</span>
          </p>
        </div>
        
        <div className="text-right">
          <span className="text-xs text-gray-500 font-medium block">Confidence</span>
          <span className="text-xl font-bold text-gray-900">{confidencePercent}%</span>
        </div>
      </div>

      {/* Evaluated Claim Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
          Marketing Claim Under Review
        </span>
        <p className="text-sm font-medium text-gray-900 italic">
          "{result.claim}"
        </p>
      </div>

      {/* Verdict Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-gray-50/50 border border-gray-200">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
            Verification Verdict
          </span>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${details.badgeClass}`}>
              <VerdictIcon className={`w-4 h-4 ${details.iconColor}`} />
              {details.label}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-600 sm:max-w-xs sm:text-right">
          {details.description}
        </p>
      </div>

      {/* Assessment Rationale Explanation */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Compliance Assessment Explanation
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-200">
          {result.explanation}
        </p>
      </div>

      {/* Detailed Breakdown Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {result.supported_points && result.supported_points.length > 0 && (
          <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
            <span className="font-semibold text-emerald-800 block mb-1.5">Supported Elements</span>
            <ul className="space-y-1 text-emerald-900 list-disc list-inside">
              {result.supported_points.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        )}

        {result.unsupported_points && result.unsupported_points.length > 0 && (
          <div className="p-3.5 rounded-lg bg-red-50/60 border border-red-200">
            <span className="font-semibold text-red-800 block mb-1.5">Unsupported / Exaggerated Elements</span>
            <ul className="space-y-1 text-red-900 list-disc list-inside">
              {result.unsupported_points.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        )}

        {result.missing_information && result.missing_information.length > 0 && (
          <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200">
            <span className="font-semibold text-amber-800 block mb-1.5">Missing Safety Disclosures</span>
            <ul className="space-y-1 text-amber-900 list-disc list-inside">
              {result.missing_information.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
};

export default VerdictCard;
