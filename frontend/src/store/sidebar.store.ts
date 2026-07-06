import { create } from "zustand";

interface SidebarState {
  collapsed: boolean;

  toggleSidebar: () => void;

  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: true,

  toggleSidebar: () =>
    set((state) => ({ collapsed: !state.collapsed })),

  setCollapsed: (collapsed) => set({ collapsed }),
}));
