import axios from 'axios';
// Base URL for backend API; prefer Vite env, fallback to Render URL
const BASE = import.meta.env.VITE_API_URL || 'https://echo-610a.onrender.com/api';

const token = () => localStorage.getItem('token');

export const api = axios.create({
  baseURL: BASE,
});

api.interceptors.request.use(cfg => {
  const t = token();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
