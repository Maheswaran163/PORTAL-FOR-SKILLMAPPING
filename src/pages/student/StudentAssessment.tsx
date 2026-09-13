import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  BookOpen,
  Award,
  TrendingUp,
  RotateCcw,
  BrainCircuit,
  Bot,
  Check,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  TARGET_ROLE_BENCHMARKS,
  generateSkillGapReport,
  getRadarChartData,
} from '../../services/matchingService';
import { evaluateSkillsWithClaude, AIAssessmentResult } from '../../services/aiAssessmentService';
import { SkillScore } from '../../types';

interface Question {
  id: string;
  skillName: string;
  category: SkillScore['category'];
  prompt: string;
  levelOptions: { text: string; score: number }[];
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 'q-python',
    skillName: 'Python',
    category: 'Programming',
    prompt: 'How would you rate your proficiency in Python programming, OOP patterns, and async libraries?',
    levelOptions: [
      { text: 'Basic syntax, standard loops & procedural scripts', score: 40 },
      { text: 'Intermediate: functions, dictionaries, file I/O, pip packages', score: 65 },
      { text: 'Advanced: decorators, generators, type hints, FastAPI, async/await', score: 85 },
      { text: 'Expert: concurrency, memory profiling, library authoring, C-extensions', score: 95 },
    ],
  },
  {
    id: 'q-ts',
    skillName: 'React & TypeScript',
    category: 'Programming',
    prompt: 'How comfortable are you building type-safe modern frontend applications with React & TypeScript?',
    levelOptions: [
      { text: 'Beginner: basic HTML/JS and simple React components', score: 45 },
      { text: 'Intermediate: hooks, React Router, basic TypeScript types', score: 70 },
      { text: 'Advanced: generics, custom hooks, Tailwind design systems, state managers', score: 88 },
      { text: 'Expert: Next.js/Vite SSR, bundle optimization, WebAssembly, accessibility', score: 96 },
    ],
  },
  {
    id: 'q-cloud',
    skillName: 'Cloud & Kubernetes (GCP/AWS)',
    category: 'Cloud & DevOps',
    prompt: 'What is your hands-on experience deploying containerized applications and managing cloud clusters?',
    levelOptions: [
      { text: 'No cloud experience / theoretical knowledge only', score: 30 },
      { text: 'Can build Dockerfiles and deploy to basic VMs / Cloud Run', score: 60 },
      { text: 'Can configure Kubernetes (Pods, Services, Ingress) on GCP/AWS', score: 78 },
      { text: 'Certified Architect: Helm charts, CI/CD pipelines, Terraform IaC, VPC', score: 92 },
    ],
  },
  {
    id: 'q-ml',
    skillName: 'Machine Learning (PyTorch/Scikit)',
    category: 'AI & ML',
    prompt: 'How experienced are you with machine learning, vector embeddings, and Retrieval-Augmented Generation (RAG)?',
    levelOptions: [
      { text: 'Basic: Scikit-learn regression and classification', score: 50 },
      { text: 'Intermediate: PyTorch neural nets, loss functions, model training', score: 72 },
      { text: 'Advanced: Fine-tuning transformers, vector databases, RAG pipelines', score: 86 },
      { text: 'Expert: Pre-training LLMs, custom CUDA kernels, distributed training, RLHF', score: 95 },
    ],
  },
  {
    id: 'q-sql',
    skillName: 'SQL & Database Architecture',
    category: 'Programming',
    prompt: 'How well do you understand relational schema design, query optimization, and NoSQL databases?',
    levelOptions: [
      { text: 'Basic SELECT queries and simple single-table lookups', score: 45 },
      { text: 'Intermediate: joins, indexes, transactions, Firestore/MongoDB CRUD', score: 70 },
      { text: 'Advanced: EXPLAIN query plans, partition sharding, ACID isolation levels', score: 85 },
      { text: 'Expert: High-throughput distributed storage engines & consensus algorithms', score: 95 },
    ],
  },
  {
    id: 'q-sys',
    skillName: 'System Design & Distributed Systems',
    category: 'Core Engineering',
    prompt: 'What is your capability in architecting distributed systems handling high concurrency and fault tolerance?',
    levelOptions: [
      { text: 'Monolithic single-server architectures only', score: 35 },
      { text: 'Understand REST APIs, caching with Redis, reverse proxy load balancers', score: 65 },
      { text: 'Microservices, message queues (Kafka/PubSub), CAP theorem trade-offs', score: 82 },
      { text: 'Enterprise distributed systems with 99.99% SLA, Paxos/Raft consensus', score: 94 },
    ],
  },
  {
    id: 'q-comm',
    skillName: 'Technical Communication',
    category: 'Soft Skills',
    prompt: 'How effectively do you present engineering architectures, document code, and collaborate in teams?',
    levelOptions: [
      { text: 'Prefer working in isolation with minimal documentation', score: 40 },
      { text: 'Adequate: write basic READMEs and participate in agile standups', score: 65 },
      { text: 'Strong: author detailed RFC design docs, pull request reviews, team demos', score: 85 },
      { text: 'Exceptional: conference presentations, published research, cross-functional leadership', score: 95 },
    ],
  },
];

