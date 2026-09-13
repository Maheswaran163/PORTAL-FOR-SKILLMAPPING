import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit,
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Posting } from '../../types';

export const IndustryPostings: React.FC = () => {
  const { industryProfile, refreshUserData } = useAuth();
  const profile = industryProfile || storageService.getIndustryProfiles()[0];
  const [postings, setPostings] = useState<Posting[]>(() => storageService.getPostings());
  const [showModal, setShowModal] = useState(false);

  // New posting state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Posting['type']>('Internship');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Bengaluru, India');
  const [isRemote, setIsRemote] = useState(false);
  const [stipendOrSalary, setStipendOrSalary] = useState('₹80,000 / month');
  const [deadline, setDeadline] = useState('2026-05-30');
  const [skillsInput, setSkillsInput] = useState('Python (80), Cloud & Kubernetes (75), SQL (70)');

  const handleCreatePosting = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSkills = skillsInput.split(',').map(item => {
      const parts = item.trim().split('(');
      const skillName = parts[0].trim();
      const minScore = parts[1] ? parseInt(parts[1].replace(/[^0-9]/g, '')) || 70 : 70;
      return { skillName, minScore };
    });

    const newPosting: Posting = {
      id: `post-${Date.now()}`,
      industryId: profile.userId,
      companyName: profile.companyName,
      type,
      title,
      description,
      requiredSkills: parsedSkills,
      location,
      isRemote,
      stipendOrSalary,
      deadline,
      createdAt: new Date().toISOString(),
      applicantCount: 0,
      status: 'active',
    };

    storageService.savePosting(newPosting);
    setPostings(storageService.getPostings());
    refreshUserData();
    setShowModal(false);

    // Reset fields
    setTitle('');
    setDescription('');
  };

  const handleDeletePosting = (id: string) => {
    if (window.confirm('Are you sure you want to delete this posting?')) {
      storageService.deletePosting(id);
      setPostings(storageService.getPostings());
      refreshUserData();
    }
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider mb-2">
              Postings Management
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Job & Internship Postings
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Define required skill proficiency benchmarks to automatically screen and rank applicants.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Role</span>
          </button>
        </div>

        {/* Postings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postings.map((post) => (
            <div
              key={post.id}
              className="bg-surface rounded-3xl p-6 border border-border shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {post.type}
                  </span>
                  <button
                    onClick={() => handleDeletePosting(post.id)}
                    className="text-text-muted hover:text-error p-1 rounded transition-colors"
                    title="Delete Posting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-primary-dark mb-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="p-3 bg-bg-alt/60 rounded-2xl border border-border/60 text-xs text-text space-y-1">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Compensation:</span>
                    <span className="font-bold text-primary">{post.stipendOrSalary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Location:</span>
                    <span className="font-medium">{post.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Deadline:</span>
                    <span className="font-medium text-accent">{post.deadline}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Benchmark Vector:</p>
                  <div className="flex flex-wrap gap-1">
                    {post.requiredSkills.map((req, rIdx) => (
                      <span key={rIdx} className="text-[10px] px-2 py-0.5 rounded bg-bg text-text border border-border">
                        {req.skillName} ({req.minScore}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-border mt-5 flex items-center justify-between">
                <span className="text-xs text-text-muted flex items-center gap-1 font-semibold">
                  <Users className="w-3.5 h-3.5 text-accent" /> {post.applicantCount || 0} Applicants
                </span>
                <Link
                  to={`/industry/applicants/${post.id}`}
                  className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Review Candidates</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Create Posting */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/40 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 bg-gradient-to-r from-primary-dark to-primary text-surface flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold">Post New Opportunity</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-surface/80 hover:text-surface hover:bg-surface/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePosting} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Distributed Systems & AI Research Intern"
                    className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Type</label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:bg-surface"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Job">Full-Time Job</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Compensation</label>
                    <input
                      type="text"
                      required
                      value={stipendOrSalary}
                      onChange={e => setStipendOrSalary(e.target.value)}
                      placeholder="e.g. ₹85,000 / month"
                      className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:bg-surface"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-1">Description & Scope</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe key responsibilities and technologies..."
                    className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:bg-surface resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                    Required Skills & Min Scores (Comma Separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={skillsInput}
                    onChange={e => setSkillsInput(e.target.value)}
                    placeholder="e.g. Python (80), Cloud & Kubernetes (75), SQL (70)"
                    className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:bg-surface"
                  />
                  <p className="text-[10px] text-text-muted mt-1">
                    Format: SkillName (MinScore), SkillName (MinScore)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:bg-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Deadline</label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:bg-surface"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-text hover:bg-bg-alt"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-sm transition-colors"
                  >
                    Publish Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
