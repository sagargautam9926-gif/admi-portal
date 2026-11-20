
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({
  size = 'md',
  text = 'Loading...',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      role="status"
      aria-label={text || 'Loading'}
      className={`flex flex-col items-center justify-center p-6 gap-3 ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full blur-md bg-blue-200/60 animate-pulse" />

        <Loader2
          className={`${sizeMap[size] || sizeMap.md} animate-spin text-blue-600 relative z-10`}
        />
      </div>

      {text && (
        <span className="text-xs sm:text-sm font-medium tracking-wide text-slate-600 animate-pulse">
          {text}
        </span>
      )}

      <span className="sr-only">{text || 'Loading'}</span>
    </div>
  );
};

export default Loader;
