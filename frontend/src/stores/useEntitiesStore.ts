import { create } from 'zustand';
import { Entity, EntityCreateRequest, EntityUpdateRequest, NoteMetadata } from '../types/api';
import apiClient from '../api/client';

interface EntitiesState {
  entities: Entity[];
  currentEntity: Entity | null;
  connections: Entity[];
  relatedNotes: NoteMetadata[];
  loading: boolean;
  error: string | null;
  fetchEntities: () => Promise<void>;
  fetchEntity: (id: string) => Promise<void>;
  createEntity: (data: EntityCreateRequest) => Promise<Entity>;
  updateEntity: (id: string, data: EntityUpdateRequest) => Promise<void>;
  deleteEntity: (id: string) => Promise<void>;
  fetchConnections: (id: string) => Promise<void>;
  fetchEntityNotes: (id: string) => Promise<void>;
  clearError: () => void;
  setError: (error: string | null) => void;
}

export const useEntitiesStore = create<EntitiesState>((set, get) => ({
  entities: [],
  currentEntity: null,
  connections: [],
  relatedNotes: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),
  setError: (error) => set({ error }),

  fetchEntities: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get<Entity[]>('/entities');
      set({ entities: data, loading: false, error: null });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch entities';
      set({ loading: false, error: message, entities: [] });
    }
  },

  fetchEntity: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get<Entity>(`/entities/${id}`);
      set({ currentEntity: data, loading: false, error: null });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch entity';
      set({ loading: false, error: message, currentEntity: null });
    }
  },

  createEntity: async (reqData) => {
    try {
      set({ error: null });
      const { data } = await apiClient.post<Entity>('/entities', reqData);
      set((s) => ({ entities: [data, ...s.entities] }));
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create entity';
      set({ error: message });
      throw err;
    }
  },

  updateEntity: async (id, reqData) => {
    try {
      set({ error: null });
      const { data } = await apiClient.put<Entity>(`/entities/${id}`, reqData);
      set((s) => ({
        entities: s.entities.map((e) => (e.id === id ? data : e)),
        currentEntity: s.currentEntity?.id === id ? data : s.currentEntity,
      }));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update entity';
      set({ error: message });
      throw err;
    }
  },

  deleteEntity: async (id) => {
    try {
      set({ error: null });
      await apiClient.delete(`/entities/${id}`);
      set((s) => ({
        entities: s.entities.filter((e) => e.id !== id),
        currentEntity: s.currentEntity?.id === id ? null : s.currentEntity,
      }));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete entity';
      set({ error: message });
      throw err;
    }
  },

  fetchConnections: async (id) => {
    try {
      set({ error: null });
      const { data } = await apiClient.get<Entity[]>(`/entities/${id}/connections`);
      set({ connections: data });
    } catch (err: any) {
      console.error('Failed to fetch connections:', err);
      set({ connections: [] });
    }
  },

  fetchEntityNotes: async (id) => {
    try {
      set({ error: null });
      const { data } = await apiClient.get<NoteMetadata[]>(`/entities/${id}/notes`);
      set({ relatedNotes: data });
    } catch (err: any) {
      console.error('Failed to fetch entity notes:', err);
      set({ relatedNotes: [] });
    }
  },
}));
