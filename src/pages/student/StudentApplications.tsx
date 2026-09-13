import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Search,
  Building,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Application, ApplicationStatus } from '../../types';

const PIPELINE_STAGES: ApplicationStatus[] = ['Applied', 'Shortlisted', 'Interview', 'Offer'];

export const StudentApplications: React.FC = () => {
  const { studentProfile } = useAuth();
  const profile = studentProfile || storageService.getStudentProfiles()[0];
  const [applications] = useState<Application[]>(() =>
    storageService.getApplicationsByStudent(profile.userId)
  );

  const getStageIndex = (status: ApplicationStatus) => {
    if (status === 'Rejected') return -1;
    return PIPELINE_STAGES.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              Application Tracker
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              My Opportunity Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Track the live interview and offer status of your submitted internship & placement applications.
            </p>
          </div>

          <Link
            to="/student/opportunities"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 w-fit"
          >
            <Search className="w-4 h-4" />
            <span>Find More Postings</span>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="bg-surface rounded-3xl p-12 text-center border border-border shadow-soft space-y-4">
            <Briefcase className="w-12 h-12 text-text-muted mx-auto" />
            <h3 className="font-serif text-xl font-bold text-primary-dark">No Active Applications Yet</h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Browse the internship and job marketplace to apply with your auto-attached verified skill vector.
            </p>
            <Link
              to="/student/opportunities"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-surface text-xs font-bold shadow-sm"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const currentStageIdx = getStageIndex(app.status);
              const isRejected = app.status === 'Rejected';

              return (
                <div
                  key={app.id}
                  className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">
                          {app.companyName}
                        </span>
                        <span className="text-text-muted text-xs">•</span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-primary-dark">
                        {app.postingTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                        {app.matchScore}% Match Vector
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          app.status === 'Offer'
                            ? 'bg-success/15 text-success border-success/30'
                            : app.status === 'Rejected'
                            ? 'bg-error/15 text-error border-error/30'
                            : 'bg-accent/15 text-accent border-accent/30'
                        }`}
                      >
                        Status: {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual Stage Pipeline */}
                  {!isRejected ? (
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 relative">
                        {PIPELINE_STAGES.map((stage, sIdx) => {
                          const isPassed = sIdx <= currentStageIdx;
                          const isCurrent = sIdx === currentStageIdx;

                          return (
                            <div key={stage} className="text-center space-y-2">
                              {/* Step circle */}
                              <div
                                className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all ${
                                  isCurrent
                                    ? 'bg-primary text-surface ring-4 ring-primary/20 shadow-sm'
                                    : isPassed
                                    ? 'bg-success text-surface'
                                    : 'bg-bg-alt text-text-muted border border-border'
                                }`}
                              >
                                {isPassed && !isCurrent ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  sIdx + 1
                                )}
                              </div>
                              <p
                                className={`text-[11px] font-bold capitalize ${
                                  isCurrent
                                    ? 'text-primary'
                                    : isPassed
                                    ? 'text-success'
                                    : 'text-text-muted'
                                }`}
                              >
                                {stage}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-error/10 text-error text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>This application was not selected for further rounds. Check other open postings.</span>
                    </div>
                  )}

                  {/* Cover Note & Feedback */}
                  {app.coverNote && (
                    <div className="p-4 bg-bg-alt/50 rounded-2xl border border-border/60 text-xs space-y-1">
                      <p className="text-[10px] font-bold text-text-muted uppercase">Your Attached Statement:</p>
                      <p className="text-text leading-relaxed italic">"{app.coverNote}"</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
