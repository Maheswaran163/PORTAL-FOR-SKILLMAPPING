import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Briefcase,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Sparkles,
  Filter,
  X,
  Send,
  ExternalLink,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { calculateJobMatchScore } from '../../services/matchingService';
import { Posting, Application } from '../../types';

export const StudentOpportunities: React.FC = () => {
  const { currentUser, studentProfile, refreshUserData } = useAuth();
  const profile = studentProfile || storageService.getStudentProfiles()[0];
  const [postings, setPostings] = useState<Posting[]>(() => storageService.getPostings());
  const [applications, setApplications] = useState<Application[]>(() =>
    storageService.getApplicationsByStudent(profile.userId)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Internship' | 'Job' | 'Apprenticeship'>('All');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedPosting, setSelectedPosting] = useState<Posting | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate match scores for all postings
  const scoredPostings = postings.map(p => ({
    ...p,
    matchScore: calculateJobMatchScore(profile.skills, p.requiredSkills),
    hasApplied: applications.some(a => a.postingId === p.id),
  }));

  // Filter
  const filteredPostings = scoredPostings.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.requiredSkills.some(s => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    const matchesRemote = !remoteOnly || p.isRemote;

    return matchesSearch && matchesType && matchesRemote;
  });

  const handleApply = (posting: Posting) => {
    setSelectedPosting(posting);
    setCoverNote(
      `Hello ${posting.companyName} Hiring Team,\n\nI am excited to submit my candidacy for the ${posting.title} role. My verified skills in ${profile.skills.slice(0, 3).map(s => s.skillName).join(', ')} match your required benchmarks closely.`
    );
  };

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosting) return;

    setIsApplying(true);

    const matchScore = calculateJobMatchScore(profile.skills, selectedPosting.requiredSkills);

    const newApp: Application = {
      id: `app-${Date.now()}`,
      studentId: profile.userId,
      studentName: profile.fullName,
      studentEmail: profile.email,
      studentBranch: profile.branch,
      studentYear: profile.year,
      studentAvatar: currentUser?.avatarUrl,
      postingId: selectedPosting.id,
      postingTitle: selectedPosting.title,
      companyName: selectedPosting.companyName,
      status: 'Applied',
      matchScore,
      appliedAt: new Date().toISOString(),
      coverNote,
      resumeUrl: profile.resumeUrl,
    };

    storageService.applyToPosting(newApp);
    setApplications(storageService.getApplicationsByStudent(profile.userId));
    setPostings(storageService.getPostings());
    refreshUserData();

    setIsApplying(false);
    setSelectedPosting(null);
    setSuccessMessage(`Application submitted successfully for ${selectedPosting.title}!`);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#6B2737', '#A45C40', '#5C7A5C'],
    });

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              Opportunities & Internships
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Explore Industry Postings
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Live internships and graduate roles ranked by your personalized Cosine Skill Match vector.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-bg-alt px-4 py-2 rounded-2xl border border-border text-xs font-semibold text-text">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Active Applications: {applications.length}</span>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 rounded-2xl bg-success/15 border border-success/30 text-success text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-surface p-4 sm:p-6 rounded-3xl border border-border shadow-soft space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role title, company, or technology (e.g. Python, GCP, ML)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface"
              />
            </div>

            {/* Type Filter */}
            <div className="md:col-span-4 flex gap-1.5 p-1 bg-bg-alt rounded-xl border border-border">
              {(['All', 'Internship', 'Job', 'Apprenticeship'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-colors capitalize ${
                    typeFilter === t ? 'bg-primary text-surface shadow-sm' : 'text-text hover:bg-surface'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Remote Checkbox */}
            <div className="md:col-span-2 flex items-center justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold text-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>Remote Only</span>
              </label>
            </div>

          </div>
        </div>

        {/* Postings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPostings.map((post) => (
            <div
              key={post.id}
              className="bg-surface rounded-3xl p-6 border border-border shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Company & Match Badge */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-bg-alt border border-border flex items-center justify-center font-serif font-bold text-primary text-sm">
                      {post.companyName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-text truncate max-w-[140px]">{post.companyName}</h4>
                      <span className="text-[10px] text-text-muted capitalize">{post.type}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      post.matchScore >= 85
                        ? 'bg-success/15 text-success border-success/30'
                        : 'bg-primary/10 text-primary border-primary/30'
                    }`}
                  >
                    {post.matchScore}% Match
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-primary-dark mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                {/* Key Attributes */}
                <div className="space-y-1.5 text-xs text-text bg-bg-alt/50 p-3 rounded-2xl border border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Compensation:</span>
                    <span className="font-bold text-primary">{post.stipendOrSalary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Location:</span>
                    <span className="font-medium text-text">{post.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Deadline:</span>
                    <span className="font-medium text-accent">{post.deadline}</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1.5">Required Competencies:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.requiredSkills.map((req, rIdx) => {
                      const studentHas = profile.skills.some(
                        s => s.skillName.toLowerCase() === req.skillName.toLowerCase() && s.proficiencyScore >= req.minScore
                      );
                      return (
                        <span
                          key={rIdx}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                            studentHas
                              ? 'bg-success/10 text-success border-success/30 font-semibold'
                              : 'bg-bg-alt text-text border-border'
                          }`}
                        >
                          {studentHas && <CheckCircle2 className="w-2.5 h-2.5 text-success" />}
                          {req.skillName} ({req.minScore}%+)
                        </span>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-border mt-6">
                {post.hasApplied ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-success/15 text-success border border-success/30 text-xs font-bold text-center flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Applied
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(post)}
                    className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Apply with Verified Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Application Submission */}
        <AnimatePresence>
          {selectedPosting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-primary-dark to-primary text-surface flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-accent">
                      {selectedPosting.companyName}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-surface">
                      {selectedPosting.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedPosting(null)}
                    className="p-1 rounded-lg text-surface/80 hover:text-surface hover:bg-surface/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Form */}
                <form onSubmit={submitApplication} className="p-6 overflow-y-auto space-y-4 flex-1">
                  
                  {/* Verified Profile Attachment Box */}
                  <div className="p-4 bg-bg-alt/70 rounded-2xl border border-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-primary">
                      <span className="flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-accent" /> Auto-Attached SkillBridge Profile
                      </span>
                      <span className="px-2 py-0.5 rounded bg-primary text-surface text-[10px]">
                        {calculateJobMatchScore(profile.skills, selectedPosting.requiredSkills)}% Match
                      </span>
                    </div>
                    <p className="text-xs text-text font-semibold">{profile.fullName} • {profile.institution}</p>
                    <p className="text-[11px] text-text-muted">{profile.branch} ({profile.year}) • GPA: {profile.gpa}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {profile.skills.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-surface border border-border font-medium">
                          {s.skillName}: {s.proficiencyScore}%
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                      Personal Statement / Cover Note
                    </label>
                    <textarea
                      rows={4}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Add any specific context about your portfolio projects, research, or availability..."
                      className="w-full p-3 rounded-xl bg-bg/50 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface resize-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPosting(null)}
                      className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-text hover:bg-bg-alt"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isApplying ? 'Submitting...' : 'Submit Application'}</span>
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
