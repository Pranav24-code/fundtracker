'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { projectsAPI, tranchesAPI } from '@/utils/api';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import ProgressRing from '@/components/common/ProgressRing';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

type Tab = 'overview' | 'updates' | 'complaints' | 'tranches' | 'edit';

export default function AdminProjectDetail() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [tranches, setTranches] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, updRes, trRes] = await Promise.all([
          projectsAPI.getById(id),
          projectsAPI.getUpdates(id).catch(() => ({ data: { data: { updates: [] } } })),
          tranchesAPI.getAll(id).catch(() => ({ data: { data: { tranches: [] } } })),
        ]);
        const p = projRes.data.data?.project || projRes.data.project || projRes.data.data || projRes.data;
        setProject(p);
        setEditForm({ title: p.title, description: p.description, department: p.department, totalBudget: p.totalBudget, amountSpent: p.amountSpent, completionPercentage: p.completionPercentage, status: p.status, expectedEndDate: p.expectedEndDate?.slice(0, 10) });
        setUpdates(updRes.data.data?.updates || updRes.data.updates || []);
        setTranches(trRes.data.data?.tranches || trRes.data.tranches || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await projectsAPI.update(id, { ...editForm, totalBudget: Number(editForm.totalBudget), amountSpent: Number(editForm.amountSpent), completionPercentage: Number(editForm.completionPercentage) });
      toast.success('Project updated!');
      const res = await projectsAPI.getById(id);
      setProject(res.data.data?.project || res.data.project || res.data.data || res.data);
      setTab('overview');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <p className="text-surface-400 text-center py-20">Project not found</p>;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'updates', label: `Updates (${updates.length})` },
    { key: 'complaints', label: 'Complaints' },
    { key: 'tranches', label: `Tranches (${tranches.length})` },
    { key: 'edit', label: 'Edit' },
  ];

  const budgetUsed = project.totalBudget > 0 ? ((project.amountSpent || 0) / project.totalBudget * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <a href="/admin/projects" className="text-xs text-surface-500 hover:text-brand-600 mb-2 block transition-colors">← Back to Projects</a>
          <h1 className="text-xl font-heading font-bold text-surface-900">{project.title}</h1>
          <p className="text-surface-500 text-sm mt-1">{project.department} &middot; {project.location?.city}</p>
        </div>
        <div className="flex gap-2 items-center">
          <StatusBadge status={project.status} />
          <RiskBadge riskFlag={project.riskFlag} riskFactors={project.riskFactors} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-surface-200 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key ? 'border-brand-500 text-brand-600 font-semibold' : 'border-transparent text-surface-400 hover:text-surface-600'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
              <h3 className="text-sm font-semibold text-surface-700 mb-3">Description</h3>
              <p className="text-surface-500 text-sm leading-relaxed">{project.description}</p>
            </div>
            <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
              <h3 className="text-sm font-semibold text-surface-700 mb-4">Budget Utilization</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-xs text-surface-400">Total Budget</p><p className="text-lg font-mono font-bold text-surface-800"><MoneyDisplay amount={project.totalBudget} /></p></div>
                <div><p className="text-xs text-surface-400">Amount Spent</p><p className="text-lg font-mono font-bold text-accent-600"><MoneyDisplay amount={project.amountSpent} /></p></div>
                <div><p className="text-xs text-surface-400">Utilization</p><p className="text-lg font-mono font-bold text-success-600">{budgetUsed}%</p></div>
              </div>
              <div className="mt-4 h-2 bg-surface-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-success-500 rounded-full" style={{ width: `${Math.min(Number(budgetUsed), 100)}%` }} />
              </div>
            </div>
            {/* Images */}
            {project.images?.length > 0 && (
              <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
                <h3 className="text-sm font-semibold text-surface-700 mb-3">Project Images</h3>
                <div className="grid grid-cols-3 gap-3">
                  {project.images.map((img: any, i: number) => (
                    <img key={i} src={img.url || img} alt="" className="w-full h-32 object-cover rounded-xl border border-surface-200" />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-surface-200/60 rounded-2xl p-6 flex flex-col items-center shadow-soft">
              <ProgressRing percentage={project.completionPercentage || 0} size={120} />
              <p className="text-sm text-surface-500 mt-3">Completion Progress</p>
            </div>
            <div className="bg-white border border-surface-200/60 rounded-2xl p-6 space-y-3 text-sm shadow-soft">
              <div className="flex justify-between"><span className="text-surface-500">Contractor</span><span className="text-surface-800">{project.contractor?.name || 'Unassigned'}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Start Date</span><span className="text-surface-800">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Expected End</span><span className="text-surface-800">{project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString() : 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Location</span><span className="text-surface-800 truncate ml-2">{project.location?.address || project.location?.city || 'N/A'}</span></div>
            </div>
          </div>
        </div>
      )}

      {tab === 'updates' && (
        <div className="space-y-4">
          {updates.length === 0 && <p className="text-surface-400 text-center py-12">No progress updates yet</p>}
          {updates.map((u: any, i: number) => (
            <motion.div key={u._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-surface-200/60 rounded-2xl p-5 border-l-4 border-l-brand-500 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-surface-800">{u.progressPercentage ?? u.newCompletion ?? 0}% Progress</span>
                <span className="text-xs text-surface-400">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-surface-500">{u.description || u.workDone || 'No description'}</p>
              {u.issuesFaced && <p className="text-sm text-danger-600 mt-1">Issues: {u.issuesFaced}</p>}
              {u.photos?.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {u.photos.map((p: any, j: number) => <img key={j} src={p.url || p} className="w-16 h-16 object-cover rounded-xl border border-surface-200" />)}
                </div>
              )}
              {u.gpsData?.lat && (
                <p className="text-xs text-surface-400 mt-2">📍 {u.gpsData.lat.toFixed(4)}, {u.gpsData.lng.toFixed(4)}
                  {u.distanceFromSite !== undefined && ` · ${u.distanceFromSite.toFixed(0)}m from site`}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'complaints' && (
        <div className="space-y-4">
          {(project.complaints || []).length === 0 && <p className="text-surface-400 text-center py-12">No complaints for this project</p>}
          {(project.complaints || []).map((c: any) => (
            <div key={c._id} className="bg-white border border-surface-200/60 rounded-2xl p-5 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-surface-800">{c.issueType} — {c.trackingId}</span>
                <StatusBadge status={c.status} type="complaint" />
              </div>
              <p className="text-sm text-surface-500">{c.description}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'tranches' && (
        <div className="space-y-4">
          {tranches.length === 0 && <p className="text-surface-400 text-center py-12">No payment tranches</p>}
          {tranches.map((t: any, i: number) => (
            <div key={t._id || i} className="bg-white border border-surface-200/60 rounded-2xl p-5 flex items-center justify-between shadow-soft">
              <div>
                <p className="text-sm font-semibold text-surface-800">Tranche #{t.trancheNumber}</p>
                <p className="text-xs text-surface-500">{t.conditions || 'No conditions'}</p>
                {t.releaseDate && <p className="text-xs text-surface-400 mt-1">{new Date(t.releaseDate).toLocaleDateString()}</p>}
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-surface-800"><MoneyDisplay amount={t.amount} /></p>
                <StatusBadge status={t.status} type="tranche" />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'edit' && (
        <form onSubmit={handleSave} className="bg-white border border-surface-200/60 rounded-2xl p-6 space-y-4 max-w-2xl shadow-card">
          <input type="text" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title"
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
          <textarea rows={3} value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-surface-500 font-medium">Total Budget</label><input type="number" value={editForm.totalBudget || ''} onChange={e => setEditForm({ ...editForm, totalBudget: e.target.value })}
              className="w-full mt-1 px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" /></div>
            <div><label className="text-xs text-surface-500 font-medium">Amount Spent</label><input type="number" value={editForm.amountSpent || ''} onChange={e => setEditForm({ ...editForm, amountSpent: e.target.value })}
              className="w-full mt-1 px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" /></div>
            <div><label className="text-xs text-surface-500 font-medium">Completion %</label><input type="number" min="0" max="100" value={editForm.completionPercentage || ''} onChange={e => setEditForm({ ...editForm, completionPercentage: e.target.value })}
              className="w-full mt-1 px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" /></div>
            <div><label className="text-xs text-surface-500 font-medium">Status</label>
              <select value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
                <option value="On Time">On Time</option><option value="Delayed">Delayed</option><option value="Critical">Critical</option><option value="Completed">Completed</option>
              </select></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setTab('overview')} className="flex-1 py-3 border border-surface-200 text-surface-600 rounded-xl hover:bg-surface-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all hover:shadow-glow-brand">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
