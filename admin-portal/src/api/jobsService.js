import api, { fakeDelay, isMockEnabled } from './api';
import { getDb, saveDb } from '../mock/mockDb';

export const jobsService = {
  async getJobs({ search = '', status = 'All' } = {}) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      let list = [...(db.jobs || [])];

      if (status && status !== 'All') {
        list = list.filter(
          (j) => j.status.toLowerCase() === status.toLowerCase()
        );
      }

      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        list = list.filter(
          (j) =>
            j.title.toLowerCase().includes(query) ||
            j.location.toLowerCase().includes(query) ||
            j.type.toLowerCase().includes(query) ||
            j.description.toLowerCase().includes(query)
        );
      }

      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return list;
    }

    const response = await api.get('/admin/jobs', {
      params: {
        search: search || undefined,
        status: status !== 'All' ? status : undefined,
      },
    });
    return response.data;
  },

  async getJobById(id) {
    if (isMockEnabled()) {
      await fakeDelay(200);
      const db = getDb();
      const job = db.jobs.find((j) => j.id === id);
      if (!job) {
        throw new Error(`Job posting with ID ${id} not found.`);
      }
      return job;
    }

    const response = await api.get(`/admin/jobs/${id}`);
    return response.data;
  },

  async createJob(jobData) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      if (!jobData.title || !jobData.location || !jobData.type) {
        throw new Error('Title, location, and employment type are required.');
      }

      const db = getDb();
      const newJob = {
        id: `job-${Date.now()}`,
        title: jobData.title.trim(),
        location: jobData.location.trim(),
        type: jobData.type,
        description: jobData.description ? jobData.description.trim() : '',
        status: jobData.status || 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.jobs.unshift(newJob);
      saveDb(db);
      return newJob;
    }

    const response = await api.post('/admin/jobs', jobData);
    return response.data;
  },

  async updateJob(id, jobData) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      const index = db.jobs.findIndex((j) => j.id === id);
      if (index === -1) {
        throw new Error(`Job posting with ID ${id} not found.`);
      }

      const updatedJob = {
        ...db.jobs[index],
        ...jobData,
        id,
        updatedAt: new Date().toISOString(),
      };

      db.jobs[index] = updatedJob;
      saveDb(db);
      return updatedJob;
    }

    const response = await api.put(`/admin/jobs/${id}`, jobData);
    return response.data;
  },

  async toggleJobStatus(id) {
    if (isMockEnabled()) {
      await fakeDelay(300);
      const db = getDb();
      const index = db.jobs.findIndex((j) => j.id === id);
      if (index === -1) {
        throw new Error(`Job posting with ID ${id} not found.`);
      }

      const currentStatus = db.jobs[index].status;
      db.jobs[index].status = currentStatus === 'Open' ? 'Closed' : 'Open';
      db.jobs[index].updatedAt = new Date().toISOString();
      saveDb(db);
      return db.jobs[index];
    }

    const response = await api.patch(`/admin/jobs/${id}/status`);
    return response.data;
  },

  async deleteJob(id) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      const exists = db.jobs.some((j) => j.id === id);
      if (!exists) {
        throw new Error(`Job posting with ID ${id} not found.`);
      }

      db.jobs = db.jobs.filter((j) => j.id !== id);
      saveDb(db);
      return { success: true, id };
    }

    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
  },
};

