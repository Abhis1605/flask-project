import { create } from "zustand";

interface SidebarState {
  collapsed: boolean;

  toggleSidebar: () => void;

  setCollapsed: (collapsed: boolean) => void;

  mobileOpen: boolean;

  toggleMobileSidebar: () => void;

  closeMobileSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: true,

  toggleSidebar: () =>
    set((state) => ({ collapsed: !state.collapsed })),

  setCollapsed: (collapsed) => set({ collapsed }),

  mobileOpen: false,

  toggleMobileSidebar: () =>
    set((state) => ({ mobileOpen: !state.mobileOpen })),

  closeMobileSidebar: () => set({ mobileOpen: false }),
}));
