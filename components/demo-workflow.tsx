"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Bot,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play,
  RotateCcw,
  FileSearch,
  Zap,
  Calculator,
  TrendingUp,
  DollarSign,
  Edit2,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Demo contract data
const DEMO_CONTRACT = {
  id: "demo-001",
  contractNumber: "2-0000274176",
  partnerName: "OneFootball UK Ltd",
  product: "Content Distribution Agreement",
  fileName: "OneFootball_Contract_2024.pdf",
  uploadedAt: new Date(),
};

// Simulated extracted text passages
const EXTRACTED_PASSAGES = [
  {
    section: "Exhibit D - Revenue Share",
    text: "Partner shall receive 40% of Net Revenue for all Text content...",
    highlight: "40% of Net Revenue",
  },
  {
    section: "Exhibit D - Revenue Share",
    text: "Partner shall receive 50% of Net Revenue for all Video content...",
    highlight: "50% of Net Revenue",
  },
  {
    section: "Section 4.2 - Cost Deductions",
    text: "Cost of Sales (COS) shall be deducted at 10% of Gross Revenue...",
    highlight: "COS... 10%",
  },
  {
    section: "Section 4.3 - Content Costs",
    text: "Cost of Content (COC) for Text shall be 12%, Video shall be 50%...",
    highlight: "COC... 12%... 50%",
  },
];

// Demo rules extracted from contract
const DEMO_EXTRACTED_RULES = [
  {
    id: "rule-text-revshare",
    name: "Text Content Revenue Share",
    category: "financial" as const,
    source: "Exhibit D - Section 1.2",
    tokens: [
      { id: "t1", type: "keyword" as const, value: "if", editable: false },
      { id: "t2", type: "variable" as const, value: "content_type", editable: false },
      { id: "t3", type: "operator" as const, value: "==", editable: false },
      { id: "t4", type: "value" as const, value: "OneFootball Partner", editable: true },
      { id: "t5", type: "keyword" as const, value: "and", editable: false },
      { id: "t6", type: "variable" as const, value: "media_type", editable: false },
      { id: "t7", type: "operator" as const, value: "==", editable: false },
      { id: "t8", type: "value" as const, value: "Text", editable: true },
      { id: "t9", type: "keyword" as const, value: "then", editable: false },
      { id: "t10", type: "variable" as const, value: "cos", editable: false },
      { id: "t11", type: "operator" as const, value: "=", editable: false },
      { id: "t12", type: "value" as const, value: "10", editable: true },
      { id: "t13", type: "variable" as const, value: "coc", editable: false },
      { id: "t14", type: "operator" as const, value: "=", editable: false },
      { id: "t15", type: "value" as const, value: "12", editable: true },
      { id: "t16", type: "variable" as const, value: "yahoo_rev", editable: false },
      { id: "t17", type: "operator" as const, value: "=", editable: false },
      { id: "t18", type: "value" as const, value: "60", editable: true },
      { id: "t19", type: "variable" as const, value: "onefootball_rev", editable: false },
      { id: "t20", type: "operator" as const, value: "=", editable: false },
      { id: "t21", type: "value" as const, value: "40", editable: true },
    ],
  },
  {
    id: "rule-video-revshare",
    name: "Video Content Revenue Share",
    category: "financial" as const,
    source: "Exhibit D - Section 1.3",
    tokens: [
      { id: "v1", type: "keyword" as const, value: "if", editable: false },
      { id: "v2", type: "variable" as const, value: "content_type", editable: false },
      { id: "v3", type: "operator" as const, value: "==", editable: false },
      { id: "v4", type: "value" as const, value: "OneFootball Partner", editable: true },
      { id: "v5", type: "keyword" as const, value: "and", editable: false },
      { id: "v6", type: "variable" as const, value: "media_type", editable: false },
      { id: "v7", type: "operator" as const, value: "==", editable: false },
      { id: "v8", type: "value" as const, value: "Video", editable: true },
      { id: "v9", type: "keyword" as const, value: "then", editable: false },
      { id: "v10", type: "variable" as const, value: "cos", editable: false },
      { id: "v11", type: "operator" as const, value: "=", editable: false },
      { id: "v12", type: "value" as const, value: "10", editable: true },
      { id: "v13", type: "variable" as const, value: "coc", editable: false },
      { id: "v14", type: "operator" as const, value: "=", editable: false },
      { id: "v15", type: "value" as const, value: "50", editable: true },
      { id: "v16", type: "variable" as const, value: "yahoo_rev", editable: false },
      { id: "v17", type: "operator" as const, value: "=", editable: false },
      { id: "v18", type: "value" as const, value: "50", editable: true },
      { id: "v19", type: "variable" as const, value: "onefootball_rev", editable: false },
      { id: "v20", type: "operator" as const, value: "=", editable: false },
      { id: "v21", type: "value" as const, value: "50", editable: true },
    ],
  },
];

