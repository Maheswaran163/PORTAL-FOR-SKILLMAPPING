import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, Award, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

const deptBatchRadarData = [
  { skill: 'Python / ML', BatchAverage: 86, IndustryTarget: 85, fullMark: 100 },
  { skill: 'React & TS', BatchAverage: 81, IndustryTarget: 80, fullMark: 100 },
  { skill: 'Cloud & K8s', BatchAverage: 62, IndustryTarget: 85, fullMark: 100 },
  { skill: 'SQL & DB', BatchAverage: 78, IndustryTarget: 75, fullMark: 100 },
  { skill: 'System Design', BatchAverage: 58, IndustryTarget: 80, fullMark: 100 },
  { skill: 'Communication', BatchAverage: 82, IndustryTarget: 75, fullMark: 100 },
];

const departmentComparisonData = [
  { dept: 'Computer Science', readiness: 88, enrollees: 120 },
  { dept: 'AI & Data Science', readiness: 92, enrollees: 85 },
  { dept: 'Information Tech', readiness: 84, enrollees: 95 },
  { dept: 'Electronics (ECE)', readiness: 76, enrollees: 60 },
];

export const AcademicianAnalytics: React.FC = () => {
  const { academicianProfile } = useAuth();
  const profile = academicianProfile || storageService.getAcademicianProfiles()[0];

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold uppercase tracking-wider">
              Institutional Curriculum Sync
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Department Batch Skill-Gap Analytics
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Analyze undergraduate batch proficiencies against enterprise hiring benchmarks to update laboratory syllabi.
            </p>
          </div>

          <div className="bg-bg-alt px-4 py-2 rounded-2xl border border-border text-xs font-semibold text-text">
            <span className="text-text-muted">Target Cohort:</span> {profile.institution} (2026 Batch)
          </div>
        </div>

        {/* Radar & Batch Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Radar Chart */}
          <div className="lg:col-span-6 bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-soft space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-primary-dark">
                Batch Average Vector vs Industry Requirement
              </h3>
              <p className="text-xs text-text-muted">
                Highlighted gaps in Cloud Computing (-23%) and System Design (-22%)
              </p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={deptBatchRadarData}>
                  <PolarGrid stroke="#D9C9B5" />
                  <PolarAngleAxis dataKey="skill" stroke="#3A2A25" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#D9C9B5" />
                  <Radar name="Batch Average" dataKey="BatchAverage" stroke="#5C7A5C" fill="#5C7A5C" fillOpacity={0.4} />
                  <Radar name="Industry Target" dataKey="IndustryTarget" stroke="#6B2737" fill="#6B2737" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 text-xs border-t border-border pt-3">
              <span className="flex items-center gap-1.5 font-semibold text-success">
                <span className="w-3 h-3 rounded-full bg-[#5C7A5C]" /> CSE Batch Average (62-86%)
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                <span className="w-3 h-3 rounded-full bg-[#6B2737]" /> Enterprise Requirement (75-85%)
              </span>
            </div>
          </div>

          {/* Department Placement Readiness Comparison */}
          <div className="lg:col-span-6 bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-soft space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-primary-dark">
                Inter-Department Readiness Comparison
              </h3>
              <p className="text-xs text-text-muted">
                Placement readiness percentage across college branches
              </p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE3D3" />
                  <XAxis dataKey="dept" stroke="#8A7A6D" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} stroke="#8A7A6D" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF9',
                      borderColor: '#D9C9B5',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="readiness" fill="#6B2737" radius={[6, 6, 0, 0]} name="Readiness %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* AICTE / NASSCOM Curriculum Synchronization Directives */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Automated AI Recommendations for Department Syllabus</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-bg rounded-2xl border border-border space-y-1.5">
              <span className="font-bold text-primary block">1. Incorporate Kubernetes in Cloud Lab</span>
              <p className="text-text-muted">
                Replace theoretical cloud virtualization chapters with hands-on container orchestration using the sponsored Google Cloud credits.
              </p>
            </div>

            <div className="p-4 bg-bg rounded-2xl border border-border space-y-1.5">
              <span className="font-bold text-accent block">2. Introduce RAG & Vector Search in AI Elective</span>
              <p className="text-text-muted">
                Supplement basic NLP with embeddings, vector databases, and Anthropic Claude prompt engineering assignments.
              </p>
            </div>

            <div className="p-4 bg-bg rounded-2xl border border-border space-y-1.5">
              <span className="font-bold text-success block">3. Sponsor Faculty Sabbatical at Siemens</span>
              <p className="text-text-muted">
                Nominate 2 faculty members for the Siemens Industrial Automation Fellowship to establish an on-campus digital twin testbed.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
