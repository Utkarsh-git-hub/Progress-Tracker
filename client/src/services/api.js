import axios from 'axios';

const baseURL = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : `${import.meta.env.VITE_BACKEND_URL}/api`;

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

