
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-file-contract text-xl"></i>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              ResumeAI Pro
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Analyzer</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Templates</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">About</a>
          </nav>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-sm">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
