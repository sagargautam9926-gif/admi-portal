import api, { fakeDelay, isMockEnabled } from './api';
import { getDb, saveDb } from '../mock/mockDb';

export const inquiriesService = {
  async getInquiries({
    search = '',
    status = 'All',
    page = 1,
    limit = 5,
    sortOrder = 'desc', // 'desc' | 'asc'
  } = {}) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      let list = [...(db.inquiries || [])];

      // Status filter
      if (status && status !== 'All') {
        list = list.filter(
          (inq) => inq.status.toLowerCase() === status.toLowerCase()
        );
      }

      // Search filter
      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        list = list.filter(
          (inq) =>
            inq.name.toLowerCase().includes(query) ||
            inq.email.toLowerCase().includes(query) ||
            inq.phone.toLowerCase().includes(query) ||
            inq.service.toLowerCase().includes(query) ||
            inq.message.toLowerCase().includes(query)
        );
      }

      // Sort by date
      list.sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });

      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const currentPage = Math.max(1, Math.min(page, totalPages));
      const startIndex = (currentPage - 1) * limit;
      const paginatedInquiries = list.slice(startIndex, startIndex + limit);

      const allInquiries = db.inquiries || [];
      const newCount = allInquiries.filter((i) => i.status === 'New').length;

      return {
        inquiries: paginatedInquiries,
        total,
        page: currentPage,
        limit,
        totalPages,
        newCount,
        allFiltered: list, // useful for CSV export
      };
    }

    const response = await api.get('/admin/inquiries', {
      params: {
        search: search || undefined,
        status: status !== 'All' ? status : undefined,
        page,
        limit,
        sortOrder,
      },
    });
    return response.data;
  },

  async getInquiryById(id) {
    if (isMockEnabled()) {
      await fakeDelay(200);
      const db = getDb();
      const inq = db.inquiries.find((i) => i.id === id);
      if (!inq) {
        throw new Error(`Inquiry with ID ${id} not found.`);
      }
      return inq;
    }

    const response = await api.get(`/admin/inquiries/${id}`);
    return response.data;
  },

  async updateInquiryStatus(id, newStatus) {
    if (isMockEnabled()) {
      await fakeDelay(300);
      const db = getDb();
      const index = db.inquiries.findIndex((i) => i.id === id);
      if (index === -1) {
        throw new Error(`Inquiry with ID ${id} not found.`);
      }

      db.inquiries[index].status = newStatus;
      db.inquiries[index].updatedAt = new Date().toISOString();
      saveDb(db);
      return db.inquiries[index];
    }

    const response = await api.patch(`/admin/inquiries/${id}/status`, {
      status: newStatus,
    });
    return response.data;
  },

  async deleteInquiry(id) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      const exists = db.inquiries.some((i) => i.id === id);
      if (!exists) {
        throw new Error(`Inquiry with ID ${id} not found.`);
      }

      db.inquiries = db.inquiries.filter((i) => i.id !== id);
      saveDb(db);
      return { success: true, id };
    }

    const response = await api.delete(`/admin/inquiries/${id}`);
    return response.data;
  },

  async getNewCount() {
    if (isMockEnabled()) {
      const db = getDb();
      return (db.inquiries || []).filter((i) => i.status === 'New').length;
    }

    const response = await api.get('/admin/inquiries/count-new');
    return response.data.count;
  },
};

