'use client';

const statusColors: Record<string, string> = {
  // Project statuses
  'On Time': 'bg-blue-50 text-blue-700 border-blue-200',
  'Delayed': 'bg-amber-50 text-amber-700 border-amber-200',
  'Critical': 'bg-red-50 text-red-700 border-red-200',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  // Lowercase aliases
  'planning': 'bg-slate-50 text-slate-600 border-slate-200',
  'active': 'bg-blue-50 text-blue-700 border-blue-200',
  'delayed': 'bg-amber-50 text-amber-700 border-amber-200',
  'completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'suspended': 'bg-red-50 text-red-700 border-red-200',
  // Complaint statuses
  'Pending': 'bg-slate-50 text-slate-600 border-slate-200',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
  'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Closed': 'bg-slate-50 text-slate-600 border-slate-200',
  'pending': 'bg-slate-50 text-slate-600 border-slate-200',
  'under_review': 'bg-blue-50 text-blue-700 border-blue-200',
  'resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'rejected': 'bg-red-50 text-red-700 border-red-200',
  // Tranche statuses
  'released': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'on_hold': 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function StatusBadge({ status, type }: { status: string; type?: string }) {
  const color = statusColors[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {status}
    </span>
  );
}
