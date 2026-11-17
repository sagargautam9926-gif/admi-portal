import api, { fakeDelay, isMockEnabled } from './api';
import { getDb, saveDb } from '../mock/mockDb';

export const settingsService = {
  async getSettings() {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      return db.settings;
    }

    const response = await api.get('/admin/settings');
    return response.data;
  },

  async updateSettings(settingsData) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();

      db.settings = {
        ...db.settings,
        contact: {
          ...db.settings.contact,
          ...settingsData.contact,
        },
        stats: {
          ...db.settings.stats,
          ...settingsData.stats,
        },
        updatedAt: new Date().toISOString(),
      };

      saveDb(db);
      return db.settings;
    }

    const response = await api.put('/admin/settings', settingsData);
    return response.data;
  },
};

