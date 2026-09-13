import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Sparkles,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

export const AdminDashboard: React.FC = () => {
  const users = storageService.getUsers();
  const postings = storageService.getPostings();
  const kb = storageService.getKnowledgeBase();

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dark/15 text-primary-dark text-xs font-bold uppercase tracking-wider">
              National Institutional Governance
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              SkillBridge Administration Center
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Oversee platform security rules, user verifications, content moderation, and RAG vector intelligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/users"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>User Directory</span>
            </Link>
            <Link
              to="/admin/knowledge-base"
              className="px-5 py-2.5 rounded-xl bg-bg-alt hover:bg-border text-text text-xs font-semibold border border-border transition-colors flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-accent" />
              <span>Manage RAG Vectors</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-bold text-primary-dark">15,420</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">{users.length} Active in current session</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Postings</span>
              <Briefcase className="w-4 h-4 text-accent" />
            </div>
            <div className="font-serif text-3xl font-bold text-accent">{postings.length}</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">All approved & verified</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">RAG Knowledge Docs</span>
              <Database className="w-4 h-4 text-success" />
            </div>
            <div className="font-serif text-3xl font-bold text-success">{kb.length}</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Pre-computed dense vectors</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">AI Retrieval SLA</span>
              <Sparkles className="w-4 h-4 text-primary-dark" />
            </div>
            <div className="font-serif text-3xl font-bold text-primary-dark">99.98%</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Claude 3.7 Sonnet RAG active</p>
          </div>
        </div>

        {/* Action Shortcuts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/users"
            className="p-6 rounded-3xl bg-surface border border-border shadow-soft hover:shadow-soft-lg hover:border-primary transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary-dark">User Management</h3>
              <p className="text-xs text-text-muted">
                Audit registered students, academician departments, and industry partner verification requests.
              </p>
            </div>
            <span className="text-xs font-bold text-primary flex items-center gap-1 mt-4">
              Open Directory <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/moderation"
            className="p-6 rounded-3xl bg-surface border border-border shadow-soft hover:shadow-soft-lg hover:border-primary transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary-dark">Content Moderation Queue</h3>
              <p className="text-xs text-text-muted">
                Review newly published internships, full-time listings, and industrial training bootcamps.
              </p>
            </div>
            <span className="text-xs font-bold text-accent flex items-center gap-1 mt-4">
              Review Queue <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/knowledge-base"
            className="p-6 rounded-3xl bg-surface border border-border shadow-soft hover:shadow-soft-lg hover:border-primary transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-success/15 text-success flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary-dark">RAG Vector Knowledge Base</h3>
              <p className="text-xs text-text-muted">
                Update skill guidance articles, inspect vector embeddings, and test top-k semantic retrieval precision.
              </p>
            </div>
            <span className="text-xs font-bold text-success flex items-center gap-1 mt-4">
              Manage Vectors <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
};
