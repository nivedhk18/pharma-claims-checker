import React from 'react';
import { Info } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-3.5 flex items-start gap-3">
      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
      <div className="text-xs text-gray-600 leading-relaxed">
        <span className="font-semibold text-gray-800 mr-1">Compliance Notice:</span>
        This tool supports document-based claim review and does not replace regulatory, medical, or legal review. Results are based on approved labeling documents uploaded into the system.
      </div>
    </div>
  );
};

export default Disclaimer;
