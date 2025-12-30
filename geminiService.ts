
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following resume in the context of the provided job description.
    Provide a detailed evaluation including:
    1. Overall score (0-100)
    2. Match percentage against the job description (0-100)
    3. ATS compatibility score (0-100)
    4. List of skills identified in the resume
    5. List of missing key skills from the job description
    6. Specific improvement suggestions for bullet points and formatting
    7. Recommended modern tech stacks (especially MERN if applicable) to improve the candidate's profile.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          matchPercentage: { type: Type.NUMBER },
          atsCompatibility: { type: Type.NUMBER },
          skillsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                suggestion: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["category", "suggestion", "impact"]
            }
          },
          techStackSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stack: { type: Type.STRING },
                description: { type: Type.STRING },
                whyRecommended: { type: Type.STRING }
              },
              required: ["stack", "description", "whyRecommended"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: [
          "overallScore", "matchPercentage", "atsCompatibility", 
          "skillsFound", "missingSkills", "improvements", 
          "techStackSuggestions", "summary"
        ]
      }
    }
  });

  const result = JSON.parse(response.text.trim());
  return result as AnalysisResult;
};
