# SkillBridge — Academia-Industry Collaboration & AI Skill Mapping Portal

> Next-generation Academia-Industry Collaboration Portal featuring AI Diagnostic Skill Mapping, Grounded RAG Assistant (Claude 3.7 + Vector Search), Verified Digital Portfolios with PDF Export, and a refined **Beige & Maroon** design system.

---

## 🎨 Design Theme — Beige & Maroon Palette

SkillBridge utilizes a sophisticated academic-industry color palette built with CSS custom properties and Tailwind CSS:

- **Warm Beige Background:** `#F5EFE6` (`var(--color-bg)`)
- **Card / Section Background:** `#EDE3D3` (`var(--color-bg-alt)`)
- **Near-White Beige Surface:** `#FFFDF9` (`var(--color-surface)`)
- **Primary Maroon:** `#6B2737` (`var(--color-primary)`)
- **Maroon Hover:** `#7F2F3F` (`var(--color-primary-hover)`)
- **Deep Maroon Heading:** `#4A1B26` (`var(--color-primary-dark)`)
- **Warm Rust Accent:** `#A45C40` (`var(--color-accent)`)
- **Dark Brown Body Text:** `#3A2A25` (`var(--color-text)`)
- **Muted Caption Text:** `#8A7A6D` (`var(--color-text-muted)`)
- **Soft Beige Border:** `#D9C9B5` (`var(--color-border)`)
- **Muted Olive Success:** `#5C7A5C` (`var(--color-success)`)
- **Muted Red Error:** `#A33B3B` (`var(--color-error)`)

Headings are styled with **Playfair Display & Lora**, while body copy uses **Plus Jakarta Sans & Inter**.

---

## 🚀 Key Modules & Capabilities

### 1. Student Portal
- **Diagnostic Skill Assessment:** Multi-step Likert & technical self-assessment across 6 core competency domains.
- **Dynamic Radar Chart & Gap Report:** Instant comparison against target industry roles (e.g. *Full-Stack AI Engineer*, *Cloud Backend Engineer*, *Machine Learning Intern*).
- **Internship & Job Marketplace:** Postings ranked by **Cosine Similarity Match Scores** (`96%`, `92%`, etc.) with 1-click application attaching verified skill vectors.
- **Industry Masterclasses & Boost Programs:** Courses by Google Cloud, Siemens, TCS, Microsoft that grant immediate skill score boosts and verified badges upon completion.
- **Application Pipeline Tracker:** Multi-stage Kanban tracking (`Applied` → `Shortlisted` → `Interview` → `Offer` → `Rejected`).
- **Verified Digital Portfolio & PDF Export:** Client-side high-resolution PDF download using `jsPDF` and `html2canvas`, plus public shareable link at `/portfolio/:id`.

### 2. Industry Portal
- **Postings CRUD:** Create and manage internship/job listings with custom required skill proficiency thresholds.
- **Ranked Candidate Review:** View applicant pool ordered by vector match precision with 1-click status progression (Shortlist, Interview, Offer, Reject).
- **Host Masterclasses & FDPs:** Publish industrial bootcamps and sponsor faculty training programs.
- **Hiring & Skill Gap Analytics:** Recharts visualizations styled in Maroon, Rust, and Olive palettes (Score Distribution, Pipeline Funnel, Skill Demand vs Applicant Averages).

### 3. Academician Portal
- **Faculty Development Programs (FDPs):** Browse & apply for national faculty enablement programs, industrial fellowships at Siemens, and funded research retainers at TCS.
- **Department Batch Gap Analytics:** Compare college branch averages (CSE, AI&DS, ECE) against enterprise benchmarks.
- **Curriculum Synchronization:** AI-driven syllabus update recommendations (e.g. Kubernetes lab integration, RAG elective modules).

### 4. Admin Portal
- **User Directory:** Search and manage registered accounts with Role-Based Access Control (RBAC).
- **Moderation Queue:** Inspect and verify employer postings and masterclasses.
- **RAG Knowledge Base & Vector Inspector:** Manage grounded knowledge documents, inspect 16-dimensional dense embedding vectors, and test vector search relevance scores.

