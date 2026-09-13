import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingChatWidget } from './components/common/FloatingChatWidget';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAssessment } from './pages/student/StudentAssessment';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentOpportunities } from './pages/student/StudentOpportunities';
import { StudentLearning } from './pages/student/StudentLearning';
import { StudentApplications } from './pages/student/StudentApplications';
import { StudentPortfolio } from './pages/student/StudentPortfolio';
import { PublicPortfolio } from './pages/public/PublicPortfolio';

// Industry Pages
import { IndustryDashboard } from './pages/industry/IndustryDashboard';
import { IndustryPostings } from './pages/industry/IndustryPostings';
import { IndustryApplicants } from './pages/industry/IndustryApplicants';
import { IndustryPrograms } from './pages/industry/IndustryPrograms';
import { IndustryAnalytics } from './pages/industry/IndustryAnalytics';

// Academician Pages
import { AcademicianDashboard } from './pages/academician/AcademicianDashboard';
import { AcademicianOpportunities } from './pages/academician/AcademicianOpportunities';
import { AcademicianAnalytics } from './pages/academician/AcademicianAnalytics';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminModeration } from './pages/admin/AdminModeration';
import { AdminKnowledgeBase } from './pages/admin/AdminKnowledgeBase';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-bg selection:bg-primary selection:text-surface">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/portfolio/:id" element={<PublicPortfolio />} />

              {/* Protected Student Routes */}
              <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/assessment" element={<ProtectedRoute allowedRole="student"><StudentAssessment /></ProtectedRoute>} />
              <Route path="/student/profile" element={<ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>} />
              <Route path="/student/opportunities" element={<ProtectedRoute allowedRole="student"><StudentOpportunities /></ProtectedRoute>} />
              <Route path="/student/learning" element={<ProtectedRoute allowedRole="student"><StudentLearning /></ProtectedRoute>} />
              <Route path="/student/applications" element={<ProtectedRoute allowedRole="student"><StudentApplications /></ProtectedRoute>} />
              <Route path="/student/portfolio" element={<ProtectedRoute allowedRole="student"><StudentPortfolio /></ProtectedRoute>} />

              {/* Protected Industry Routes */}
              <Route path="/industry/dashboard" element={<ProtectedRoute allowedRole="industry"><IndustryDashboard /></ProtectedRoute>} />
              <Route path="/industry/postings" element={<ProtectedRoute allowedRole="industry"><IndustryPostings /></ProtectedRoute>} />
              <Route path="/industry/applicants/:postingId" element={<ProtectedRoute allowedRole="industry"><IndustryApplicants /></ProtectedRoute>} />
              <Route path="/industry/programs" element={<ProtectedRoute allowedRole="industry"><IndustryPrograms /></ProtectedRoute>} />
              <Route path="/industry/analytics" element={<ProtectedRoute allowedRole="industry"><IndustryAnalytics /></ProtectedRoute>} />

              {/* Protected Academician Routes */}
              <Route path="/academician/dashboard" element={<ProtectedRoute allowedRole="academician"><AcademicianDashboard /></ProtectedRoute>} />
              <Route path="/academician/opportunities" element={<ProtectedRoute allowedRole="academician"><AcademicianOpportunities /></ProtectedRoute>} />
              <Route path="/academician/analytics" element={<ProtectedRoute allowedRole="academician"><AcademicianAnalytics /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/moderation" element={<ProtectedRoute allowedRole="admin"><AdminModeration /></ProtectedRoute>} />
              <Route path="/admin/knowledge-base" element={<ProtectedRoute allowedRole="admin"><AdminKnowledgeBase /></ProtectedRoute>} />

              {/* Fallback to Landing Page */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>
          <Footer />
          <FloatingChatWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
