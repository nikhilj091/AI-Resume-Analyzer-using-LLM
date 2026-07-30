'use server';

import { parseResume } from '@/lib/analyzer/parser';
import { calculateATSScore } from '@/lib/analyzer/scoring';
import { generateAIAnalysis } from '@/lib/analyzer/ai';

export async function analyzeResume(formData: FormData) {
  try {
    let fileBuffer: Buffer;
    let fileType: string;

    const file = formData.get('resume') as File | null;
    const base64Data = formData.get('resumeBase64') as string | null;
    
    if (base64Data) {
      fileBuffer = Buffer.from(base64Data, 'base64');
      fileType = formData.get('resumeType') as string;
    } else if (file) {
      fileBuffer = Buffer.from(await file.arrayBuffer());
      fileType = file.type;
    } else {
      throw new Error("Missing resume file data");
    }

    const companyId = formData.get('companyId') as string;
    const roleId = formData.get('roleId') as string;

    if (!companyId || !roleId) {
      throw new Error("Missing required fields");
    }
    
    // 1. Parse Resume
    const resumeText = await parseResume(fileBuffer, fileType);
    
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
