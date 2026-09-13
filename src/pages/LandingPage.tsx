import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Search,
  Users,
  Compass,
  FileCheck2,
  BrainCircuit,
  ChevronRight,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ScrollAnimation } from '../components/common/ScrollAnimation';

const demoRadarData = [
  { skill: 'Python / ML', Candidate: 92, Benchmark: 85, fullMark: 100 },
  { skill: 'React & TS', Candidate: 88, Benchmark: 80, fullMark: 100 },
  { skill: 'Cloud & K8s', Candidate: 72, Benchmark: 85, fullMark: 100 },
  { skill: 'SQL & DB', Candidate: 80, Benchmark: 75, fullMark: 100 },
  { skill: 'System Design', Candidate: 68, Benchmark: 80, fullMark: 100 },
  { skill: 'Communication', Candidate: 85, Benchmark: 75, fullMark: 100 },
];

export const LandingPage: React.FC = () => {
  
  const navigate = useNavigate();
  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('student');

  const handleQuickLaunch = (role: UserRole) => {
    navigate('/login', { state: { targetRole: role } });
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-surface via-bg to-bg border-b border-border/60">
        {/* Subtle Decorative Ambient Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border shadow-soft text-xs font-semibold text-primary"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Next-Gen Academia-Industry Collaboration Platform</span>
              <span className="hidden sm:inline-block text-border">•</span>
              <span className="hidden sm:inline-flex items-center text-accent gap-1">
                <BrainCircuit className="w-3.5 h-3.5" /> Powered by Claude RAG
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-dark leading-[1.12]"
            >
              Bridging Higher Education & Enterprise Excellence
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed"
            >
              SkillBridge unites students, faculty, and industry leaders through AI-driven diagnostic skill gap mapping, verified digital portfolios, high-impact internships, and grounded RAG intelligence.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-surface font-semibold text-base shadow-soft-lg hover:shadow-glow transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Sign In to Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface hover:bg-bg-alt text-primary font-semibold text-base border-2 border-border hover:border-primary transition-all duration-200 flex items-center justify-center gap-2 shadow-soft"
              >
                <Sparkles className="w-5 h-5 text-accent" />
                <span>Register (All Roles)</span>
              </Link>

              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-text-muted hover:text-primary font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Explore Features</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Key Trust Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
            >
              <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 shadow-soft">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-primary">94.8%</div>
                <div className="text-xs text-text-muted mt-1 font-medium">Placement & Match Precision</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 shadow-soft">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-accent">500+</div>
                <div className="text-xs text-text-muted mt-1 font-medium">Enterprise & Research Postings</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 shadow-soft">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-success">15,000+</div>
                <div className="text-xs text-text-muted mt-1 font-medium">Verified Student Profiles</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface/80 border border-border/80 shadow-soft">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">&lt; 150ms</div>
                <div className="text-xs text-text-muted mt-1 font-medium">Vector Semantic RAG Speed</div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Interactive Role Pathways Explorer */}
      <section className="py-20 bg-bg-alt/50 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollAnimation>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase font-bold tracking-wider text-accent block mb-2">
                Four Connected Ecosystems
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-dark">
                Tailored Workflows for Every Stakeholder
              </h2>
              <p className="text-text-muted text-sm sm:text-base mt-3">
                Experience seamless interaction between students seeking high-growth careers, faculty spearheading research, and industry recruiters acquiring verified talent.
              </p>
            </div>
          </ScrollAnimation>

          {/* Role Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10">
            {[
              { id: 'student', label: 'For Students', icon: GraduationCap, color: 'text-primary' },
              { id: 'industry', label: 'For Industry Partners', icon: Briefcase, color: 'text-accent' },
              { id: 'academician', label: 'For Academicians & Faculty', icon: BookOpen, color: 'text-success' },
              { id: 'admin', label: 'For Institutional Admins', icon: ShieldCheck, color: 'text-primary-dark' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRoleTab(tab.id as UserRole)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeRoleTab === tab.id
                    ? 'bg-primary text-surface shadow-soft-lg scale-105'
                    : 'bg-surface text-text hover:bg-bg-alt border border-border'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeRoleTab === tab.id ? 'text-surface' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Showcase Card */}
          <ScrollAnimation>
            <div className="bg-surface rounded-3xl border border-border shadow-soft-lg p-6 sm:p-10 transition-all">
              {activeRoleTab === 'student' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      Student Roadmap
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
                      Diagnose Skill Gaps & Land Ideal Internships
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Take our diagnostic multi-step assessment to generate a verified skill vector. Compare your competencies against real job benchmarks using interactive Radar charts, enroll in industry masterclasses to boost weak areas, and generate a tamper-proof digital portfolio.
                    </p>
                    <div className="space-y-2.5 text-xs text-text">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Cosine-similarity matching with 20+ top tier tech postings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Interactive Radar Chart and personalized gap analysis report</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Export verified portfolio to high-resolution PDF with 1-click</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => handleQuickLaunch('student')}
                        className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
                      >
                        <span>Open Student Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Radar Chart Interactive Visual */}
                  <div className="lg:col-span-6 bg-bg-alt/60 p-6 rounded-2xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Live Skill Radar Demo
                      </span>
                      <span className="text-xs text-text-muted">Target: Full-Stack AI Engineer</span>
                    </div>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={demoRadarData}>
                          <PolarGrid stroke="#D9C9B5" />
                          <PolarAngleAxis dataKey="skill" stroke="#3A2A25" tick={{ fontSize: 11 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#D9C9B5" />
                          <Radar name="Candidate" dataKey="Candidate" stroke="#6B2737" fill="#6B2737" fillOpacity={0.45} />
                          <Radar name="Benchmark" dataKey="Benchmark" stroke="#A45C40" fill="#A45C40" fillOpacity={0.15} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 text-xs mt-2">
                      <span className="flex items-center gap-1.5 font-semibold text-primary">
                        <span className="w-3 h-3 rounded-full bg-primary" /> Candidate Vector
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-accent">
                        <span className="w-3 h-3 rounded-full bg-accent" /> Role Benchmark
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'industry' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider">
                      Industry Recruiting
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
                      Ranked Candidates by True Technical Competency
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Eliminate resume spam. Post internships, full-time roles, and training programs with exact skill proficiency thresholds. Our cosine matching algorithm automatically ranks applicants based on verified projects, GitHub repositories, and assessment scores.
                    </p>
                    <div className="space-y-2.5 text-xs text-text">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>One-click applicant status progression (Applied → Shortlist → Offer)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Host Industry Masterclasses and boost student readiness directly</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Sponsor Faculty Development Programs (FDPs) and research grants</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => handleQuickLaunch('industry')}
                        className="px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-surface text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
                      >
                        <span>Open Industry Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-bg-alt/60 p-6 rounded-2xl border border-border space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-xs font-bold text-primary-dark">Google Cloud Innovations</span>
                      <span className="text-xs bg-success/15 text-success font-semibold px-2 py-0.5 rounded-full">Active Hiring</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between">
                        <div>
                          <p className="font-bold text-primary-dark">Aarav Sharma (IIT Madras)</p>
                          <p className="text-[11px] text-text-muted">Applied for Generative AI Intern</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">92% Match</span>
                        </div>
                      </div>
                      <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between">
                        <div>
                          <p className="font-bold text-primary-dark">Priya Sundaram (NIT Trichy)</p>
                          <p className="text-[11px] text-text-muted">Applied for NLP Research Intern</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-full bg-success/10 text-success font-bold text-xs">96% Match</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'academician' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold uppercase tracking-wider">
                      Faculty Enablement
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
                      Curriculum Modernization & Joint Research
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Apply to national Faculty Development Programs (FDPs), industry sabbaticals, and funded consultancy projects. Access department-wide batch skill analytics to align semester syllabi with evolving technology stacks.
                    </p>
                    <div className="space-y-2.5 text-xs text-text">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Sponsored FDPs with Google Cloud & Siemens testbed access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Department batch radar analysis to identify curriculum gaps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Direct institutional consultancy retainer workflows</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => handleQuickLaunch('academician')}
                        className="px-6 py-3 rounded-xl bg-success hover:bg-success/90 text-surface text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
                      >
                        <span>Open Academician Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-bg-alt/60 p-6 rounded-2xl border border-border space-y-4">
                    <span className="text-xs font-bold text-primary-dark uppercase tracking-wider block">
                      Active Faculty Opportunities
                    </span>
                    <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-sm text-primary">National FDP on Generative AI & Cloud</h4>
                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">FDP</span>
                      </div>
                      <p className="text-xs text-text-muted">Sponsored by Google Cloud India • 500 Lab Compute Credits / Faculty</p>
                    </div>
                    <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-sm text-primary">Industrial Fellowship in Smart Manufacturing</h4>
                        <span className="text-[10px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded">Training</span>
                      </div>
                      <p className="text-xs text-text-muted">Siemens Technology Bangalore • ₹75,000 Travel & Accommodation Grant</p>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'admin' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dark/15 text-primary-dark text-xs font-bold uppercase tracking-wider">
                      Institutional Governance
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
                      Institution-Wide Analytics & Vector RAG Oversight
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Oversee student onboarding, manage recruiter trust verification, moderate open job postings, and inspect the RAG knowledge base vector embeddings.
                    </p>
                    <div className="space-y-2.5 text-xs text-text">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Unified user directory management with RBAC rules</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Content moderation queue for new postings and programs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>Vector knowledge base editor for live Claude RAG grounding</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => handleQuickLaunch('admin')}
                        className="px-6 py-3 rounded-xl bg-primary-dark hover:bg-primary-dark/90 text-surface text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
                      >
                        <span>Open Admin Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-bg-alt/60 p-6 rounded-2xl border border-border space-y-3">
                    <span className="text-xs font-bold text-primary-dark uppercase tracking-wider block">
                      Platform Health Overview
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-surface rounded-xl border border-border">
                        <p className="text-text-muted">Total Users</p>
                        <p className="font-serif text-xl font-bold text-primary">15,420</p>
                      </div>
                      <div className="p-3 bg-surface rounded-xl border border-border">
                        <p className="text-text-muted">RAG Vector Docs</p>
                        <p className="font-serif text-xl font-bold text-accent">1,280 Embeds</p>
                      </div>
                      <div className="p-3 bg-surface rounded-xl border border-border">
                        <p className="text-text-muted">Active Postings</p>
                        <p className="font-serif text-xl font-bold text-success">524 Live</p>
                      </div>
                      <div className="p-3 bg-surface rounded-xl border border-border">
                        <p className="text-text-muted">System Uptime</p>
                        <p className="font-serif text-xl font-bold text-primary-dark">99.98%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollAnimation>

        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 bg-surface border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollAnimation>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-bold tracking-wider text-accent block mb-2">
                Engineered for Impact
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-dark">
                Everything Needed for Skill-Based Hiring & Collaboration
              </h2>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BrainCircuit,
                title: 'RAG-Powered AI Copilot',
                description: 'Natural language Q&A grounded with Firestore vector embeddings. Gives cited answers for career pathways, skill gap recommendations, and faculty opportunities.',
                tag: 'AI Intelligence',
              },
              {
                icon: Compass,
                title: 'Diagnostic Skill Assessment',
                description: 'Multi-step Likert & technical domain assessments generating multi-dimensional skill vectors and interactive Radar charts.',
                tag: 'Precision Profiling',
              },
              {
                icon: TrendingUp,
                title: 'Cosine Skill Match Engine',
                description: 'Calculates true technical alignment between student candidate vectors and enterprise job requirements.',
                tag: 'Matching Algorithm',
              },
              {
                icon: FileCheck2,
                title: 'Verified Digital Portfolio',
                description: 'Tamper-proof online credentials showcasing verified skill scores, projects, certificates, and instant PDF download.',
                tag: 'Digital Credentials',
              },
              {
                icon: BookOpen,
                title: 'Industry Boost Programs',
                description: 'Co-created masterclasses with Google, Siemens, TCS, and Microsoft that directly boost student skill scores upon completion.',
                tag: 'Learning Pathways',
              },
              {
                icon: Users,
                title: 'Faculty & Research Grants',
                description: 'National FDPs, industrial training, and funded consultancy projects connecting university faculty with industry leaders.',
                tag: 'Academia Integration',
              },
            ].map((feat, idx) => (
              <ScrollAnimation key={idx} delay={idx * 0.1}>
                <div className="p-8 rounded-2xl bg-bg border border-border hover:border-primary/50 shadow-soft hover:shadow-soft-lg transition-all duration-300 group flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <feat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-bg-alt text-text-muted">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-primary-dark mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>

        </div>
      </section>

      {/* Real-time Marketplace Preview */}
      <section id="marketplace" className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-accent block mb-2">
                Live Opportunities
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-dark">
                Featured Industry Postings
              </h2>
            </div>
            <Link
              to="/student/opportunities"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
            >
              <span>View All 20+ Postings</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                company: 'Google Cloud Innovations',
                title: 'Generative AI & Cloud Architecture Intern',
                stipend: '₹95,000 / mo',
                location: 'Bengaluru, India',
                skills: ['Python (80%)', 'Cloud & K8s (75%)', 'ML PyTorch (70%)'],
                type: 'Internship',
              },
              {
                company: 'Siemens Industrial AI',
                title: 'Industrial Computer Vision & Robotics Intern',
                stipend: '₹65,000 / mo',
                location: 'Bengaluru, Hybrid',
                skills: ['Python (85%)', 'Machine Learning (80%)', 'Edge AI'],
                type: 'Internship',
              },
              {
                company: 'Tata Consultancy AI Labs',
                title: 'NLP & Foundation Models Research Intern',
                stipend: '₹55,000 / mo',
                location: 'Pune / Mumbai (Remote)',
                skills: ['Python (85%)', 'PyTorch LLMs (85%)', 'SQL (65%)'],
                type: 'Internship',
              },
            ].map((post, idx) => (
              <ScrollAnimation key={idx} delay={idx * 0.1}>
                <div className="p-6 rounded-2xl bg-surface border border-border shadow-soft flex flex-col justify-between h-full hover:border-primary transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">
                        {post.company}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {post.type}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-primary-dark mb-2">
                      {post.title}
                    </h4>
                    <p className="text-xs font-semibold text-text mb-4">
                      {post.stipend} • {post.location}
                    </p>
                    <div className="space-y-1 mb-6">
                      <p className="text-[10px] uppercase font-bold text-text-muted">Required Skills:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {post.skills.map((s, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded bg-bg-alt text-[10px] font-medium text-text border border-border">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/student/opportunities"
                    className="w-full py-2.5 rounded-xl bg-bg-alt hover:bg-primary hover:text-surface text-primary text-xs font-bold text-center transition-colors"
                  >
                    View & Apply with Skill Vector
                  </Link>
                </div>
              </ScrollAnimation>
            ))}
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-primary-dark via-primary to-primary-dark text-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-surface">
            Ready to Bridge the Skill Gap?
          </h2>
          <p className="text-sm sm:text-base text-surface/80 max-w-2xl mx-auto">
            Join thousands of students, professors, and top engineering employers collaborating on the next generation of industry readiness.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3.5 rounded-xl bg-surface hover:bg-bg text-primary font-bold text-sm shadow-lg transition-colors"
            >
              Create Free Account
            </Link>
            <button
              onClick={() => handleQuickLaunch('student')}
              className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent/90 text-surface font-bold text-sm shadow-lg transition-colors"
            >
              Explore Demo Instantly
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