export const StudentAssessment: React.FC = () => {
  const { studentProfile, refreshUserData } = useAuth();
  const profile = studentProfile || storageService.getStudentProfiles()[0];
  const allPrograms = storageService.getLearningPrograms();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTargetRole, setSelectedTargetRole] = useState('Full-Stack AI Engineer');
  const [answers, setAnswers] = useState<Record<string, { skillName: string; category: SkillScore['category']; score: number; text: string }>>(() => {
    const initial: Record<string, { skillName: string; category: SkillScore['category']; score: number; text: string }> = {};
    profile.skills.forEach(s => {
      const q = ASSESSMENT_QUESTIONS.find(item => item.skillName.toLowerCase() === s.skillName.toLowerCase());
      if (q) {
        initial[q.id] = {
          skillName: q.skillName,
          category: q.category,
          score: s.proficiencyScore,
          text: 'Verified previous proficiency',
        };
      }
    });
    return initial;
  });

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<AIAssessmentResult | null>(null);

  const totalSteps = ASSESSMENT_QUESTIONS.length;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep];

  const handleSelectOption = (opt: { text: string; score: number }) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        skillName: currentQuestion.skillName,
        category: currentQuestion.category,
        score: opt.score,
        text: opt.text,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const finishAssessment = async () => {
    setIsEvaluating(true);

    try {
      // Call Anthropic Claude AI Assessment Engine
      const result = await evaluateSkillsWithClaude(answers, selectedTargetRole);
      setAiEvaluation(result);

      // Update student profile with AI-evaluated skill scores
      const updatedProfile = {
        ...profile,
        skills: result.evaluatedSkills,
      };

      storageService.updateStudentProfile(updatedProfile);
      refreshUserData();
      setIsCompleted(true);

      // Fire celebratory confetti
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#6B2737', '#A45C40', '#5C7A5C', '#EDE3D3'],
      });
    } catch (err) {
      console.error('Error during AI assessment evaluation:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const gapReport = isCompleted
    ? generateSkillGapReport(profile, selectedTargetRole, allPrograms)
    : null;

  const radarData = isCompleted
    ? getRadarChartData(profile.skills, selectedTargetRole)
    : [];

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <BrainCircuit className="w-3.5 h-3.5 text-accent" /> AI Diagnostic Assessment Engine
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary-dark">
            Precision Skill Mapping & Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Evaluated against 2026 enterprise benchmarks using Anthropic Claude 3.7 AI to pinpoint exact gaps and deliver verified competency scoring.
          </p>
        </div>

        {/* Evaluating Loader Overlay */}
        {isEvaluating && (
          <div className="bg-surface rounded-3xl p-12 border border-border shadow-soft-lg text-center space-y-4 animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-primary text-surface flex items-center justify-center mx-auto shadow-md">
              <Bot className="w-8 h-8 text-[#FFFDF9]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-primary-dark">
              Claude 3.7 AI is Analyzing Your Skill Vectors...
            </h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Comparing your answers against enterprise benchmarks, calculating cosine similarity indices, and formulating personalized gap recommendations.
            </p>
            <div className="w-48 h-2 bg-bg-alt rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-primary animate-pulse w-full" />
            </div>
          </div>
        )}

        {!isCompleted && !isEvaluating ? (
          /* Step-by-Step Assessment Questionnaire */
          <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-border shadow-soft-lg space-y-8">
            
            {/* Target Role Selector & Progress Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-muted block">Target Role Benchmark:</span>
                  <select
                    value={selectedTargetRole}
                    onChange={(e) => setSelectedTargetRole(e.target.value)}
                    className="mt-0.5 px-3 py-1.5 rounded-xl bg-bg-alt border border-border text-xs font-bold text-primary focus:outline-none"
                  >
                    {Object.keys(TARGET_ROLE_BENCHMARKS).map(roleKey => (
                      <option key={roleKey} value={roleKey}>
                        {roleKey}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                    {currentQuestion.category}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Question {currentStep + 1} of {totalSteps}
                  </span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-bg-alt rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  Competency Vector: {currentQuestion.skillName}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary-dark">
                  {currentQuestion.prompt}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.levelOptions.map((opt, idx) => {
                  const isSelected = answers[currentQuestion.id]?.score === opt.score;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-primary-dark font-bold shadow-sm'
                          : 'bg-bg/40 border-border hover:bg-bg-alt/70 text-text'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-primary bg-primary text-surface' : 'border-border'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      <span className="text-xs font-serif font-bold text-accent ml-2">
                        {opt.score} pts
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-5 py-2.5 rounded-xl border border-border bg-surface text-text hover:bg-bg-alt disabled:opacity-30 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-surface text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors"
              >
                <span>{currentStep === totalSteps - 1 ? 'Compute AI Diagnostic Evaluation' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : isCompleted && (
          /* AI Assessment Results View */
          <div className="space-y-8 animate-fade-in">
            
            {/* Top AI Verdict Banner */}
            <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft-lg space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <span className="px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> AI Evaluated with Claude 3.7
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
                    Verdict: {aiEvaluation?.overallReadiness || gapReport?.readinessLevel}
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    Benchmark Target: <strong>{selectedTargetRole}</strong> • Overall Alignment: <strong>{aiEvaluation?.overallMatchScore || gapReport?.overallMatchPercentage}%</strong>
                  </p>
                </div>

                <div className="bg-bg-alt px-5 py-3 rounded-2xl border border-border text-center md:text-right">
                  <span className="text-[10px] uppercase font-bold text-text-muted">AI Match Precision</span>
                  <div className="font-serif text-3xl font-bold text-primary">
                    {aiEvaluation?.overallMatchScore || gapReport?.overallMatchPercentage}%
                  </div>
                </div>
              </div>

              {/* AI Executive Summary */}
              {aiEvaluation?.executiveSummary && (
                <div className="p-4 bg-bg-alt/60 rounded-2xl border border-border/80 text-xs text-text space-y-1">
                  <p className="font-bold text-primary uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-accent" /> AI Senior Evaluator Feedback:
                  </p>
                  <p className="leading-relaxed italic">"{aiEvaluation.executiveSummary}"</p>
                </div>
              )}

              {/* Strengths & Critical Gaps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Strengths */}
                <div className="p-4 bg-success/5 rounded-2xl border border-success/30 space-y-2 text-xs">
                  <span className="font-bold text-success uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Strengths:
                  </span>
                  <ul className="space-y-1 text-text">
                    {(aiEvaluation?.strengths || ['High programming problem solving', 'Strong database schema knowledge']).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-success font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps */}
                <div className="p-4 bg-accent/5 rounded-2xl border border-accent/30 space-y-2 text-xs">
                  <span className="font-bold text-accent uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Priority Skill Gaps:
                  </span>
                  <ul className="space-y-1 text-text">
                    {(aiEvaluation?.criticalGaps || ['Cloud container orchestration (Kubernetes)', 'Production distributed system design']).map((g, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-accent font-bold">!</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Radar Visual + Detailed Gap Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Radar Chart */}
              <div className="lg:col-span-6 bg-surface p-6 rounded-3xl border border-border shadow-soft space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-primary-dark">
                    Competency Radar vs Benchmark
                  </h3>
                  <span className="text-xs font-bold text-accent">
                    {gapReport?.overallMatchPercentage}% Overall
                  </span>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#D9C9B5" />
                      <PolarAngleAxis dataKey="skill" stroke="#3A2A25" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#D9C9B5" />
                      <Radar name="Candidate" dataKey="Candidate" stroke="#6B2737" fill="#6B2737" fillOpacity={0.45} />
                      <Radar name="Benchmark" dataKey="Benchmark" stroke="#A45C40" fill="#A45C40" fillOpacity={0.15} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-6 text-xs border-t border-border pt-3">
                  <span className="flex items-center gap-1.5 font-semibold text-primary">
                    <span className="w-3 h-3 rounded-full bg-primary" /> AI Verified Score
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-accent">
                    <span className="w-3 h-3 rounded-full bg-accent" /> Role Benchmark
                  </span>
                </div>
              </div>

              {/* Gap Analysis Breakdown Table */}
              <div className="lg:col-span-6 bg-surface p-6 rounded-3xl border border-border shadow-soft space-y-4">
                <h3 className="font-serif text-lg font-bold text-primary-dark">
                  Target Role Gap Breakdown
                </h3>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {gapReport?.gapItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border ${
                        item.gap > 0
                          ? 'bg-bg border-accent/30'
                          : 'bg-success/5 border-success/30'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-text">{item.skillName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-text-muted">
                            {item.currentScore} / {item.requiredScore} req
                          </span>
                          {item.gap > 0 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/15 text-accent">
                              -{item.gap} gap
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/15 text-success">
                              Met ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {item.gap > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/60 text-[11px] text-text-muted">
                          <span className="font-semibold text-primary">Recommended Bridge: </span>
                          <span>{item.recommendedCourses[0]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Strategic Action Card */}
            <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif text-lg font-bold text-primary-dark">
                  Close Your AI-Identified Skill Gaps
                </h4>
                <p className="text-xs text-text-muted">
                  Enroll in accredited Industry Masterclasses to earn verified boost points and update your Radar chart.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCompleted(false)}
                  className="px-4 py-2.5 rounded-xl border border-border bg-bg text-text text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
                <Link
                  to="/student/learning"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-sm flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Masterclasses</span>
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
