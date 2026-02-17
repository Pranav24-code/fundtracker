'use client';

import { useEffect, useState } from 'react';
import { projectsAPI } from '@/utils/api';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import ProgressRing from '@/components/common/ProgressRing';
import { motion } from 'framer-motion';

export default function ContractorProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    projectsAPI.getAll({ limit: 100 }).then(res => {
      const p = res.data.data?.projects || res.data.projects || [];
      setProjects(p);
      if (p.length > 0) loadUpdates(p[0]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const loadUpdates = async (project: any) => {
    setSelected(project);
    try {
      const res = await projectsAPI.getUpdates(project._id);
      setUpdates(res.data.data?.updates || res.data.updates || []);
    } catch { setUpdates([]); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">My Projects</h1>
        <p className="text-surface-500 text-sm mt-1">{projects.length} assigned projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="space-y-3">
          {projects.map((p: any) => (
            <motion.div key={p._id} whileHover={{ scale: 1.01 }}
              onClick={() => loadUpdates(p)}
              className={`bg-white rounded-2xl p-4 cursor-pointer transition-all border-2 hover:shadow-card ${
                selected?._id === p._id ? 'border-accent-500 shadow-soft' : 'border-surface-200/60 hover:border-surface-300'
              }`}>
              <h3 className="text-sm font-semibold text-surface-800 truncate">{p.title}</h3>
              <p className="text-xs text-surface-400">{p.department}</p>
              <div className="flex items-center justify-between mt-2">
                <StatusBadge status={p.status} />
                <span className="text-xs font-mono text-surface-500">{p.completionPercentage || 0}%</span>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && <p className="text-surface-400 text-sm">No projects assigned</p>}
        </div>

        {/* Project Detail */}
        {selected && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-heading font-bold text-surface-900">{selected.title}</h2>
                  <p className="text-sm text-surface-500 mt-1">{selected.department} &middot; {selected.location?.city}</p>
                </div>
                <ProgressRing percentage={selected.completionPercentage || 0} size={80} />
              </div>
              <p className="text-sm text-surface-500 mt-3 leading-relaxed">{selected.description}</p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div><p className="text-xs text-surface-400">Budget</p><p className="font-mono text-surface-800"><MoneyDisplay amount={selected.totalBudget} /></p></div>
                <div><p className="text-xs text-surface-400">Spent</p><p className="font-mono text-accent-600"><MoneyDisplay amount={selected.amountSpent} /></p></div>
                <div><p className="text-xs text-surface-400">Status</p><StatusBadge status={selected.status} /></div>
              </div>
              <RiskBadge riskFlag={selected.riskFlag} riskFactors={selected.riskFactors} />
            </div>

            {/* Updates */}
            <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
              <h3 className="text-sm font-semibold text-surface-700 mb-4">Progress Updates ({updates.length})</h3>
              {updates.length === 0 ? (
                <p className="text-surface-400 text-sm">No updates yet. <a href="/contractor/updates" className="text-accent-600 hover:text-accent-500">Submit one →</a></p>
              ) : (
                <div className="space-y-3">
                  {updates.map((u: any, i: number) => (
                    <div key={u._id || i} className="p-3 rounded-xl bg-surface-50 border border-surface-200/60">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-surface-800">{u.progressPercentage ?? u.newCompletion ?? 0}%</span>
                        <span className="text-xs text-surface-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-surface-500">{u.description || u.workDone || 'Update submitted'}</p>
                      {u.photos?.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {u.photos.map((p: any, j: number) => <img key={j} src={p.url || p} className="w-10 h-10 object-cover rounded-lg border border-surface-200" />)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
