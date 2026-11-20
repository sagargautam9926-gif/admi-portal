
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { inquiriesService } from '../api/inquiriesService';
import { isMockEnabled } from '../api/api';
import toast from 'react-hot-toast';

export const Topbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [newCount, setNewCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isMock = isMockEnabled();

  const getPageTitle = () => {
    if (title) return title;
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/services')) return 'Services Management';
    if (path.includes('/careers')) return 'Career Openings';
    if (path.includes('/inquiries')) return 'Client Inquiries';
    if (path.includes('/settings')) return 'Site & System Settings';
    return 'Admin Portal';
  };

  const fetchBadge = async () => {
    try {
      const count = await inquiriesService.getNewCount();
      setNewCount(count);
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    fetchBadge();
    const interval = setInterval(fetchBadge, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all shadow-sm">

      {/* Page Title */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-wide">
          {getPageTitle()}
        </h2>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500">
            Code Eagle Info Solutions (Indore, India)
          </span>

          {isMock && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              <Sparkles className="w-2.5 h-2.5" />
              Mock DB Active
            </span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => navigate('/inquiries')}
          aria-label="View inquiries notifications"
          className="relative p-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
          title="Go to Inquiries"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />

          {newCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {newCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 text-xs font-bold">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CE'}
              </span>
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {user?.name || 'Administrator'}
              </p>

              <p className="text-[10px] text-blue-600 capitalize flex items-center gap-1 leading-tight">
                <ShieldCheck className="w-2.5 h-2.5" />
                {user?.role || 'Admin'}
              </p>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                profileOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50">

              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {user?.name}
                </p>

                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email}
                </p>

                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                    Role: {user?.role}
                  </span>
                </div>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
