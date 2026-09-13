import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Users,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

export const AcademicianDashboard: React.FC = () => {
  const { academicianProfile } = useAuth();
  const profile = academicianProfile || storageService.getAcademicianProfiles()[0];
  const opps = storageService.getAcademicOpportunities();

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold uppercase tracking-wider">
              Faculty & Institutional Portal
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              {profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              {profile.designation} • {profile.department} • {profile.institution}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/academician/opportunities"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Explore FDPs & Grants</span>
            </Link>
            <Link
              to="/academician/analytics"
              className="px-5 py-2.5 rounded-xl bg-bg-alt hover:bg-border text-text text-xs font-semibold border border-border transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Dept Gap Analytics</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Open FDPs</span>
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-bold text-primary-dark">{opps.length}</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Google, Siemens, TCS</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Batch Readiness</span>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div className="font-serif text-3xl font-bold text-accent">87.2%</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">CSE 2026 Cohort</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Lab Credits Grant</span>
              <Sparkles className="w-4 h-4 text-success" />
            </div>
            <div className="font-serif text-3xl font-bold text-success">500 GCP</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Allocated for labs</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Consultancies</span>
              <Award className="w-4 h-4 text-primary-dark" />
            </div>
            <div className="font-serif text-3xl font-bold text-primary-dark">2 Open</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Industry retainers</p>
          </div>
        </div>

        {/* Featured Opportunities Preview */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl font-bold text-primary-dark">
                National Faculty Opportunities & Grants
              </h3>
              <p className="text-xs text-text-muted">
                Sponsored by top industry R&D organizations to align academia with production tech
              </p>
            </div>
            <Link
              to="/academician/opportunities"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opps.slice(0, 4).map(opp => (
              <div
                key={opp.id}
                className="p-5 rounded-2xl bg-bg border border-border flex flex-col justify-between hover:border-primary/60 transition-colors"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">
                      {opp.companyOrOrg}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-bold">
                      {opp.type}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-primary-dark">
                    {opp.title}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-primary font-bold">
                    {opp.honorariumOrGrant || 'Sponsored'}
                  </span>
                  <Link
                    to="/academician/opportunities"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View Details →
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
