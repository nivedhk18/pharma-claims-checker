import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import type { EvidenceItem } from '../types/claim';

interface EvidenceCardProps {
  evidence: EvidenceItem;
  index: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs transition-colors">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 bg-gray-50/70 hover:bg-gray-100/70 cursor-pointer select-none border-b border-gray-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">
                {evidence.document_name}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                Page {evidence.page}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-normal">Label Excerpt #{index + 1}</span>
          </div>
        </div>

        <button 
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label={isExpanded ? "Collapse excerpt" : "Expand excerpt"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Body */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1">
              Relevant Text Excerpt:
            </span>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800 font-sans leading-relaxed whitespace-pre-wrap">
              "{evidence.text}"
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
            <span className="flex items-center gap-1 text-gray-500">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
              Source: Approved Product Labeling
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceCard;
