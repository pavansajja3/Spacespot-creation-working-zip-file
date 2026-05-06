import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token =
  localStorage.getItem('authToken') ||
  localStorage.getItem('sbp_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error("Authentication failed (401): Token expired or invalid.");

      localStorage.removeItem('authToken');
      localStorage.removeItem('sbp_token');
      localStorage.removeItem('user');

      alert("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

export default api;