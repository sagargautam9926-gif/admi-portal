import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-navy-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full card-gradient border border-border-blue p-8 sm:p-10 text-center relative z-10 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-navy-900 border border-border-blue mx-auto flex items-center justify-center text-brand-cyan mb-6 shadow-glow-cyan animate-pulse">
          <Compass className="w-10 h-10" />
        </div>

        <span className="inline-block text-xs font-bold tracking-widest uppercase text-brand-cyan bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800 mb-3">
          Error 404
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-brand-text/80 mb-8 leading-relaxed">
          The admin route you requested does not exist or may have been relocated within the Code Eagle portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary w-full sm:w-auto text-xs sm:text-sm py-2.5 px-5 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full sm:w-auto text-xs sm:text-sm py-2.5 px-6 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-brand-cyan" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

