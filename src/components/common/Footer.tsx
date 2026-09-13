import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border/80 pt-14 pb-10 text-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-surface shadow-sm">
                <GraduationCap className="w-5 h-5 text-[#FFFDF9]" />
              </div>
              <span className="font-serif text-2xl font-bold text-primary-dark">
                SkillBridge
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-sm">
              Unified Academia-Industry Collaboration Platform bridging educational curricula with enterprise competency demands through diagnostic AI skill mapping, verified digital portfolios, and grounded RAG knowledge intelligence.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/30">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                RAG Engine Online • Anthropic Claude 3.7
              </span>
            </div>
          </div>

          {/* Student Hub */}
          <div>
            <h4 className="font-serif text-sm font-bold text-primary-dark uppercase tracking-wider mb-4">
              Student Hub
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/student/assessment" className="text-text-muted hover:text-primary transition-colors">
                  Diagnostic Skill Assessment
                </Link>
              </li>
              <li>
                <Link to="/student/opportunities" className="text-text-muted hover:text-primary transition-colors">
                  Internships & Job Matching
                </Link>
              </li>
              <li>
                <Link to="/student/learning" className="text-text-muted hover:text-primary transition-colors">
                  Industry Masterclasses & Boosters
                </Link>
              </li>
              <li>
                <Link to="/student/portfolio" className="text-text-muted hover:text-primary transition-colors">
                  Verified Digital Portfolio & PDF
                </Link>
              </li>
              <li>
                <Link to="/portfolio/user-stu-1" className="text-text-muted hover:text-primary transition-colors">
                  Public Verified Portfolio Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Industry & Faculty */}
          <div>
            <h4 className="font-serif text-sm font-bold text-primary-dark uppercase tracking-wider mb-4">
              Partners & Faculty
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/industry/postings" className="text-text-muted hover:text-primary transition-colors">
                  Post Internships & Roles
                </Link>
              </li>
              <li>
                <Link to="/industry/programs" className="text-text-muted hover:text-primary transition-colors">
                  Host Industry Learning Programs
                </Link>
              </li>
              <li>
                <Link to="/academician/opportunities" className="text-text-muted hover:text-primary transition-colors">
                  National Faculty FDPs
                </Link>
              </li>
              <li>
                <Link to="/academician/analytics" className="text-text-muted hover:text-primary transition-colors">
                  Institutional Batch Gap Analytics
                </Link>
              </li>
              <li>
                <Link to="/admin/knowledge-base" className="text-text-muted hover:text-primary transition-colors">
                  Knowledge Base & Vectors
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech & AI Highlights */}
          <div>
            <h4 className="font-serif text-sm font-bold text-primary-dark uppercase tracking-wider mb-4">
              AI Engine & Standards
            </h4>
            <ul className="space-y-2.5 text-xs text-text-muted">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Vector Semantic Retrieval
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" /> Cosine Match Matrix
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-success" /> AICTE & NASSCOM Aligned
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-success" /> Tamper-Proof Badges
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© 2026 SkillBridge Platform. Engineered for Academia-Industry Integration.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> in Beige & Maroon
          </p>
        </div>
      </div>
    </footer>
  );
};
