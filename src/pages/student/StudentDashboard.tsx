import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Briefcase,
  BookOpen,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileCheck2,
  Compass,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { getRadarChartData, calculateJobMatchScore } from '../../services/matchingService';
import { ScrollAnimation } from '../../components/common/ScrollAnimation';

export const StudentDashboard: React.FC = () => {
  const { currentUser, studentProfile } = useAuth();
  const profile = studentProfile || storageService.getStudentProfiles()[0];
  const postings = storageService.getPostings();
  const applications = storageService.getApplicationsByStudent(profile.userId);
  const enrollments = storageService.getEnrollmentsByStudent(profile.userId);

  // Compute matched postings sorted by score
  const matchedPostings = postings
    .map(p => ({
      ...p,
      matchScore: calculateJobMatchScore(profile.skills, p.requiredSkills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  const radarData = getRadarChartData(profile.skills, 'Full-Stack AI Engineer');

  const avgSkillScore = Math.round(
    profile.skills.reduce((acc, s) => acc + s.proficiencyScore, 0) / (profile.skills.length || 1)
  );

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              Student Dashboard
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Welcome back, {profile.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              {profile.branch} • {profile.institution} • {profile.year}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/student/assessment"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Retake Diagnostic Assessment</span>
            </Link>
            <Link
              to="/student/portfolio"
              className="px-5 py-2.5 rounded-xl bg-bg-alt hover:bg-border text-text text-xs font-semibold border border-border transition-colors flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-accent" />
              <span>View Digital Portfolio</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Skill Index</span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-bold text-primary-dark">{avgSkillScore}%</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">{profile.skills.length} verified competencies</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Apps</span>
              <Briefcase className="w-4 h-4 text-accent" />
            </div>
            <div className="font-serif text-3xl font-bold text-accent">{applications.length}</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">1 in Interview stage</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Boost Programs</span>
              <BookOpen className="w-4 h-4 text-success" />
            </div>
            <div className="font-serif text-3xl font-bold text-success">{enrollments.length}</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">+15 point cloud boost active</p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border shadow-soft">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Target Match</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-bold text-primary-dark">92%</div>
            <p className="text-[11px] text-text-muted mt-1 font-medium">Full-Stack AI Engineer</p>
          </div>
        </div>

        {/* Middle Section: Radar Chart & Skills Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Radar Chart */}
          <div className="lg:col-span-6 bg-surface p-6 rounded-3xl border border-border shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-primary-dark">
                  Skill Competency Radar
                </h3>
                <p className="text-xs text-text-muted">
                  Candidate profile vs Full-Stack AI Engineer benchmark
                </p>
              </div>
              <Link
                to="/student/assessment"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#D9C9B5" />
                  <PolarAngleAxis dataKey="skill" stroke="#3A2A25" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#D9C9B5" />
                  <Radar name="Candidate" dataKey="Candidate" stroke="#6B2737" fill="#6B2737" fillOpacity={0.45} />
                  <Radar name="Benchmark" dataKey="Benchmark" stroke="#A45C40" fill="#A45C40" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 text-xs mt-2 border-t border-border pt-3">
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                <span className="w-3 h-3 rounded-full bg-primary" /> Candidate Vector
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-accent">
                <span className="w-3 h-3 rounded-full bg-accent" /> Target Benchmark
              </span>
            </div>
          </div>

          {/* Individual Skills List */}
          <div className="lg:col-span-6 bg-surface p-6 rounded-3xl border border-border shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-primary-dark">
                Verified Skill Scores
              </h3>
              <span className="text-xs text-text-muted">Ranked by score</span>
            </div>

            <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
              {profile.skills.map((skill, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-bg-alt/60 border border-border/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text flex items-center gap-1.5">
                      {skill.skillName}
                      {skill.verified && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                    </span>
                    <span className="font-serif font-bold text-primary">{skill.proficiencyScore}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-border/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiencyScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Matched Opportunities For You */}
        <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-xl font-bold text-primary-dark">
                High-Match Postings For Your Profile
              </h3>
              <p className="text-xs text-text-muted">
                Calculated using Cosine Vector Similarity against your verified skills
              </p>
            </div>
            <Link
              to="/student/opportunities"
              className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <span>View All Postings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedPostings.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-bg border border-border hover:border-primary/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">
                      {post.companyName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                      {post.matchScore}% Match
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-primary-dark mb-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-text-muted mb-3">
                    {post.stipendOrSalary} • {post.location} • Deadline: {post.deadline}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {post.requiredSkills.slice(0, 2).map((s, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-bg-alt text-text font-medium">
                        {s.skillName}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/student/opportunities"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Apply <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
