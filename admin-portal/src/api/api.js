import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error attaching auth token to request:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      } catch (e) {
        console.error('Error clearing local auth on 401:', e);
      }
      // Broadcast logout event so AuthContext and router can redirect gracefully
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Helper utility for fake mock delay
export const fakeDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isMockEnabled = () => {
  const envVal = import.meta.env.VITE_USE_MOCK;
  if (envVal === undefined || envVal === null) return true;
  return String(envVal).trim().toLowerCase() !== 'false';
};

export default api;

