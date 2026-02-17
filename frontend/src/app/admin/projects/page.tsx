'use client';

import { useEffect, useState } from 'react';
import { projectsAPI } from '@/utils/api';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import SearchInput from '@/components/common/SearchInput';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new project
  const [form, setForm] = useState({
    title: '', description: '', department: 'Public Works', totalBudget: '',
    startDate: '', expectedEndDate: '', 'location.address': '', 'location.city': '', 'location.state': '',
    'location.pincode': '', 'location.coordinates.latitude': '', 'location.coordinates.longitude': '',
  });
  const [creating, setCreating] = useState(false);

  const departments = ['Public Works', 'Education', 'Healthcare', 'Transportation', 'Water Resources',
    'Urban Development', 'Rural Development', 'Energy', 'Agriculture'];
  const statuses = ['On Time', 'Delayed', 'Critical', 'Completed'];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await projectsAPI.getAll({ limit: 100 });
      setProjects(res.data.data?.projects || res.data.projects || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filtered = projects.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.department?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (departmentFilter && p.department !== departmentFilter) return false;
    return true;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload: any = {
        title: form.title, description: form.description, department: form.department,
        totalBudget: Number(form.totalBudget), startDate: form.startDate, expectedEndDate: form.expectedEndDate,
        location: {
          address: form['location.address'], city: form['location.city'],
          state: form['location.state'], pincode: form['location.pincode'],
          coordinates: {
            latitude: Number(form['location.coordinates.latitude']) || 0,
            longitude: Number(form['location.coordinates.longitude']) || 0,
          }
        }
      };
      await projectsAPI.create(payload);
      toast.success('Project created!');
      setShowAddModal(false);
      setForm({ title: '', description: '', department: 'Public Works', totalBudget: '', startDate: '', expectedEndDate: '', 'location.address': '', 'location.city': '', 'location.state': '', 'location.pincode': '', 'location.coordinates.latitude': '', 'location.coordinates.longitude': '' });
      loadProjects();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error creating project');
    } finally { setCreating(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">Projects</h1>
          <p className="text-surface-500 text-sm mt-1">{projects.length} total projects</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-glow-brand">
          + Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." className="w-64" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-surface-200/60 rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-surface-400 text-xs border-b border-surface-100 bg-surface-50">
                <th className="py-3 px-4 font-medium">Title</th>
                <th className="py-3 px-4 font-medium">Department</th>
                <th className="py-3 px-4 font-medium">Budget</th>
                <th className="py-3 px-4 font-medium">Spent</th>
                <th className="py-3 px-4 font-medium">Progress</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Risk</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any, i: number) => (
                <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                  <td className="py-3 px-4 text-surface-800 font-medium truncate max-w-[200px]">{p.title}</td>
                  <td className="py-3 px-4 text-surface-500 text-xs">{p.department}</td>
                  <td className="py-3 px-4 font-mono text-surface-600 text-xs"><MoneyDisplay amount={p.totalBudget} /></td>
                  <td className="py-3 px-4 font-mono text-surface-600 text-xs"><MoneyDisplay amount={p.amountSpent} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-surface-100 rounded-full"><div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${p.completionPercentage || 0}%` }} /></div>
                      <span className="text-xs text-surface-500 font-mono">{p.completionPercentage || 0}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={p.status} /></td>
                  <td className="py-3 px-4"><RiskBadge riskFlag={p.riskFlag} riskFactors={p.riskFactors} /></td>
                  <td className="py-3 px-4">
                    <Link href={`/admin/projects/${p._id}`} className="text-brand-600 hover:text-brand-700 text-xs font-medium">View &rarr;</Link>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-surface-400">No projects match your filters</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-surface-200 rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-elevated"
            onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-heading font-bold text-surface-900 mb-6">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project Title"
                className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
              <textarea rows={3} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description"
                className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20">
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="number" required value={form.totalBudget} onChange={e => setForm({ ...form, totalBudget: e.target.value })} placeholder="Total Budget (₹)"
                  className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-surface-500 mb-1 block font-medium">Start Date</label>
                  <input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="text-xs text-surface-500 mb-1 block font-medium">Expected End Date</label>
                  <input type="date" required value={form.expectedEndDate} onChange={e => setForm({ ...form, expectedEndDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                </div>
              </div>
              <p className="text-xs text-surface-500 pt-2 font-medium">Location Details</p>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={form['location.address']} onChange={e => setForm({ ...form, 'location.address': e.target.value })} placeholder="Address"
                  className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                <input type="text" value={form['location.city']} onChange={e => setForm({ ...form, 'location.city': e.target.value })} placeholder="City"
                  className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                <input type="text" value={form['location.state']} onChange={e => setForm({ ...form, 'location.state': e.target.value })} placeholder="State"
                  className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                <input type="text" value={form['location.pincode']} onChange={e => setForm({ ...form, 'location.pincode': e.target.value })} placeholder="Pincode"
                  className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                <input type="number" step="any" value={form['location.coordinates.latitude']} onChange={e => setForm({ ...form, 'location.coordinates.latitude': e.target.value })} placeholder="Latitude"
                  className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
                <input type="number" step="any" value={form['location.coordinates.longitude']} onChange={e => setForm({ ...form, 'location.coordinates.longitude': e.target.value })} placeholder="Longitude"
                  className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border-2 border-surface-200 text-surface-600 rounded-xl font-medium hover:bg-surface-50 transition-colors">Cancel</button>
                <button type="submit" disabled={creating} className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all hover:shadow-glow-brand">
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
