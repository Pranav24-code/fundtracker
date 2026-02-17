'use client';

import { useEffect, useState } from 'react';
import { projectsAPI } from '@/utils/api';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import SearchInput from '@/components/common/SearchInput';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CitizenDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

  const departments = ['Public Works', 'Education', 'Healthcare', 'Transportation', 'Water Resources',
    'Urban Development', 'Rural Development', 'Energy', 'Agriculture'];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await projectsAPI.getAll({ limit: 100 });
        setProjects(res.data.data?.projects || res.data.projects || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = projects.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.location?.city?.toLowerCase().includes(search.toLowerCase())) return false;
    if (department && p.department !== department) return false;
    if (status && p.status !== status) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Explore Projects</h1>
        <p className="text-surface-500 text-sm mt-1">Monitor government projects in your area</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-surface-200/60 p-4 rounded-2xl shadow-soft text-center hover:shadow-card transition-shadow">
          <p className="text-2xl font-mono font-bold text-surface-800">{projects.length}</p>
          <p className="text-xs text-surface-500">Total Projects</p>
        </div>
        <div className="bg-white border border-surface-200/60 p-4 rounded-2xl shadow-soft text-center hover:shadow-card transition-shadow">
          <p className="text-2xl font-mono font-bold text-success-600">{projects.filter(p => p.status === 'On Time').length}</p>
          <p className="text-xs text-surface-500">On Track</p>
        </div>
        <div className="bg-white border border-surface-200/60 p-4 rounded-2xl shadow-soft text-center hover:shadow-card transition-shadow">
          <p className="text-2xl font-mono font-bold text-danger-600">{projects.filter(p => p.riskFlag).length}</p>
          <p className="text-xs text-surface-500">Risk Flagged</p>
        </div>
        <div className="bg-white border border-surface-200/60 p-4 rounded-2xl shadow-soft text-center hover:shadow-card transition-shadow">
          <p className="text-2xl font-mono font-bold text-purple-600">{projects.filter(p => p.status === 'Completed').length}</p>
          <p className="text-xs text-surface-500">Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or city..." className="w-72" />
        <select value={department} onChange={e => setDepartment(e.target.value)}
          className="px-3 py-2 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
          <option value="">All Statuses</option>
          <option value="On Time">On Time</option>
          <option value="Delayed">Delayed</option>
          <option value="Critical">Critical</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p: any, i: number) => (
          <motion.div key={p._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Link href={`/citizen/projects/${p._id}`} className="block bg-white border border-surface-200/60 rounded-2xl overflow-hidden hover:border-brand-300 hover:shadow-card transition-all group">
              {p.images?.[0] && (
                <div className="h-36 overflow-hidden">
                  <img src={p.images[0].url || p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-surface-800 leading-snug line-clamp-2">{p.title}</h3>
                  <RiskBadge riskFlag={p.riskFlag} compact />
                </div>
                <p className="text-xs text-surface-400 mb-3">{p.department} &middot; {p.location?.city || 'N/A'}</p>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-surface-500">Progress</span>
                    <span className="font-mono text-surface-700">{p.completionPercentage || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-100 rounded-full">
                    <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${p.completionPercentage || 0}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-surface-500"><MoneyDisplay amount={p.totalBudget} /></span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-surface-400 text-center py-12">No projects match your filters</p>
      )}
    </div>
  );
}
