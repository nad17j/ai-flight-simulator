"use client";

import React, { useState } from "react";
import {
  Plane,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Target,
  FileText,
  Lock,
  ChevronRight,
  TrendingUp,
  Award,
  HelpCircle
} from "lucide-react";

// --- TYPES ---
type Scenario = {
  id: string;
  title: string;
  role: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  context: string;
  objective: string;
  securityRisk: string;
};

type EvaluationResult = {
  overallScore: number;
  clarityScore: number;
  contextScore: number;
  constraintsScore: number;
  securityScore: number;
  securityPassed: boolean;
  piiDetected: boolean;
  feedback: {
    clarity: string;
    context: string;
    constraints: string;
    security: string;
  };
  improvedPrompt: string;
};

// --- SCENARIO DATA ---
const SCENARIOS: Scenario[] = [
  {
    id: "cs-escalation",
    title: "Enterprise Customer Churn Escalation",
    role: "Customer Success Manager",
    difficulty: "Intermediate",
    description: "Handle an angry enterprise client threatening to cancel a $120k contract due to API outage.",
    context: "Client 'AcmeCorp' suffered 2 hours of API downtime during peak hours. CTO is demanding financial credits and an root-cause incident report immediately.",
    objective: "Draft an empathetic, professional email response that acknowledges the incident, outlines mitigation steps, and offers a executive call without making unapproved financial commitments.",
    securityRisk: "Accidentally pasting internal system passwords, private SLA contract figures, or PII into the prompt."
  },
  {
    id: "fin-analysis",
    title: "Q3 Financial Performance Briefing",
    role: "Financial Analyst",
    difficulty: "Advanced",
    description: "Extract actionable strategic insights from unstructured Q3 earnings notes.",
    context: "You have raw transcripts from quarterly earnings calls containing revenue metrics, margins, and operating cost spikes across 4 divisions.",
    objective: "Instruct the AI to summarize key revenue drivers, calculate margin deviations, and structure a 3-bullet executive summary with zero speculative hallucinations.",
    securityRisk: "Feeding unannounced material non-public financial information (MNPI) to unvetted LLM models."
  },
  {
    id: "hr-policy",
    title: "Remote Work Policy Synthesis",
    role: "People Ops Lead",
    difficulty: "Beginner",
    description: "Synthesize employee feedback into a revised corporate remote work guidelines doc.",
    context: "Survey feedback from 500 employees shows high demand for flexible hybrid days, but team managers report coordination friction.",
    objective: "Prompt the AI to categorize feedback themes, draft a balanced hybrid policy framework, and set clear core collaboration hours.",
    securityRisk: "Including employee names, manager performance comments, or personal health disclosures."
  }
];

