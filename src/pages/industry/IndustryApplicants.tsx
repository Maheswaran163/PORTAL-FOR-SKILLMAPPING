import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Mail,
  FileCheck2,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Application, Posting, ApplicationStatus } from '../../types';

export const IndustryApplicants: React.FC = () => {
  const { postingId } = useParams<{ postingId: string }>();
  const postings = storageService.getPostings();
  const currentPosting = postings.find(p => p.id === postingId) || postings[0];

  const allApplications = storageService.getApplications();
  const [applications, setApplications] = useState<Application[]>(() => {
    // If applications for this posting exist, use them, otherwise mock matched applicants from students
    const existing = allApplications.filter(a => a.postingId === currentPosting.id);
    if (existing.length > 0) return existing;

    // Generate matched applicants from students
    const students = storageService.getStudentProfiles();
    return students.map((s, idx) => ({
      id: `app-mock-${idx}`,
      studentId: s.userId,
      studentName: s.fullName,
      studentEmail: s.email,
      studentBranch: s.branch,
      studentYear: s.year,
      studentAvatar: idx === 0 ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : undefined,
      postingId: currentPosting.id,
      postingTitle: currentPosting.title,
      companyName: currentPosting.companyName,
      status: (idx === 0 ? 'Interview' : idx === 1 ? 'Shortlisted' : 'Applied') as ApplicationStatus,
      matchScore: idx === 0 ? 94 : idx === 1 ? 91 : 84,
      appliedAt: '2026-02-28T10:00:00Z',
      coverNote: 'Hands-on experience in building microservices and vector databases. Eager to contribute to production environments.',
    }));
  });

  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const handleUpdateStatus = (appId: string, newStatus: ApplicationStatus) => {
    storageService.updateApplicationStatus(appId, newStatus);
    setApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: newStatus } : a))
    );
  };

  const sortedApplicants = [...applications].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            to="/industry/postings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Postings
          </Link>

          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                Ranked Applicant Review
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
                {currentPosting.title}
              </h1>
              <p className="text-xs sm:text-sm text-text-muted">
                {currentPosting.companyName} • {currentPosting.stipendOrSalary} • {currentPosting.location}
              </p>
            </div>

            <div className="bg-bg-alt px-5 py-3 rounded-2xl border border-border text-center md:text-right">
              <span className="text-[10px] uppercase font-bold text-text-muted">Total Applicants</span>
              <div className="font-serif text-2xl font-bold text-primary">
                {sortedApplicants.length} Candidates
              </div>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div className="space-y-4">
          {sortedApplicants.map((app, rankIdx) => {
            const isExpanded = expandedAppId === app.id;
            const student = storageService.getStudentProfile(app.studentId);

            return (
              <div
                key={app.id}
                className="bg-surface rounded-3xl p-6 border border-border shadow-soft space-y-4 transition-all"
              >
                {/* Main Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className="w-10 h-10 rounded-2xl bg-bg-alt border border-border flex items-center justify-center font-serif font-bold text-primary text-sm flex-shrink-0">
                      #{rankIdx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-primary-dark">
                          {app.studentName}
                        </h3>
                        <span className="text-xs text-text-muted">({app.studentBranch}, {app.studentYear})</span>
                      </div>
                      <p className="text-xs text-text-muted flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-accent" /> {app.studentEmail}
                      </p>
                    </div>
                  </div>

                  {/* Match Score & Status Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold border border-success/30 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {app.matchScore}% Match Vector
                    </span>

                    <span className="px-3 py-1 rounded-full bg-bg-alt text-text text-xs font-bold uppercase tracking-wider border border-border">
                      {app.status}
                    </span>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-border">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                        title="Shortlist"
                        className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
                          app.status === 'Shortlisted'
                            ? 'bg-accent text-surface border-accent'
                            : 'bg-bg hover:bg-bg-alt border-border text-text'
                        }`}
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Interview')}
                        title="Invite to Interview"
                        className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
                          app.status === 'Interview'
                            ? 'bg-primary text-surface border-primary'
                            : 'bg-bg hover:bg-bg-alt border-border text-text'
                        }`}
                      >
                        Interview
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Offer')}
                        title="Extend Offer"
                        className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
                          app.status === 'Offer'
                            ? 'bg-success text-surface border-success'
                            : 'bg-bg hover:bg-bg-alt border-border text-text'
                        }`}
                      >
                        Offer
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                        title="Reject"
                        className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
                          app.status === 'Rejected'
                            ? 'bg-error text-surface border-error'
                            : 'bg-bg hover:bg-bg-alt border-border text-text-muted hover:text-error'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                      className="p-2 text-text-muted hover:text-text rounded-lg"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="pt-4 border-t border-border space-y-4 animate-fade-in text-xs">
                    {app.coverNote && (
                      <div className="p-3 bg-bg rounded-xl border border-border text-text italic">
                        "{app.coverNote}"
                      </div>
                    )}

                    {student && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Skills Breakdown */}
                        <div className="space-y-2">
                          <p className="font-bold text-text-muted uppercase">Verified Skills Breakdown:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {student.skills.map((s, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded bg-bg-alt border border-border font-medium">
                                {s.skillName}: <strong>{s.proficiencyScore}%</strong>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Projects / Links */}
                        <div className="space-y-2">
                          <p className="font-bold text-text-muted uppercase">Verified Portfolio & GitHub:</p>
                          <div className="flex gap-3">
                            <Link
                              to={`/portfolio/${student.userId}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
                            >
                              <FileCheck2 className="w-4 h-4" /> View Verified Portfolio <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
