import React, { useEffect, useState } from 'react';
import { Search, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';
import VerdictCard from '../components/VerdictCard';
import EvidenceCard from '../components/EvidenceCard';
import LoadingState from '../components/LoadingState';
import Disclaimer from '../components/Disclaimer';
import { checkClaim, getMedicines } from '../services/api';
import type { ClaimCheckResult } from '../types/claim';

export const ClaimChecker: React.FC = () => {
  const [medicines, setMedicines] = useState<string[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<string>('ibuprofen');

  const [claimText, setClaimText] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ClaimCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleClaims = [
    {
      med: 'ibuprofen',
      text: 'Provides temporary relief of minor aches and pains due to headache or muscle pain.'
    },
    {
      med: 'ibuprofen',
      text: 'Completely cures all joint pain permanently with 100% safety.'
    },
    {
      med: 'ibuprofen',
      text: 'Provides fast pain relief and instantly reduces high body temperature.'
    }
  ];

  useEffect(() => {
    getMedicines()
      .then((meds) => {
        if (meds.length > 0) {
          setMedicines(meds);
          if (meds.length > 0) {
            setSelectedMedicine(meds[0].toLowerCase());
          }
        }
      })
      .catch(() => {
        setMedicines([]);
      });
  }, []);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeMed = selectedMedicine;

    if (!claimText.trim()) {
      setError("Please enter a pharmaceutical marketing claim to verify.");
      return;
    }
    if (!activeMed) {
      setError("Please select an approved product.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await checkClaim({
        medicine: activeMed,
        claim: claimText.trim()
      });
      setResult(res);
      setClaimText('');
    } catch (err: any) {
      console.error("Claim check error:", err);
      const msg = err.response?.data?.detail || "Failed to process claim verification request.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Verify a Pharmaceutical Claim
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Compare a marketing claim against evidence from an approved drug label.
        </p>
      </div>

      <Disclaimer />

      {/* Input Verification Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
        <form onSubmit={handleAudit} className="space-y-5">
          
          {/* Medicine / Product Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Drug / Label:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={selectedMedicine}
                onChange={(e) => {
                  setSelectedMedicine(e.target.value);
                }}
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none cursor-pointer"
              >
                {medicines.map((med) => (
                  <option key={med} value={med.toLowerCase()}>
                    {med}
                  </option>
                ))}
                {medicines.length === 0 && (
                  <option value="">
                    No medicines available
                  </option>
                )}
              </select>

            </div>
          </div>

          {/* Marketing Claim Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Marketing Claim:
            </label>

            <textarea
              rows={4}
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Enter the marketing claim you want to verify..."
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none leading-relaxed"
            />

            <div className="flex justify-between items-center mt-1.5 text-xs text-gray-500">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-medium text-gray-600">Sample claims:</span>
                {sampleClaims.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedMedicine(sample.med);
                      setClaimText(sample.text);
                    }}
                    className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs border border-gray-200 transition-colors"
                  >
                    "{sample.text.slice(0, 30)}..."
                  </button>
                ))}
              </div>
              <span className="font-mono text-gray-400 shrink-0 ml-2">
                {claimText.length} chars
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-xs disabled:opacity-50 h-10"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Check Claim
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Verification Result Display */}
      {result && !loading && (
        <div className="space-y-6">
          <VerdictCard result={result} />

          {/* Supporting Evidence Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Evidence Excerpts from Approved Labeling ({result.evidence.length})
              </h3>
            </div>

            {result.evidence.length === 0 ? (
              <div className="p-6 rounded-lg bg-white border border-gray-200 text-center text-xs text-gray-500">
                No matching evidence excerpts found in the approved labeling documents.
              </div>
            ) : (
              <div className="space-y-3">
                {result.evidence.map((item, idx) => (
                  <EvidenceCard key={idx} evidence={item} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ClaimChecker;
