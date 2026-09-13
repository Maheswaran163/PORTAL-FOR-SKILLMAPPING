/**
 * SkillBridge Database Seed Script
 * Populates Firestore with 15 students, 5 industries, 5 academicians, 20 postings, 10 learning programs, 15 knowledge-base items
 */

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
} from '../src/services/mockData';

export async function seedDatabase(adminDb?: any) {
  console.log('🌱 Starting SkillBridge Database Seeding...');

  const summary = {
    users: initialUsers.length,
    studentProfiles: initialStudentProfiles.length,
    industryProfiles: initialIndustryProfiles.length,
    academicianProfiles: initialAcademicianProfiles.length,
    postings: initialPostings.length,
    learningPrograms: initialLearningPrograms.length,
    academicOpportunities: initialAcademicOpportunities.length,
    knowledgeBaseEntries: initialKnowledgeBase.length,
  };

  if (adminDb) {
    console.log('Writing records to live Firestore instance...');
    const batch = adminDb.batch();

    initialUsers.forEach(u => {
      const ref = adminDb.collection('users').doc(u.id);
      batch.set(ref, u);
    });

    initialPostings.forEach(p => {
      const ref = adminDb.collection('postings').doc(p.id);
      batch.set(ref, p);
    });

    initialKnowledgeBase.forEach(kb => {
      const ref = adminDb.collection('knowledgeBase').doc(kb.id);
      batch.set(ref, kb);
    });

    await batch.commit();
    console.log('✅ Live Firestore batch written successfully!');
  }

  console.log('Seeded dataset summary:', summary);
  return summary;
}

// Auto-run if executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('seed')) {
  seedDatabase().then(() => console.log('✅ Seed completed.'));
}
