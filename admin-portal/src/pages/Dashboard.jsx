import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Briefcase,
  Layers,
  Users,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Eye,
  RefreshCw,
  Sparkles,
  Shield,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    if (active && payload && payload.length) {
      return (
        <div className="card-gradient border border-border-blue p-3 shadow-xl text-xs rounded-xl">
          <p className="font-semibold text-white mb-1">{label}</p>
          <p className="text-brand-cyan flex items-center gap-1.5 font-medium">
            <span>Visitors:</span>
            <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
          {payload[1] && (
            <p className="text-brand-muted flex items-center gap-1.5 mt-0.5">
              <span>Page Views:</span>
              <span>{payload[1].value.toLocaleString()}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Welcome Banner matching mockup aesthetic */}
      <div className="card-gradient border border-[#1c3a9e] p-6 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-32 bg-brand-blue/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-blue/20 border border-brand-cyan/40 text-brand-cyan text-xs font-semibold mb-3 shadow-[0_0_12px_rgba(25,211,255,0.25)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED SOFTWARE SOLUTIONS • INDORE HQ</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Operations Control Center
            </h1>
            <p className="text-xs sm:text-sm text-brand-text/85 mt-1 max-w-2xl leading-relaxed">
              Real-time administration portal for Code Eagle Info Solutions Pvt. Ltd. Monitor visitor metrics, manage service capabilities, career vacancies, and client inquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStats}
            aria-label="Refresh dashboard metrics"
            className="btn-secondary text-xs sm:text-sm flex items-center gap-2 py-2 px-4 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
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

      {/* Quick Action Buttons */}
      <div className="card-gradient border border-border-blue/70 p-4 sm:p-6 shadow-xl">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-3 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" />
          <span>Quick Management Actions</span>
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/services?action=new')}
            className="btn-primary text-xs sm:text-sm py-2 px-4 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Add New Service</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/careers?action=new')}
            className="btn-secondary text-xs sm:text-sm py-2 px-4 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-brand-cyan" />
            <span>Post a Job</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/inquiries')}
            className="btn-secondary text-xs sm:text-sm py-2 px-4 flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-brand-cyan" />
            <span>View All Inquiries</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="btn-secondary text-xs sm:text-sm py-2 px-4 flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-brand-cyan" />
              <span>Update Site Info</span>
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout: Chart & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visitors Chart */}
        <div className="lg:col-span-7 card-gradient border border-[#1c3a9e] p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Website Visitors (Last 7 Days)
              </h3>
              <p className="text-xs text-brand-muted">
                Daily traffic to Code Eagle website & service pages
              </p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-blue/20 text-brand-cyan border border-brand-cyan/30">
              Weekly Trends
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
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
                  <defs>
                    <linearGradient id="neonBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.95} />
                      <stop offset="50%" stopColor="#1e6bff" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#0a2166" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1c3a9e"
                    opacity={0.35}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#6c85cb"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#1c3a9e', opacity: 0.5 }}
                  />
                  <YAxis
                    stroke="#6c85cb"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#1c3a9e', opacity: 0.5 }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(30, 107, 255, 0.12)' }}
                  />
                  <Bar
                    dataKey="visitors"
                    fill="url(#neonBarGradient)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="lg:col-span-5 card-gradient border border-[#1c3a9e] p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Latest Client Inquiries
                </h3>
                <p className="text-xs text-brand-muted">
                  Recently received RFP & service requests
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/inquiries')}
                className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <Loader text="Loading recent inquiries..." />
              </div>
            ) : !stats?.recentInquiries || stats.recentInquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-brand-muted">
                No inquiries recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3 rounded-xl bg-[#061445]/70 border border-border-blue/60 hover:border-brand-cyan/50 transition-all flex items-center justify-between gap-3 group shadow-sm"
                  >
                    <div className="overflow-hidden min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {inq.name}
                        </span>
                        <StatusBadge status={inq.status} />
                      </div>
                      <p className="text-[11px] text-brand-muted truncate mt-0.5">
                        {inq.service} • {inq.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(inq)}
                      className="p-1.5 rounded-lg bg-navy-800 text-brand-text hover:text-brand-cyan hover:bg-navy-700 transition-colors shrink-0"
                      title="Quick preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-border-blue/40 flex items-center justify-between text-xs text-brand-muted">
            <span>Client SLA Response: &lt; 2 hrs</span>
            <span className="text-brand-cyan font-medium">Indore, India</span>
          </div>
        </div>
      </div>

      {/* Quick View Modal for Inquiry */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Inquiry Details"
        subtitle={`From ${selectedInquiry?.name || ''}`}
      >
        {selectedInquiry && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-navy-900/80 border border-border-blue/60">
              <div>
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Sender Name
                </p>
                <p className="font-medium text-white mt-0.5">
                  {selectedInquiry.name}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Status
                </p>
                <div className="mt-0.5">
                  <StatusBadge status={selectedInquiry.status} />
                </div>
              </div>
              <div>
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Email
                </p>
                <p className="font-medium text-brand-cyan mt-0.5 truncate">
                  {selectedInquiry.email}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Phone
                </p>
                <p className="font-medium text-white mt-0.5">
                  {selectedInquiry.phone}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] text-brand-muted uppercase font-semibold">
                  Requested Service
                </p>
                <p className="font-medium text-white mt-0.5">
                  {selectedInquiry.service}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-brand-muted uppercase mb-1">
                Full Message
              </p>
              <div className="p-4 rounded-xl bg-[#061445] border border-border-blue/70 text-brand-text leading-relaxed">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="btn-secondary text-xs sm:text-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedInquiry(null);
                  navigate('/inquiries');
                }}
                className="btn-primary text-xs sm:text-sm flex items-center gap-1.5"
              >
                <span>Manage in Inquiries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
