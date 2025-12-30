
export interface Improvement {
  category: string;
  suggestion: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  overallScore: number;
  matchPercentage: number;
  atsCompatibility: number;
  skillsFound: string[];
  missingSkills: string[];
  improvements: Improvement[];
  techStackSuggestions: {
    stack: string;
    description: string;
    whyRecommended: string;
  }[];
  summary: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ANALYZED = 'ANALYZED',
  ERROR = 'ERROR'
}
