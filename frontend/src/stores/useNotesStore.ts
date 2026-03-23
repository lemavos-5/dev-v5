import { create } from 'zustand';
import { NoteResponse, NoteMetadata, NoteCreateRequest, NoteUpdateRequest, Folder } from '../types/api';
import apiClient from '../api/client';

interface NotesState {
  notes: NoteMetadata[];
  folders: Folder[];
  currentNote: NoteResponse | null;
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: (data: NoteCreateRequest) => Promise<NoteResponse>;
  updateNote: (id: string, data: NoteUpdateRequest) => Promise<NoteResponse>;
  deleteNote: (id: string) => Promise<void>;
  fetchFolders: () => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<Folder>;
  renameFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  clearError: () => void;
  setError: (error: string | null) => void;
  setCurrentNote: (note: NoteResponse | null) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  folders: [],
  currentNote: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),
  setError: (error) => set({ error }),
  setCurrentNote: (note) => set({ currentNote: note }),
  clearCurrentNote: () => set({ currentNote: null }),

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get<NoteMetadata[]>('/notes');
      set({ notes: data, loading: false, error: null });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch notes';
      set({ loading: false, error: message, notes: [] });
    }
  },

  fetchNoteById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get<NoteResponse>(`/notes/${id}`);
      set({ currentNote: data, loading: false, error: null });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch note';
      set({ loading: false, error: message, currentNote: null });
    }
  },

  clearCurrentNote: () => {
    set({ currentNote: null });
  },

  createNote: async (reqData) => {
    try {
      set({ error: null });
      const { data } = await apiClient.post<NoteResponse>('/notes', reqData);
      set((s) => ({ notes: [data, ...s.notes] }));
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create note';
      set({ error: message });
      throw err;
    }
  },

  updateNote: async (id, reqData) => {
    try {
      set({ error: null });
      const { data } = await apiClient.put<NoteResponse>(`/notes/${id}`, reqData);
      set((s) => ({
        notes: s.notes.map((n) => (n.id === id ? data : n)),
        currentNote: s.currentNote?.id === id ? data : s.currentNote,
      }));
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update note';
      set({ error: message });
      throw err;
    }
  },

  deleteNote: async (id) => {
    try {
      set({ error: null });
      await apiClient.delete(`/notes/${id}`);
      set((s) => ({
        notes: s.notes.filter((n) => n.id !== id),
        currentNote: s.currentNote?.id === id ? null : s.currentNote,
      }));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete note';
      set({ error: message });
      throw err;
    }
  },

  fetchFolders: async () => {
    try {
      set({ error: null });
      const { data } = await apiClient.get<Folder[]>('/folders');
      set({ folders: data });
    } catch (err: any) {
      console.error('Failed to fetch folders:', err);
      set({ folders: [] });
    }
  },

  createFolder: async (name, parentId) => {
    try {
      set({ error: null });
      const { data } = await apiClient.post<Folder>('/folders', { name, parentId });
      set((s) => ({ folders: [...s.folders, data] }));
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create folder';
      set({ error: message });
      throw err;
    }
  },

  renameFolder: async (id, name) => {
    try {
      set({ error: null });
      const { data } = await apiClient.patch<Folder>(`/api/folders/${id}/rename`, { name });
      set((s) => ({ folders: s.folders.map((f) => (f.id === id ? data : f)) }));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to rename folder';
      set({ error: message });
      throw err;
    }
  },

  deleteFolder: async (id) => {
    try {
      set({ error: null });
      await apiClient.delete(`/api/folders/${id}`);
      set((s) => ({ folders: s.folders.filter((f) => f.id !== id) }));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete folder';
      set({ error: message });
      throw err;
    }
  },
}));
