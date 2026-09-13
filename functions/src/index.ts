import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Anthropic from '@anthropic-ai/sdk';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

admin.initializeApp();
const db = admin.firestore();

// 1. RAG AI Assistant Endpoint (/api/rag-chat)
export const ragChat = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { query, role = 'student' } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required.' });
      return;
    }

    // Retrieve knowledge base docs from Firestore
    const kbSnapshot = await db.collection('knowledgeBase').limit(15).get();
    const docs = kbSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const context = docs
      .map((d: any, idx: number) => `[Doc ${idx + 1}] Title: ${d.title} (${d.category || 'General'})\nContent: ${d.content}`)
      .join('\n\n');

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.json({
        answer: `[Mock Cloud Function] Grounded answer for: "${query}". Retrieved ${docs.length} knowledge base entries.`,
        citedSources: docs.slice(0, 3).map((d: any) => ({ title: d.title, type: d.sourceType || 'skill' })),
      });
      return;
    }

    const anthropic = new Anthropic({ apiKey });
    const prompt = `You are SkillBridge AI, assisting a ${role.toUpperCase()} user on the Academia-Industry collaboration portal.
Use the following retrieved context:
${context}

User question: ${query}

Provide a grounded, professional, concise response.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const answer = message.content[0].type === 'text' ? message.content[0].text : '';

    res.json({
      answer,
      citedSources: docs.slice(0, 3).map((d: any) => ({ title: d.title, type: d.sourceType || 'skill' })),
    });
  } catch (error: any) {
    console.error('ragChat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 2. Skill Matching Endpoint (/api/match-skills)
export const matchSkills = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { studentSkills = [], requiredSkills = [] } = req.body;
    
    const skillMap = new Map<string, number>();
    studentSkills.forEach((s: any) => skillMap.set(s.skillName.toLowerCase(), s.proficiencyScore));

    let dotProduct = 0;
    let normStudent = 0;
    let normRequired = 0;

    requiredSkills.forEach((reqItem: any) => {
      const studentScore = skillMap.get(reqItem.skillName.toLowerCase()) || 25;
      const reqScore = reqItem.minScore || 70;

      dotProduct += studentScore * reqScore;
      normStudent += studentScore * studentScore;
      normRequired += reqScore * reqScore;
    });

    if (normStudent === 0 || normRequired === 0) {
      res.json({ matchScore: 70 });
      return;
    }

    const cosineSimilarity = dotProduct / (Math.sqrt(normStudent) * Math.sqrt(normRequired));
    const score = Math.min(99, Math.max(45, Math.round(cosineSimilarity * 98)));

    res.json({ matchScore: score });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Server-side PDF Generation Endpoint (/api/generate-portfolio-pdf)
export const generatePortfolioPDF = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { studentName = 'Student', institution = 'University', skills = [] } = req.body;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Maroon header banner
    page.drawRectangle({
      x: 0,
      y: 740,
      width: 595.28,
      height: 102,
      color: rgb(0.42, 0.15, 0.22), // Maroon #6B2737
    });

    page.drawText('SkillBridge — Verified Academic-Industry Portfolio', {
      x: 40,
      y: 800,
      size: 16,
      font: fontBold,
      color: rgb(1, 0.99, 0.98),
    });

    page.drawText(`${studentName} • ${institution}`, {
      x: 40,
      y: 765,
      size: 12,
      font: fontRegular,
      color: rgb(0.96, 0.94, 0.9),
    });

    page.drawText('Verified Competencies:', {
      x: 40,
      y: 700,
      size: 14,
      font: fontBold,
      color: rgb(0.29, 0.11, 0.15),
    });

    let currentY = 670;
    skills.forEach((s: any) => {
      page.drawText(`• ${s.skillName}: ${s.proficiencyScore}% Verified`, {
        x: 50,
        y: currentY,
        size: 11,
        font: fontRegular,
        color: rgb(0.23, 0.16, 0.15),
      });
      currentY -= 24;
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${studentName}_Portfolio.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
