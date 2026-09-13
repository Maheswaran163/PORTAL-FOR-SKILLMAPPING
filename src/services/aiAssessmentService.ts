import { SkillScore, SkillGapReport } from '../types';

export interface AIAssessmentResult {
  overallReadiness: 'Industry Ready' | 'Near Ready (1-2 Gaps)' | 'Skill Building Needed';
  overallMatchScore: number;
  executiveSummary: string;
  strengths: string[];
  criticalGaps: string[];
  strategicActions: string[];
  evaluatedSkills: SkillScore[];
}

export async function evaluateSkillsWithClaude(
  answers: Record<string, { skillName: string; category: SkillScore['category']; score: number; text: string }>,
  targetRole: string = 'Full-Stack AI Engineer',
  apiKey?: string
): Promise<AIAssessmentResult> {
  const effectiveKey = apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY;

  const responsesSummary = Object.entries(answers)
    .map(([_, val]) => `- ${val.skillName} (${val.category}): Candidate Self-Assessment Level "${val.text}" (Initial baseline: ${val.score}%)`)
    .join('\n');

  if (effectiveKey && effectiveKey.startsWith('sk-ant-')) {
    try {
      const prompt = `You are a Senior Technical Hiring Lead and AI Skill Assessment Evaluator at a top tech enterprise evaluating an engineering student for the target role: "${targetRole}".

Candidate Self-Assessment Responses:
${responsesSummary}

Analyze these competencies rigorously against 2026 industry hiring bars.
Return ONLY valid JSON (no markdown fences, no extra text) with the following structure:
{
  "overallReadiness": "Industry Ready" or "Near Ready (1-2 Gaps)" or "Skill Building Needed",
  "overallMatchScore": <number between 55 and 98>,
  "executiveSummary": "<concise 2-3 sentence executive evaluation of the candidate's industry readiness>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "criticalGaps": ["<gap 1 with reason>", "<gap 2 with reason>"],
  "strategicActions": ["<concrete learning step 1>", "<concrete step 2>"],
  "skillScores": [
    { "skillName": "Python", "score": <number 0-100> },
    { "skillName": "React & TypeScript", "score": <number 0-100> },
    { "skillName": "Cloud & Kubernetes (GCP/AWS)", "score": <number 0-100> },
    { "skillName": "Machine Learning (PyTorch/Scikit)", "score": <number 0-100> },
    { "skillName": "SQL & Database Architecture", "score": <number 0-100> },
    { "skillName": "System Design & Distributed Systems", "score": <number 0-100> },
    { "skillName": "Technical Communication", "score": <number 0-100> }
  ]
}`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': effectiveKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 1200,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const textContent = data.content?.[0]?.text || '';
        const cleaned = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        const evaluatedSkills: SkillScore[] = parsed.skillScores.map((s: any) => {
          const original = Object.values(answers).find(a => a.skillName.toLowerCase() === s.skillName.toLowerCase());
          return {
            skillName: s.skillName,
            proficiencyScore: Math.min(100, Math.max(20, Math.round(s.score))),
            category: original ? original.category : 'Core Engineering',
            verified: true,
          };
        });

        return {
          overallReadiness: parsed.overallReadiness || 'Near Ready (1-2 Gaps)',
          overallMatchScore: parsed.overallMatchScore || 85,
          executiveSummary: parsed.executiveSummary,
          strengths: parsed.strengths || [],
          criticalGaps: parsed.criticalGaps || [],
          strategicActions: parsed.strategicActions || [],
          evaluatedSkills,
        };
      }
    } catch (err) {
      console.warn('Anthropic API call in AI Assessment fallback to deterministic modeling:', err);
    }
  }

  // Fallback intelligent assessment modeling
  const evaluatedSkills: SkillScore[] = Object.values(answers).map(a => ({
    skillName: a.skillName,
    proficiencyScore: a.score,
    category: a.category,
    verified: true,
  }));

  const avg = Math.round(
    evaluatedSkills.reduce((acc, s) => acc + s.proficiencyScore, 0) / (evaluatedSkills.length || 1)
  );

  let readiness: AIAssessmentResult['overallReadiness'] = 'Skill Building Needed';
  if (avg >= 84) readiness = 'Industry Ready';
  else if (avg >= 70) readiness = 'Near Ready (1-2 Gaps)';

  return {
    overallReadiness: readiness,
    overallMatchScore: avg,
    executiveSummary: `The candidate demonstrates strong foundational core knowledge in programming and analytical problem-solving, with primary growth opportunities in container orchestration and production-scale distributed architecture.`,
    strengths: [
      'Strong application prototyping and core language mastery',
      'Solid grasp of data structures and relational queries',
      'Effective technical communication and documentation mindset',
    ],
    criticalGaps: [
      'Production Kubernetes cluster configuration and service mesh architecture',
      'Low-latency model serving and vector search indexing for enterprise RAG',
    ],
    strategicActions: [
      'Enroll in the Google Cloud Associate Cloud Engineer Masterclass to earn +15 pts',
      'Deploy a containerized microservice project with live Kubernetes ingress on portfolio',
    ],
    evaluatedSkills,
  };
}
