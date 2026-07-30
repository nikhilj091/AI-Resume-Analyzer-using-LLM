"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { COMPANIES, TARGET_ROLES } from "@/lib/constants"
import { UploadCloud, File as FileIcon, X, Loader2 } from "lucide-react"
import { analyzeResume } from "@/app/actions/analyze"
import type { AnalysisResult } from "./analyzer-app"

interface UploadSectionProps {
  onResult: (result: AnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
  selectedCompany: string;
  setSelectedCompany: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
}

export function UploadSection({
  onResult,
  isAnalyzing,
  setIsAnalyzing,
  selectedCompany,
  setSelectedCompany,
  selectedRole,
  setSelectedRole
}: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File size must be under 5MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const formData = new FormData();
      formData.append("resumeBase64", base64String);
      formData.append("resumeType", file.type);
      formData.append("companyId", selectedCompany);
      formData.append("roleId", selectedRole);

      const result = await analyzeResume(formData);
      if (result.success && result.data) {
        onResult(result.data);
      } else {
        setError(result.error || "An error occurred during analysis.");
      }
    } catch (err) {
      setError("Failed to connect to the analysis service.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg bg-card/50 backdrop-blur border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Let's Get Started</CardTitle>
        <CardDescription className="text-center">Upload your resume to receive AI-powered feedback.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Target Role</Label>
            <Select value={selectedRole} onValueChange={(val) => { if (val) setSelectedRole(val) }}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {TARGET_ROLES.map(role => (
                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Target Company</Label>
            <Select value={selectedCompany} onValueChange={(val) => { if (val) setSelectedCompany(val) }}>
              <SelectTrigger id="company">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {COMPANIES.map(company => (
                  <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Resume Upload</Label>
          {!file ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.docx" 
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF or DOCX (max 5MB)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-xl p-4 flex items-center justify-between bg-card">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} disabled={isAnalyzing}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <Button 
          className="w-full h-12 text-lg font-medium shadow-md transition-all hover:shadow-xl active:scale-[0.98]" 
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            "Analyze Resume"
          )}
        </Button>

      </CardContent>
    </Card>
  )
}
