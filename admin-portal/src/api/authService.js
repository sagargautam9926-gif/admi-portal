import api, { fakeDelay, isMockEnabled } from './api';
import { getDb } from '../mock/mockDb';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  async login({ email, password, rememberMe = false }) {
    if (isMockEnabled()) {
      await fakeDelay(400);
      const db = getDb();
      const user = db.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user || user.password !== password) {
        const error = new Error('Invalid email or password. Please verify your credentials.');
        error.response = { status: 401, data: { message: error.message } };
        throw error;
      }

      const token = `mock-jwt-${user.role}-${Date.now()}`;
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      };

      try {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));
        if (rememberMe) {
          localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, email.trim());
        } else {
          localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
        }
      } catch (err) {
        console.error('Storage error during login:', err);
      }

      return { token, user: authUser };
    }

    // Real backend path
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, email.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      }
    }
    return response.data;
  },

  async getCurrentUser() {
    if (isMockEnabled()) {
      await fakeDelay(200);
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userRaw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
        if (!token || !userRaw) return null;
        return JSON.parse(userRaw);
      } catch (err) {
        console.error('Error getting current user:', err);
        return null;
      }
    }

    // Real backend path
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout() {
    if (isMockEnabled()) {
      await fakeDelay(150);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      return { success: true };
    }

    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Continue client cleanup even if network fails
      console.warn('Backend logout error:', e);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
    return { success: true };
  },
};

