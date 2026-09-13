import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Building,
  Mail,
  Filter,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { User, UserRole } from '../../types';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.institutionOrCompany && u.institutionOrCompany.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dark/15 text-primary-dark text-xs font-bold uppercase tracking-wider mb-2">
              User Directory
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Registered Platform Users
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Manage permissions, roles, and institutional affiliations across all registered accounts.
            </p>
          </div>

          <div className="bg-bg-alt px-4 py-2 rounded-2xl border border-border text-xs font-semibold text-text">
            Total Accounts: <strong>{users.length}</strong>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface p-4 sm:p-6 rounded-3xl border border-border shadow-soft space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-7 relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users by name, email, or institution..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface"
              />
            </div>

            <div className="md:col-span-5 flex gap-1.5 p-1 bg-bg-alt rounded-xl border border-border">
              {(['All', 'student', 'industry', 'academician', 'admin'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg capitalize transition-colors ${
                    roleFilter === r ? 'bg-primary text-surface shadow-sm' : 'text-text hover:bg-surface'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-surface rounded-3xl border border-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-alt border-b border-border text-text font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Affiliation / Organization</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-text">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-bg/40 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-primary-dark">{u.name}</p>
                        <p className="text-[11px] text-text-muted">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-bg-alt border border-border">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-text-muted">
                      {u.institutionOrCompany || 'National Platform'}
                    </td>
                    <td className="p-4 text-text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <span className="inline-flex items-center gap-1 text-[11px] text-success font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
