import api, { fakeDelay, isMockEnabled } from './api';
import { getDb, saveDb } from '../mock/mockDb';

export const servicesService = {
  async getServices({ search = '' } = {}) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      let list = [...(db.services || [])];

      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        list = list.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query)
        );
      }

      // Sort by creation date descending
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return list;
    }

    const response = await api.get('/admin/services', {
      params: { search: search || undefined },
    });
    return response.data;
  },

  async getServiceById(id) {
    if (isMockEnabled()) {
      await fakeDelay(200);
      const db = getDb();
      const service = db.services.find((s) => s.id === id);
      if (!service) {
        throw new Error(`Service with ID ${id} not found.`);
      }
      return service;
    }

    const response = await api.get(`/admin/services/${id}`);
    return response.data;
  },

  async createService(serviceData) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      if (!serviceData.name || !serviceData.description) {
        throw new Error('Service name and description are required.');
      }
      const db = getDb();
      const newService = {
        id: `srv-${Date.now()}`,
        name: serviceData.name.trim(),
        description: serviceData.description.trim(),
        icon: serviceData.icon || 'Globe',
        active: serviceData.active !== undefined ? serviceData.active : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.services.unshift(newService);
      saveDb(db);
      return newService;
    }

    const response = await api.post('/admin/services', serviceData);
    return response.data;
  },

  async updateService(id, serviceData) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      const index = db.services.findIndex((s) => s.id === id);
      if (index === -1) {
        throw new Error(`Service with ID ${id} not found.`);
      }

      const updatedService = {
        ...db.services[index],
        ...serviceData,
        id, // ensure ID is preserved
        updatedAt: new Date().toISOString(),
      };

      db.services[index] = updatedService;
      saveDb(db);
      return updatedService;
    }

    const response = await api.put(`/admin/services/${id}`, serviceData);
    return response.data;
  },

  async toggleServiceActive(id) {
    if (isMockEnabled()) {
      await fakeDelay(300);
      const db = getDb();
      const index = db.services.findIndex((s) => s.id === id);
      if (index === -1) {
        throw new Error(`Service with ID ${id} not found.`);
      }

      db.services[index].active = !db.services[index].active;
      db.services[index].updatedAt = new Date().toISOString();
      saveDb(db);
      return db.services[index];
    }

    const response = await api.patch(`/admin/services/${id}/toggle`);
    return response.data;
  },

  async deleteService(id) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      const exists = db.services.some((s) => s.id === id);
      if (!exists) {
        throw new Error(`Service with ID ${id} not found.`);
      }

      db.services = db.services.filter((s) => s.id !== id);
      saveDb(db);
      return { success: true, id };
    }

    const response = await api.delete(`/admin/services/${id}`);
    return response.data;
  },
};

