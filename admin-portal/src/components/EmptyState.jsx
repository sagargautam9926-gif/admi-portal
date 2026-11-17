import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data matching your criteria.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`card-gradient p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-border-blue/60 ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-navy-900 border border-border-blue flex items-center justify-center text-brand-cyan mb-4 shadow-glow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-brand-text/80 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary text-sm focus-visible:ring-2 focus-visible:ring-brand-cyan"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

