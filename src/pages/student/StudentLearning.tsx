import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Award,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { LearningProgram, Enrollment } from '../../types';

export const StudentLearning: React.FC = () => {
  const { studentProfile, refreshUserData } = useAuth();
  const profile = studentProfile || storageService.getStudentProfiles()[0];
  const [programs] = useState<LearningProgram[]>(() => storageService.getLearningPrograms());
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() =>
    storageService.getEnrollmentsByStudent(profile.userId)
  );
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleEnroll = (program: LearningProgram) => {
    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      studentId: profile.userId,
      programId: program.id,
      programTitle: program.title,
      companyName: program.companyName,
      status: 'In Progress',
      progressPercentage: 20,
      enrolledAt: new Date().toISOString(),
      targetSkill: program.targetSkill,
      skillBoostScore: program.skillBoostScore,
    };

    storageService.enrollInProgram(newEnrollment);
    setEnrollments(storageService.getEnrollmentsByStudent(profile.userId));
    refreshUserData();

    setToastMessage(`Enrolled in "${program.title}"! Complete modules to earn +${program.skillBoostScore} skill boost.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleComplete = (enrollmentId: string, program: LearningProgram) => {
    storageService.completeProgram(enrollmentId, profile.userId);
    setEnrollments(storageService.getEnrollmentsByStudent(profile.userId));
    refreshUserData();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6B2737', '#A45C40', '#5C7A5C'],
    });

    setToastMessage(`🎉 Program Completed! Verified +${program.skillBoostScore} pts added to ${program.targetSkill}!`);
    setTimeout(() => setToastMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              Industry Masterclasses & Skill Boosters
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Certified Learning Pathways
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Complete industry-designed curricula to directly boost your verified skill proficiency vectors and earn accredited badges.
            </p>
          </div>

          <div className="bg-bg-alt p-4 rounded-2xl border border-border text-xs font-semibold text-text">
            <div className="text-text-muted text-[10px] uppercase">Enrolled Programs</div>
            <div className="font-serif text-2xl font-bold text-primary">{enrollments.length} Active</div>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 rounded-2xl bg-success/15 border border-success/30 text-success text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program) => {
            const enrollment = enrollments.find(e => e.programId === program.id);
            const isCompleted = enrollment?.status === 'Completed';
            const isEnrolled = Boolean(enrollment);
            const isExpanded = expandedProgramId === program.id;

            return (
              <div
                key={program.id}
                className="bg-surface rounded-3xl p-6 sm:p-7 border border-border shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Company & Skill Boost Badge */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                        {program.companyName}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Level: {program.level} • {program.mode}
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold border border-accent/30 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> +{program.skillBoostScore} pts Boost
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-primary-dark mb-2 leading-snug">
                      {program.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  {/* Meta Details */}
                  <div className="p-3 bg-bg-alt/50 rounded-2xl border border-border/60 text-xs text-text space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Target Skill Boost:</span>
                      <span className="font-bold text-primary">{program.targetSkill}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Duration:</span>
                      <span className="font-medium">{program.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Instructor:</span>
                      <span className="font-medium text-text-muted">{program.instructor}</span>
                    </div>
                  </div>

                  {/* Skills Covered Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {program.skillsCovered.map((sc, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-bg text-text border border-border font-medium"
                      >
                        {sc}
                      </span>
                    ))}
                  </div>

                  {/* Syllabus Toggle Drawer */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedProgramId(isExpanded ? null : program.id)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Course Syllabus' : 'View Course Syllabus'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-3 bg-bg rounded-xl border border-border text-xs space-y-1.5">
                        <p className="text-[10px] font-bold text-text-muted uppercase">Curriculum Modules:</p>
                        {program.syllabus.map((mod, mIdx) => (
                          <div key={mIdx} className="flex items-start gap-2 text-text">
                            <span className="font-serif font-bold text-primary text-[11px]">{mIdx + 1}.</span>
                            <span>{mod}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Action Footer */}
                <div className="pt-6 border-t border-border mt-6">
                  {isCompleted ? (
                    <div className="w-full py-2.5 rounded-xl bg-success/15 border border-success/30 text-success text-xs font-bold text-center flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Completed & Skill Verified (+{program.skillBoostScore} Pts)</span>
                    </div>
                  ) : isEnrolled ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-text-muted">
                        <span>Course Progress</span>
                        <span className="font-bold text-primary">{enrollment?.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-border/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${enrollment?.progressPercentage}%` }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleComplete(enrollment.id, program)}
                        className="w-full py-2.5 rounded-xl bg-success hover:bg-success/90 text-surface text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        <span>Complete Course & Boost Skill Score</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEnroll(program)}
                      className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Enroll in Free Masterclass</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
