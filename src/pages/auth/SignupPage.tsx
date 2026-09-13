import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, User, Building, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, role, organization);
      if (role === 'student') navigate('/student/assessment');
      else if (role === 'industry') navigate('/industry/dashboard');
      else if (role === 'academician') navigate('/academician/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 sm:p-10 rounded-3xl border border-border shadow-soft-lg">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-surface shadow-md mx-auto">
            <GraduationCap className="w-6 h-6 text-[#FFFDF9]" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-primary-dark">
            Join SkillBridge
          </h2>
          <p className="text-xs text-text-muted">
            Create an account to start mapping skills and collaborating
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error/10 border border-error/30 text-error rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Select Your Role
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-bg-alt rounded-xl border border-border">
              {(['student', 'industry', 'academician', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-1.5 text-[10px] font-bold capitalize rounded-lg transition-colors ${
                    role === r ? 'bg-primary text-surface shadow-sm' : 'text-text hover:bg-surface'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Full Name / Organization Name
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

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              {role === 'student' ? 'University / College' : role === 'industry' ? 'Company Name' : 'Institution / Department'}
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder={role === 'student' ? 'e.g. IIT Madras' : role === 'industry' ? 'e.g. Google India' : 'e.g. NIT Trichy'}
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
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};