// Demo revenue data
const DEMO_REVENUE_DATA = [
  { id: "1", contentType: "OneFootball - Borussia Dortmund", mediaType: "Text", grossRevenue: 4100 },
  { id: "2", contentType: "OneFootball - Borussia Dortmund", mediaType: "Video", grossRevenue: 8250 },
  { id: "3", contentType: "OneFootball - Borussia Mönchengladbach", mediaType: "Video", grossRevenue: 3870 },
  { id: "4", contentType: "OneFootball - Bayern Munich", mediaType: "Text", grossRevenue: 12500 },
  { id: "5", contentType: "OneFootball - RB Leipzig", mediaType: "Video", grossRevenue: 6300 },
];

type DemoStep = "intro" | "extraction" | "rules" | "calculation" | "results";

interface DemoWorkflowProps {
  onExit: () => void;
}

export function DemoWorkflow({ onExit }: DemoWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<DemoStep>("intro");
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractedPassages, setExtractedPassages] = useState<typeof EXTRACTED_PASSAGES>([]);
  const [rules, setRules] = useState(DEMO_EXTRACTED_RULES);
  const [showRulesAnimation, setShowRulesAnimation] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [calculationResults, setCalculationResults] = useState<any[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Reset demo
  const resetDemo = useCallback(() => {
    setCurrentStep("intro");
    setExtractionProgress(0);
    setExtractedPassages([]);
    setRules(DEMO_EXTRACTED_RULES);
    setShowRulesAnimation(false);
    setCalculationProgress(0);
    setCalculationResults([]);
    setIsAutoPlaying(false);
  }, []);

  // Simulate extraction process
  const runExtraction = useCallback(async (autoPlay: boolean = false) => {
    setCurrentStep("extraction");
    setExtractionProgress(0);
    setExtractedPassages([]);

    for (let i = 0; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 50));
      setExtractionProgress(i);

      // Add passages at certain progress points
      if (i === 25) setExtractedPassages([EXTRACTED_PASSAGES[0]]);
      if (i === 50) setExtractedPassages((p) => [...p, EXTRACTED_PASSAGES[1]]);
      if (i === 75) setExtractedPassages((p) => [...p, EXTRACTED_PASSAGES[2]]);
      if (i === 95) setExtractedPassages((p) => [...p, EXTRACTED_PASSAGES[3]]);
    }

    await new Promise((r) => setTimeout(r, 500));
    
    // Move to rules step
    setCurrentStep("rules");
    setShowRulesAnimation(true);
    
    // If auto-playing, continue to calculation after a delay
    if (autoPlay) {
      await new Promise((r) => setTimeout(r, 2500));
      runCalculation();
    }
  }, []);

  // Calculate revenue
  const runCalculation = useCallback(async () => {
    setCurrentStep("calculation");
    setCalculationProgress(0);
    setCalculationResults([]);

    const results: any[] = [];

    for (let i = 0; i < DEMO_REVENUE_DATA.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setCalculationProgress(((i + 1) / DEMO_REVENUE_DATA.length) * 100);

      const data = DEMO_REVENUE_DATA[i];
      const isText = data.mediaType === "Text";

      // Get rule values
      const cos = 10;
      const coc = isText ? 12 : 50;
      const yahooShare = isText ? 60 : 50;
      const partnerShare = isText ? 40 : 50;

      const revenuePostCOS = data.grossRevenue * (1 - cos / 100);
      const cocAmount = revenuePostCOS * (coc / 100);
      const revenuePostCOC = revenuePostCOS * (1 - coc / 100);
      const yahooAmount = revenuePostCOC * (yahooShare / 100);
      const partnerAmount = revenuePostCOC * (partnerShare / 100);

      results.push({
        ...data,
        cos,
        revenuePostCOS,
        coc,
        cocAmount,
        revenuePostCOC,
        yahooShare,
        partnerShare,
        yahooAmount,
        partnerAmount,
      });

      setCalculationResults([...results]);
    }

    await new Promise((r) => setTimeout(r, 500));
    setCurrentStep("results");
  }, []);

  // Auto-play mode
  const startAutoPlay = useCallback(async () => {
    setIsAutoPlaying(true);
    await runExtraction(true);
  }, [runExtraction]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTokenColor = (type: string) => {
    switch (type) {
      case "variable":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "operator":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "value":
        return "bg-violet-100 text-violet-800 border-violet-300";
      case "keyword":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const steps = [
    { id: "intro", label: "Start", icon: Play },
    { id: "extraction", label: "Extract", icon: FileSearch },
    { id: "rules", label: "Build Rules", icon: Zap },
    { id: "calculation", label: "Calculate", icon: Calculator },
    { id: "results", label: "Results", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PAM Rule Engine</h1>
                <p className="text-sm text-purple-200/70">Interactive Demo Experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={resetDemo}
                className="border-purple-400/50 bg-purple-500/20 text-purple-100 hover:bg-purple-500/30 hover:text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExit}
                className="border-pink-400/50 bg-pink-500/20 text-pink-100 hover:bg-pink-500/30 hover:text-white"
              >
                Exit Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = step.id === currentStep;
            const isPast = steps.findIndex((s) => s.id === currentStep) > index;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-110"
                      : isPast
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/5 text-white/50 border border-white/10"
                  }`}
                >
                  {isPast ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight
                    className={`h-5 w-5 mx-1 ${
                      isPast ? "text-emerald-400" : "text-white/20"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Intro Step */}
        {currentStep === "intro" && (
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI-Powered Contract Analysis</span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">
                Experience the Full Workflow
              </h2>
              <p className="text-xl text-purple-200/70 max-w-2xl mx-auto">
                Watch how PAM extracts rules from contracts, lets you customize them,
                and calculates revenue distributions — all powered by AI.
              </p>
            </div>

            {/* Demo Contract Preview */}
            <Card className="max-w-md mx-auto mb-10 bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Sample Contract
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-purple-200/70">
                    <span>Contract #:</span>
                    <span className="text-white font-mono">{DEMO_CONTRACT.contractNumber}</span>
                  </div>
                  <div className="flex justify-between text-purple-200/70">
                    <span>Partner:</span>
                    <span className="text-white">{DEMO_CONTRACT.partnerName}</span>
                  </div>
                  <div className="flex justify-between text-purple-200/70">
                    <span>Type:</span>
                    <span className="text-white">{DEMO_CONTRACT.product}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={startAutoPlay}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg shadow-lg shadow-purple-500/25"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Auto Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={runExtraction}
                className="border-cyan-400/50 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30 hover:text-white px-8 py-6 text-lg"
              >
                Step-by-Step Mode
              </Button>
            </div>
          </div>
        )}

        {/* Extraction Step */}
        {currentStep === "extraction" && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                <FileSearch className="inline h-8 w-8 mr-3 text-cyan-400" />
                Extracting Contract Data
              </h2>
              <p className="text-purple-200/70">
                AI is analyzing the contract and identifying key revenue terms...
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Progress Panel */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="h-5 w-5 text-cyan-400" />
                    AI Analysis Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-purple-200/70">Processing</span>
                      <span className="text-white font-mono">{extractionProgress}%</span>
                    </div>
                    <Progress value={extractionProgress} className="h-3 bg-white/10" />
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "PDF Parsing", threshold: 20 },
                      { label: "Text Extraction", threshold: 40 },
                      { label: "Section Identification", threshold: 60 },
                      { label: "Rule Pattern Matching", threshold: 80 },
                      { label: "Rule Generation", threshold: 95 },
                    ].map((task) => (
                      <div key={task.label} className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            extractionProgress >= task.threshold
                              ? "bg-emerald-400"
                              : "bg-white/20"
                          }`}
                        />
                        <span
                          className={`text-sm transition-all duration-300 ${
                            extractionProgress >= task.threshold
                              ? "text-white"
                              : "text-white/40"
                          }`}
                        >
                          {task.label}
                        </span>
                        {extractionProgress >= task.threshold && (
                          <CheckCircle className="h-4 w-4 text-emerald-400 ml-auto animate-in zoom-in duration-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Extracted Passages */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Extracted Passages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {extractedPassages.map((passage, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 animate-in slide-in-from-right duration-500"
                      >
                        <div className="text-xs text-cyan-400 font-medium mb-1">
                          {passage.section}
                        </div>
                        <p className="text-sm text-white/80 mb-2">{passage.text}</p>
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          Found: {passage.highlight}
                        </Badge>
                      </div>
                    ))}
                    {extractedPassages.length === 0 && (
                      <div className="text-center py-8 text-white/40">
                        <div className="animate-pulse">Scanning document...</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {extractionProgress === 100 && !isAutoPlaying && (
              <div className="mt-8 text-center animate-in fade-in duration-500">
                <Button
                  size="lg"
                  onClick={() => {
                    setCurrentStep("rules");
                    setShowRulesAnimation(true);
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  View Extracted Rules
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Rules Step */}
        {currentStep === "rules" && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                <Zap className="inline h-8 w-8 mr-3 text-yellow-400" />
                AI-Generated Rules
              </h2>
              <p className="text-purple-200/70">
                Rules extracted from contract. Click on highlighted values to edit them.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {rules.map((rule, ruleIdx) => (
                <Card
                  key={rule.id}
                  className={`bg-white/5 border-white/10 backdrop-blur-sm transition-all duration-700 ${
                    showRulesAnimation ? "animate-in slide-in-from-left" : ""
                  }`}
                  style={{ animationDelay: `${ruleIdx * 200}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                          {ruleIdx + 1}
                        </div>
                        {rule.name}
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {rule.category}
                        </Badge>
                      </CardTitle>
                      <span className="text-xs text-purple-200/50 font-mono">
                        Source: {rule.source}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 flex-wrap">
                      {rule.tokens.map((token) => (
                        <span
                          key={token.id}
                          className={`px-3 py-1.5 rounded-lg border font-mono text-sm transition-all ${getTokenColor(
                            token.type
                          )} ${
                            token.editable
                              ? "cursor-pointer hover:scale-105 hover:shadow-lg ring-2 ring-transparent hover:ring-white/20"
                              : ""
                          }`}
                        >
                          {token.value}
                          {token.editable && (
                            <Edit2 className="inline h-3 w-3 ml-1 opacity-50" />
                          )}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!isAutoPlaying && (
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={runCalculation}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                >
                  Apply Rules & Calculate Revenue
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Calculation Step */}
        {currentStep === "calculation" && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                <Calculator className="inline h-8 w-8 mr-3 text-emerald-400" />
                Calculating Revenue Distributions
              </h2>
              <p className="text-purple-200/70">
                Applying extracted rules to revenue data...
              </p>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-200/70">Processing Revenue Data</span>
                  <span className="text-white font-mono">{Math.round(calculationProgress)}%</span>
                </div>
                <Progress value={calculationProgress} className="h-3 bg-white/10" />
              </CardContent>
            </Card>

            {calculationResults.length > 0 && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-purple-200/70">Content</TableHead>
                      <TableHead className="text-purple-200/70">Type</TableHead>
                      <TableHead className="text-purple-200/70 text-right">Gross</TableHead>
                      <TableHead className="text-purple-200/70 text-right">Post-COS</TableHead>
                      <TableHead className="text-purple-200/70 text-right">Yahoo</TableHead>
                      <TableHead className="text-purple-200/70 text-right">Partner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculationResults.map((result, idx) => (
                      <TableRow
                        key={result.id}
                        className="border-white/10 animate-in slide-in-from-left duration-300"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <TableCell className="text-white font-medium">
                          {result.contentType.split(" - ")[1] || result.contentType}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              result.mediaType === "Text"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            }
                          >
                            {result.mediaType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-white font-mono">
                          {formatCurrency(result.grossRevenue)}
                        </TableCell>
                        <TableCell className="text-right text-cyan-300 font-mono">
                          {formatCurrency(result.revenuePostCOS)}
                        </TableCell>
                        <TableCell className="text-right text-emerald-400 font-mono font-bold">
                          {formatCurrency(result.yahooAmount)}
                        </TableCell>
                        <TableCell className="text-right text-pink-400 font-mono font-bold">
                          {formatCurrency(result.partnerAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        )}

        {/* Results Step */}
        {currentStep === "results" && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 mb-4">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Calculation Complete</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                <TrendingUp className="inline h-8 w-8 mr-3 text-emerald-400" />
                Revenue Distribution Results
              </h2>
              <p className="text-purple-200/70">
                Final breakdown of revenue shares based on contract rules
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <DollarSign className="h-10 w-10 mx-auto text-white/40 mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">
                      {formatCurrency(
                        calculationResults.reduce((sum, r) => sum + r.grossRevenue, 0)
                      )}
                    </div>
                    <div className="text-sm text-purple-200/70">Total Gross Revenue</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border-emerald-500/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-10 w-10 mx-auto text-emerald-400 mb-3" />
                    <div className="text-3xl font-bold text-emerald-400 mb-1">
                      {formatCurrency(
                        calculationResults.reduce((sum, r) => sum + r.yahooAmount, 0)
                      )}
                    </div>
                    <div className="text-sm text-emerald-200/70">Yahoo Revenue Share</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-900/30 to-pink-950/30 border-pink-500/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-10 w-10 mx-auto text-pink-400 mb-3" />
                    <div className="text-3xl font-bold text-pink-400 mb-1">
                      {formatCurrency(
                        calculationResults.reduce((sum, r) => sum + r.partnerAmount, 0)
                      )}
                    </div>
                    <div className="text-sm text-pink-200/70">Partner Payout</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results Table */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden mb-8">
              <CardHeader>
                <CardTitle className="text-white">Detailed Breakdown</CardTitle>
                <CardDescription className="text-purple-200/50">
                  Line-by-line calculation results with all deductions applied
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-purple-200/70">Content</TableHead>
                      <TableHead className="text-purple-200/70">Type</TableHead>
                      <TableHead className="text-purple-200/70 text-right">Gross</TableHead>
                      <TableHead className="text-purple-200/70 text-right">COS (10%)</TableHead>
                      <TableHead className="text-purple-200/70 text-right">COC</TableHead>
                      <TableHead className="text-purple-200/70 text-right">Net Revenue</TableHead>
                      <TableHead className="text-purple-200/70 text-right">Yahoo Share</TableHead>
                      <TableHead className="text-purple-200/70 text-right">Partner Share</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculationResults.map((result) => (
                      <TableRow key={result.id} className="border-white/10">
                        <TableCell className="text-white font-medium">
                          {result.contentType.split(" - ")[1] || result.contentType}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              result.mediaType === "Text"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            }
                          >
                            {result.mediaType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-white font-mono">
                          {formatCurrency(result.grossRevenue)}
                        </TableCell>
                        <TableCell className="text-right text-orange-300 font-mono">
                          -{formatCurrency(result.grossRevenue * 0.1)}
                        </TableCell>
                        <TableCell className="text-right text-orange-300 font-mono">
                          -{formatCurrency(result.cocAmount)} ({result.coc}%)
                        </TableCell>
                        <TableCell className="text-right text-cyan-300 font-mono">
                          {formatCurrency(result.revenuePostCOC)}
                        </TableCell>
                        <TableCell className="text-right text-emerald-400 font-mono font-bold">
                          {formatCurrency(result.yahooAmount)}
                        </TableCell>
                        <TableCell className="text-right text-pink-400 font-mono font-bold">
                          {formatCurrency(result.partnerAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={resetDemo}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Run Demo Again
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onExit}
                className="border-cyan-400/50 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30 hover:text-white"
              >
                Exit to Main App
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

