import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  UserCheck,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Sparkles,
  FileCheck2,
  Layers,
  Search,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { currentUser, currentRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { label: 'Platform Features', path: '/#features' },
        { label: 'Marketplace', path: '/#marketplace' },
        { label: 'AI Skill Mapping', path: '/#ai-skills' },
        { label: 'Academia Collaboration', path: '/#academia' },
      ];
    }

    switch (currentRole) {
      case 'student':
        return [
          { label: 'Dashboard', path: '/student/dashboard', icon: Layers },
          { label: 'Assessment', path: '/student/assessment', icon: Sparkles },
          { label: 'Opportunities', path: '/student/opportunities', icon: Search },
          { label: 'Learning', path: '/student/learning', icon: BookOpen },
          { label: 'Applications', path: '/student/applications', icon: Briefcase },
          { label: 'Portfolio', path: '/student/portfolio', icon: FileCheck2 },
        ];
      case 'industry':
        return [
          { label: 'Dashboard', path: '/industry/dashboard', icon: Layers },
          { label: 'Postings & Jobs', path: '/industry/postings', icon: Briefcase },
          { label: 'Training & FDPs', path: '/industry/programs', icon: BookOpen },
          { label: 'Analytics', path: '/industry/analytics', icon: Sparkles },
        ];
      case 'academician':
        return [
          { label: 'Dashboard', path: '/academician/dashboard', icon: Layers },
          { label: 'FDPs & Grants', path: '/academician/opportunities', icon: GraduationCap },
          { label: 'Dept Analytics', path: '/academician/analytics', icon: Sparkles },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: Layers },
          { label: 'User Directory', path: '/admin/users', icon: UserCheck },
          { label: 'Moderation Queue', path: '/admin/moderation', icon: ShieldCheck },
          { label: 'RAG Knowledge Base', path: '/admin/knowledge-base', icon: Sparkles },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'student':
        return 'bg-[#6B2737]/10 text-[#6B2737] border-[#6B2737]/30';
      case 'industry':
        return 'bg-[#A45C40]/15 text-[#A45C40] border-[#A45C40]/30';
      case 'academician':
        return 'bg-[#5C7A5C]/15 text-[#5C7A5C] border-[#5C7A5C]/30';
      case 'admin':
        return 'bg-[#4A1B26]/15 text-[#4A1B26] border-[#4A1B26]/30';
    }
  };

  const getProfilePath = () => {
    if (currentRole === 'student') return '/student/profile';
    if (currentRole === 'industry') return '/industry/dashboard';
    if (currentRole === 'academician') return '/academician/dashboard';
    return '/admin/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#D9C9B5]/70 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-surface shadow-md group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5 text-[#FFFDF9]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-bold tracking-tight text-primary-dark block leading-none">
                SkillBridge
              </span>
              <span className="text-[9px] tracking-wider uppercase font-semibold text-accent block mt-0.5">
                Academia • Industry • AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto scrollbar-none">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-primary text-surface shadow-sm font-bold'
                      : 'text-text hover:text-primary hover:bg-bg-alt/60'
                  }`}
                >
                  {link.icon && <link.icon className={`w-3.5 h-3.5 ${isActive ? 'text-surface' : 'text-accent'}`} />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Auth */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            {currentUser ? (
              <>
                {/* Role Badge (display only, no switcher) */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeColor(currentRole)}`}>
                  {currentRole}
                </span>

                {/* User avatar & dropdown */}
                <div className="flex items-center gap-2 pl-2 border-l border-border shrink-0">
                  <div className="relative">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(!userDropdownOpen);
                      }}
                      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-primary-dark truncate max-w-[90px] lg:max-w-[120px]">
                          {currentUser.name}
                        </p>
                        <p className="text-[10px] text-text-muted capitalize">{currentUser.role}</p>
                      </div>
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-primary/40 shadow-xs"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center font-bold text-xs">
                          {currentUser.name.charAt(0)}
                        </div>
                      )}
                    </button>

                    <AnimatePresence>
                      {userDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 rounded-xl bg-surface border border-border shadow-soft-lg p-2 z-50 space-y-1"
                        >
                          <div className="px-3 py-2 border-b border-border mb-1">
                            <p className="font-bold text-xs text-primary-dark truncate">{currentUser.name}</p>
                            <p className="text-[10px] text-text-muted truncate">{currentUser.email}</p>
                          </div>

                          <Link
                            to={getProfilePath()}
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-text hover:bg-bg-alt font-medium"
                          >
                            <UserIcon className="w-3.5 h-3.5 text-accent" />
                            <span>My Profile</span>
                          </Link>

                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                              navigate('/login');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-error hover:bg-error/10 font-bold"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Prominent Log Out Button */}
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    title="Log Out of Platform"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-error/10 hover:bg-error text-error hover:text-surface font-semibold text-xs transition-all shadow-xs shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline font-bold">Log Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-bg-alt transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-hover text-surface shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text hover:bg-bg-alt transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-surface px-4 pt-3 pb-6 space-y-3"
          >
            {currentUser && (
              <div className="p-3 bg-bg-alt rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary-dark">{currentUser.name}</p>
                  <p className="text-xs text-text-muted">{currentUser.email}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${getRoleBadgeColor(currentRole)}`}>
                  {currentRole}
                </span>
              </div>
            )}

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-primary text-surface font-semibold'
                      : 'text-text hover:bg-bg-alt'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center">
              {currentUser ? (
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-error text-surface text-sm font-bold shadow-sm"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center rounded-lg border border-primary text-primary text-sm font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center rounded-lg bg-primary text-surface text-sm font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
