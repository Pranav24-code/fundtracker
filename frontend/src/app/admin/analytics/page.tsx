'use client';

import { useEffect, useState } from 'react';
import { statsAPI } from '@/utils/api';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#14B8A6', '#F97316', '#EF4444'];
const chartTooltipStyle = { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12, color: '#334155', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [risk, setRisk] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, deptRes, riskRes] = await Promise.all([
          statsAPI.getDashboardStats(),
          statsAPI.getDepartmentAllocation().catch(() => ({ data: { data: { allocation: [] } } })),
          statsAPI.getRiskBreakdown().catch(() => ({ data: { data: { breakdown: [] } } })),
        ]);
        const s = statsRes.data.data || statsRes.data;
        const dept = deptRes.data.data?.allocation || deptRes.data.allocation || [];
        setStats({ ...s, departmentAllocation: dept });
        const rb = riskRes.data.data?.breakdown || riskRes.data.breakdown || riskRes.data.data || [];
        setRisk(Array.isArray(rb) ? rb : []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;

  const deptData = (stats?.departmentAllocation || []).map((d: any) => {
    const name = d.department || d._id || '';
    return { name: name.length > 15 ? name.slice(0, 15) + '…' : name, count: d.projectCount || 0, fullName: name };
  });

  const statusPie = [
    { name: 'On Time', value: stats?.projectCounts?.['On Time'] || 0, color: '#10B981' },
    { name: 'Delayed', value: stats?.projectCounts?.['Delayed'] || 0, color: '#F59E0B' },
    { name: 'Critical', value: stats?.projectCounts?.['Critical'] || 0, color: '#EF4444' },
    { name: 'Completed', value: stats?.projectCounts?.['Completed'] || 0, color: '#8B5CF6' },
  ].filter(d => d.value > 0);

  const budgetPie = [
    { name: 'Spent', value: stats?.totalBudgetSpent || 0 },
    { name: 'Remaining', value: Math.max(0, (stats?.totalBudgetAllocated || 0) - (stats?.totalBudgetSpent || 0)) },
  ];

  const riskData = risk.map((r: any) => ({ name: r._id || r.factor || 'Unknown', count: r.count || r.total || 0 }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Analytics</h1>
        <p className="text-surface-500 text-sm mt-1">Deep dive into project metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft hover:shadow-card transition-shadow">
          <p className="text-xs text-surface-500 font-medium">Avg Completion</p>
          <p className="text-2xl font-mono font-bold text-brand-600">{stats?.averageCompletion?.toFixed(1) || 0}%</p>
        </div>
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft hover:shadow-card transition-shadow">
          <p className="text-xs text-surface-500 font-medium">Total Budget</p>
          <p className="text-2xl font-mono font-bold text-success-600"><MoneyDisplay amount={stats?.totalBudgetAllocated || 0} /></p>
        </div>
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft hover:shadow-card transition-shadow">
          <p className="text-xs text-surface-500 font-medium">Risk Rate</p>
          <p className="text-2xl font-mono font-bold text-danger-600">
            {stats?.activeProjects ? ((stats?.riskFlaggedProjects || 0) / stats.activeProjects * 100).toFixed(1) : 0}%
          </p>
        </div>
        <div className="bg-white border border-surface-200/60 p-5 rounded-2xl shadow-soft hover:shadow-card transition-shadow">
          <p className="text-xs text-surface-500 font-medium">Complaint Resolution</p>
          <p className="text-2xl font-mono font-bold text-blue-600">
            {stats?.totalComplaints ? ((stats?.resolvedComplaints || 0) / stats.totalComplaints * 100).toFixed(0) : 0}%
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Projects by Department</h2>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-surface-400 text-sm">No data</p>}
        </div>

        {/* Status Distribution */}
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Status Distribution</h2>
          {statusPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusPie} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value" label={(props: any) => `${props.name || ''} ${((props.percent || 0) * 100).toFixed(0)}%`}>
                  {statusPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-surface-400 text-sm">No data</p>}
        </div>

        {/* Budget Utilization */}
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Budget Utilization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={budgetPie} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">
                <Cell fill="#6366F1" />
                <Cell fill="#E2E8F0" />
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12, color: '#64748B' }} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: any) => `₹${(Number(v) / 10000000).toFixed(2)} Cr`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Breakdown */}
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Risk Factor Breakdown</h2>
          {riskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 10 }} width={120} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#EF4444" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-surface-400 text-sm">No risk data available</p>}
        </div>
      </div>
    </div>
  );
}
