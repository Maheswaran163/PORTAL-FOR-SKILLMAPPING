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
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const ROLE_TABS: { r: UserRole; label: string; icon: React.ElementType; description: string }[] = [
  { r: 'student', label: 'Student', icon: GraduationCap, description: 'Access your skill dashboard & opportunities' },
  { r: 'industry', label: 'Industry Partner', icon: Briefcase, description: 'Post jobs, track talent & programs' },
  { r: 'academician', label: 'Faculty / Dept', icon: BookOpen, description: 'Manage FDPs, grants & analytics' },
  { r: 'admin', label: 'Administrator', icon: ShieldCheck, description: 'Platform management & moderation' },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole: UserRole = (location.state as any)?.targetRole || 'student';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, role);
      if (!success) {
        setError('Invalid email or password. Please check your credentials.');
        setLoading(false);
        return;
      }

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
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const selectedTab = ROLE_TABS.find(t => t.r === role)!;

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-bg">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-7 bg-surface p-8 sm:p-10 rounded-3xl border border-border shadow-soft-lg"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-surface shadow-md mx-auto">
            <GraduationCap className="w-7 h-7 text-[#FFFDF9]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary-dark">
            Welcome Back
          </h1>
          <p className="text-xs text-text-muted">
            Sign in to your SkillBridge account
          </p>
        </div>

        {/* Role Picker Tabs */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
            I am a...
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_TABS.map(tab => (
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
                <tab.icon className={`w-4 h-4 shrink-0 ${role === tab.r ? 'text-surface' : 'text-accent'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          {selectedTab && (
            <p className="text-[10px] text-text-muted text-center pt-1">{selectedTab.description}</p>
          )}
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
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <span>{loading ? 'Signing In...' : `Sign In to ${role.charAt(0).toUpperCase() + role.slice(1)} Portal`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1 text-xs text-text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Register Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
