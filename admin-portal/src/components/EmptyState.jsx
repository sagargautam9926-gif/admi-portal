
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
      className={`bg-white p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-slate-200 rounded-2xl shadow-sm ${className}`}
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
        <Icon className="w-8 h-8" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 max-w-md mb-6">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 outline-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
