import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini (or other providers if implemented)
// We check for GEMINI_API_KEY. If not found, check OPENAI_API_KEY, etc.
// For this MVP, we default to Gemini if the key is provided.

export interface AIAnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  interviewReadiness: string;
  careerAdvice: string;
  grammarFeedback: string;
  recommendedRoles: Array<{ role: string; match: number; reason: string }>;
}

export async function generateAIAnalysis(resumeText: string, targetRole: string, company: string): Promise<AIAnalysisResult | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn("No AI API key found. Skipping AI analysis.");
    return null;
  }

  try {
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // We use gemini-1.5-flash as it's fast and suitable for this text task
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are an expert ATS and technical recruiter. 
        Analyze the following resume for a ${targetRole} position at ${company}.
        
        Resume text:
        """
        ${resumeText.substring(0, 5000)} 
        """
        
        Return ONLY a raw JSON object (without markdown wrappers like \`\`\`json) with the following structure:
        {
          "summary": "A short professional summary of the candidate (2-3 sentences).",
          "strengths": ["strength 1", "strength 2", "strength 3"],
          "weaknesses": ["weakness 1", "weakness 2"],
          "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"],
          "interviewReadiness": "Brief assessment of how ready they are for an interview.",
          "careerAdvice": "One piece of high-level career advice.",
          "grammarFeedback": "Any noticeable grammar or tone issues. Keep it brief.",
          "recommendedRoles": [
             { "role": "Role Name 1", "match": 95, "reason": "Why this fits" },
             { "role": "Role Name 2", "match": 85, "reason": "Why this fits" },
             { "role": "Role Name 3", "match": 80, "reason": "Why this fits" }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up markdown json formatting if the model still outputs it
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      
      return JSON.parse(text) as AIAnalysisResult;
    }
    
    // Future integration for OpenAI or Groq goes here...
    return null;

  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null; // Graceful degradation
  }
}
