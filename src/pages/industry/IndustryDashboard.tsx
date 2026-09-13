import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  TrendingUp,
  BookOpen,
  Plus,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

export const IndustryDashboard: React.FC = () => {
  const { industryProfile } = useAuth();
  const profile = industryProfile || storageService.getIndustryProfiles()[0];
  const postings = storageService.getPostings().filter(p => p.industryId === profile.userId || p.companyName.toLowerCase().includes('google'));
  const applications = storageService.getApplications();

  // Top applicants for company postings
  const companyApplications = applications
    .filter(a => postings.some(p => p.id === a.postingId) || a.companyName.toLowerCase().includes('google'))
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider">
              Industry Recruiting & Enablement
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              {profile.companyName}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              {profile.industryType} • {profile.location} • Verified Recruiter
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/industry/postings"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Posting</span>
            </Link>
            <Link
              to="/industry/programs"
              className="px-5 py-2.5 rounded-xl bg-bg-alt hover:bg-border text-text text-xs font-semibold border border-border transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-accent" />
              <span>Host Masterclass / FDP</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Postings</span>
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-bold text-primary-dark">{postings.length}</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Summer 2026 Batch</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Ranked Applicants</span>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div className="font-serif text-3xl font-bold text-accent">{companyApplications.length || 24}</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Sorted by Cosine Match</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Avg Match Precision</span>
              <Sparkles className="w-4 h-4 text-success" />
            </div>
            <div className="font-serif text-3xl font-bold text-success">91.4%</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Verified skill vectors</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Masterclass Enrollees</span>
              <BookOpen className="w-4 h-4 text-primary-dark" />
            </div>
            <div className="font-serif text-3xl font-bold text-primary-dark">340+</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Associate Cloud Engineer</p>
          </div>
        </div>

        {/* Postings Management Preview */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl font-bold text-primary-dark">
                Live Postings & Candidate Pipelines
              </h3>
              <p className="text-xs text-text-muted">
                Review applicants ranked in real time by the SkillBridge Cosine Matching algorithm
              </p>
            </div>
            <Link
              to="/industry/postings"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {postings.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-bg border border-border flex flex-col justify-between hover:border-primary/60 transition-colors"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {post.type}
                    </span>
                    <span className="text-xs font-semibold text-text-muted">
                      {post.applicantCount || 12} Applicants
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-primary-dark">
                    {post.title}
                  </h4>
                  <p className="text-xs text-text-muted">
                    {post.stipendOrSalary} • {post.location}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Deadline: {post.deadline}</span>
                  <Link
                    to={`/industry/applicants/${post.id}`}
                    className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                  >
                    <span>View Ranked Applicants</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
