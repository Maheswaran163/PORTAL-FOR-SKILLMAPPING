import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole: UserRole = (location.state as any)?.targetRole || 'student';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(() => {
    if (initialRole === 'industry') return 'campus-relations@google.com';
    if (initialRole === 'academician') return 'ramesh.cs@iitm.ac.in';
    if (initialRole === 'admin') return 'admin@skillbridge.gov.in';
    return 'aarav.sharma@student.edu';
  });
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle role change and update default demo credentials
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'student') {
      setEmail('aarav.sharma@student.edu');
      setPassword('password123');
    } else if (newRole === 'industry') {
      setEmail('campus-relations@google.com');
      setPassword('password123');
    } else if (newRole === 'academician') {
      setEmail('ramesh.cs@iitm.ac.in');
      setPassword('password123');
    } else if (newRole === 'admin') {
      setEmail('admin@skillbridge.gov.in');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // If Firebase Auth is available and live credentials provided, attempt Firebase sign-in
      if (auth && import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseErr: any) {
          // If demo user or offline, gracefully fallback to local auth
          console.warn('Firebase Auth notice (falling back to platform identity):', firebaseErr.message);
        }
      }

      await login(email, role);

      // Navigate to destination or role dashboard
      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (role === 'industry') {
        navigate('/industry/dashboard', { replace: true });
      } else if (role === 'academician') {
        navigate('/academician/dashboard', { replace: true });
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetRole: UserRole) => {
    handleRoleChange(targetRole);
    setLoading(true);
    try {
      const demoEmail =
        targetRole === 'student'
          ? 'aarav.sharma@student.edu'
          : targetRole === 'industry'
          ? 'campus-relations@google.com'
          : targetRole === 'academician'
          ? 'ramesh.cs@iitm.ac.in'
          : 'admin@skillbridge.gov.in';

      await login(demoEmail, targetRole);

      if (targetRole === 'student') navigate('/student/dashboard');
      else if (targetRole === 'industry') navigate('/industry/dashboard');
      else if (targetRole === 'academician') navigate('/academician/dashboard');
      else if (targetRole === 'admin') navigate('/admin/dashboard');
    } catch (err: any) {
      setError('Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 sm:p-10 rounded-3xl border border-border shadow-soft-lg">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-surface shadow-md mx-auto">
            <GraduationCap className="w-6 h-6 text-[#FFFDF9]" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-primary-dark">
            Portal Sign In
          </h2>
          <p className="text-xs text-text-muted">
            Select your account role to access your personalized collaboration space.
          </p>
        </div>

        {/* Role Picker Tabs */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider text-center">
            Step 1: Choose Your Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { r: 'student' as UserRole, label: 'Student', icon: GraduationCap },
              { r: 'industry' as UserRole, label: 'Industry Partner', icon: Briefcase },
              { r: 'academician' as UserRole, label: 'Faculty / Dept', icon: BookOpen },
              { r: 'admin' as UserRole, label: 'Administrator', icon: ShieldCheck },
            ].map(tab => (
              <button
                key={tab.r}
                type="button"
                onClick={() => handleRoleChange(tab.r)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 ${
                  role === tab.r
                    ? 'bg-primary text-surface border-primary shadow-sm'
                    : 'bg-bg-alt/70 text-text border-border hover:bg-bg-alt'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${role === tab.r ? 'text-surface' : 'text-accent'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick 1-Click Demo Login */}
        <div className="p-3 bg-bg-alt/60 rounded-2xl border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-primary flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> One-Click Demo Access
            </span>
            <span className="text-[10px] text-text-muted">Pre-filled profiles</span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickLogin(role)}
            className="w-full py-2 px-3 rounded-xl bg-surface hover:bg-primary hover:text-surface text-primary border border-border text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Sign In as Demo {role.toUpperCase()}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error/10 border border-error/30 text-error rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              {role === 'student'
                ? 'Student Email'
                : role === 'industry'
                ? 'Company Email'
                : role === 'academician'
                ? 'Institutional Email'
                : 'Admin Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@organization.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing In...' : `Sign In to ${role.toUpperCase()} Portal`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-text-muted">
          New to SkillBridge?{' '}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create an Account for Any Role
          </Link>
        </div>

      </div>
    </div>
  );
};