### 5. Grounded RAG AI Assistant ("SkillBridge AI")
- Persistent floating chat widget available on all pages.
- Grounded with dense vector semantic search over knowledge base entries, active postings, and faculty programs.
- Displays interactive **source citation chips** underneath every response.
- Integrated with Anthropic Claude API (`claude-3-7-sonnet-20250219`) with high-fidelity local grounded reasoning fallback.

---

## 🛠️ Project Structure

```
SIH_PROJECT_AI/
├── public/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Navbar.tsx             # Role-aware navigation + quick demo switcher
│   │       ├── Footer.tsx             # Platform footer with RAG engine status
│   │       ├── FloatingChatWidget.tsx # Floating RAG AI widget with source chips
│   │       └── ScrollAnimation.tsx    # Framer-motion scroll reveal wrappers
│   ├── context/
│   │   └── AuthContext.tsx            # Global auth and role switching context
│   ├── pages/
│   │   ├── LandingPage.tsx            # Animated hero, role pathways, radar showcase
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx          # 1-Click demo role sign-in
│   │   │   └── SignupPage.tsx         # Role registration
│   │   ├── student/
│   │   │   ├── StudentDashboard.tsx   # Radar preview, stats, match postings
│   │   │   ├── StudentAssessment.tsx  # Multi-step assessment & gap report
│   │   │   ├── StudentOpportunities.tsx # Search, filter & apply with skill vector
│   │   │   ├── StudentLearning.tsx    # Masterclasses & skill boosting
│   │   │   ├── StudentApplications.tsx# Visual stage pipeline tracker
│   │   │   ├── StudentPortfolio.tsx   # Verified portfolio + PDF export
│   │   │   └── StudentProfile.tsx     # Profile editor
│   │   ├── industry/
│   │   │   ├── IndustryDashboard.tsx  # Recruiter dashboard
│   │   │   ├── IndustryPostings.tsx   # Postings CRUD
│   │   │   ├── IndustryApplicants.tsx # Ranked candidate review & status updates
│   │   │   ├── IndustryPrograms.tsx   # Masterclass & FDP manager
│   │   │   └── IndustryAnalytics.tsx  # Funnel & score distribution charts
│   │   ├── academician/
│   │   │   ├── AcademicianDashboard.tsx # Faculty dashboard
│   │   │   ├── AcademicianOpportunities.tsx # FDPs & research grants
│   │   │   └── AcademicianAnalytics.tsx # Batch skill-gap radar & syllabus sync
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx     # Institutional governance
│   │   │   ├── AdminUsers.tsx         # User directory
│   │   │   ├── AdminModeration.tsx    # Content approval queue
│   │   │   └── AdminKnowledgeBase.tsx # RAG vector editor & search simulator
│   │   └── public/
│   │       └── PublicPortfolio.tsx    # Public read-only verified portfolio
│   ├── services/
│   │   ├── firebase.ts                # Firebase client init with demo fallback
│   │   ├── mockData.ts                # 15 students, 5 industries, 20 postings, 15 vectors
│   │   ├── storageService.ts          # Reactive state & LocalStorage sync
│   │   ├── matchingService.ts         # Cosine skill matching & radar benchmarks
│   │   └── ragService.ts              # Semantic vector search & Claude RAG engine
│   ├── types/
│   │   └── index.ts                   # Domain TypeScript definitions
│   ├── App.tsx                        # Router configuration
│   ├── index.css                      # Tailwind & Beige/Maroon theme variables
│   └── main.tsx
├── functions/                         # Firebase Cloud Functions package
│   ├── src/
│   │   └── index.ts                   # /api/rag-chat, /api/match-skills, /api/generate-portfolio-pdf
│   ├── package.json
│   └── tsconfig.json
├── scripts/
│   └── seed.ts                        # Standalone database seed script
├── firestore.rules                    # Role-based Firestore security rules
├── tailwind.config.js
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies & Start Local Dev Server
```bash
npm install
npm run dev
```

The application will launch on `http://localhost:5173` with full demo data and instantaneous role switching available on the top bar!

### 2. Optional: Configure Live Firebase & Claude API
Copy `.env.example` to `.env` and fill in your keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_ANTHROPIC_API_KEY=your_claude_key
```

### 3. Build for Production
```bash
npm run build
```
