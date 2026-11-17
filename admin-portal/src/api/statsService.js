import api, { fakeDelay, isMockEnabled } from './api';
import { getDb } from '../mock/mockDb';

export const statsService = {
  async getDashboardStats() {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();

      const inquiries = db.inquiries || [];
      const jobs = db.jobs || [];
      const services = db.services || [];
      const weeklyVisitors = db.weeklyVisitors || [];

      const newInquiries = inquiries.filter((i) => i.status === 'New').length;
      const openJobs = jobs.filter((j) => j.status === 'Open').length;
      const activeServices = services.filter((s) => s.active === true).length;
      const totalWeeklyVisitors = weeklyVisitors.reduce(
        (sum, item) => sum + (item.visitors || 0),
        0
      );

      // Latest 5 inquiries sorted by date descending
      const recentInquiries = [...inquiries]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      return {
        newInquiries,
        openJobs,
        activeServices,
        weeklyVisitors: totalWeeklyVisitors,
        weeklyVisitorsGrowth: '+14.2%',
        visitorsChart: weeklyVisitors,
        recentInquiries,
      };
    }

    const response = await api.get('/admin/stats');
    return response.data;
  },
};

