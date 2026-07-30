"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { CheckCircle2, AlertCircle, Sparkles, Building, Briefcase, FileText, Check, X, BookOpen, Lightbulb, TrendingUp } from "lucide-react"
import type { AnalysisResult } from "./analyzer-app"
import { COMPANIES, TARGET_ROLES } from "@/lib/constants"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

interface DashboardProps {
  result: AnalysisResult;
  companyId: string;
  roleId: string;
}

export function Dashboard({ result, companyId, roleId }: DashboardProps) {
  const { ats, ai } = result;
  
  const company = COMPANIES.find(c => c.id === companyId);
  const role = TARGET_ROLES.find(r => r.id === roleId);

  // Data for overall score pie chart
  const scoreData = [
    { name: "Score", value: ats.score.overall, color: "hsl(var(--primary))" },
    { name: "Remaining", value: 100 - ats.score.overall, color: "hsl(var(--muted))" }
  ];

  // Data for score breakdown bar chart
  const breakdownData = [
    { name: "Keywords", score: ats.score.keywordMatch },
    { name: "Formatting", score: ats.score.formatting },
    { name: "Skills", score: ats.score.skills },
    { name: "Experience", score: ats.score.experience },
    { name: "Projects", score: ats.score.projects }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Analysis Complete <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
            <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {company?.name}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> {role?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">ATS Score</p>
            <p className={`text-4xl font-extrabold ${getScoreColor(ats.score.overall)}`}>
              {ats.score.overall}<span className="text-xl text-muted-foreground">/100</span>
            </p>
          </div>
          <div className="w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={40}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-card border shadow-sm rounded-lg p-1">
          <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
          <TabsTrigger value="details" className="rounded-md">ATS Details</TabsTrigger>
          <TabsTrigger value="ai" className="rounded-md">AI Insights</TabsTrigger>
        </TabsList>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Score Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Score Breakdown</CardTitle>
                <CardDescription>How your ATS score is calculated</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} 
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Action Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Action Items</CardTitle>
                <CardDescription>What to fix first</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {ats.score.formatting < 80 && (
                    <li className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      <span className="text-sm">Improve resume formatting (check sections and bullet points).</span>
                    </li>
                  )}
                  {ats.score.skills < 70 && (
                    <li className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      <span className="text-sm">Missing key technical skills required for {role?.name}.</span>
                    </li>
                  )}
                  {ai?.suggestions?.slice(0, 3).map((suggestion, i) => (
                    <li key={i} className="flex gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* AI Summary */}
          {ai?.summary && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/10 rounded-full h-fit">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">AI Summary</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ai.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ATS DETAILS TAB */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5"/> Keyword & Skills Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div>
                <h4 className="text-sm font-semibold mb-3 flex justify-between">
                  <span>Found Skills</span>
                  <Badge variant="outline">{ats.foundSkills.length}</Badge>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ats.foundSkills.length > 0 ? (
                    ats.foundSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20">{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No matching technical skills detected.</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex justify-between">
                  <span>Missing Important Skills</span>
                  <Badge variant="outline" className="text-rose-500">{ats.missingSkills.length}</Badge>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ats.missingSkills.length > 0 ? (
                    ats.missingSkills.map(skill => (
                      <Badge key={skill} variant="outline" className="border-rose-200 text-rose-500">{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Great job! You have all the core skills for this role.</span>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formatting & Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                  <span className="text-sm font-medium">Overall Formatting Score</span>
                  <span className="font-bold">{ats.score.formatting}/100</span>
                </div>
                <p className="text-sm text-muted-foreground">Ensure your resume contains all standard sections for ATS parsers to read it correctly.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI INSIGHTS TAB */}
        <TabsContent value="ai" className="space-y-6">
          {!ai ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                AI Analysis was skipped or failed. Ensure your API keys are configured correctly.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-emerald-500/20 bg-emerald-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5"/> Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {ai.strengths.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-rose-500/20 bg-rose-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg text-rose-600 dark:text-rose-400 flex items-center gap-2">
                      <X className="w-5 h-5"/> Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {ai.weaknesses.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5"/>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {ai.suggestions.map((sug, i) => (
                      <li key={i} className="flex gap-3 bg-muted/50 p-4 rounded-lg">
                        <div className="bg-primary/20 text-primary font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">{i+1}</div>
                        <p className="text-sm leading-relaxed">{sug}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interview Readiness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{ai.interviewReadiness}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Grammar & Tone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{ai.grammarFeedback}</p>
                  </CardContent>
                </Card>
              </div>

              {ai.recommendedRoles?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" /> Best Fit Roles
                    </CardTitle>
                    <CardDescription>Based on your profile, AI suggests you might also be a fit for:</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ai.recommendedRoles.map((r, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
                          <div className="shrink-0 w-16 text-center">
                            <span className="text-2xl font-bold text-primary">{r.match}%</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{r.role}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{r.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
