import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Mail,
  User,
  Building,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const ROLE_TABS: { r: UserRole; label: string; icon: React.ElementType; placeholder: string; orgLabel: string }[] = [
  { r: 'student', label: 'Student', icon: GraduationCap, placeholder: 'e.g. IIT Madras', orgLabel: 'University / College' },
  { r: 'industry', label: 'Industry Partner', icon: Briefcase, placeholder: 'e.g. Google India', orgLabel: 'Company Name' },
  { r: 'academician', label: 'Faculty / Dept', icon: BookOpen, placeholder: 'e.g. NIT Trichy – CSE Dept', orgLabel: 'Institution / Department' },
];

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedTab = ROLE_TABS.find(t => t.r === role)!;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setOrganization('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, role, organization);
      if (role === 'student') navigate('/student/assessment');
      else if (role === 'industry') navigate('/industry/dashboard');
      else if (role === 'academician') navigate('/academician/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-bg">
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
            Join SkillBridge
          </h1>
          <p className="text-xs text-text-muted">
            Create your account to start mapping skills and collaborating
          </p>
        </div>

        {/* Role Selector */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
            I am registering as a...
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_TABS.map(tab => (
              <button
                key={tab.r}
                type="button"
                onClick={() => handleRoleChange(tab.r)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  role === tab.r
                    ? 'bg-primary text-surface border-primary shadow-sm'
                    : 'bg-bg-alt/70 text-text border-border hover:bg-bg-alt'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${role === tab.r ? 'text-surface' : 'text-accent'}`} />
                <span className="leading-tight text-center">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-error/10 border border-error/30 text-error rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Vikramaditya Sen"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface"
              />
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              {selectedTab.orgLabel}
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder={selectedTab.placeholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1 text-xs text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign In Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
