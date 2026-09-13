import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Building,
  Calendar,
  MapPin,
  CheckCircle2,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { AcademicOpportunity, AcademicApplication } from '../../types';

export const AcademicianOpportunities: React.FC = () => {
  const { academicianProfile, refreshUserData } = useAuth();
  const profile = academicianProfile || storageService.getAcademicianProfiles()[0];
  const opps = storageService.getAcademicOpportunities();
  const [selectedOpp, setSelectedOpp] = useState<AcademicOpportunity | null>(null);
  const [proposalNote, setProposalNote] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleApply = (opp: AcademicOpportunity) => {
    setSelectedOpp(opp);
    setProposalNote(
      `Respected Selection Committee,\n\nI am submitting an institutional expression of interest on behalf of ${profile.institution} for the "${opp.title}". Our department research lab has strong competencies in ${profile.researchAreas.join(', ')}.`
    );
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;

    const newApp: AcademicApplication = {
      id: `acad-app-${Date.now()}`,
      academicianId: profile.userId,
      academicianName: profile.fullName,
      academicianDept: profile.department,
      opportunityId: selectedOpp.id,
      opportunityTitle: selectedOpp.title,
      companyOrOrg: selectedOpp.companyOrOrg,
      status: 'Submitted',
      appliedAt: new Date().toISOString(),
      proposalNote,
    };

    storageService.applyToAcademicOpportunity(newApp);
    refreshUserData();
    setSelectedOpp(null);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#5C7A5C', '#6B2737', '#A45C40'],
    });

    setToastMessage(`Expression of interest submitted for "${selectedOpp.title}"!`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold uppercase tracking-wider">
              Faculty Development & Sabbaticals
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Faculty Enablement & Research Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              National FDPs, funded industrial training, research retainers, and lab compute grants.
            </p>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 rounded-2xl bg-success/15 border border-success/30 text-success text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opps.map(opp => (
            <div
              key={opp.id}
              className="bg-surface rounded-3xl p-6 sm:p-7 border border-border shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                      {opp.companyOrOrg}
                    </span>
                    <span className="text-[11px] text-text-muted">Domain: {opp.domain}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold border border-success/30">
                    {opp.type}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-primary-dark mb-2">
                    {opp.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="p-3.5 bg-bg-alt/60 rounded-2xl border border-border/60 text-xs text-text space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Grant / Honorarium:</span>
                    <span className="font-bold text-primary">{opp.honorariumOrGrant || 'Sponsored'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Duration:</span>
                    <span className="font-medium">{opp.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Eligibility:</span>
                    <span className="font-medium text-text-muted">{opp.eligibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Deadline:</span>
                    <span className="font-bold text-accent">{opp.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-6">
                <button
                  onClick={() => handleApply(opp)}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Submit Institutional Application</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Application Submission */}
        {selectedOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/40 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-bold text-accent uppercase">{selectedOpp.companyOrOrg}</span>
                  <h3 className="font-serif text-lg font-bold text-primary-dark">{selectedOpp.title}</h3>
                </div>
                <button onClick={() => setSelectedOpp(null)}><X className="w-5 h-5 text-text-muted" /></button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                <div className="p-3.5 bg-bg-alt/70 rounded-2xl border border-border space-y-1">
                  <p className="font-bold text-primary">{profile.fullName} ({profile.designation})</p>
                  <p className="text-text-muted">{profile.department} • {profile.institution}</p>
                </div>

                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">
                    Proposal Statement / Institutional Objectives
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={proposalNote}
                    onChange={e => setProposalNote(e.target.value)}
                    className="w-full p-3 rounded-xl bg-bg/50 border border-border resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="px-4 py-2 rounded-xl border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-surface font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Application</span>
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
