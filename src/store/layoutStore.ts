import create, { StateCreator } from 'zustand';
import { Layout } from '../components/layout/Layout';
import { SquareType } from '../utils/helpers';
import { MAX_HEIGHT, MAX_WIDTH } from './workspaceStore';

type LayoutSlice = {
  layout: Layout;
  setLayout: (layout?: Layout) => void;
};

type DraggedSlice = {
  draggedItem: SquareType | undefined;
  draggedPosition: [number, number] | undefined;
  setDraggedPosition: (i: number, j: number) => void;
  setDraggedItem: (item: SquareType) => void;
  handleDropInGrid: () => void;
};

const createLayoutSlice: StateCreator<
  LayoutSlice & DraggedSlice,
  [],
  [],
  LayoutSlice
> = (set) => ({
  layout: new Layout(MAX_HEIGHT, MAX_WIDTH),
  setLayout: (layout) => set({ layout }),
});

const createDraggedSlice: StateCreator<
  LayoutSlice & DraggedSlice,
  [],
  [],
  DraggedSlice
> = (set, get) => ({
  draggedItem: undefined,
  draggedPosition: undefined,
  setDraggedPosition: (i, j) => {
    if (get().draggedPosition?.[0] !== i || get().draggedPosition?.[1] !== j) {
      set({ draggedPosition: [i, j] });
    }
  },
  setDraggedItem: (item) => {
    if (get().draggedItem?.id !== item.id) {
      set({ draggedItem: item });
    }
  },
  handleDropInGrid: () => {
    set((state) => {
      if (
        state.draggedItem !== undefined &&
        state.draggedPosition !== undefined
      ) {
        const layout = state.layout?.clone();
        layout?.setElement(
          state.draggedPosition[0],
          state.draggedPosition[1],
          state.draggedItem,
        );
        return { layout, draggedItem: undefined, draggedPosition: undefined };
      }

      return { draggedItem: undefined, draggedPosition: undefined };
    });
  },
});

export const useLayoutStore = create<LayoutSlice & DraggedSlice>()((...a) => ({
  ...createLayoutSlice(...a),
  ...createDraggedSlice(...a),
}));
