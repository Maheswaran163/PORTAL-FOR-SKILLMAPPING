export type UserRole = 'student' | 'academician' | 'industry' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institutionOrCompany?: string;
  createdAt: string;
}

export interface SkillScore {
  skillName: string;
  proficiencyScore: number; // 0 - 100
  category: 'Programming' | 'AI & ML' | 'Cloud & DevOps' | 'Design & UX' | 'Core Engineering' | 'Soft Skills';
  verified?: boolean;
}

export interface SkillGapItem {
  skillName: string;
  currentScore: number;
  requiredScore: number;
  gap: number;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  recommendedCourses: string[];
}

export interface SkillGapReport {
  targetRole: string;
  overallMatchPercentage: number;
  readinessLevel: 'Industry Ready' | 'Near Ready (1-2 Gaps)' | 'Skill Building Needed';
  gapItems: SkillGapItem[];
  generatedAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  verifiedBy?: string;
  imageUrl?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  skillsVerified: string[];
}

export interface StudentProfile {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  branch: string;
  year: string; // '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgraduate'
  institution: string;
  bio: string;
  resumeUrl?: string;
  skills: SkillScore[];
  portfolioProjects: PortfolioProject[];
  certifications: Certification[];
  targetRoles: string[];
  gpa?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface IndustryProfile {
  userId: string;
  companyName: string;
  industryType: string;
  website: string;
  location: string;
  logoUrl?: string;
  description: string;
  verified: boolean;
  contactEmail: string;
}

export interface AcademicianProfile {
  userId: string;
  fullName: string;
  department: string;
  designation: string; // 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'HOD' | 'Dean'
  institution: string;
  researchAreas: string[];
  experienceYears: number;
  bio: string;
  publicationsCount: number;
}

export interface Posting {
  id: string;
  industryId: string;
  companyName: string;
  companyLogo?: string;
  type: 'Internship' | 'Job' | 'Apprenticeship';
  title: string;
  description: string;
  requiredSkills: { skillName: string; minScore: number }[];
  location: string;
  isRemote: boolean;
  stipendOrSalary: string;
  duration?: string;
  deadline: string;
  createdAt: string;
  applicantCount: number;
  status: 'active' | 'closed' | 'under_review';
}

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentBranch: string;
  studentYear: string;
  studentAvatar?: string;
  postingId: string;
  postingTitle: string;
  companyName: string;
  status: ApplicationStatus;
  matchScore: number; // 0 - 100
  appliedAt: string;
  coverNote?: string;
  resumeUrl?: string;
  feedback?: string;
}

export interface LearningProgram {
  id: string;
  industryId: string;
  companyName: string;
  title: string;
  description: string;
  skillsCovered: string[];
  skillBoostScore: number; // proficiency points added upon completion
  targetSkill: string;
  duration: string;
  mode: 'Self-Paced' | 'Live Cohort' | 'Hybrid';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolledCount: number;
  link: string;
  syllabus: string[];
  instructor: string;
  badgeImageUrl?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  programId: string;
  programTitle: string;
  companyName: string;
  status: 'In Progress' | 'Completed';
  progressPercentage: number;
  enrolledAt: string;
  completedAt?: string;
  targetSkill: string;
  skillBoostScore: number;
}

export interface AcademicOpportunity {
  id: string;
  postedById: string;
  postedByName: string;
  companyOrOrg: string;
  type: 'FDP' | 'Industrial Training' | 'Consultancy' | 'Joint Research';
  title: string;
  description: string;
  domain: string;
  duration: string;
  location: string;
  isVirtual: boolean;
  honorariumOrGrant?: string;
  eligibility: string;
  deadline: string;
  createdAt: string;
  status: 'open' | 'closed';
}

export interface AcademicApplication {
  id: string;
  academicianId: string;
  academicianName: string;
  academicianDept: string;
  opportunityId: string;
  opportunityTitle: string;
  companyOrOrg: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Declined';
  appliedAt: string;
  proposalNote: string;
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  category: 'Skill Guidance' | 'Industry Benchmark' | 'Career Pathway' | 'Curriculum Sync' | 'Opportunity';
  content: string;
  sourceType: 'skill' | 'posting' | 'program' | 'opportunity';
  sourceRefId?: string;
  tags: string[];
  embedding?: number[]; // pre-computed pseudo/real vector representation
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citedSources?: {
    title: string;
    type: 'posting' | 'program' | 'skill' | 'opportunity' | 'doc';
    link?: string;
    score?: number;
  }[];
}
