import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Mail,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { inquiriesService } from '../api/inquiriesService';
import CodeEagleLogo from './CodeEagleLogo';
import toast from 'react-hot-toast';

export const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [newCount, setNewCount] = useState(0);

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

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Services', to: '/services', icon: Layers },
    { name: 'Careers', to: '/careers', icon: Briefcase },
    {
      name: 'Inquiries',
      to: '/inquiries',
      icon: Mail,
      badge: newCount > 0 ? newCount : null,
    },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Site Settings', to: '/settings', icon: Settings });
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-[#030b2c]/95 backdrop-blur-xl border-r border-[#1a3888] z-30 shadow-2xl">
        {/* Brand Header with Official Logo */}
        <div className="p-5 border-b border-[#1a3888]/80 flex items-center justify-between">
          <CodeEagleLogo size="md" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-brand-muted/70 flex items-center justify-between">
            <span>Admin Console</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-brand-cyan border border-brand-cyan/30">
              Indore HQ
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0d2a8a] to-[#091b5c] text-brand-cyan border border-brand-cyan/50 shadow-[0_0_15px_rgba(25,211,255,0.25)] font-semibold'
                      : 'text-brand-text hover:text-white hover:bg-[#07174e]/60 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-brand-cyan drop-shadow-[0_0_8px_rgba(25,211,255,0.7)]' : 'text-brand-muted'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge ? (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-cyan text-navy-950 shadow-glow-cyan animate-pulse">
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-brand-cyan opacity-80" />
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#1a3888]/80 bg-[#02071d]/60">
          <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-[#07174e]/70 border border-[#1c3a9e]/60">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan p-0.5 flex items-center justify-center shrink-0 shadow-glow-sm">
              <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center text-brand-cyan font-bold text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CE'}
              </div>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Administrator'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-brand-muted">
                <ShieldCheck className="w-3 h-3 text-brand-cyan" />
                <span className="capitalize">{user?.role || 'User'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-300 hover:text-white bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 hover:border-red-600 transition-all focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Horizontal Scroll Bar */}
      <nav className="md:hidden sticky top-0 z-40 bg-[#030b2c]/95 backdrop-blur-lg border-b border-[#1a3888] px-3 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-lg">
        <div className="pr-3 border-r border-[#1a3888] shrink-0">
          <CodeEagleLogo size="sm" showText={false} />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-blue to-cyan-500 text-white shadow-glow-sm font-semibold'
                      : 'text-brand-text bg-navy-900/80 border border-border-blue/50'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-brand-cyan text-navy-950 font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
