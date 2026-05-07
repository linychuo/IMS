import axios from 'axios';

const apiClient = axios.create({
  timeout: 10000,
});

// Sales service (8080)
export const salesApi = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
});

// Procurement service (8081)
export const procurementApi = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
});

// Report service (8085)
export const reportApi = axios.create({
  baseURL: 'http://localhost:8085',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;