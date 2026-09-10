import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  BarChart3, 
  Menu, 
  X
} from 'lucide-react';
import { checkHealth } from '../services/api';

export const Navbar: React.FC = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkHealth()
      .then(() => setIsHealthy(true))
      .catch(() => setIsHealthy(false));
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: BarChart3 },
    { to: '/checker', label: 'Claim Checker', icon: CheckCircle2 },
    { to: '/documents', label: 'Documents', icon: FileText },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-md bg-blue-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-base sm:text-lg tracking-tight">
                  Pharma Claims Checker
                </span>
                <span className="hidden sm:inline-block text-xs text-gray-500 border-l border-gray-200 pl-2 font-normal">
                  Pharmaceutical Claim Verification
                </span>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Real Backend Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isHealthy === false ? 'bg-red-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isHealthy === false ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span>{isHealthy === true ? 'System Ready' : isHealthy === false ? 'System Offline' : 'Checking...'}</span>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-1 shadow-sm sticky top-16 z-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </>
  );
};

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: BarChart3 },
    { to: '/checker', label: 'Claim Checker', icon: CheckCircle2 },
    { to: '/documents', label: 'Documents', icon: FileText },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 shrink-0 hidden md:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-64px)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 pt-4 px-3">
        <div className="text-[11px] text-gray-500 font-medium">
          Pharmaceutical Compliance System
        </div>
        <div className="text-[10px] text-gray-400 mt-0.5">
          Claim Verification Tool
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
