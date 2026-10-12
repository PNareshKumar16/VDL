import axios from 'axios';

// API Base URL: use env var if provided, otherwise use the production Render backend
const PRODUCTION_BACKEND = 'https://vdl-txe7.onrender.com/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || PRODUCTION_BACKEND;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT Bearer token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for global error response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-change'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
