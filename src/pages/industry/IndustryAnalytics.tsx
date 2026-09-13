import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Users, Award, Sparkles } from 'lucide-react';

const applicantScoreData = [
  { range: '90-100%', count: 18, color: '#6B2737' },
  { range: '80-89%', count: 26, color: '#7F2F3F' },
  { range: '70-79%', count: 14, color: '#A45C40' },
  { range: '60-69%', count: 8, color: '#D9C9B5' },
];

const pipelineFunnelData = [
  { stage: 'Applications', count: 66 },
  { stage: 'Screened (80%+)', count: 44 },
  { stage: 'Shortlisted', count: 22 },
  { stage: 'Interview', count: 12 },
  { stage: 'Offers Made', count: 6 },
];

const skillDemandData = [
  { skill: 'Python / AI', required: 85, avgApplicant: 88 },
  { skill: 'React & TS', required: 80, avgApplicant: 82 },
  { skill: 'Cloud & K8s', required: 85, avgApplicant: 71 },
  { skill: 'SQL & DB', required: 75, avgApplicant: 79 },
  { skill: 'System Design', required: 80, avgApplicant: 67 },
];

export const IndustryAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider">
              Talent Acquisition Intelligence
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Hiring Pipeline & Skill Gap Analytics
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Data visualizations styled in custom Maroon, Rust, and Olive palettes.
            </p>
          </div>

          <div className="bg-bg-alt px-4 py-2 rounded-2xl border border-border text-xs font-semibold text-text">
            <span className="text-text-muted">Cohort:</span> 2026 Graduating Engineers
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Match Score Distribution */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-soft space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-primary-dark">
                Applicant Match Score Distribution
              </h3>
              <p className="text-xs text-text-muted">
                Cosine similarity breakdown across current applicant pool
              </p>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicantScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE3D3" />
                  <XAxis dataKey="range" stroke="#8A7A6D" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#8A7A6D" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF9',
                      borderColor: '#D9C9B5',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#6B2737" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Hiring Pipeline Funnel */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-soft space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-primary-dark">
                Recruitment Conversion Funnel
              </h3>
              <p className="text-xs text-text-muted">
                Conversion rates from initial applicant vector to finalized offer
              </p>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pipelineFunnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE3D3" />
                  <XAxis dataKey="stage" stroke="#8A7A6D" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#8A7A6D" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF9',
                      borderColor: '#D9C9B5',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#A45C40"
                    fill="#A45C40"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Required Benchmark vs Applicant Average */}
          <div className="lg:col-span-2 bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary-dark">
                  Required Competencies vs Applicant Pool Average
                </h3>
                <p className="text-xs text-text-muted">
                  Identifies key areas where student talent requires industry masterclass intervention (e.g. Cloud & System Design)
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-primary">
                  <span className="w-3 h-3 rounded-full bg-[#6B2737]" /> Required Benchmark
                </span>
                <span className="flex items-center gap-1.5 font-bold text-success">
                  <span className="w-3 h-3 rounded-full bg-[#5C7A5C]" /> Applicant Average
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillDemandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE3D3" />
                  <XAxis dataKey="skill" stroke="#8A7A6D" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#8A7A6D" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF9',
                      borderColor: '#D9C9B5',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="required" fill="#6B2737" radius={[4, 4, 0, 0]} name="Required Benchmark" />
                  <Bar dataKey="avgApplicant" fill="#5C7A5C" radius={[4, 4, 0, 0]} name="Applicant Avg" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
