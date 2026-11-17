import React from 'react';

export const CodeEagleLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', title: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 'w-9 h-9', title: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', title: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', title: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Glowing Cybernetic Emblem Icon */}
      <div className={`relative ${currentSize.icon} shrink-0`}>
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-pulse" />
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(25,211,255,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="url(#eagleCyanGrad)"
            strokeWidth="3"
            strokeDasharray="14 6 8 4"
          />
          {/* Inner Circuit Arcs */}
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#1e6bff"
            strokeWidth="2"
            opacity="0.8"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="url(#eagleCyanGrad)"
            strokeWidth="2.5"
            strokeDasharray="18 8 10 4"
          />
          <circle
            cx="50"
            cy="50"
            r="22"
            stroke="#19d3ff"
            strokeWidth="2"
            opacity="0.9"
          />
          {/* Core Central Node */}
          <circle cx="50" cy="50" r="14" fill="url(#eagleCoreGrad)" />
          <circle
            cx="50"
            cy="50"
            r="6"
            fill="#ffffff"
            className="animate-ping"
            opacity="0.75"
          />
          <circle cx="50" cy="50" r="5" fill="#ffffff" />

          {/* Radiating Circuit Nodes */}
          <circle cx="50" cy="12" r="3" fill="#19d3ff" />
          <circle cx="88" cy="50" r="3" fill="#19d3ff" />
          <circle cx="50" cy="88" r="3" fill="#19d3ff" />
          <circle cx="12" cy="50" r="3" fill="#19d3ff" />
          <circle cx="77" cy="23" r="2.5" fill="#1e6bff" />
          <circle cx="23" cy="77" r="2.5" fill="#1e6bff" />
          <circle cx="77" cy="77" r="2.5" fill="#19d3ff" />
          <circle cx="23" cy="23" r="2.5" fill="#19d3ff" />

          <defs>
            <linearGradient id="eagleCyanGrad" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#19d3ff" />
              <stop offset="50%" stopColor="#1e6bff" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>
            <radialGradient id="eagleCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#19d3ff" />
              <stop offset="100%" stopColor="#0b2475" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="overflow-hidden leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`${currentSize.title} font-bold text-white tracking-wide font-sans`}>
              Code <span className="text-brand-cyan">Eagle</span>
            </span>
          </div>
          <span className={`${currentSize.sub} text-brand-muted tracking-tight block font-normal truncate`}>
            Info Solutions Pvt. Ltd
          </span>
        </div>
      )}
    </div>
  );
};

export default CodeEagleLogo;

