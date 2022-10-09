import create from 'zustand';

export const MAX_WIDTH = 16;
export const MAX_HEIGHT = 12;

type WorkspaceStore = {
  width: number;
  height: number;
  setSize: (width: number, height: number) => void;
  resetWorkspace: () => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  width: MAX_WIDTH,
  height: MAX_HEIGHT,
  setSize: (width: number, height: number) => set({ width, height }),
  resetWorkspace: () => set({ width: MAX_WIDTH, height: MAX_HEIGHT }),
}));
