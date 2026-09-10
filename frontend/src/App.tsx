import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar, { Sidebar } from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ClaimChecker from './pages/ClaimChecker';
import Documents from './pages/Documents';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-gray-900 font-sans antialiased">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/checker" element={<ClaimChecker />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4">
            &copy; Pharma Claims Checker &bull; Pharmaceutical Claim Verification & Compliance Review System
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
