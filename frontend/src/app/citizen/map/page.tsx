'use client';

import { useEffect, useState } from 'react';
import { projectsAPI } from '@/utils/api';
import dynamic from 'next/dynamic';

const ProjectMapFull = dynamic(() => import('@/components/common/ProjectMapFull'), { ssr: false });

export default function CitizenMap() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'risk' | 'completed'>('all');

  useEffect(() => {
    projectsAPI.getAll({ limit: 200 }).then(res => {
      setProjects(res.data.data?.projects || res.data.projects || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    if (filter === 'risk') return p.riskFlag;
    if (filter === 'completed') return p.status === 'Completed';
    return true;
  });

  const projectsWithCoords = filtered.filter(p => p.location?.coordinates?.latitude && p.location?.coordinates?.longitude);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">Project Map</h1>
          <p className="text-surface-500 text-sm mt-1">{projectsWithCoords.length} projects on map</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'risk', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-xl transition-all ${filter === f ? 'bg-brand-600 text-white font-semibold shadow-glow-brand' : 'bg-white border border-surface-200 text-surface-500 hover:text-surface-700 hover:border-surface-300'}`}>
              {f === 'all' ? 'All' : f === 'risk' ? '⚠️ Risk Flagged' : '✅ Completed'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-surface-200/60 rounded-2xl overflow-hidden shadow-card" style={{ height: 'calc(100vh - 200px)' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ProjectMapFull projects={filtered} />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-surface-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full inline-block" /> Normal Project</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full inline-block" /> Risk Flagged</span>
      </div>
    </div>
  );
}
