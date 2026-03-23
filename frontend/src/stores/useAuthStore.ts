import { create } from 'zustand';
import { UserContext, AuthResponse, Plan } from '../types/api';
import apiClient from '../api/client';

interface AuthState {
  user: UserContext | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  loading: false,
  error: null,

  setError: (error) => set({ error }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
      localStorage.setItem('auth_token', data.token);
      set({ token: data.token, isAuthenticated: true, loading: false });
      await get().fetchMe();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      set({ loading: false, error: message });
      throw err;
    }
  },

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.post('/auth/register', { username, email, password });
      set({ loading: false });
      return data.message || 'Registration successful';
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.fields
        ? Object.values(err.response.data.fields).join(', ')
        : 'Registration failed';
      set({ loading: false, error: typeof message === 'string' ? message : 'Registration failed' });
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {}
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const { data } = await apiClient.get<UserContext>('/auth/me');
      set({ user: data, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
      localStorage.removeItem('auth_token');
    }
  },

  initialize: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      set({ loading: true });
      await get().fetchMe();
      set({ loading: false });
    }
  },
}));
