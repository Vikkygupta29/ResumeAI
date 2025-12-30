
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-file-contract"></i>
              </div>
              <span className="text-xl font-bold text-white">ResumeAI Pro</span>
            </div>
            <p className="max-w-xs mb-4">
              Elevating career paths with intelligent resume analysis and personalized tech stack recommendations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-white transition-colors"><i className="fab fa-github"></i></a>
              <a href="#" className="hover:text-white transition-colors"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Resume Score</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Keyword Optimization</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ATS Checker</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} ResumeAI Pro. Built for MERN Developers.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
