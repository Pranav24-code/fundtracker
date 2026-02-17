'use client';

import { useEffect, useState, useRef } from 'react';
import { projectsAPI } from '@/utils/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function ContractorUpdates() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [progressPercentage, setProgressPercentage] = useState('');
  const [description, setDescription] = useState('');
  const [workDone, setWorkDone] = useState('');
  const [issuesFaced, setIssuesFaced] = useState('');
  const [nextMilestone, setNextMilestone] = useState('');
  const [laborCount, setLaborCount] = useState('');
  const [materialsSummary, setMaterialsSummary] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [gps, setGps] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    projectsAPI.getAll({ limit: 100 }).then(res => {
      setProjects(res.data.data?.projects || res.data.projects || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const captureGPS = () => {
    if (!navigator.geolocation) { toast.error('GPS not supported'); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setGpsLoading(false);
        toast.success(`GPS captured: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        toast.error('Failed to get GPS: ' + err.message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (photos.length + newFiles.length > 5) {
        toast.error('Maximum 5 photos allowed');
        return;
      }
      setPhotos([...photos, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) { toast.error('Select a project'); return; }
    if (!progressPercentage) { toast.error('Enter progress percentage'); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('progressPercentage', progressPercentage);
      formData.append('description', description);
      if (workDone) formData.append('workDone', workDone);
      if (issuesFaced) formData.append('issuesFaced', issuesFaced);
      if (nextMilestone) formData.append('nextMilestone', nextMilestone);
      if (laborCount) formData.append('laborCount', laborCount);
      if (materialsSummary) formData.append('materialsSummary', materialsSummary);
      if (gps) {
        formData.append('latitude', String(gps.lat));
        formData.append('longitude', String(gps.lng));
        formData.append('gpsAccuracy', String(gps.accuracy));
      }
      photos.forEach(file => formData.append('photos', file));

      await projectsAPI.submitUpdate(projectId, formData);
      toast.success('Progress update submitted!');
      // Reset form
      setDescription('');
      setWorkDone('');
      setIssuesFaced('');
      setNextMilestone('');
      setLaborCount('');
      setMaterialsSummary('');
      setProgressPercentage('');
      setPhotos([]);
      setGps(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error submitting update');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Submit Progress Update</h1>
        <p className="text-surface-500 text-sm mt-1">Upload site photos and progress details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Selection */}
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 space-y-4 shadow-soft">
          <h3 className="text-sm font-semibold text-surface-700">Project & Progress</h3>
          <select value={projectId} onChange={e => setProjectId(e.target.value)} required
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20">
            <option value="">Select Project...</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.title} ({p.completionPercentage || 0}%)</option>)}
          </select>
          <div>
            <label className="text-xs text-surface-500 mb-1 block font-medium">Progress Percentage</label>
            <input type="number" min="0" max="100" required value={progressPercentage} onChange={e => setProgressPercentage(e.target.value)}
              placeholder="e.g. 45" className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20" />
          </div>
          <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} required
            placeholder="Overall progress description..."
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20" />
        </div>

        {/* Work Details */}
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 space-y-4 shadow-soft">
          <h3 className="text-sm font-semibold text-surface-700">Work Details (optional)</h3>
          <textarea rows={2} value={workDone} onChange={e => setWorkDone(e.target.value)} placeholder="Specific work completed..."
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20" />
          <textarea rows={2} value={issuesFaced} onChange={e => setIssuesFaced(e.target.value)} placeholder="Issues or challenges faced..."
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20" />
          <input type="text" value={nextMilestone} onChange={e => setNextMilestone(e.target.value)} placeholder="Next milestone..."
            className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" value={laborCount} onChange={e => setLaborCount(e.target.value)} placeholder="Labor count"
              className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20" />
            <input type="text" value={materialsSummary} onChange={e => setMaterialsSummary(e.target.value)} placeholder="Materials summary"
              className="px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20" />
          </div>
        </div>

        {/* GPS */}
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-surface-700">📍 GPS Location</h3>
            <button type="button" onClick={captureGPS} disabled={gpsLoading}
              className="px-4 py-2 bg-accent-50 text-accent-600 text-xs rounded-xl hover:bg-accent-100 disabled:opacity-50 flex items-center gap-1 border border-accent-200 transition-colors">
              {gpsLoading && <div className="w-3 h-3 border border-accent-500 border-t-transparent rounded-full animate-spin" />}
              {gps ? 'Re-capture' : 'Capture GPS'}
            </button>
          </div>
          {gps ? (
            <div className="p-3 bg-success-50 border border-success-200 rounded-xl">
              <p className="text-sm text-success-700 font-mono">{gps.lat.toFixed(6)}, {gps.lng.toFixed(6)}</p>
              <p className="text-xs text-surface-500 mt-1">Accuracy: ±{gps.accuracy.toFixed(0)}m</p>
            </div>
          ) : (
            <p className="text-xs text-surface-400">Click &quot;Capture GPS&quot; to record your location at the project site</p>
          )}
        </div>

        {/* Photos */}
        <div className="bg-white border border-surface-200/60 rounded-2xl p-6 shadow-soft">
          <h3 className="text-sm font-semibold text-surface-700 mb-3">📸 Site Photos (max 5)</h3>
          <div className="flex flex-wrap gap-3 mb-3">
            {photos.map((file, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group border border-surface-200">
                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePhoto(i)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity rounded-xl">
                  Remove
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 border-2 border-dashed border-surface-200 rounded-xl flex items-center justify-center text-surface-400 hover:border-accent-300 hover:text-accent-500 transition-colors">
                <span className="text-2xl">+</span>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoAdd} className="hidden" />
        </div>

        {/* Submit */}
        <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="w-full py-3.5 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-all hover:shadow-glow-brand">
          {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Submit Progress Update
        </motion.button>
      </form>
    </div>
  );
}
