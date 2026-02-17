'use client';

import { useEffect, useState } from 'react';
import { complaintsAPI } from '@/utils/api';
import StatusBadge from '@/components/common/StatusBadge';
import SearchInput from '@/components/common/SearchInput';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadComplaints(); }, []);

  const loadComplaints = async () => {
    try {
      const res = await complaintsAPI.getAll({ limit: 100 });
      setComplaints(res.data.data?.complaints || res.data.complaints || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filtered = complaints.filter(c => {
    if (search && !c.description?.toLowerCase().includes(search.toLowerCase()) && !c.trackingId?.toLowerCase().includes(search.toLowerCase()) && !c.issueType?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    return true;
  });

  const handleReview = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await complaintsAPI.respond(selected._id, { status: newStatus || selected.status, adminResponse: response });
      toast.success('Complaint updated');
      setSelected(null);
      setResponse('');
      loadComplaints();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error updating complaint');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Complaints</h1>
        <p className="text-surface-500 text-sm mt-1">{complaints.length} total complaints</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by ID, type, description..." className="w-72" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((c: any, i: number) => (
            <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              onClick={() => { setSelected(c); setNewStatus(c.status); setResponse(c.adminResponse || ''); }}
              className={`bg-white rounded-2xl p-4 cursor-pointer transition-all duration-200 border-2 hover:shadow-card ${
                selected?._id === c._id ? 'border-brand-500 shadow-glow-brand' : 'border-surface-200/60 hover:border-surface-300'
              }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-surface-400">{c.trackingId}</span>
                    {c.isCritical && <span className="text-xs bg-danger-50 text-danger-600 border border-danger-200 px-1.5 py-0.5 rounded-full font-semibold">Critical</span>}
                  </div>
                  <p className="text-sm text-surface-800 font-semibold truncate">{c.issueType}</p>
                  <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{c.description}</p>
                  <p className="text-xs text-surface-400 mt-1">
                    Project: {c.project?.title || c.project || 'N/A'} &middot; {c.upvotes || 0} upvotes
                  </p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <StatusBadge status={c.status} type="complaint" />
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="text-surface-400 text-center py-12">No complaints found</p>}
        </div>

        {/* Review Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-white border border-surface-200/60 rounded-2xl p-6 space-y-4 sticky top-6 self-start shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-700">Review Complaint</h3>
                <button onClick={() => setSelected(null)} className="text-surface-400 hover:text-surface-600 text-lg">&times;</button>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-surface-600"><span className="text-surface-400">Tracking ID:</span> {selected.trackingId}</p>
                <p className="text-surface-600"><span className="text-surface-400">Type:</span> {selected.issueType}</p>
                <p className="text-surface-600"><span className="text-surface-400">Citizen:</span> {selected.citizen?.name || 'Anonymous'}</p>
                <p className="text-surface-600"><span className="text-surface-400">Date:</span> {new Date(selected.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1 font-medium">Description</p>
                <p className="text-sm text-surface-700">{selected.description}</p>
              </div>
              {selected.images?.length > 0 && (
                <div className="flex gap-2">
                  {selected.images.map((img: any, i: number) => <img key={i} src={img.url || img} className="w-16 h-16 object-cover rounded-xl border border-surface-200" />)}
                </div>
              )}
              <div>
                <label className="text-xs text-surface-500 mb-1 block font-medium">Update Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-surface-500 mb-1 block font-medium">Admin Response</label>
                <textarea rows={3} value={response} onChange={e => setResponse(e.target.value)} placeholder="Write your response..."
                  className="w-full px-3 py-2 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
              </div>
              <button onClick={handleReview} disabled={saving}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all hover:shadow-glow-brand">
                {saving ? 'Saving...' : 'Submit Review'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
