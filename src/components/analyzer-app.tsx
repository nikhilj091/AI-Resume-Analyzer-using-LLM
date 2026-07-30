"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadSection } from "./upload-section"
import { Dashboard } from "./dashboard"
import { AIAnalysisResult } from "@/lib/analyzer/ai"
import { ScoreDetails } from "@/lib/analyzer/scoring"
import { COMPANIES, TARGET_ROLES } from "@/lib/constants"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"

export type AnalysisResult = {
  ats: {
    score: ScoreDetails;
    foundSkills: string[];
    missingSkills: string[];
  };
  ai: AIAnalysisResult | null;
}

export function AnalyzerApp() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { setTheme, theme } = useTheme();
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0].id);
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0].id);

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">AI Resume Analyzer</span>
          </div>
          <nav className="flex items-center gap-4">
            {result && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                Analyze Another
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400">
                  Land your dream job with AI
                </h1>
                <p className="text-xl text-muted-foreground">
                  Upload your resume, select your target role and company, and get an instant ATS score with actionable AI feedback to improve your chances.
                </p>
              </div>
              
              <UploadSection 
                onResult={setResult} 
                isAnalyzing={isAnalyzing} 
                setIsAnalyzing={setIsAnalyzing}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard 
                result={result} 
                companyId={selectedCompany} 
                roleId={selectedRole} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="border-t py-6 md:py-0 mt-20">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Built for the hackathon. Empowering job seekers with AI.
          </p>
        </div>
      </footer>
    </div>
  )
}
