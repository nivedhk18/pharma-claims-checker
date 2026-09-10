import React, { useEffect, useState } from 'react';
import { Loader2, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LoadingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Retrieving label evidence...", icon: FileText },
    { label: "Analyzing claim...", icon: ShieldCheck },
    { label: "Generating assessment...", icon: CheckCircle2 },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1000);
    const timer2 = setTimeout(() => setCurrentStep(2), 2200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs max-w-lg mx-auto my-6 text-center space-y-4">
      <div className="flex justify-center">
        <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900">Verifying claim...</h3>
        <p className="text-xs text-gray-500 mt-1">Comparing marketing claim against approved product labeling.</p>
      </div>

      <div className="space-y-2 text-left pt-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-md border text-xs font-medium transition-colors ${
                isDone
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : isCurrent
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-gray-300 inline-block shrink-0" />
              )}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingState;
