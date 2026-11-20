
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
    navItems.push({
      name: 'Site Settings',
      to: '/settings',
      icon: Settings,
    });
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-30 shadow-sm">

        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <CodeEagleLogo size="md" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto">

          <div className="px-3 pb-3 text-[10px] font-semibold tracking-wider uppercase text-slate-500 flex items-center justify-between">
            <span>Admin Console</span>

            <span className="text-[9px] px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
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
                  `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-100 font-semibold'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-blue-600'
                            : 'text-slate-500 group-hover:text-blue-600'
                        }`}
                      />

                      <span>{item.name}</span>
                    </div>

                    {item.badge ? (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-600 text-white">
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card and Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">

          <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white border border-slate-200">

            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-700 font-bold text-xs">
                {user?.name
                  ? user.name.slice(0, 2).toUpperCase()
                  : 'CE'}
              </span>
            </div>

            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user?.name || 'Administrator'}
              </p>

              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span className="capitalize">
                  {user?.role || 'User'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-3 py-2.5 flex items-center gap-2 overflow-x-auto shadow-sm">

        <div className="pr-3 border-r border-slate-200 shrink-0">
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
                  `flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 bg-slate-100 hover:bg-blue-50'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>

                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white text-blue-700 font-bold">
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
