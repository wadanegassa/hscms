import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('harari_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect if it's a login attempt failure
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth/login')) {
      sessionStorage.removeItem('harari_admin_token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
