'use client';

import { useEffect, useState } from 'react';
import { projectsAPI } from '@/utils/api';
import StatusBadge from '@/components/common/StatusBadge';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import ProgressRing from '@/components/common/ProgressRing';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContractorDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await projectsAPI.getAll({ limit: 100 });
        setProjects(res.data.data?.projects || res.data.projects || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" /></div>;

  const active = projects.filter(p => p.status !== 'Completed');
  const completed = projects.filter(p => p.status === 'Completed');
  const avgProgress = projects.length > 0
    ? (projects.reduce((sum, p) => sum + (p.completionPercentage || 0), 0) / projects.length).toFixed(0)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Contractor Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">Manage your assigned projects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft hover:shadow-card transition-shadow">
          <p className="text-xs text-surface-500 font-medium">My Projects</p>
          <p className="text-2xl font-mono font-bold text-surface-800">{projects.length}</p>
        </div>
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft hover:shadow-card transition-shadow">
          <p className="text-xs text-surface-500 font-medium">Active</p>
          <p className="text-2xl font-mono font-bold text-accent-600">{active.length}</p>
        </div>
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft hover:shadow-card transition-shadow">
          <p className="text-xs text-surface-500 font-medium">Completed</p>
          <p className="text-2xl font-mono font-bold text-success-600">{completed.length}</p>
        </div>
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft hover:shadow-card transition-shadow">
          <p className="text-xs text-surface-500 font-medium">Avg Progress</p>
          <p className="text-2xl font-mono font-bold text-brand-600">{avgProgress}%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/contractor/updates" className="bg-white border border-surface-200/60 rounded-2xl p-5 hover:border-accent-300 hover:shadow-card transition-all group">
          <h3 className="text-sm font-semibold text-surface-800 mb-1 group-hover:text-accent-600 transition-colors">📝 Submit Progress Update</h3>
          <p className="text-xs text-surface-500">Upload photos, GPS data, and progress details</p>
        </Link>
        <Link href="/contractor/tranches" className="bg-white border border-surface-200/60 rounded-2xl p-5 hover:border-success-300 hover:shadow-card transition-all group">
          <h3 className="text-sm font-semibold text-surface-800 mb-1 group-hover:text-success-600 transition-colors">💰 Payment Tranches</h3>
          <p className="text-xs text-surface-500">View payment status and milestones</p>
        </Link>
      </div>

      {/* Active Projects */}
      <div>
        <h2 className="text-sm font-semibold text-surface-700 mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {active.map((p: any, i: number) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/contractor/projects`}
                className="block bg-white border border-surface-200/60 rounded-2xl p-5 hover:border-accent-300 hover:shadow-card transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-surface-800 mb-1 truncate">{p.title}</h3>
                    <p className="text-xs text-surface-400">{p.department} &middot; {p.location?.city || 'N/A'}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1">
                        <div className="h-1.5 bg-surface-100 rounded-full">
                          <div className="h-full bg-accent-500 rounded-full" style={{ width: `${p.completionPercentage || 0}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-mono text-surface-500">{p.completionPercentage || 0}%</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={p.status} />
                      <span className="text-xs font-mono text-surface-500"><MoneyDisplay amount={p.totalBudget} /></span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {active.length === 0 && <p className="text-surface-400 text-sm col-span-2">No active projects</p>}
        </div>
      </div>
    </div>
  );
}
