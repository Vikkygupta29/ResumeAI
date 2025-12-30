
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AnalysisResult } from '../types';

interface Props {
  data: AnalysisResult;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<Props> = ({ data, onReset }) => {
  const chartData = [
    { name: 'Match', value: data.matchPercentage },
    { name: 'Gap', value: 100 - data.matchPercentage },
  ];

  const scoreData = [
    { name: 'Overall', value: data.overallScore },
    { name: 'ATS', value: data.atsCompatibility },
    { name: 'Match', value: data.matchPercentage },
  ];

  const COLORS = ['#4f46e5', '#e2e8f0'];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Analysis Result</h2>
        <button 
          onClick={onReset}
          className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
        >
          <i className="fas fa-redo"></i> Analyze Another
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <span className="text-slate-500 text-sm font-medium mb-2">Overall Score</span>
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-indigo-600">
              {data.overallScore}
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">Based on industry standards</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-slate-500 text-sm font-medium mb-4 block">Key Performance Indicators</span>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} layout="vertical" margin={{ left: -20, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-md text-white">
          <h3 className="font-bold text-xl mb-3">AI Executive Summary</h3>
          <p className="text-indigo-50 leading-relaxed text-sm">
            {data.summary}
          </p>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-check-circle text-emerald-500"></i> Identified Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skillsFound.map((skill, i) => (
              <span key={i} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-exclamation-circle text-amber-500"></i> Missing Key Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.length > 0 ? (
              data.missingSkills.map((skill, i) => (
                <span key={i} className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">Perfect match! All skills found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Specific Improvements */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6">Actionable Improvements</h3>
        <div className="space-y-4">
          {data.improvements.map((imp, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                imp.impact === 'High' ? 'bg-rose-500' : imp.impact === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
              }`} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900">{imp.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                    imp.impact === 'High' ? 'bg-rose-100 text-rose-700' : imp.impact === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {imp.impact} Impact
                  </span>
                </div>
                <p className="text-slate-600 text-sm">{imp.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Suggestions */}
      <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-2xl">
        <h3 className="font-bold text-indigo-900 text-xl mb-6 flex items-center gap-3">
          <i className="fas fa-laptop-code"></i> Recommended Modern Tech Stacks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.techStackSuggestions.map((stack, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-bold text-indigo-600 mb-2">{stack.stack}</h4>
              <p className="text-slate-700 text-sm mb-4 leading-relaxed">{stack.description}</p>
              <div className="bg-slate-50 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mb-1">Why Recommendation?</span>
                <p className="text-slate-600 text-xs italic">{stack.whyRecommended}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
