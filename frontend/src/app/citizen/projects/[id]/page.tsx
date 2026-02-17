'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { projectsAPI } from '@/utils/api';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import ProgressRing from '@/components/common/ProgressRing';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ProjectMapView = dynamic(() => import('@/components/common/ProjectMapView'), { ssr: false });

export default function CitizenProjectDetail() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, updRes] = await Promise.all([
          projectsAPI.getById(id),
          projectsAPI.getUpdates(id).catch(() => ({ data: { data: { updates: [] } } })),
        ]);
        setProject(projRes.data.data?.project || projRes.data.project || projRes.data.data || projRes.data);
        setUpdates(updRes.data.data?.updates || updRes.data.updates || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <p className="text-surface-400 text-center py-20">Project not found</p>;

  const budgetUsed = project.totalBudget > 0 ? ((project.amountSpent || 0) / project.totalBudget * 100).toFixed(1) : 0;
  const lat = project.location?.coordinates?.latitude;
  const lng = project.location?.coordinates?.longitude;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <Link href="/citizen/dashboard" className="text-xs text-surface-500 hover:text-brand-600 transition-colors">← Back to Projects</Link>

      {/* Header */}
      <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-card">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={project.status} />
              <RiskBadge riskFlag={project.riskFlag} riskFactors={project.riskFactors} />
            </div>
            <h1 className="text-xl font-heading font-bold text-surface-900">{project.title}</h1>
            <p className="text-sm text-surface-500 mt-1">{project.department} &middot; {project.location?.city || 'N/A'}</p>
          </div>
          <ProgressRing percentage={project.completionPercentage || 0} size={100} />
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
        <h3 className="text-sm font-semibold text-surface-700 mb-2">About this Project</h3>
        <p className="text-sm text-surface-500 leading-relaxed">{project.description}</p>
      </div>

      {/* Budget + Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h3 className="text-sm font-semibold text-surface-700 mb-4">Budget</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-surface-500 text-sm">Total Budget</span><span className="font-mono text-surface-800"><MoneyDisplay amount={project.totalBudget} /></span></div>
            <div className="flex justify-between"><span className="text-surface-500 text-sm">Amount Spent</span><span className="font-mono text-accent-600"><MoneyDisplay amount={project.amountSpent} /></span></div>
            <div className="h-2 bg-surface-100 rounded-full">
              <div className="h-full bg-gradient-to-r from-brand-500 to-success-500 rounded-full" style={{ width: `${Math.min(Number(budgetUsed), 100)}%` }} />
            </div>
            <p className="text-xs text-surface-400 text-right">{budgetUsed}% utilized</p>
          </div>
        </div>
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h3 className="text-sm font-semibold text-surface-700 mb-4">Timeline</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-surface-500">Start Date</span><span className="text-surface-800">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-surface-500">Expected End</span><span className="text-surface-800">{project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString() : 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-surface-500">Contractor</span><span className="text-surface-800">{project.contractor?.name || 'Unassigned'}</span></div>
          </div>
        </div>
      </div>

      {/* Map */}
      {lat && lng && (
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h3 className="text-sm font-semibold text-surface-700 mb-3">Location</h3>
          <div className="h-64 rounded-xl overflow-hidden border border-surface-200">
            <ProjectMapView lat={lat} lng={lng} title={project.title} />
          </div>
          <p className="text-xs text-surface-400 mt-2">{project.location?.address}, {project.location?.city}, {project.location?.state}</p>
        </div>
      )}

      {/* Images */}
      {project.images?.length > 0 && (
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h3 className="text-sm font-semibold text-surface-700 mb-3">Project Photos</h3>
          <div className="grid grid-cols-3 gap-3">
            {project.images.map((img: any, i: number) => (
              <img key={i} src={img.url || img} alt="" className="w-full h-32 object-cover rounded-xl border border-surface-200" />
            ))}
          </div>
        </div>
      )}

      {/* Progress Updates Timeline */}
      <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
        <h3 className="text-sm font-semibold text-surface-700 mb-4">Progress Updates</h3>
        {updates.length === 0 ? (
          <p className="text-surface-400 text-sm">No updates yet</p>
        ) : (
          <div className="space-y-4">
            {updates.map((u: any, i: number) => (
              <motion.div key={u._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-6 pb-4 border-l-2 border-brand-200 last:border-l-0">
                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-brand-500 rounded-full" />
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-surface-800">{u.progressPercentage ?? u.newCompletion ?? 0}%</span>
                  <span className="text-xs text-surface-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-surface-500">{u.description || u.workDone || 'Progress update'}</p>
                {u.photos?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {u.photos.map((p: any, j: number) => <img key={j} src={p.url || p} className="w-14 h-14 object-cover rounded-lg border border-surface-200" />)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Report Issue CTA */}
      <div className="bg-white border-2 border-brand-100 rounded-2xl p-6 text-center shadow-soft">
        <p className="text-sm text-surface-600 mb-3">Found an issue with this project?</p>
        <Link href="/citizen/complaints" className="inline-block px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-glow-brand">
          File a Complaint
        </Link>
      </div>
    </div>
  );
}
