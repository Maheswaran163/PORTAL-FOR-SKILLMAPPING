import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Code2,
  GitBranch,
  Globe,
  Award,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Building,
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const PublicPortfolio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentProfiles = storageService.getStudentProfiles();
  const profile = studentProfiles.find(p => p.userId === id) || studentProfiles[0];

  return (
    <div className="min-h-screen bg-bg py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to SkillBridge
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold border border-success/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Public Credential
          </span>
        </div>

        {/* Portfolio Document */}
        <div className="bg-surface rounded-3xl p-8 sm:p-12 border border-border shadow-soft-lg space-y-10 text-text">
          
          {/* Header */}
          <div className="border-b border-border pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary-dark">
                {profile.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-text-muted">
                {profile.branch} • {profile.institution} ({profile.year})
              </p>
              <div className="flex flex-wrap gap-3 text-xs pt-1">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Code2 className="w-3.5 h-3.5" /> <span>GitHub</span>
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-accent hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" /> <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-bg-alt border border-border text-center sm:text-right space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted">Verified Identity</span>
              <p className="font-mono text-xs font-bold text-primary">{profile.userId}</p>
              <p className="text-[10px] text-success font-semibold">Institutional Seal Active</p>
            </div>
          </div>

          {/* About */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-primary-dark">
              Professional Summary
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Verified Skills */}
          <div className="space-y-4">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-primary-dark">
              Verified Technical Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.skills.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-bg border border-border space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text flex items-center gap-1.5">
                      {s.skillName}
                      {s.verified && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                    </span>
                    <span className="font-serif font-bold text-primary">{s.proficiencyScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-border/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${s.proficiencyScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="space-y-4">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-primary-dark">
              Verified Projects & Capstones
            </h3>
            <div className="space-y-3">
              {profile.portfolioProjects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-bg border border-border space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif text-base font-bold text-primary-dark">{proj.title}</h4>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" /> Repo
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-bg-alt border border-border font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
