
import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const norm = String(status || '').trim().toLowerCase();

  let styles = 'bg-slate-100 text-slate-600 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (norm === 'new') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (norm === 'in progress') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (
    norm === 'resolved' ||
    norm === 'open' ||
    norm === 'active'
  ) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (norm === 'closed' || norm === 'inactive') {
    styles = 'bg-slate-100 text-slate-500 border-slate-200';
    dotColor = 'bg-slate-400';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
