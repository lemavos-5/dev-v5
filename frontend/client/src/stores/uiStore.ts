/**
 * Zustand store para estado de UI global
 * Gerencia modais, sidebars, temas e notificações
 */

import { create } from "zustand";

export interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Modais
  upgradeModalOpen: boolean;
  setUpgradeModalOpen: (open: boolean) => void;

  confirmDialogOpen: boolean;
  confirmDialogTitle: string;
  confirmDialogMessage: string;
  confirmDialogOnConfirm: (() => void) | null;
  openConfirmDialog: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirmDialog: () => void;

  // Tema
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;

  // Busca
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Notificações (toast)
  showNotification: (message: string, type: "success" | "error" | "info") => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Upgrade Modal
  upgradeModalOpen: false,
  setUpgradeModalOpen: (open) => set({ upgradeModalOpen: open }),

  // Confirm Dialog
  confirmDialogOpen: false,
  confirmDialogTitle: "",
  confirmDialogMessage: "",
  confirmDialogOnConfirm: null,
  openConfirmDialog: (title, message, onConfirm) =>
    set({
      confirmDialogOpen: true,
      confirmDialogTitle: title,
      confirmDialogMessage: message,
      confirmDialogOnConfirm: onConfirm,
    }),
  closeConfirmDialog: () =>
    set({
      confirmDialogOpen: false,
      confirmDialogTitle: "",
      confirmDialogMessage: "",
      confirmDialogOnConfirm: null,
    }),

  // Tema
  theme: "dark",
  setTheme: (theme) => set({ theme }),

  // Busca
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),

  // Notificações
  showNotification: (message, type) => {
    // Implementado com react-hot-toast no componente
    console.log(`[${type.toUpperCase()}] ${message}`);
  },
}));

// ============================================================================
// HOOKS CUSTOMIZADOS
// ============================================================================

export function useSidebar() {
  return useUIStore((state) => ({
    open: state.sidebarOpen,
    toggle: state.toggleSidebar,
    setOpen: state.setSidebarOpen,
  }));
}

export function useUpgradeModal() {
  return useUIStore((state) => ({
    open: state.upgradeModalOpen,
    setOpen: state.setUpgradeModalOpen,
  }));
}

export function useConfirmDialog() {
  return useUIStore((state) => ({
    open: state.confirmDialogOpen,
    title: state.confirmDialogTitle,
    message: state.confirmDialogMessage,
    onConfirm: state.confirmDialogOnConfirm,
    openDialog: state.openConfirmDialog,
    closeDialog: state.closeConfirmDialog,
  }));
}

export function useTheme() {
  return useUIStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));
}

export function useSearch() {
  return useUIStore((state) => ({
    open: state.searchOpen,
    setOpen: state.setSearchOpen,
  }));
}
