import {
  User,
  StudentProfile,
  IndustryProfile,
  AcademicianProfile,
  Posting,
  Application,
  LearningProgram,
  Enrollment,
  AcademicOpportunity,
  AcademicApplication,
  KnowledgeBaseItem,
  UserRole,
} from '../types';
import {
  initialUsers,
  initialStudentProfiles,
  initialIndustryProfiles,
  initialAcademicianProfiles,
  initialPostings,
  initialLearningPrograms,
  initialAcademicOpportunities,
  initialApplications,
  initialKnowledgeBase,
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'skillbridge_current_user',
  USERS: 'skillbridge_users',
  STUDENT_PROFILES: 'skillbridge_student_profiles',
  INDUSTRY_PROFILES: 'skillbridge_industry_profiles',
  ACADEMICIAN_PROFILES: 'skillbridge_academician_profiles',
  POSTINGS: 'skillbridge_postings',
  APPLICATIONS: 'skillbridge_applications',
  LEARNING_PROGRAMS: 'skillbridge_learning_programs',
  ENROLLMENTS: 'skillbridge_enrollments',
  ACADEMIC_OPPORTUNITIES: 'skillbridge_academic_opportunities',
  ACADEMIC_APPLICATIONS: 'skillbridge_academic_applications',
  KNOWLEDGE_BASE: 'skillbridge_knowledge_base',
};

function getFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return defaultVal;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('skillbridge_storage_updated'));
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
}

