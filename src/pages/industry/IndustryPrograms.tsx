import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Zap,
  Users,
  Award,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { LearningProgram, AcademicOpportunity } from '../../types';

export const IndustryPrograms: React.FC = () => {
  const { industryProfile, refreshUserData } = useAuth();
  const profile = industryProfile || storageService.getIndustryProfiles()[0];
  const [programs, setPrograms] = useState<LearningProgram[]>(() => storageService.getLearningPrograms());
  const [academicOpps, setAcademicOpps] = useState<AcademicOpportunity[]>(() =>
    storageService.getAcademicOpportunities()
  );

  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showFDPModal, setShowFDPModal] = useState(false);

  // New Program State
  const [progTitle, setProgTitle] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [progTargetSkill, setProgTargetSkill] = useState('Cloud & Kubernetes (GCP/AWS)');
  const [progBoostScore, setProgBoostScore] = useState(15);
  const [progDuration, setProgDuration] = useState('4 Weeks (20 Hours)');
  const [progInstructor, setProgInstructor] = useState('Senior Staff Architect @ Industry');

  // New FDP State
  const [fdpTitle, setFdpTitle] = useState('');
  const [fdpDesc, setFdpDesc] = useState('');
  const [fdpDomain, setFdpDomain] = useState('Cloud Computing & AI');
  const [fdpDuration, setFdpDuration] = useState('5 Days (Virtual Labs)');
  const [fdpHonorarium, setFdpHonorarium] = useState('500 Cloud Credits / Faculty');

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const newProg: LearningProgram = {
      id: `prog-${Date.now()}`,
      industryId: profile.userId,
      companyName: profile.companyName,
      title: progTitle,
      description: progDesc,
      skillsCovered: [progTargetSkill, 'Applied Engineering', 'Industry Standards'],
      targetSkill: progTargetSkill,
      skillBoostScore: progBoostScore,
      duration: progDuration,
      mode: 'Self-Paced',
      level: 'Intermediate',
      enrolledCount: 0,
      instructor: progInstructor,
      link: 'https://skillbridge.edu/masterclass',
      syllabus: ['Core Foundations', 'Practical Architecture', 'Capstone Project'],
    };

    storageService.saveLearningProgram(newProg);
    setPrograms(storageService.getLearningPrograms());
    refreshUserData();
    setShowProgramModal(false);
  };

  const handleCreateFDP = (e: React.FormEvent) => {
    e.preventDefault();
    const newOpp: AcademicOpportunity = {
      id: `acad-opp-${Date.now()}`,
      postedById: profile.userId,
      postedByName: profile.companyName,
      companyOrOrg: profile.companyName,
      type: 'FDP',
      title: fdpTitle,
      description: fdpDesc,
      domain: fdpDomain,
      duration: fdpDuration,
      location: 'Virtual / Online',
      isVirtual: true,
      honorariumOrGrant: fdpHonorarium,
      eligibility: 'Computer Science, IT, and AI Faculty',
      deadline: '2026-05-30',
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    storageService.saveAcademicOpportunity(newOpp);
    setAcademicOpps(storageService.getAcademicOpportunities());
    refreshUserData();
    setShowFDPModal(false);
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider">
              Talent Enablement
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Industry Masterclasses & Faculty FDPs
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Sponsor learning bootcamps that directly upgrade student skill vectors or host national Faculty Development Programs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowProgramModal(true)}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Host Masterclass</span>
            </button>
            <button
              onClick={() => setShowFDPModal(true)}
              className="px-5 py-2.5 rounded-xl bg-bg-alt hover:bg-border text-text text-xs font-semibold border border-border transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-accent" />
              <span>Post Faculty FDP</span>
            </button>
          </div>
        </div>

        {/* Programs List */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary-dark">
            Active Student Masterclasses ({programs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map(prog => (
              <div
                key={prog.id}
                className="bg-surface rounded-3xl p-6 border border-border shadow-soft space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                      {prog.companyName}
                    </span>
                    <h3 className="font-serif text-base font-bold text-primary-dark mt-1">
                      {prog.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> +{prog.skillBoostScore} Pts
                  </span>
                </div>

                <p className="text-xs text-text-muted">{prog.description}</p>

                <div className="p-3 bg-bg-alt/50 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Target Skill:</span>
                    <span className="font-bold text-primary">{prog.targetSkill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Enrolled Students:</span>
                    <span className="font-bold text-text">{prog.enrolledCount} Learners</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Create Masterclass */}
        {showProgramModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/40 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="font-serif text-lg font-bold text-primary-dark">Host Industry Masterclass</h3>
                <button onClick={() => setShowProgramModal(false)}><X className="w-5 h-5 text-text-muted" /></button>
              </div>

              <form onSubmit={handleCreateProgram} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={progTitle}
                    onChange={e => setProgTitle(e.target.value)}
                    placeholder="e.g. Production Generative AI on Vertex AI"
                    className="w-full p-2.5 rounded-xl bg-bg/60 border border-border"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Target Skill & Boost</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={progTargetSkill}
                      onChange={e => setProgTargetSkill(e.target.value)}
                      placeholder="Target Skill"
                      className="w-full p-2.5 rounded-xl bg-bg/60 border border-border"
                    />
                    <input
                      type="number"
                      required
                      value={progBoostScore}
                      onChange={e => setProgBoostScore(parseInt(e.target.value) || 10)}
                      placeholder="Boost (+15)"
                      className="w-full p-2.5 rounded-xl bg-bg/60 border border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={progDesc}
                    onChange={e => setProgDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-bg/60 border border-border resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProgramModal(false)}
                    className="px-4 py-2 rounded-xl border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-surface font-bold"
                  >
                    Publish Masterclass
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
