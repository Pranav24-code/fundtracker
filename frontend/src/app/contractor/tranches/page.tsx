'use client';

import { useEffect, useState } from 'react';
import { projectsAPI, tranchesAPI } from '@/utils/api';
import StatusBadge from '@/components/common/StatusBadge';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import { motion } from 'framer-motion';

export default function ContractorTranches() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [tranches, setTranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.getAll({ limit: 100 }).then(res => {
      const p = res.data.data?.projects || res.data.projects || [];
      setProjects(p);
      if (p.length > 0) {
        setSelectedProject(p[0]._id);
        loadTranches(p[0]._id);
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, []);

  const loadTranches = async (projectId: string) => {
    setLoading(true);
    try {
      const res = await tranchesAPI.getAll(projectId);
      setTranches(res.data.data?.tranches || res.data.tranches || []);
    } catch { setTranches([]); } finally { setLoading(false); }
  };

  const handleProjectChange = (id: string) => {
    setSelectedProject(id);
    loadTranches(id);
  };

  const totalAmount = tranches.reduce((sum, t) => sum + (t.amount || 0), 0);
  const releasedAmount = tranches.filter(t => t.status === 'released').reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Payment Tranches</h1>
        <p className="text-surface-500 text-sm mt-1">Track your payment milestones</p>
      </div>

      {/* Project Selector */}
      <select value={selectedProject} onChange={e => handleProjectChange(e.target.value)}
        className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 max-w-md w-full">
        {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
      </select>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft">
          <p className="text-xs text-surface-500 font-medium">Total Tranches</p>
          <p className="text-xl font-mono font-bold text-surface-800">{tranches.length}</p>
        </div>
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft">
          <p className="text-xs text-surface-500 font-medium">Total Amount</p>
          <p className="text-xl font-mono font-bold text-surface-800"><MoneyDisplay amount={totalAmount} /></p>
        </div>
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft">
          <p className="text-xs text-surface-500 font-medium">Released</p>
          <p className="text-xl font-mono font-bold text-success-600"><MoneyDisplay amount={releasedAmount} /></p>
        </div>
      </div>

      {/* Tranches */}
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : tranches.length === 0 ? (
        <p className="text-surface-400 text-center py-12">No tranches found for this project</p>
      ) : (
        <div className="space-y-4">
          {tranches.map((t: any, i: number) => (
            <motion.div key={t._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-surface-200/60 rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-surface-800">Tranche #{t.trancheNumber}</h3>
                    <StatusBadge status={t.status} type="tranche" />
                  </div>
                  <p className="text-xs text-surface-500">{t.conditions || 'No conditions specified'}</p>
                  {t.releaseDate && <p className="text-xs text-surface-400 mt-1">Release Date: {new Date(t.releaseDate).toLocaleDateString()}</p>}
                  {t.notes && <p className="text-xs text-surface-500 mt-1 italic">{t.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono font-bold text-surface-800"><MoneyDisplay amount={t.amount} /></p>
                  {t.status === 'released' && (
                    <p className="text-xs text-success-600 mt-1">✓ Released</p>
                  )}
                  {t.status === 'on_hold' && (
                    <p className="text-xs text-warning-600 mt-1">⏸ On Hold</p>
                  )}
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="mt-3 h-1.5 bg-surface-100 rounded-full">
                <div className={`h-full rounded-full transition-all ${
                  t.status === 'released' ? 'bg-success-500' :
                  t.status === 'on_hold' ? 'bg-warning-500' : 'bg-surface-200'
                }`} style={{ width: t.status === 'released' ? '100%' : t.status === 'on_hold' ? '50%' : '10%' }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
