import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Code2,
  GitBranch,
  Globe,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StudentProfile as StudentProfileType } from '../../types';

export const StudentProfile: React.FC = () => {
  const { studentProfile, refreshUserData } = useAuth();
  const initial = studentProfile || storageService.getStudentProfiles()[0];

  const [fullName, setFullName] = useState(initial.fullName);
  const [branch, setBranch] = useState(initial.branch);
  const [year, setYear] = useState(initial.year);
  const [institution, setInstitution] = useState(initial.institution);
  const [bio, setBio] = useState(initial.bio);
  const [gpa, setGpa] = useState(initial.gpa || '9.2 / 10');
  const [githubUrl, setGithubUrl] = useState(initial.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(initial.linkedinUrl || '');
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfileType = {
      ...initial,
      fullName,
      branch,
      year,
      institution,
      bio,
      gpa,
      githubUrl,
      linkedinUrl,
    };

    storageService.updateStudentProfile(updated);
    refreshUserData();

    setToastMessage('Profile updated successfully!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              Personal Identity & Academics
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Edit Student Profile
            </h1>
            <p className="text-xs text-text-muted">
              Update institutional metadata, contact credentials, and verified external repositories.
            </p>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 rounded-2xl bg-success/15 border border-success/30 text-success text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-text-muted uppercase mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs focus:outline-none focus:bg-surface"
              />
            </div>

            <div>
              <label className="block font-bold text-text-muted uppercase mb-1">Institution / University</label>
              <input
                type="text"
                required
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs focus:outline-none focus:bg-surface"
              />
            </div>

            <div>
              <label className="block font-bold text-text-muted uppercase mb-1">Degree Branch & Specialization</label>
              <input
                type="text"
                required
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs focus:outline-none focus:bg-surface"
              />
            </div>

            <div>
              <label className="block font-bold text-text-muted uppercase mb-1">Academic Year</label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs focus:outline-none focus:bg-surface"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-text-muted uppercase mb-1">Current Cumulative GPA</label>
              <input
                type="text"
                value={gpa}
                onChange={e => setGpa(e.target.value)}
                placeholder="e.g. 9.2 / 10"
                className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs focus:outline-none focus:bg-surface"
              />
            </div>

            <div>
              <label className="block font-bold text-text-muted uppercase mb-1">GitHub Profile URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full p-2.5 rounded-xl bg-bg/60 border border-border text-xs focus:outline-none focus:bg-surface"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-text-muted uppercase mb-1">Professional Bio & Career Goals</label>
            <textarea
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-3 rounded-xl bg-bg/60 border border-border text-xs focus:outline-none focus:bg-surface resize-none"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
