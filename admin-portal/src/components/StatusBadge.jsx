import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const norm = String(status || '').trim().toLowerCase();

  let styles = 'bg-slate-800/80 text-slate-300 border-slate-700';

  if (norm === 'new') {
    styles = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(25,211,255,0.2)]';
  } else if (norm === 'in progress') {
    styles = 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
  } else if (norm === 'resolved' || norm === 'open' || norm === 'active') {
    styles = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
  } else if (norm === 'closed' || norm === 'inactive') {
    styles = 'bg-navy-900 text-slate-400 border-border-blue/60';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide transition-all ${styles} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          norm === 'new'
            ? 'bg-cyan-400 animate-pulse'
            : norm === 'in progress'
            ? 'bg-amber-400'
            : norm === 'resolved' || norm === 'open' || norm === 'active'
            ? 'bg-emerald-400'
            : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;

