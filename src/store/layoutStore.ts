import { DependencyList, useEffect, useRef } from 'react';
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

type SelectedSlice = {
  selectedCell: [number, number] | undefined;
  setSelectedCell: (selectedCell: [number, number] | undefined) => void;
};

const createLayoutSlice: StateCreator<
  LayoutSlice & DraggedSlice & SelectedSlice,
  [],
  [],
  LayoutSlice
> = (set) => ({
  layout: new Layout(MAX_HEIGHT, MAX_WIDTH),
  setLayout: (layout) => set({ layout }),
});

const createDraggedSlice: StateCreator<
  LayoutSlice & DraggedSlice & SelectedSlice,
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
          state.draggedItem.clone(),
        );
        return { layout, draggedItem: undefined, draggedPosition: undefined };
      }

      return { draggedItem: undefined, draggedPosition: undefined };
    });
  },
});

const createSelectedSlice: StateCreator<
  LayoutSlice & DraggedSlice & SelectedSlice,
  [],
  [],
  SelectedSlice
> = (set) => ({
  selectedCell: undefined,
  setSelectedCell: (selectedCell) => set({ selectedCell }),
});

export const useLayoutStore = create<
  LayoutSlice & DraggedSlice & SelectedSlice
>()((...a) => ({
  ...createLayoutSlice(...a),
  ...createDraggedSlice(...a),
  ...createSelectedSlice(...a),
}));

export const useLayoutRef = (deps?: DependencyList) => {
  // Fetch initial state
  const layoutRef = useRef(useLayoutStore.getState().layout);
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() => {
    useLayoutStore.subscribe((state) => (layoutRef.current = state.layout));
  }, deps ?? []);

  return layoutRef;
};
