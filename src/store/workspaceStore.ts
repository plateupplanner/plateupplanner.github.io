import create from 'zustand';

export const DEFAULT_WIDTH = 16;
export const DEFAULT_HEIGHT = 12;
export const MAX_WIDTH = 40;
export const MAX_HEIGHT = 20;

type WorkspaceStore = {
  width: number;
  height: number;
  setSize: (size: { width?: number; height?: number }) => void;
  resetWorkspace: () => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  setSize: ({ width, height }) =>
    set((state) => ({
      ...state,
      width: width ? width : state.width,
      height: height ? height : state.height,
    })),
  resetWorkspace: () => set({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }),
}));
