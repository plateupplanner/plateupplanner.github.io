import type {
  Cell,
  CellOption,
  SquareState,
  WallState,
} from '../types/project';
import {
  DependencyList,
  useEffect,
  useRef,
  TouchEvent,
  MouseEvent,
} from 'react';
import create, { StateCreator } from 'zustand';
import { Layout } from '../components/layout/Layout';
import {
  areSameCell,
  createMouseEvent,
  getTouchedPosition,
  getTouchedWall,
  isSingleTouch,
  SquareType,
  WallType,
} from '../utils/helpers';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './workspaceStore';

type LayoutSlice = {
  layout: Layout;
  setLayout: (layout?: Layout) => void;

  displayStates: Array<Array<SquareState | WallState>>;

  // IMPORTANT
  // Must call this after making any potentially visible changes in grid cells using set()
  // Each grid square is bound to the corresponding state object in displayStates,
  // and will only re-render if computeDisplayStates is called and there are changes
  computeDisplayStates: () => void;

  drawType?: WallType;
};

type MenuDragSlice = {
  menuDraggedItem: SquareType | undefined;
  setMenuDraggedItem: (item: SquareType) => void;
  menuDraggedOverCell: CellOption;
  setMenuDraggedOverCell: (i: number, j: number) => void;
  handleMenuDrop: () => void;
};

type CellSlice = {
  selectedCell: CellOption;
  setSelectedCell: (selectedCell: CellOption) => void;

  hoveredCell: CellOption;
  setHoveredCell: (hoveredCell: CellOption) => void;

  clickedCell: CellOption;
  setClickedCell: (clickedCell: CellOption) => void;

  draggedOverCell: CellOption;
  setDraggedOverCell: (draggedOverCell: CellOption) => void;
};

type EventSlice = {
  plan: {
    handleMouseDown: (i: number, j: number, event: MouseEvent) => void;
    handleMouseUp: (event: MouseEvent) => void;
    handleMouseEnter: (i: number, j: number) => void;
    handleMouseLeave: () => void;
    handleDelete: () => void;
    handleRotateLeft: () => void;
    handleRotateRight: () => void;
    handleRemoveSquares: () => void;
    handleItemMove: (dx: number, dy: number) => void;
    handleSelectionMove: (dx: number, dy: number) => void;
    handleDuplicateSelected: () => void;
    handleTouchStart: (i: number, j: number, event: TouchEvent) => void;
    handleTouchMove: (event: TouchEvent) => void;
    handleTouchEnd: (event: TouchEvent) => void;
  };
  draw: {
    drawLine: (i: number, j: number, wallType: WallType) => void;
    handleMouseDown: (i: number, j: number) => void;
    handleMouseUp: () => void;
    handleMouseEnter: (i: number, j: number) => void;
    handleTouchStart: (i: number, j: number, event: TouchEvent) => void;
    handleTouchMove: (event: TouchEvent) => void;
    handleRemoveAllWalls: () => void;
  };
};

const computeSquareState = (
  cell: Cell,
  state: LayoutSlice & MenuDragSlice & CellSlice & EventSlice,
) => {
  const {
    layout,
    selectedCell,
    draggedOverCell,
    clickedCell,
    menuDraggedItem,
    menuDraggedOverCell,
  } = state;

  const [i, j] = cell;
  const isSelected =
    selectedCell !== undefined && areSameCell(selectedCell, [i, j]);

  let squareType = layout.layout?.[i]?.[j] as SquareType;
  let opacity = 1;
  if (draggedOverCell !== undefined) {
    if (areSameCell(draggedOverCell, [i, j])) {
      squareType = layout.layout[clickedCell?.[0] ?? 0][
        clickedCell?.[1] ?? 0
      ] as SquareType;
      opacity = 0.7;
    } else if (clickedCell !== undefined && areSameCell(clickedCell, [i, j])) {
      squareType = layout.layout[draggedOverCell[0]][
        draggedOverCell[1]
      ] as SquareType;
      opacity = 0.7;
    }
  }

  if (
    menuDraggedItem !== undefined &&
    menuDraggedOverCell !== undefined &&
    areSameCell(menuDraggedOverCell, [i, j])
  ) {
    squareType = menuDraggedItem;
    opacity = 0.7;
  }
  return {
    squareType: squareType,
    opacity: opacity,
    isSelected: isSelected,
  };
};

