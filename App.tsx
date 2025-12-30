
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AnalysisDashboard from './components/AnalysisDashboard';
import { AppState, AnalysisResult } from './types';
import { analyzeResume } from './geminiService';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File) => {
    setIsExtracting(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      setResumeText(fullText.trim());
    } catch (err) {
      console.error('PDF Extraction Error:', err);
      setError("Failed to extract text from PDF. Please try another file or paste the text manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError("Please upload a PDF file.");
        return;
      }
      extractTextFromPDF(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please provide both your resume and the target job description.");
      return;
    }

    setAppState(AppState.LOADING);
    setError(null);

    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
      setAppState(AppState.ANALYZED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while analyzing the resume.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setError(null);
    setResumeText('');
    setJobDescription('');
  }, []);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {appState === AppState.IDLE || appState === AppState.LOADING || appState === AppState.ERROR ? (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Optimize Your Resume for <span className="text-indigo-600">MERN Success</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload your PDF resume or paste your details to get AI-powered insights, 
                skill gap analysis, and personalized tech stack recommendations.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                      <i className="fas fa-file-alt text-indigo-500"></i> Your Resume
                    </label>
                    <button 
                      onClick={triggerFileUpload}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <i className="fas fa-upload"></i> Upload PDF
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                    />
                  </div>
                  
                  <div className="relative group">
                    {isExtracting && (
                      <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
                        <i className="fas fa-spinner fa-spin text-indigo-600 text-2xl mb-2"></i>
                        <span className="text-xs font-bold text-slate-600">Extracting PDF text...</span>
                      </div>
                    )}
                    <textarea
                      className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none text-slate-600 text-sm bg-slate-50/50 group-hover:bg-white"
                      placeholder="Upload a PDF or paste your resume text here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                    {!resumeText && !isExtracting && (
                      <div 
                        onClick={triggerFileUpload}
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer pointer-events-none opacity-40 hover:opacity-60 transition-opacity"
                      >
                        <i className="fas fa-file-pdf text-4xl mb-2"></i>
                        <span className="text-sm font-medium">Click to upload PDF</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                    <i className="fas fa-briefcase text-indigo-500"></i> Job Description
                  </label>
                  <textarea
                    className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none text-slate-600 text-sm bg-slate-50/50 hover:bg-white"
                    placeholder="Paste the target job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium animate-shake">
                  <i className="fas fa-exclamation-triangle"></i> {error}
                </div>
              )}

              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={appState === AppState.LOADING || isExtracting}
                  className={`
                    px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg transform active:scale-95
                    ${appState === AppState.LOADING || isExtracting
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'}
                  `}
                >
                  {appState === AppState.LOADING ? (
                    <span className="flex items-center gap-3">
                      <i className="fas fa-circle-notch fa-spin"></i> Analyzing with AI...
                    </span>
                  ) : (
                    "Analyze Resume Now"
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
              <div className="bg-white/60 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-chart-line text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-800">Score Evaluation</h3>
                <p className="text-slate-500 text-xs">Get an instant score based on ATS standards and requirements.</p>
              </div>
              <div className="bg-white/60 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-bullseye text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-800">Skill Alignment</h3>
                <p className="text-slate-500 text-xs">Identify exactly which keywords you are missing for the role.</p>
              </div>
              <div className="bg-white/60 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-rocket text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-800">Stack Improvement</h3>
                <p className="text-slate-500 text-xs">Receive suggestions for modern MERN stacks to stay ahead.</p>
              </div>
            </div>
          </div>
        ) : (
          analysisResult && (
            <div className="max-w-5xl mx-auto">
              <AnalysisDashboard data={analysisResult} onReset={handleReset} />
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
