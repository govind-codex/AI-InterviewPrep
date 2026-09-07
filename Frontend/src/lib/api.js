import axios from 'axios';

const localApiHost = window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:5001'
  : 'http://localhost:5001';
const baseURL = (import.meta.env.VITE_API_BASE_URL || localApiHost).replace(/\/$/, '');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
