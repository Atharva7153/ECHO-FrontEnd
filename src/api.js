import axios from 'axios';
// Remove usage of process.env in frontend, use a hardcoded fallback or import.meta.env for Vite
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const token = () => localStorage.getItem('token');

export const api = axios.create({
  baseURL: BASE,
});

api.interceptors.request.use(cfg => {
  const t = token();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
