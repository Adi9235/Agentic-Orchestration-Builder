import { create } from "zustand";

interface UIState {
  selectedWorkflowId: string | null;
  isSidebarOpen: boolean;
  isApprovalModalOpen: boolean;
  setSelectedWorkflowId: (id: string | null) => void;
  toggleSidebar: () => void;
  openApprovalModal: () => void;
  closeApprovalModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedWorkflowId: null,
  isSidebarOpen: false,
  isApprovalModalOpen: false,

  setSelectedWorkflowId: (id) => set({ selectedWorkflowId: id }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openApprovalModal: () => set({ isApprovalModalOpen: true }),
  closeApprovalModal: () => set({ isApprovalModalOpen: false }),
}));
