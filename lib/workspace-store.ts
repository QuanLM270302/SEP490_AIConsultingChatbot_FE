import { create } from "zustand";

interface WorkspaceState {
  isChatHistoryOpen: boolean;
  setChatHistoryOpen: (open: boolean) => void;
  toggleChatHistory: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  isChatHistoryOpen: false,
  setChatHistoryOpen: (open) => set({ isChatHistoryOpen: open }),
  toggleChatHistory: () =>
    set((state) => ({ isChatHistoryOpen: !state.isChatHistoryOpen })),
}));
