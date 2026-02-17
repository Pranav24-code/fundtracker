'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplaints, submitComplaint, upvoteComplaint } from '@/redux/slices/complaintSlice';
import { projectsAPI } from '@/utils/api';
import type { AppDispatch, RootState } from '@/redux/store';
import StatusBadge from '@/components/common/StatusBadge';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function CitizenComplaints() {
  const dispatch = useDispatch<AppDispatch>();
  const { complaints, loading } = useSelector((s: RootState) => s.complaints);
  const { user } = useSelector((s: RootState) => s.auth);
  const [projects, setProjects] = useState<any[]>([]);
  const [tab, setTab] = useState<'file' | 'my'>('file');

  // Form state
  const [projectId, setProjectId] = useState('');
  const [issueType, setIssueType] = useState('Quality Issues');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const issueTypes = ['Quality Issues', 'Budget Misuse', 'Timeline Delays', 'Safety Concerns', 'Other'];

  useEffect(() => {
    dispatch(fetchComplaints({}));
    projectsAPI.getAll({ limit: 100 }).then(res => {
      setProjects(res.data.data?.projects || res.data.projects || []);
    }).catch(() => {});
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) { toast.error('Please select a project'); return; }
    setSubmitting(true);
    try {
      await dispatch(submitComplaint({ project: projectId, issueType, description, location })).unwrap();
      toast.success('Complaint submitted! You will receive a tracking ID.');
      setDescription('');
      setLocation('');
      setProjectId('');
      setTab('my');
      dispatch(fetchComplaints({}));
    } catch (err: any) {
      toast.error(err || 'Error submitting complaint');
    } finally { setSubmitting(false); }
  };

  const handleUpvote = async (id: string) => {
    try {
      await dispatch(upvoteComplaint(id)).unwrap();
    } catch (err: any) {
      toast.error(err || 'Error upvoting');
    }
  };

  const myComplaints = complaints.filter((c: any) => c.citizen?._id === user?._id || c.citizen === user?._id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Complaints</h1>
        <p className="text-surface-500 text-sm mt-1">Report issues or view your submissions</p>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-surface-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('file')} className={`px-4 py-2 text-sm rounded-lg transition-all ${tab === 'file' ? 'bg-white text-brand-700 font-semibold shadow-soft' : 'text-surface-500 hover:text-surface-700'}`}>
          File Complaint
        </button>
        <button onClick={() => setTab('my')} className={`px-4 py-2 text-sm rounded-lg transition-all ${tab === 'my' ? 'bg-white text-brand-700 font-semibold shadow-soft' : 'text-surface-500 hover:text-surface-700'}`}>
          My Complaints ({myComplaints.length})
        </button>
      </div>

      {tab === 'file' && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit}
          className="bg-white border border-surface-200/60 rounded-2xl p-6 space-y-4 max-w-xl shadow-card">
          <div>
            <label className="text-xs text-surface-500 mb-1 block font-medium">Select Project</label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)} required
              className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
              <option value="">Choose a project...</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-surface-500 mb-1 block font-medium">Issue Type</label>
            <select value={issueType} onChange={e => setIssueType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
              {issueTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-surface-500 mb-1 block font-medium">Description</label>
            <textarea rows={4} required value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
          </div>
          <div>
            <label className="text-xs text-surface-500 mb-1 block font-medium">Location (optional)</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Near City Hall, Sector 5"
              className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-glow-brand">
            {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Submit Complaint
          </button>
        </motion.form>
      )}

      {tab === 'my' && (
        <div className="space-y-4">
          {loading && <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}
          {!loading && myComplaints.length === 0 && (
            <p className="text-surface-400 text-center py-12">You haven&apos;t filed any complaints yet</p>
          )}
          {myComplaints.map((c: any, i: number) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-surface-200/60 rounded-2xl p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-brand-600">{c.trackingId}</span>
                    <StatusBadge status={c.status} type="complaint" />
                  </div>
                  <p className="text-sm font-semibold text-surface-800">{c.issueType}</p>
                  <p className="text-xs text-surface-400 mt-1 line-clamp-2">{c.description}</p>
                  <p className="text-xs text-surface-400 mt-2">
                    Project: {c.project?.title || 'N/A'} &middot; {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                  {c.adminResponse && (
                    <div className="mt-3 p-3 bg-brand-50 border border-brand-100 rounded-xl">
                      <p className="text-xs text-brand-700 font-semibold mb-1">Admin Response</p>
                      <p className="text-xs text-surface-600">{c.adminResponse}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => handleUpvote(c._id)}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-surface-50 border border-surface-200 hover:bg-surface-100 transition-colors">
                  <span className="text-lg">👍</span>
                  <span className="text-xs font-mono text-surface-500">{c.upvotes || 0}</span>
                </button>
              </div>
            </motion.div>
          ))}

          {/* All complaints feed */}
          {!loading && complaints.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-surface-700 mb-4">Community Complaints</h3>
              {complaints.filter((c: any) => c.citizen?._id !== user?._id && c.citizen !== user?._id).slice(0, 10).map((c: any) => (
                <div key={c._id} className="bg-white border border-surface-200/60 rounded-2xl p-4 mb-3 flex items-center justify-between shadow-soft">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-surface-400">{c.trackingId}</span>
                    <p className="text-sm text-surface-800 mt-0.5">{c.issueType} — <span className="text-surface-500">{c.description?.slice(0, 60)}...</span></p>
                  </div>
                  <button onClick={() => handleUpvote(c._id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-50 border border-surface-200 hover:bg-surface-100 text-sm transition-colors">
                    👍 <span className="font-mono text-xs text-surface-500">{c.upvotes || 0}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
