import { SkillScore, SkillGapReport, SkillGapItem, StudentProfile, Posting, LearningProgram } from '../types';

export interface TargetRoleBenchmark {
  roleTitle: string;
  category: string;
  requiredSkills: { skillName: string; requiredScore: number; category: SkillScore['category']; priority: 'High' | 'Medium' | 'Low' }[];
}

export const TARGET_ROLE_BENCHMARKS: Record<string, TargetRoleBenchmark> = {
  'Full-Stack AI Engineer': {
    roleTitle: 'Full-Stack AI Engineer',
    category: 'Software & AI',
    requiredSkills: [
      { skillName: 'Python', requiredScore: 85, category: 'Programming', priority: 'High' },
      { skillName: 'React & TypeScript', requiredScore: 85, category: 'Programming', priority: 'High' },
      { skillName: 'Cloud & Kubernetes (GCP/AWS)', requiredScore: 80, category: 'Cloud & DevOps', priority: 'High' },
      { skillName: 'Machine Learning (PyTorch/Scikit)', requiredScore: 75, category: 'AI & ML', priority: 'Medium' },
      { skillName: 'SQL & Database Architecture', requiredScore: 75, category: 'Programming', priority: 'Medium' },
      { skillName: 'System Design & Distributed Systems', requiredScore: 75, category: 'Core Engineering', priority: 'High' },
      { skillName: 'Technical Communication', requiredScore: 75, category: 'Soft Skills', priority: 'Low' },
    ],
  },
  'Cloud Backend Engineer': {
    roleTitle: 'Cloud Backend Engineer',
    category: 'Cloud & DevOps',
    requiredSkills: [
      { skillName: 'Python', requiredScore: 85, category: 'Programming', priority: 'High' },
      { skillName: 'Cloud & Kubernetes (GCP/AWS)', requiredScore: 90, category: 'Cloud & DevOps', priority: 'High' },
      { skillName: 'System Design & Distributed Systems', requiredScore: 85, category: 'Core Engineering', priority: 'High' },
      { skillName: 'SQL & Database Architecture', requiredScore: 80, category: 'Programming', priority: 'High' },
      { skillName: 'Technical Communication', requiredScore: 70, category: 'Soft Skills', priority: 'Low' },
    ],
  },
  'Machine Learning Intern': {
    roleTitle: 'Machine Learning Intern',
    category: 'AI & ML',
    requiredSkills: [
      { skillName: 'Python', requiredScore: 90, category: 'Programming', priority: 'High' },
      { skillName: 'Machine Learning (PyTorch/Scikit)', requiredScore: 90, category: 'AI & ML', priority: 'High' },
      { skillName: 'SQL & Database Architecture', requiredScore: 70, category: 'Programming', priority: 'Medium' },
      { skillName: 'Cloud & Kubernetes (GCP/AWS)', requiredScore: 65, category: 'Cloud & DevOps', priority: 'Low' },
      { skillName: 'Technical Communication', requiredScore: 75, category: 'Soft Skills', priority: 'Low' },
    ],
  },
};

/**
 * Calculates Cosine Similarity between a student skill set and job requirements.
 * Returns a score between 0 and 100.
 */
export function calculateJobMatchScore(
  studentSkills: SkillScore[],
  requiredSkills: Posting['requiredSkills']
): number {
  if (!requiredSkills || requiredSkills.length === 0) return 90;

  const skillMap = new Map<string, number>();
  studentSkills.forEach(s => skillMap.set(s.skillName.toLowerCase(), s.proficiencyScore));

  let dotProduct = 0;
  let normStudent = 0;
  let normRequired = 0;

  requiredSkills.forEach(req => {
    const studentScore = skillMap.get(req.skillName.toLowerCase()) || 20; // baseline for unlisted
    const reqScore = req.minScore;

    dotProduct += studentScore * reqScore;
    normStudent += studentScore * studentScore;
    normRequired += reqScore * reqScore;
  });

  if (normStudent === 0 || normRequired === 0) return 60;

  const cosineSimilarity = dotProduct / (Math.sqrt(normStudent) * Math.sqrt(normRequired));
  // Scale and calibrate to realistic percentage (60 - 99%)
  const percentage = Math.round(cosineSimilarity * 98);
  return Math.min(99, Math.max(45, percentage));
}

/**
 * Generates a Gap Report comparing student skills against a target role benchmark.
 */
export function generateSkillGapReport(
  profile: StudentProfile,
  targetRoleKey: string = 'Full-Stack AI Engineer',
  allPrograms: LearningProgram[] = []
): SkillGapReport {
  const benchmark = TARGET_ROLE_BENCHMARKS[targetRoleKey] || TARGET_ROLE_BENCHMARKS['Full-Stack AI Engineer'];
  const studentSkillMap = new Map<string, number>();
  profile.skills.forEach(s => studentSkillMap.set(s.skillName.toLowerCase(), s.proficiencyScore));

  const gapItems: SkillGapItem[] = [];
  let totalAchieved = 0;
  let totalRequired = 0;

  benchmark.requiredSkills.forEach(req => {
    const currentScore = studentSkillMap.get(req.skillName.toLowerCase()) || 0;
    const gap = Math.max(0, req.requiredScore - currentScore);

    totalAchieved += Math.min(currentScore, req.requiredScore);
    totalRequired += req.requiredScore;

    // Find recommended courses from industry learning programs
    const matchingCourses = allPrograms
      .filter(p => p.skillsCovered.some(sc => sc.toLowerCase().includes(req.skillName.toLowerCase()) || req.skillName.toLowerCase().includes(sc.toLowerCase())))
      .map(p => p.title);

    gapItems.push({
      skillName: req.skillName,
      currentScore,
      requiredScore: req.requiredScore,
      gap,
      category: req.category,
      priority: req.priority,
      recommendedCourses: matchingCourses.length > 0 ? matchingCourses : [`Advanced ${req.skillName} Industry Bootcamp`],
    });
  });

  const overallMatchPercentage = Math.round((totalAchieved / (totalRequired || 1)) * 100);
  
  let readinessLevel: SkillGapReport['readinessLevel'] = 'Skill Building Needed';
  if (overallMatchPercentage >= 85) {
    readinessLevel = 'Industry Ready';
  } else if (overallMatchPercentage >= 70) {
    readinessLevel = 'Near Ready (1-2 Gaps)';
  }

  return {
    targetRole: benchmark.roleTitle,
    overallMatchPercentage,
    readinessLevel,
    gapItems,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Prepares Radar Chart data comparing Candidate vs Benchmark
 */
export function getRadarChartData(studentSkills: SkillScore[], targetRoleKey: string = 'Full-Stack AI Engineer') {
  const benchmark = TARGET_ROLE_BENCHMARKS[targetRoleKey] || TARGET_ROLE_BENCHMARKS['Full-Stack AI Engineer'];
  const studentMap = new Map<string, number>();
  studentSkills.forEach(s => studentMap.set(s.skillName.toLowerCase(), s.proficiencyScore));

  return benchmark.requiredSkills.map(req => {
    const current = studentMap.get(req.skillName.toLowerCase()) || 25;
    return {
      skill: req.skillName.length > 18 ? req.skillName.slice(0, 16) + '…' : req.skillName,
      fullSkillName: req.skillName,
      Candidate: current,
      Benchmark: req.requiredScore,
      fullMark: 100,
    };
  });
}
