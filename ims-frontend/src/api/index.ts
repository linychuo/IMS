import axios, { type AxiosInstance } from 'axios';

const createApi = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    timeout: 10000,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export const authApi = createApi('http://localhost:8080');
export const systemApi = createApi('http://localhost:8080');
export const productApi = createApi('http://localhost:8080/api');
export const warehouseApi = createApi('http://localhost:8080/api');
export const locationApi = createApi('http://localhost:8080/api');
export const customerApi = createApi('http://localhost:8080/api');
export const supplierApi = createApi('http://localhost:8080/api');
export const salesApi = createApi('http://localhost:8080/api');
export const purchaseApi = createApi('http://localhost:8080/api');
export const procurementApi = createApi('http://localhost:8080/api');
export const inventoryApi = createApi('http://localhost:8080/api');
export const financeApi = createApi('http://localhost:8080/api');
export const reportApi = createApi('http://localhost:8080/api');