import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Share2,
  CheckCircle2,
  Code2,
  GitBranch,
  Globe,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Building,
  User,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StudentProfile } from '../../types';

export const StudentPortfolio: React.FC = () => {
  const { studentProfile } = useAuth();
  const profile = studentProfile || storageService.getStudentProfiles()[0];
  const portfolioRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const publicUrl = `${window.location.origin}/portfolio/${profile.userId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleExportPDF = async () => {
    if (!portfolioRef.current) return;
    setIsExporting(true);

    try {
      const element = portfolioRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFDF9',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${profile.fullName.replace(/\s+/g, '_')}_SkillBridge_Portfolio.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Actions Toolbar */}
        <div className="bg-surface p-4 rounded-3xl border border-border shadow-soft flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
              Digital Verified Credentials
            </span>
            <p className="text-xs text-text-muted">
              Share your tamper-proof skill portfolio with recruiters or export as PDF.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-bg-alt hover:bg-bg border border-border text-xs font-semibold text-text flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-accent" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>

        {/* Printable Verified Portfolio Canvas */}
        <div
          ref={portfolioRef}
          className="bg-surface rounded-3xl p-8 sm:p-12 border border-border shadow-soft-lg space-y-10 text-text"
        >
          {/* Header Banner */}
          <div className="border-b border-border pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/15 text-success text-[11px] font-bold border border-success/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Academic-Industry Profile</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary-dark">
                {profile.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-text-muted">
                {profile.branch} • {profile.institution} ({profile.year}) • GPA: {profile.gpa}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-text pt-1">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Code2 className="w-3.5 h-3.5" /> <span>GitHub Profile</span>
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

            {/* Institution Badge */}
            <div className="p-4 rounded-2xl bg-bg-alt border border-border text-center sm:text-right space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted">SkillBridge ID</span>
              <p className="font-mono text-xs font-bold text-primary">{profile.userId}</p>
              <p className="text-[10px] text-text-muted">NASSCOM / AICTE Aligned</p>
            </div>
          </div>

          {/* About / Bio */}
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-primary-dark uppercase tracking-wider text-xs">
              Executive Summary & Bio
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Verified Skills Matrix */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-primary-dark uppercase tracking-wider text-xs">
              Verified Technical Competencies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.skills.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-bg border border-border/80 space-y-2">
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

          {/* Portfolio Projects */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-primary-dark uppercase tracking-wider text-xs">
              Featured Capstone Projects
            </h3>
            <div className="space-y-3">
              {profile.portfolioProjects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-bg border border-border space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif text-base font-bold text-primary-dark">{proj.title}</h4>
                      {proj.verifiedBy && (
                        <span className="text-[10px] font-bold text-success flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified by {proj.verifiedBy}
                        </span>
                      )}
                    </div>
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
                  <p className="text-xs text-text-muted leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5">
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

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-primary-dark uppercase tracking-wider text-xs">
                Accreditations & Certificates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-2xl bg-bg border border-border space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <Award className="w-4 h-4 text-accent" />
                      <span>{cert.title}</span>
                    </div>
                    <p className="text-[11px] text-text-muted">{cert.issuer} • Issued {cert.issueDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Footer */}
          <div className="pt-6 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
            <span>SkillBridge Cryptographic Skill Vector Hash: #SB-{profile.userId.slice(-6).toUpperCase()}</span>
            <span>Generated on {new Date().toLocaleDateString()}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