const computeWallState = (
  cell: Cell,
  state: LayoutSlice & MenuDragSlice & CellSlice & EventSlice,
) => {
  const { layout } = state;
  const [i, j] = cell;

  return {
    wallType: layout?.layout?.[i]?.[j] as WallType,
  };
};

const createLayoutSlice: StateCreator<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice,
  [],
  [],
  LayoutSlice
> = (set, get) => ({
  layout: new Layout(DEFAULT_HEIGHT, DEFAULT_WIDTH),
  setLayout: (layout) => {
    set({
      layout,
      displayStates: layout
        ? Array.from(Array(layout.height * 2 - 1), () =>
            Array(layout.width * 2 - 1),
          )
        : Array.from(Array(DEFAULT_HEIGHT * 2 - 1), () =>
            Array(DEFAULT_WIDTH * 2 - 1),
          ),
    });
    get().computeDisplayStates();
  },

  displayStates: Array.from(Array(DEFAULT_HEIGHT * 2 - 1), () =>
    Array(DEFAULT_WIDTH * 2 - 1),
  ),
  computeDisplayStates: () => {
    if (get().layout === undefined) return;
    const height = get().layout.height;
    const width = get().layout.width;
    const newElementStates = Array.from(Array(height * 2 - 1), () =>
      Array(width * 2 - 1),
    );
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          newElementStates[i][j] = computeSquareState([i, j], get());
        } else {
          newElementStates[i][j] = computeWallState([i, j], get());
        }
      }
    }
    set({ displayStates: newElementStates });
  },
});

const createMenuDragSlice: StateCreator<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice,
  [],
  [],
  MenuDragSlice
> = (set, get) => ({
  menuDraggedItem: undefined,
  menuDraggedOverCell: undefined,
  setMenuDraggedOverCell: (i, j) => {
    const menuDraggedOverCell = get().menuDraggedOverCell;
    if (!menuDraggedOverCell || !areSameCell(menuDraggedOverCell, [i, j])) {
      set({ menuDraggedOverCell: [i, j] });
      get().computeDisplayStates();
    }
  },

  setMenuDraggedItem: (item) => {
    if (get().menuDraggedItem?.id !== item.id) {
      set({ menuDraggedItem: item });
      get().computeDisplayStates();
    }
  },

  handleMenuDrop: () => {
    set((state) => {
      if (
        state.menuDraggedItem !== undefined &&
        state.menuDraggedOverCell !== undefined
      ) {
        const layout = state.layout?.clone();
        layout?.setElement(
          state.menuDraggedOverCell[0],
          state.menuDraggedOverCell[1],
          state.menuDraggedItem.clone(),
        );
        return {
          layout,
          menuDraggedItem: undefined,
          menuDraggedOverCell: undefined,
        };
      }

      return { menuDraggedItem: undefined, menuDraggedOverCell: undefined };
    });
    get().computeDisplayStates();
  },
});

const createCellSlice: StateCreator<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice,
  [],
  [],
  CellSlice
> = (set, get) => ({
  selectedCell: undefined,
  setSelectedCell: (selectedCell) => {
    set({ selectedCell });
    get().computeDisplayStates();
  },

  hoveredCell: undefined,
  setHoveredCell: (hoveredCell) => {
    set({ hoveredCell });
    get().computeDisplayStates();
  },

  clickedCell: undefined,
  setClickedCell: (clickedCell) => {
    set({ clickedCell });
    get().computeDisplayStates();
  },

  draggedOverCell: undefined,
  setDraggedOverCell: (draggedOverCell) => {
    set({ draggedOverCell });
    get().computeDisplayStates();
  },
});

const createEventSlice: StateCreator<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice,
  [],
  [],
  EventSlice