class StorageService {
  constructor() {
    // Initialize storage if empty
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.resetToDefaults();
    }
  }

  public resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(initialStudentProfiles));
    localStorage.setItem(STORAGE_KEYS.INDUSTRY_PROFILES, JSON.stringify(initialIndustryProfiles));
    localStorage.setItem(STORAGE_KEYS.ACADEMICIAN_PROFILES, JSON.stringify(initialAcademicianProfiles));
    localStorage.setItem(STORAGE_KEYS.POSTINGS, JSON.stringify(initialPostings));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(initialApplications));
    localStorage.setItem(STORAGE_KEYS.LEARNING_PROGRAMS, JSON.stringify(initialLearningPrograms));
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_OPPORTUNITIES, JSON.stringify(initialAcademicOpportunities));
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_APPLICATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify([
      {
        id: 'enr-1',
        studentId: 'user-stu-1',
        programId: 'prog-1',
        programTitle: 'Google Cloud Certified Associate Cloud Engineer Masterclass',
        companyName: 'Google Cloud Innovations',
        status: 'In Progress',
        progressPercentage: 65,
        enrolledAt: '2026-02-10T10:00:00Z',
        targetSkill: 'Cloud & Kubernetes (GCP/AWS)',
        skillBoostScore: 15,
      }
    ]));
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASE, JSON.stringify(initialKnowledgeBase));
    
    // Default current user: null (visitor must log in from landing page)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // --- Auth & Users ---
  public getCurrentUser(): User | null {
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  public setCurrentUser(user: User | null): void {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  }

  public getUsers(): User[] {
    return getFromStorage<User[]>(STORAGE_KEYS.USERS, initialUsers);
  }

  public addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    saveToStorage(STORAGE_KEYS.USERS, users);
  }

  public switchUserByRole(role: UserRole): User {
    const users = this.getUsers();
    const user = users.find(u => u.role === role) || initialUsers.find(u => u.role === role) || users[0];
    this.setCurrentUser(user);
    return user;
  }

  // --- Student Profiles ---
  public getStudentProfiles(): StudentProfile[] {
    return getFromStorage<StudentProfile[]>(STORAGE_KEYS.STUDENT_PROFILES, initialStudentProfiles);
  }

  public getStudentProfile(userId: string): StudentProfile | undefined {
    const profiles = this.getStudentProfiles();
    return profiles.find(p => p.userId === userId);
  }

  public updateStudentProfile(profile: StudentProfile): void {
    const profiles = this.getStudentProfiles();
    const index = profiles.findIndex(p => p.userId === profile.userId);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, profiles);
  }

  // --- Industry Profiles ---
  public getIndustryProfiles(): IndustryProfile[] {
    return getFromStorage<IndustryProfile[]>(STORAGE_KEYS.INDUSTRY_PROFILES, initialIndustryProfiles);
  }

  public getIndustryProfile(userId: string): IndustryProfile | undefined {
    const profiles = this.getIndustryProfiles();
    return profiles.find(p => p.userId === userId);
  }

  public updateIndustryProfile(profile: IndustryProfile): void {
    const profiles = this.getIndustryProfiles();
    const index = profiles.findIndex(p => p.userId === profile.userId);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    saveToStorage(STORAGE_KEYS.INDUSTRY_PROFILES, profiles);
  }

  // --- Academician Profiles ---
  public getAcademicianProfiles(): AcademicianProfile[] {
    return getFromStorage<AcademicianProfile[]>(STORAGE_KEYS.ACADEMICIAN_PROFILES, initialAcademicianProfiles);
  }

  public getAcademicianProfile(userId: string): AcademicianProfile | undefined {
    const profiles = this.getAcademicianProfiles();
    return profiles.find(p => p.userId === userId);
  }

  public updateAcademicianProfile(profile: AcademicianProfile): void {
    const profiles = this.getAcademicianProfiles();
    const index = profiles.findIndex(p => p.userId === profile.userId);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    saveToStorage(STORAGE_KEYS.ACADEMICIAN_PROFILES, profiles);
  }

  // --- Postings ---
  public getPostings(): Posting[] {
    return getFromStorage<Posting[]>(STORAGE_KEYS.POSTINGS, initialPostings);
  }

  public getPosting(id: string): Posting | undefined {
    return this.getPostings().find(p => p.id === id);
  }

  public savePosting(posting: Posting): void {
    const postings = this.getPostings();
    const index = postings.findIndex(p => p.id === posting.id);
    if (index >= 0) {
      postings[index] = posting;
    } else {
      postings.unshift(posting);
    }
    saveToStorage(STORAGE_KEYS.POSTINGS, postings);
  }

  public deletePosting(id: string): void {
    const postings = this.getPostings().filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.POSTINGS, postings);
  }

  // --- Applications ---
  public getApplications(): Application[] {
    return getFromStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, initialApplications);
  }

  public getApplicationsByStudent(studentId: string): Application[] {
    return this.getApplications().filter(a => a.studentId === studentId);
  }

  public getApplicationsByPosting(postingId: string): Application[] {
    return this.getApplications().filter(a => a.postingId === postingId);
  }

  public applyToPosting(application: Application): void {
    const applications = this.getApplications();
    // Check if already applied
    const existing = applications.find(
      a => a.studentId === application.studentId && a.postingId === application.postingId
    );
    if (!existing) {
      applications.unshift(application);
      saveToStorage(STORAGE_KEYS.APPLICATIONS, applications);

      // Increment applicant count on posting
      const postings = this.getPostings();
      const post = postings.find(p => p.id === application.postingId);
      if (post) {
        post.applicantCount = (post.applicantCount || 0) + 1;
        this.savePosting(post);
      }
    }
  }

  public updateApplicationStatus(applicationId: string, status: Application['status'], feedback?: string): void {
    const applications = this.getApplications();
    const index = applications.findIndex(a => a.id === applicationId);
    if (index >= 0) {
      applications[index].status = status;
      if (feedback) applications[index].feedback = feedback;
      saveToStorage(STORAGE_KEYS.APPLICATIONS, applications);
    }
  }

  // --- Learning Programs & Enrollments ---
  public getLearningPrograms(): LearningProgram[] {
    return getFromStorage<LearningProgram[]>(STORAGE_KEYS.LEARNING_PROGRAMS, initialLearningPrograms);
  }

  public saveLearningProgram(program: LearningProgram): void {
    const programs = this.getLearningPrograms();
    const index = programs.findIndex(p => p.id === program.id);
    if (index >= 0) {
      programs[index] = program;
    } else {
      programs.unshift(program);
    }
    saveToStorage(STORAGE_KEYS.LEARNING_PROGRAMS, programs);
  }

  public getEnrollments(): Enrollment[] {
    return getFromStorage<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, []);
  }

  public getEnrollmentsByStudent(studentId: string): Enrollment[] {
    return this.getEnrollments().filter(e => e.studentId === studentId);
  }

  public enrollInProgram(enrollment: Enrollment): void {
    const enrollments = this.getEnrollments();
    if (!enrollments.find(e => e.studentId === enrollment.studentId && e.programId === enrollment.programId)) {
      enrollments.unshift(enrollment);
      saveToStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);

      // Update enrolled count in program
      const programs = this.getLearningPrograms();
      const prog = programs.find(p => p.id === enrollment.programId);
      if (prog) {
        prog.enrolledCount += 1;
        this.saveLearningProgram(prog);
      }
    }
  }

  public completeProgram(enrollmentId: string, studentId: string): void {
    const enrollments = this.getEnrollments();
    const enr = enrollments.find(e => e.id === enrollmentId);
    if (enr && enr.status !== 'Completed') {
      enr.status = 'Completed';
      enr.progressPercentage = 100;
      enr.completedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.ENROLLMENTS, enrollments);

      // Boost student skill in student profile
      const studentProfile = this.getStudentProfile(studentId);
      if (studentProfile) {
        const skill = studentProfile.skills.find(s => s.skillName === enr.targetSkill);
        if (skill) {
          skill.proficiencyScore = Math.min(100, skill.proficiencyScore + enr.skillBoostScore);
          skill.verified = true;
        } else {
          studentProfile.skills.push({
            skillName: enr.targetSkill,
            proficiencyScore: Math.min(100, 70 + enr.skillBoostScore),
            category: 'Core Engineering',
            verified: true,
          });
        }

        // Add a verified certification
        studentProfile.certifications.push({
          id: `cert-${Date.now()}`,
          title: enr.programTitle,
          issuer: enr.companyName,
          issueDate: 'Today',
          credentialUrl: `https://skillbridge.edu/verify/${enr.id}`,
          skillsVerified: [enr.targetSkill],
        });

        this.updateStudentProfile(studentProfile);
      }
    }
  }

  // --- Academic Opportunities ---
  public getAcademicOpportunities(): AcademicOpportunity[] {
    return getFromStorage<AcademicOpportunity[]>(STORAGE_KEYS.ACADEMIC_OPPORTUNITIES, initialAcademicOpportunities);
  }

  public saveAcademicOpportunity(opp: AcademicOpportunity): void {
    const opps = this.getAcademicOpportunities();
    const index = opps.findIndex(o => o.id === opp.id);
    if (index >= 0) {
      opps[index] = opp;
    } else {
      opps.unshift(opp);
    }
    saveToStorage(STORAGE_KEYS.ACADEMIC_OPPORTUNITIES, opps);
  }

  public getAcademicApplications(): AcademicApplication[] {
    return getFromStorage<AcademicApplication[]>(STORAGE_KEYS.ACADEMIC_APPLICATIONS, []);
  }

  public applyToAcademicOpportunity(app: AcademicApplication): void {
    const apps = this.getAcademicApplications();
    apps.unshift(app);
    saveToStorage(STORAGE_KEYS.ACADEMIC_APPLICATIONS, apps);
  }

  // --- Knowledge Base ---
  public getKnowledgeBase(): KnowledgeBaseItem[] {
    return getFromStorage<KnowledgeBaseItem[]>(STORAGE_KEYS.KNOWLEDGE_BASE, initialKnowledgeBase);
  }

  public saveKnowledgeBaseItem(item: KnowledgeBaseItem): void {
    const items = this.getKnowledgeBase();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.unshift(item);
    }
    saveToStorage(STORAGE_KEYS.KNOWLEDGE_BASE, items);
  }

  public deleteKnowledgeBaseItem(id: string): void {
    const items = this.getKnowledgeBase().filter(i => i.id !== id);
    saveToStorage(STORAGE_KEYS.KNOWLEDGE_BASE, items);
  }
}

export const storageService = new StorageService();
