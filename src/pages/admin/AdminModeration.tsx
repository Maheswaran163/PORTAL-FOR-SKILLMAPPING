import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  Briefcase,
  Check,
  X,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Posting } from '../../types';

export const AdminModeration: React.FC = () => {
  const [postings, setPostings] = useState<Posting[]>(() => storageService.getPostings());
  const [toastMessage, setToastMessage] = useState('');

  const handleApprove = (id: string, title: string) => {
    setToastMessage(`Posting "${title}" marked as Approved and Verified.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleFlag = (id: string, title: string) => {
    setToastMessage(`Posting "${title}" flagged for verification review.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dark/15 text-primary-dark text-xs font-bold uppercase tracking-wider mb-2">
              Content Integrity
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Postings Moderation Queue
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Verify recruiter authenticity and validate skill proficiency benchmarks for incoming postings.
            </p>
          </div>

          <div className="bg-bg-alt px-4 py-2 rounded-2xl border border-border text-xs font-semibold text-text">
            Queue: <strong>{postings.length} Postings</strong>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 rounded-2xl bg-success/15 border border-success/30 text-success text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Postings Queue List */}
        <div className="space-y-4">
          {postings.map(post => (
            <div
              key={post.id}
              className="bg-surface rounded-3xl p-6 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">
                    {post.companyName}
                  </span>
                  <span className="text-text-muted text-xs">•</span>
                  <span className="px-2 py-0.5 rounded bg-bg-alt text-primary text-[10px] font-bold">
                    {post.type}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-primary-dark">
                  {post.title}
                </h3>
                <p className="text-xs text-text-muted line-clamp-2">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.requiredSkills.map((req, rIdx) => (
                    <span key={rIdx} className="text-[10px] px-2 py-0.5 rounded bg-bg border border-border">
                      {req.skillName} ({req.minScore}%)
                    </span>
                  ))}
                </div>
              </div>

              {/* Moderation Action Buttons */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  onClick={() => handleApprove(post.id, post.title)}
                  className="px-4 py-2 rounded-xl bg-success text-surface text-xs font-bold shadow-sm hover:bg-success/90 flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => handleFlag(post.id, post.title)}
                  className="px-4 py-2 rounded-xl bg-bg-alt hover:bg-error/10 hover:text-error text-text text-xs font-bold border border-border flex items-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" /> Flag
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