> = (set, get) => ({
  plan: {
    handleMouseDown: (i, j, event) => {
      const { clickedCell, layout } = get();
      if (event.button === 0 && clickedCell === undefined) {
        set({ clickedCell: [i, j] });
      } else if (event.button === 2) {
        const newLayout = layout.clone();
        newLayout.rotateElementRight(i, j);
        set({ layout: newLayout });
        get().computeDisplayStates();
      }
    },

    handleMouseEnter: (i, j) => {
      const { clickedCell } = get();
      if (clickedCell !== undefined) {
        set({ draggedOverCell: [i, j] });
        get().computeDisplayStates();
      }
      set({ hoveredCell: [i, j] });
    },

    handleMouseLeave: () => {
      set({ hoveredCell: undefined });
    },

    handleMouseUp: (event) => {
      if (event.button === 2) {
        return;
      }

      const { clickedCell, draggedOverCell, selectedCell, layout } = get();
      if (clickedCell !== undefined && draggedOverCell !== undefined) {
        const newLayout = layout.clone();
        newLayout.swapElements(
          clickedCell[0],
          clickedCell[1],
          draggedOverCell[0],
          draggedOverCell[1],
        );
        set({ selectedCell: draggedOverCell, layout: newLayout });
      } else if (
        clickedCell !== undefined &&
        (selectedCell === undefined || !areSameCell(clickedCell, selectedCell))
      ) {
        set({ selectedCell: clickedCell });
      } else {
        set({ selectedCell: undefined });
      }
      set({ clickedCell: undefined, draggedOverCell: undefined });

      get().computeDisplayStates();
    },

    handleDelete: () => {
      const { selectedCell, layout } = get();
      if (selectedCell !== undefined) {
        const newLayout = layout.clone();
        newLayout.setElement(
          selectedCell[0],
          selectedCell[1],
          SquareType.Empty,
        );
        set({ layout: newLayout, selectedCell: undefined });
        get().computeDisplayStates();
      }
    },

    handleRotateLeft: () => {
      const { selectedCell, layout } = get();
      if (selectedCell !== undefined) {
        const newLayout = layout.clone();
        newLayout.rotateElementLeft(selectedCell[0], selectedCell[1]);
        set({ layout: newLayout });
        get().computeDisplayStates();
      }
    },

    handleRotateRight: () => {
      const { selectedCell, layout } = get();
      if (selectedCell !== undefined) {
        const newLayout = layout.clone();
        newLayout.rotateElementRight(selectedCell[0], selectedCell[1]);
        set({ layout: newLayout });
        get().computeDisplayStates();
      }
    },

    handleRemoveSquares: () => {
      const { layout } = get();
      const newLayout = layout.clone();
      newLayout.removeSquares();
      set({ layout: newLayout });
      get().computeDisplayStates();
    },

    handleItemMove: (dx, dy) => {
      const { selectedCell, layout } = get();
      if (selectedCell === undefined) return;
      const [p, q] = selectedCell;
      // add y and x component with wrap around
      let a = (dy + p / 2) % layout.height;
      a = a >= 0 ? 2 * a : 2 * (layout.height + a);
      let b = (dx + q / 2) % layout.width;
      b = b >= 0 ? 2 * b : 2 * (layout.width + b);
      const newLayout = layout.clone();
      newLayout.swapElements(p, q, a, b);
      set({ layout: newLayout, selectedCell: [a, b] });
      get().computeDisplayStates();
    },

    handleSelectionMove: (dx, dy) => {
      const { selectedCell, layout } = get();
      if (selectedCell !== undefined) {
        const [p, q] = selectedCell;
        // BFS to find first non-empty cell in that direction (quarter circle) from selected
        const queue: Cell[] = [[dx, dy]];
        const seen = {} as { [key: string]: boolean };
        while (queue.length > 0) {
          const [cdx, cdy] = queue.shift() as Cell;
          const key = `${cdx},${cdy}`;
          const [i, j] = [p + 2 * cdy, q + 2 * cdx];
          if (
            seen[key] ||
            i < 0 ||
            i >= 2 * layout.height ||
            j < 0 ||
            j >= 2 * layout.width
          )
            continue;
          seen[key] = true;
          if (layout.layout[i][j] !== SquareType.Empty) {
            set({ selectedCell: [i, j] });
            get().computeDisplayStates();
            return;
          } else {
            queue.push([cdx + dx, cdy + dy]);
            if (Math.abs(cdx) !== Math.abs(cdy)) {
              queue.push([cdx + dy, cdy + dx]);
              queue.push([cdx - dy, cdy - dx]);
            }
          }
        }
        set({ selectedCell: undefined });
        get().computeDisplayStates();
      } else {
        // Find first non-empty cell in that direction from wall
        const starty = dy >= 0 ? 0 : layout.height - 1;
        const startx = dx >= 0 ? 0 : layout.width - 1;
        for (
          let [y, x] = [starty, startx];
          y >= 0 && y < layout.height && x >= 0 && x < layout.width;
          y += dy, x += dx
        ) {
          for (
            let [yy, xx] = [y, x];
            yy >= 0 && yy < layout.height && xx >= 0 && xx < layout.width;
            yy += dx & 1, xx += dy & 1
          ) {
            const [i, j] = [2 * yy, 2 * xx];
            if (layout.layout[i][j] !== SquareType.Empty) {
              set({ selectedCell: [2 * yy, 2 * xx] });
              get().computeDisplayStates();
              return;
            }
          }
        }
        // end for: selected cell is already undefined
      }
    },

    handleDuplicateSelected: () => {
      const { selectedCell, hoveredCell, layout } = get();
      if (selectedCell === undefined) return;

      const newLayout = layout.clone();
      newLayout.duplicateElement(selectedCell, hoveredCell);
      set({ layout: newLayout });
      get().computeDisplayStates();
    },

    handleTouchStart: (i: number, j: number, event: TouchEvent) => {
      event.preventDefault();
      if (!isSingleTouch(event)) return;
      event.target.dispatchEvent(createMouseEvent('mousedown'));
    },

    handleTouchMove: (event: TouchEvent) => {
      const { plan } = get();
      event.preventDefault();
      if (!isSingleTouch(event)) {
        return;
      }
      const [row, col] = getTouchedPosition(event);
      if (row < 0 || col < 0) {
        plan.handleMouseLeave();
      } else {
        plan.handleMouseEnter(row, col);
      }
    },

    handleTouchEnd: (event: TouchEvent) => {
      // Try to ignore multi-touch guestures (doesn't work well)
      event.preventDefault();
      if (!isSingleTouch(event)) {
        return;
      }
      event.target.dispatchEvent(createMouseEvent('mouseup'));
    },
  },
  draw: {
    drawLine: (i: number, j: number, wallType: WallType) => {
      const { layout } = get();
      const newlayout = layout.clone();

      if (i % 2 !== 0 || j % 2 !== 0) {
        newlayout.setElement(i, j, wallType);
        if (i % 2 === 0 || j % 2 === 0) {
          // Fix corner walls only if we're drawing a wall, so
          newlayout.fixCornerWalls(); // users can still draw from corners
        }
        set({ layout: newlayout });
        get().computeDisplayStates();
      }
    },

    handleMouseDown: (i: number, j: number) => {
      const { layout, draw } = get();
      const oldWallType = layout.layout[i][j] as WallType;
      const newWallType = oldWallType.cycle();
      set({ drawType: newWallType });

      draw.drawLine(i, j, newWallType);
    },

    handleMouseUp: () => {
      set({ drawType: undefined });
    },

    handleMouseEnter: (i: number, j: number) => {
      const { draw, drawType } = get();

      if (drawType !== undefined) {
        draw.drawLine(i, j, drawType);
      }
    },

    handleTouchStart: (i: number, j: number, event: TouchEvent) => {
      event.preventDefault();
      if (!isSingleTouch(event)) return;
      event.target.dispatchEvent(createMouseEvent('mousedown'));
    },

    handleTouchMove: (e: TouchEvent) => {
      e.preventDefault();
      if (!isSingleTouch(e)) return;
      const [i, j] = getTouchedWall(e);
      if (i < 0 && j < 0) return;
      get().draw.handleMouseEnter(i, j);
    },

    handleRemoveAllWalls: () => {
      const newLayout = get().layout.clone();
      newLayout.removeWalls();
      newLayout.fixCornerWalls();
      set({ layout: newLayout });
      get().computeDisplayStates();
    },
  },
});

export const useLayoutStore = create<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice
>()((...a) => ({
  ...createLayoutSlice(...a),
  ...createMenuDragSlice(...a),
  ...createCellSlice(...a),
  ...createEventSlice(...a),
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
