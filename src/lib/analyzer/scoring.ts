import { COMPANIES, TARGET_ROLES, TECHNICAL_SKILLS } from '../constants';
import { calculateCosineSimilarity, extractSkills, preprocessText } from './nlp';

export interface ScoreDetails {
  overall: number;
  keywordMatch: number;
  formatting: number;
  skills: number;
  experience: number;
  projects: number;
  education: number;
}

export interface SectionAnalysis {
  hasSummary: boolean;
  hasSkills: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasProjects: boolean;
}

export function analyzeFormatting(text: string): { score: number; details: SectionAnalysis } {
  const lowerText = text.toLowerCase();
  
  const sections = {
    hasSummary: lowerText.includes('summary') || lowerText.includes('objective') || lowerText.includes('profile'),
    hasSkills: lowerText.includes('skills') || lowerText.includes('technologies') || lowerText.includes('technical skills'),
    hasExperience: lowerText.includes('experience') || lowerText.includes('employment') || lowerText.includes('work history'),
    hasEducation: lowerText.includes('education') || lowerText.includes('academic') || lowerText.includes('university'),
    hasProjects: lowerText.includes('projects') || lowerText.includes('portfolio'),
  };

  let score = 100;
  
  if (!sections.hasSummary) score -= 10;
  if (!sections.hasSkills) score -= 20;
  if (!sections.hasExperience) score -= 20;
  if (!sections.hasEducation) score -= 10;
  if (!sections.hasProjects) score -= 10;

  // Formatting heuristics
  const lines = text.split('\n');
  if (lines.length > 150) score -= 10; // Might be too long (over 2 pages)
  if (lines.length < 20) score -= 20; // Might be too short

  const bulletPoints = text.match(/•|-|\*/g) || [];
  if (bulletPoints.length < 5) score -= 10; // Not enough bullet points

  return {
    score: Math.max(0, score),
    details: sections
  };
}

export function calculateATSScore(
  text: string,
  companyId: string,
  roleId: string
): { score: ScoreDetails; foundSkills: string[]; missingSkills: string[] } {
  
  const company = COMPANIES.find(c => c.id === companyId) || COMPANIES.find(c => c.id === 'generic')!;
  const role = TARGET_ROLES.find(r => r.id === roleId) || TARGET_ROLES[0];

  const tokens = preprocessText(text);
  
  // Combine role keywords and company focus keywords
  const targetKeywords = Array.from(new Set([...role.keywords, ...company.focus]));
  
  // 1. Keyword Match
  const keywordMatchScore = calculateCosineSimilarity(tokens, targetKeywords);
  
  // 2. Skills Match
  const foundSkills = extractSkills(text, TECHNICAL_SKILLS);
  const roleSkills = role.keywords.filter(kw => TECHNICAL_SKILLS.map(s => s.toLowerCase()).includes(kw.toLowerCase()));
  const foundRoleSkills = foundSkills.filter(s => roleSkills.map(rs => rs.toLowerCase()).includes(s.toLowerCase()));
  
  const missingSkills = roleSkills.filter(rs => !foundSkills.map(fs => fs.toLowerCase()).includes(rs.toLowerCase()));
  
  let skillsScore = 0;
  if (roleSkills.length > 0) {
    skillsScore = Math.round((foundRoleSkills.length / roleSkills.length) * 100);
  } else {
    skillsScore = foundSkills.length > 5 ? 100 : foundSkills.length * 20;
  }

  // 3. Formatting
  const { score: formattingScore, details: sections } = analyzeFormatting(text);

  // 4. Experience & Projects (heuristic based on sections and length)
  const experienceScore = sections.hasExperience ? 100 : 0;
  const projectsScore = sections.hasProjects ? 100 : 0;
  const educationScore = sections.hasEducation ? 100 : 0;

  // Calculate Overall
  const weights = company.weights;
  let overall = 
    (keywordMatchScore * weights.keyword) +
    (formattingScore * weights.format) +
    (skillsScore * weights.skills) +
    (experienceScore * weights.experience) +
    (projectsScore * weights.projects);
    
  if (weights.education) {
    overall += (educationScore * weights.education);
  }

  return {
    score: {
      overall: Math.round(overall),
      keywordMatch: keywordMatchScore,
      formatting: formattingScore,
      skills: skillsScore,
      experience: experienceScore,
      projects: projectsScore,
      education: educationScore,
    },
    foundSkills,
    missingSkills
  };
}
