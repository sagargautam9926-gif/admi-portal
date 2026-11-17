import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendPositive = true,
  subtitle,
  onClick,
  className = '',
}) => {
  const CardWrapper = onClick ? 'button' : 'div';

  return (
    <CardWrapper
      onClick={onClick}
      className={`card-gradient card-gradient-hover p-5 sm:p-6 text-left w-full transition-all duration-300 relative overflow-hidden group ${
        onClick ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-cyan outline-none' : ''
      } ${className}`}
    >
      {/* Decorative background glow circle */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-brand-cyan/5 blur-xl group-hover:bg-brand-cyan/15 transition-all pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-brand-muted tracking-wide uppercase">
            {title}
          </p>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="p-3 rounded-xl bg-navy-900 border border-border-blue/80 text-brand-cyan group-hover:scale-110 group-hover:border-brand-cyan/50 transition-all shadow-glow-sm">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center font-medium px-2 py-0.5 rounded-full ${
                trendPositive
                  ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/60'
                  : 'text-rose-400 bg-rose-950/50 border border-rose-800/60'
              }`}
            >
              {trendPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-brand-muted/80 truncate">{subtitle}</span>
          )}
        </div>
      )}
    </CardWrapper>
  );
};

export default StatCard;

