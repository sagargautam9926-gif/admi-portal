
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
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-left w-full shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden group ${
        onClick ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-wide uppercase">
            {title}
          </p>

          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center font-medium px-2 py-1 rounded-full ${
                trendPositive
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-rose-700 bg-rose-50'
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
            <span className="text-slate-500 truncate">{subtitle}</span>
          )}
        </div>
      )}
    </CardWrapper>
  );
};

export default StatCard;
