
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Briefcase, Layers, Users, PlusCircle, ArrowRight,
  Clock, Eye, RefreshCw, Sparkles, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { statsService } from '../api/statsService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getDashboardStats();
      setStats(data);
    } catch (err) {
      toast.error('Failed to load dashboard statistics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 shadow-lg rounded-xl text-xs">
          <p className="font-semibold text-slate-800 mb-1">{label}</p>
          <p className="text-blue-600 font-medium">
            Visitors: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="absolute -right-10 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED SOFTWARE SOLUTIONS • INDORE HQ</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Operations Control Center
            </h1>

            <p className="text-sm text-blue-50 mt-2 max-w-2xl leading-relaxed">
              Real-time administration portal for Code Eagle Info Solutions Pvt. Ltd.
              Monitor website visitors, services, career vacancies and client inquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStats}
            className="bg-white text-blue-700 hover:bg-blue-50 rounded-lg px-4 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Metrics
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="New Inquiries"
          value={loading ? '...' : stats?.newInquiries ?? 0}
          icon={Mail}
          trend="+8 today"
          trendPositive={true}
          subtitle="Pending client review"
          onClick={() => navigate('/inquiries?status=New')}
        />

        <StatCard
          title="Open Careers"
          value={loading ? '...' : stats?.openJobs ?? 0}
          icon={Briefcase}
          trend="Hiring"
          trendPositive={true}
          subtitle="Active openings in Indore"
          onClick={() => navigate('/careers?status=Open')}
        />

        <StatCard
          title="Active Services"
          value={loading ? '...' : stats?.activeServices ?? 0}
          icon={Layers}
          subtitle="Showcased capabilities"
          onClick={() => navigate('/services')}
        />

        <StatCard
          title="Weekly Visitors"
          value={loading ? '...' : (stats?.weeklyVisitors ?? 0).toLocaleString()}
          icon={Users}
          trend={stats?.weeklyVisitorsGrowth || '+14.2%'}
          trendPositive={true}
          subtitle="Past 7 days traffic"
        />
      </div>

      {/* Quick Management Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          Quick Management Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/services?action=new')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Service
          </button>

          <button
            type="button"
            onClick={() => navigate('/careers?action=new')}
            className="bg-white border border-slate-300 hover:bg-blue-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            Post a Job
          </button>

          <button
            type="button"
            onClick={() => navigate('/inquiries')}
            className="bg-white border border-slate-300 hover:bg-blue-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            View All Inquiries
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="bg-white border border-slate-300 hover:bg-blue-50 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 transition"
            >
              <Clock className="w-4 h-4 text-blue-600" />
              Update Site Info
            </button>
          )}
        </div>
      </div>

      {/* Chart and Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Website Visitors Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                Website Visitors (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Daily traffic to Code Eagle website and service pages
              </p>
            </div>

            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">
              Weekly Trends
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader text="Loading traffic analytics..." />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.visitorsChart || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: '#EFF6FF' }}
                  />

                  <Bar
                    dataKey="visitors"
                    fill="#2563EB"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                Latest Client Inquiries
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Recently received service requests
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/inquiries')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center">
              <Loader text="Loading recent inquiries..." />
            </div>
          ) : !stats?.recentInquiries || stats.recentInquiries.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No inquiries recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition flex items-center justify-between gap-3"
                >
                  <div className="overflow-hidden min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {inq.name}
                      </span>
                      <StatusBadge status={inq.status} />
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-1">
                      {inq.service} • {inq.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(inq)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition shrink-0"
                    title="Quick preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Client SLA Response: &lt; 2 hrs</span>
            <span className="text-blue-600 font-medium">Indore, India</span>
          </div>
        </div>
      </div>

      {/* Inquiry Preview Modal */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Inquiry Details"
        subtitle={`From ${selectedInquiry?.name || ''}`}
      >
        {selectedInquiry && (
          <div className="space-y-4 text-xs sm:text-sm">

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Sender Name</p>
                <p className="font-medium text-slate-800 mt-1">{selectedInquiry.name}</p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Status</p>
                <div className="mt-1">
                  <StatusBadge status={selectedInquiry.status} />
                </div>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Email</p>
                <p className="font-medium text-blue-600 mt-1 truncate">{selectedInquiry.email}</p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Phone</p>
                <p className="font-medium text-slate-800 mt-1">{selectedInquiry.phone}</p>
              </div>

              <div className="col-span-2">
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Requested Service</p>
                <p className="font-medium text-slate-800 mt-1">{selectedInquiry.service}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                Full Message
              </p>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2 text-sm"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedInquiry(null);
                  navigate('/inquiries');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2"
              >
                Manage in Inquiries
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
