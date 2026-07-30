'use server';

import { parseResume } from '@/lib/analyzer/parser';
import { calculateATSScore } from '@/lib/analyzer/scoring';
import { generateAIAnalysis } from '@/lib/analyzer/ai';

export async function analyzeResume(formData: FormData) {
  try {
    const file = formData.get('resume') as File;
    const companyId = formData.get('companyId') as string;
    const roleId = formData.get('roleId') as string;

    if (!file || !companyId || !roleId) {
      throw new Error("Missing required fields");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 1. Parse Resume
    const resumeText = await parseResume(buffer, file.type);
    
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error("Could not extract enough text from the resume. Please ensure it is a text-based PDF/DOCX.");
    }

    // 2. Deterministic ATS Scoring
    const atsResult = calculateATSScore(resumeText, companyId, roleId);

    // 3. AI Analysis
    const aiResult = await generateAIAnalysis(resumeText, roleId, companyId);

    return {
      success: true,
      data: {
        ats: atsResult,
        ai: aiResult,
      }
    };

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during analysis."
    };
  }
}
