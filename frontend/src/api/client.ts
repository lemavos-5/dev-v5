import axios from 'axios';
import { ENV } from '../config/env';

const apiClient = axios.create({
  baseURL: `${ENV.API_URL}${ENV.API_BASE}`,
  timeout: ENV.API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('auth_token');
      if (token && !error.config._retry) {
        error.config._retry = true;
        try {
          const { data } = await apiClient.post('/auth/refresh', { token });
          localStorage.setItem('auth_token', data.token);
          error.config.headers.Authorization = `Bearer ${data.token}`;
          return apiClient(error.config);
        } catch {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Notes API
export const notesApi = {
  create: (data: { title: string; content: string; folderId?: string }) =>
    apiClient.post('/notes', data),
  getById: (id: string) => apiClient.get(`/notes/${id}`),
  update: (id: string, data: { title?: string; content?: string; folderId?: string }) =>
    apiClient.put(`/notes/${id}`, data),
  list: () => apiClient.get('/notes'),
  getNoteFull: (id: string) => apiClient.get(`/notes/${id}`), // Assuming it returns NoteResponse
};

// Entities API
export const entitiesApi = {
  create: (data: { name: string; description?: string; type?: string }) =>
    apiClient.post('/entities', data),
  getById: (id: string) => apiClient.get(`/entities/${id}`),
  update: (id: string, data: { name?: string; description?: string; type?: string }) =>
    apiClient.put(`/entities/${id}`, data),
  list: () => apiClient.get('/entities'),
  getContext: (id: string) => apiClient.get(`/entities/${id}/context`),
};
