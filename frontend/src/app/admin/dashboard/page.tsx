'use client';

import { useEffect, useState } from 'react';
import { statsAPI, projectsAPI, complaintsAPI } from '@/utils/api';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, deptRes, projRes, compRes] = await Promise.all([
          statsAPI.getDashboardStats(),
          statsAPI.getDepartmentAllocation(),
          projectsAPI.getAll({ limit: 10 }),
          complaintsAPI.getAll({ limit: 5 }),
        ]);
        const s = statsRes.data.data || statsRes.data;
        const dept = deptRes.data.data?.allocation || deptRes.data.allocation || [];
        setStats({ ...s, departmentAllocation: dept });
        setProjects((projRes.data.data?.projects || projRes.data.projects || []).slice(0, 8));
        setComplaints((compRes.data.data?.complaints || compRes.data.complaints || []).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  const statCards = [
    { label: 'Total Projects', value: stats?.activeProjects || 0, icon: '📊', gradient: 'from-brand-500 to-brand-600', bg: 'bg-brand-50', text: 'text-brand-700' },
    { label: 'Total Budget', value: stats?.totalBudgetAllocated || 0, isMoney: true, icon: '💰', gradient: 'from-success-500 to-success-600', bg: 'bg-success-50', text: 'text-success-700' },
    { label: 'Active Complaints', value: stats?.pendingComplaints ?? stats?.totalComplaints ?? 0, icon: '📋', gradient: 'from-warning-500 to-warning-600', bg: 'bg-warning-50', text: 'text-warning-700' },
    { label: 'Risk Flagged', value: stats?.riskFlaggedProjects ?? 0, icon: '🚨', gradient: 'from-danger-500 to-danger-600', bg: 'bg-danger-50', text: 'text-danger-700' },
    { label: 'Completed', value: stats?.projectCounts?.['Completed'] ?? 0, icon: '✅', gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-700' },
  ];

  const statusData = [
    { name: 'On Time', value: stats?.projectCounts?.['On Time'] || 0 },
    { name: 'Delayed', value: stats?.projectCounts?.['Delayed'] || 0 },
    { name: 'Critical', value: stats?.projectCounts?.['Critical'] || 0 },
    { name: 'Completed', value: stats?.projectCounts?.['Completed'] || 0 },
  ].filter(d => d.value > 0);
  const pieColors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const deptData = (stats?.departmentAllocation || []).map((d: any) => ({
    name: (d.department || d._id || '').slice(0, 12),
    value: d.projectCount || 0,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Admin Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">Public Expenditure Monitoring Overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} {...fadeUp} transition={{ delay: i * 0.05 }}
            className="bg-white border border-surface-200/60 rounded-2xl p-5 hover:shadow-card transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-surface-500 font-medium">{card.label}</p>
              <span className="text-lg">{card.icon}</span>
            </div>
            <p className={`text-xl font-mono font-bold ${card.text}`}>
              {card.isMoney ? <MoneyDisplay amount={card.value} /> : card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Projects by Status</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12, color: '#64748B' }} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-surface-400 text-sm">No data</p>}
        </div>

        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Projects by Department</h2>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="value" stroke="#6366F1" fill="rgba(99,102,241,0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-surface-400 text-sm">No data</p>}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-surface-700">Recent Projects</h2>
          <a href="/admin/projects" className="text-xs text-brand-600 hover:text-brand-700 font-medium">View All &rarr;</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-surface-400 text-xs border-b border-surface-100">
                <th className="py-3 pr-4 font-medium">Title</th>
                <th className="py-3 pr-4 font-medium">Department</th>
                <th className="py-3 pr-4 font-medium">Budget</th>
                <th className="py-3 pr-4 font-medium">Progress</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p: any) => (
                <tr key={p._id} className="border-b border-surface-100 hover:bg-surface-50 cursor-pointer transition-colors" onClick={() => window.location.href = `/admin/projects/${p._id}`}>
                  <td className="py-3 pr-4 text-surface-800 font-medium truncate max-w-[200px]">{p.title}</td>
                  <td className="py-3 pr-4 text-surface-500">{p.department}</td>
                  <td className="py-3 pr-4 font-mono text-surface-600"><MoneyDisplay amount={p.totalBudget} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-100 rounded-full">
                        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${p.completionPercentage || 0}%` }} />
                      </div>
                      <span className="text-xs text-surface-500 font-mono">{p.completionPercentage || 0}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                  <td className="py-3"><RiskBadge riskFlag={p.riskFlag} riskFactors={p.riskFactors} /></td>
                </tr>
              ))}
              {projects.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-surface-400">No projects found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Alerts & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">&#9888; Risk Alerts</h2>
          <div className="space-y-3">
            {projects.filter((p: any) => p.riskFlag).slice(0, 4).map((p: any) => (
              <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-danger-50 border border-danger-100">
                <div>
                  <p className="text-sm text-surface-800 font-medium truncate max-w-[200px]">{p.title}</p>
                  <p className="text-xs text-surface-400">{p.riskFactors?.join(', ') || 'Flagged'}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
            {projects.filter((p: any) => p.riskFlag).length === 0 && (
              <p className="text-surface-400 text-sm">No risk alerts</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Recent Complaints</h2>
          <div className="space-y-3">
            {complaints.map((c: any) => (
              <div key={c._id} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-100">
                <div>
                  <p className="text-sm text-surface-800 font-medium truncate max-w-[200px]">{c.description?.slice(0, 50) || c.issueType}</p>
                  <p className="text-xs text-surface-400">{c.trackingId} &middot; {c.issueType}</p>
                </div>
                <StatusBadge status={c.status} type="complaint" />
              </div>
            ))}
            {complaints.length === 0 && <p className="text-surface-400 text-sm">No complaints</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