export default function FlightSimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  // --- MOCK EVALUATION ENGINE ---
  const handleEvaluate = () => {
    if (!userPrompt.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      const promptLower = userPrompt.toLowerCase();

      // Basic heuristic scoring for demo purposes
      const length = userPrompt.length;
      const hasContext = promptLower.includes("acmecorp") || promptLower.includes("outage") || promptLower.includes("context") || length > 120;
      const hasConstraints = promptLower.includes("do not") || promptLower.includes("bullet") || promptLower.includes("format") || promptLower.includes("limit");
      const hasPiiOrRisk = promptLower.includes("password") || promptLower.includes("ssn") || promptLower.includes("confidential_key") || promptLower.includes("120,000");

      const clarity = Math.min(95, Math.max(50, Math.floor(length / 3) + 40));
      const context = hasContext ? 88 : 45;
      const constraints = hasConstraints ? 92 : 55;
      const security = hasPiiOrRisk ? 30 : 98;
      const piiDetected = hasPiiOrRisk;
      const securityPassed = !hasPiiOrRisk;

      const overall = Math.round((clarity + context + constraints + security) / 4);

      setResult({
        overallScore: overall,
        clarityScore: clarity,
        contextScore: context,
        constraintsScore: constraints,
        securityScore: security,
        securityPassed,
        piiDetected,
        feedback: {
          clarity: clarity > 75 
            ? "Clear structure and explicit goal statement provided." 
            : "Prompt is too ambiguous. Specify the exact persona, audience, and tone required.",
          context: hasContext 
            ? "Excellent background context provided regarding the outage and client impact." 
            : "Missing critical situational context. Provide specific details about the incident background.",
          constraints: hasConstraints 
            ? "Good use of negative constraints and formatting boundaries." 
            : "No output constraints set. Specify maximum length, tone guidelines, and structure to prevent rambling responses.",
          security: securityPassed 
            ? "Safe prompt! No unscrubbed PII or internal key leak risks detected." 
            : "CRITICAL RISK: Potential financial figures or internal keys detected in prompt text!"
        },
        improvedPrompt: `[ROLE]: You are a Senior Customer Success Specialist at a SaaS Enterprise.\n[CONTEXT]: Client AcmeCorp experienced a 2-hour API outage during peak hours. They are frustrated and requesting immediate clarity.\n[TASK]: Write an empathetic, professional email acknowledging the outage and scheduling an executive review call.\n[CONSTRAINTS]: Do NOT promise financial credits or specific SLA refunds in this initial email. Keep tone professional, accountable, and concise (under 200 words).`
      });

      setIsEvaluating(false);
    }, 1200);
  };

  const handleReset = () => {
    setUserPrompt("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-400">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">Tai Labs</span>
              <span className="ml-2 text-xs font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Flight Simulator v1.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> SOC2 Safe Sandbox
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HERO INTRO */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-2xl border border-indigo-900/40 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              <Zap className="w-3.5 h-3.5" /> Interactive Prompt Training Simulator
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test your AI Co-Pilot prompts in real-world scenarios.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Build operational prompt muscle memory. Receive instant rubric scoring on Clarity, Context, Constraints, and Security before executing prompts in live workflows.
            </p>
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: SCENARIOS & INPUT (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* SCENARIO SELECTOR */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                <span>1. Select Simulation Scenario</span>
                <span className="text-slate-500">{SCENARIOS.length} Scenarios Available</span>
              </label>

              <div className="grid grid-cols-1 gap-3">
                {SCENARIOS.map((sc) => {
                  const isSelected = sc.id === selectedScenario.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setSelectedScenario(sc);
                        setResult(null);
                      }}
                      className={`text-left p-4 rounded-lg border transition-all relative ${
                        isSelected
                          ? "bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30"
                          : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-mono text-indigo-400 font-medium">{sc.role}</div>
                          <div className="text-sm font-bold text-white mt-0.5">{sc.title}</div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          sc.difficulty === "Beginner" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : sc.difficulty === "Intermediate"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {sc.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{sc.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SCENARIO BRIEFING CARD */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Scenario Briefing: {selectedScenario.title}
              </div>
              
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 font-medium">Background Context: </span>
                  <span className="text-slate-200">{selectedScenario.context}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Core Objective: </span>
                  <span className="text-slate-200">{selectedScenario.objective}</span>
                </div>
                <div className="bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-md flex items-start gap-2 mt-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-rose-300">
                    <strong>Security Risk Vector:</strong> {selectedScenario.securityRisk}
                  </span>
                </div>
              </div>
            </div>

            {/* PROMPT EDITOR */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  2. Craft Your Prompt Attempt
                </label>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Clear Editor
                </button>
              </div>

              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Type your prompt instructions here... (e.g., Act as a CSM responding to AcmeCorp regarding today's API outage...)"
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-mono transition-all"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500 font-mono">
                  {userPrompt.length} characters
                </span>
                
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !userPrompt.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Flight Check in Progress...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Run Flight Simulator
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: EVALUATION RUBRIC RESULTS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {result ? (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* OVERALL SCORE BANNER */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs uppercase font-semibold text-slate-400">Flight Score</span>
                    <div className="text-3xl font-black text-white mt-0.5 flex items-baseline gap-1">
                      {result.overallScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border ${
                    result.overallScore >= 80 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : result.overallScore >= 60
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}>
                    {result.overallScore >= 80 ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  </div>
                </div>

                {/* 4 PILLAR METRICS */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Evaluation Rubric</span>
                  
                  {/* CLARITY */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Clarity & Specificity</span>
                      <span className="text-slate-400 font-mono">{result.clarityScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${result.clarityScore}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">{result.feedback.clarity}</p>
                  </div>

                  {/* CONTEXT */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Context Framing</span>
                      <span className="text-slate-400 font-mono">{result.contextScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${result.contextScore}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">{result.feedback.context}</p>
                  </div>

                  {/* CONSTRAINTS */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Boundary Constraints</span>
                      <span className="text-slate-400 font-mono">{result.constraintsScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${result.constraintsScore}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">{result.feedback.constraints}</p>
                  </div>

                  {/* SECURITY */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Security & Hallucination Risk</span>
                      <span className={`font-mono ${result.securityPassed ? "text-emerald-400" : "text-rose-400 font-bold"}`}>
                        {result.securityScore}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${result.securityPassed ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${result.securityScore}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">{result.feedback.security}</p>
                  </div>
                </div>

                {/* GOLD STANDARD REFRAME */}
                <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5" /> Gold Standard Prompt Reframing
                  </div>
                  <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                    {result.improvedPrompt}
                  </pre>
                </div>

              </div>
            ) : (
              /* EMPTY STATE */
              <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[400px]">
                <div className="p-3 bg-slate-800/50 rounded-full text-slate-500">
                  <Target className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-slate-300">Awaiting Prompt Submission</div>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Select a scenario, craft your prompt instructions on the left, and click &quot;Run Flight Simulator&quot; to inspect your rubric scores.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
