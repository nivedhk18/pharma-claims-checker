import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileText, ArrowRight, Search, FileCheck, Award } from 'lucide-react';
import Disclaimer from '../components/Disclaimer';

export const Dashboard: React.FC = () => {
  const steps = [
    {
      step: '1',
      title: 'Select Drug Label',
      description: 'Choose an approved drug label.',
      icon: FileText
    },
    {
      step: '2',
      title: 'Enter Claim',
      description: 'Enter the pharmaceutical marketing claim.',
      icon: Search
    },
    {
      step: '3',
      title: 'Retrieve Evidence',
      description: 'Find relevant evidence from the approved label.',
      icon: FileCheck
    },
    {
      step: '4',
      title: 'Get Verdict',
      description: 'Receive an evidence-grounded claim assessment.',
      icon: Award
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Hero Banner Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
            PHARMA CLAIMS CHECKER
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            AI-assisted pharmaceutical claims verification
          </h1>
          <p className="text-sm font-medium text-gray-600 mt-2">
            "Verify pharmaceutical marketing claims against approved drug-label evidence."
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/checker"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-xs"
          >
            Check a Claim
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <Disclaimer />

      {/* Quick Actions Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <Link
            to="/checker"
            className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-lg p-5 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2 w-fit rounded bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Check a Claim</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Verify a pharmaceutical marketing claim.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-medium text-blue-600 gap-1">
              Go to Claim Checker <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/documents"
            className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-lg p-5 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2 w-fit rounded bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Manage Documents</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                View or upload approved drug labels.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-medium text-blue-600 gap-1">
              Go to Documents <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>
      </div>

      {/* How it works Workflow Explanation */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-5">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          How it works
        </h2>

        {/* Responsive Desktop Horizontal / Mobile Vertical Step Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {steps.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.step} className="flex flex-col space-y-2 p-3 rounded-lg bg-gray-50/70 border border-gray-200/80">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {item.step}
                  </div>
                  <IconComponent className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 pt-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

