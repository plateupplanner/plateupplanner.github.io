import type { Cell, SquareState, WallState } from '../types/project';
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
  DrawDirection,
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
};

type MenuDragSlice = {
  menuDraggedItem?: SquareType;
  setMenuDraggedItem: (item?: SquareType) => void;
  menuDraggedOverCell?: Cell;
  setMenuDraggedOverCell: (cell: Cell) => void;
  handleMenuDrop: () => void;
};

type CellSlice = {
  selectedCell?: Cell;
  setSelectedCell: (selectedCell?: Cell) => void;

  hoveredCell?: Cell;
  setHoveredCell: (hoveredCell?: Cell) => void;

  clickedCell?: Cell;
  setClickedCell: (clickedCell?: Cell) => void;

  draggedOverCell?: Cell;
  setDraggedOverCell: (draggedOverCell?: Cell) => void;
};

type WallSlice = {
  startWall?: Cell;
  endWall?: Cell;
  drawType?: WallType;
  drawDirection?: DrawDirection;
};

type EventSlice = {
  plan: {
    handleMouseDown: (cell: Cell, event: MouseEvent) => void;
    handleMouseUp: (event: MouseEvent) => void;
    handleMouseEnter: (cell: Cell) => void;
    handleMouseLeave: () => void;
    handleDelete: () => void;
    handleRotateLeft: () => void;
    handleRotateRight: () => void;
    handleDeleteAll: () => void;
    handleMoveItem: (dx: number, dy: number) => void;
    handleMoveSelection: (dx: number, dy: number) => void;
    handleDuplicateSelected: () => void;
    handleTouchStart: (event: TouchEvent) => void;
    handleTouchMove: (event: TouchEvent) => void;
    handleTouchEnd: (event: TouchEvent) => void;
  };
  draw: {
    handleMouseDown: (cell: Cell) => void;
    handleMouseUp: () => void;
    handleMouseEnter: (cell: Cell) => void;
    handleTouchStart: (event: TouchEvent) => void;
    handleTouchMove: (event: TouchEvent) => void;
    handleDeleteAll: () => void;
  };
};

const computeSquareState = (
  cell: Cell,
  state: LayoutSlice & MenuDragSlice & CellSlice & EventSlice & WallSlice,
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
      squareType = layout.getElement(clickedCell) as SquareType;
      opacity = 0.7;
    } else if (clickedCell !== undefined && areSameCell(clickedCell, [i, j])) {
      squareType = layout.getElement(draggedOverCell) as SquareType;
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
  state: LayoutSlice & MenuDragSlice & CellSlice & EventSlice & WallSlice,
) => {
  const { layout, startWall, endWall, drawType, drawDirection } = state;
  const [i, j] = cell;

  if (
    startWall !== undefined &&
    endWall !== undefined &&
    drawType !== undefined
  ) {
    // Wall being drawn
    if (
      ((drawDirection === DrawDirection.Horizontal ||
        drawDirection === DrawDirection.None) &&
        i === startWall[0] &&
        ((j >= startWall[1] && j <= endWall[1]) ||
          (j >= endWall[1] && j <= startWall[1]))) ||
      ((drawDirection === DrawDirection.Vertical ||
        drawDirection === DrawDirection.None) &&
        j === startWall[1] &&
        ((i >= startWall[0] && i <= endWall[0]) ||
          (i >= endWall[0] && i <= startWall[0])))
    ) {
      return {
        wallType: drawType,
        isDrawable: false,
      };
    }
    // Wall can be drawn
    if (
      (drawDirection === DrawDirection.Horizontal && i === startWall[0]) ||
      (drawDirection === DrawDirection.Vertical && j === startWall[1]) ||
      (drawDirection === DrawDirection.None &&
        (i === startWall[0] || j === startWall[1]))
    ) {
      return {
        wallType: layout?.layout?.[i]?.[j] as WallType,
        isDrawable: true,
      };
    }
  }
  return {
    wallType: layout?.layout?.[i]?.[j] as WallType,
    isDrawable: false,
  };
};

const createLayoutSlice: StateCreator<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice & WallSlice,
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
    const newDisplayStates = Array.from(Array(height * 2 - 1), () =>
      Array(width * 2 - 1),
    );
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          newDisplayStates[i][j] = computeSquareState([i, j], get());
        } else {
          newDisplayStates[i][j] = computeWallState([i, j], get());
        }
      }
    }
    set({ displayStates: newDisplayStates });
  },
});

const createMenuDragSlice: StateCreator<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice & WallSlice,
  [],
  [],
  MenuDragSlice
> = (set, get) => ({
  menuDraggedItem: undefined,
  menuDraggedOverCell: undefined,
  setMenuDraggedOverCell: (cell) => {
    const menuDraggedOverCell = get().menuDraggedOverCell;
    if (!menuDraggedOverCell || !areSameCell(menuDraggedOverCell, cell)) {
      set({ menuDraggedOverCell: cell });
      get().computeDisplayStates();
    }
  },

  setMenuDraggedItem: (item) => {
    if (get().menuDraggedItem?.id !== item?.id) {
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
          state.menuDraggedOverCell,
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

const createWallSlice: StateCreator<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice & WallSlice,
  [],
  [],
  WallSlice
> = () => ({
  startWall: undefined,
  endWall: undefined,
  drawType: undefined,
  drawDirection: undefined,
});

const createEventSlice: StateCreator<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice & WallSlice,
  [],
  [],
  EventSlice
> = (set, get) => ({
  plan: {
    handleMouseDown: (cell, event) => {
      const { clickedCell, layout } = get();
      if (event.button === 0 && clickedCell === undefined) {
        set({ clickedCell: cell });
      } else if (event.button === 2) {
        const newLayout = layout.clone();
        newLayout.rotateElementRight(cell);
        set({ layout: newLayout });
        get().computeDisplayStates();
      }
    },

    handleMouseEnter: (cell) => {
      const { clickedCell } = get();
      if (clickedCell !== undefined) {
        set({ draggedOverCell: cell });
        get().computeDisplayStates();
      }
      set({ hoveredCell: cell });
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
        newLayout.swapElements(clickedCell, draggedOverCell);
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
        newLayout.setElement(selectedCell, SquareType.Empty);
        set({ layout: newLayout, selectedCell: undefined });
        get().computeDisplayStates();
      }
    },

    handleRotateLeft: () => {
      const { selectedCell, layout } = get();
      if (selectedCell !== undefined) {
        const newLayout = layout.clone();
        newLayout.rotateElementLeft(selectedCell);
        set({ layout: newLayout });
        get().computeDisplayStates();
      }
    },

    handleRotateRight: () => {
      const { selectedCell, layout } = get();
      if (selectedCell !== undefined) {
        const newLayout = layout.clone();
        newLayout.rotateElementRight(selectedCell);
        set({ layout: newLayout });
        get().computeDisplayStates();
      }
    },

    handleDeleteAll: () => {
      const { layout } = get();
      const newLayout = layout.clone();
      newLayout.removeSquares();
      set({ layout: newLayout });
      get().computeDisplayStates();
    },

    handleMoveItem: (dx, dy) => {
      const { selectedCell, layout } = get();
      if (selectedCell === undefined) return;
      const [p, q] = selectedCell;
      // add y and x component with wrap around
      let a = (dy + p / 2) % layout.height;
      a = a >= 0 ? 2 * a : 2 * (layout.height + a);
      let b = (dx + q / 2) % layout.width;
      b = b >= 0 ? 2 * b : 2 * (layout.width + b);
      const newLayout = layout.clone();
      newLayout.swapElements(selectedCell, [a, b]);
      set({ layout: newLayout, selectedCell: [a, b] });
      get().computeDisplayStates();
    },

    handleMoveSelection: (dx, dy) => {
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

    handleTouchStart: (event: TouchEvent) => {
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
        plan.handleMouseEnter([row, col]);
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
    handleMouseDown: (cell: Cell) => {
      const oldWallType = get().layout.getElement(cell) as WallType;

      const [i, j] = cell;
      let drawDirection = DrawDirection.None;
      if (i % 2 === 0 && j % 2 === 1) {
        drawDirection = DrawDirection.Vertical;
      } else if (i % 2 === 1 && j % 2 === 0) {
        drawDirection = DrawDirection.Horizontal;
      }
      set({
        startWall: cell,
        endWall: cell,
        drawType: oldWallType.cycle(),
        drawDirection,
      });
      get().computeDisplayStates();
    },

    handleMouseUp: () => {
      const { startWall, endWall, drawType, layout, computeDisplayStates } =
        get();
      if (
        startWall !== undefined &&
        endWall !== undefined &&
        drawType !== undefined
      ) {
        const newLayout = layout.clone();
        if (startWall[0] === endWall[0]) {
          const [jMin, jMax] = [startWall[1], endWall[1]].sort((a, b) => a - b);
          for (let j = jMin; j <= jMax; j += 1) {
            newLayout.setElement([startWall[0], j], drawType);
          }
        } else if (startWall[1] === endWall[1]) {
          const [iMin, iMax] = [startWall[0], endWall[0]].sort((a, b) => a - b);
          for (let i = iMin; i <= iMax; i += 1) {
            newLayout.setElement([i, startWall[1]], drawType);
          }
        } else {
          throw Error("startWall and endWall indices don't match");
        }
        newLayout.fixCornerWalls();
        set({ layout: newLayout });
      }
      set({ startWall: undefined, endWall: undefined, drawType: undefined });
      computeDisplayStates();
    },

    handleMouseEnter: (cell: Cell) => {
      const { startWall, drawDirection, drawType, computeDisplayStates } =
        get();
      const [i, j] = cell;
      if (startWall !== undefined && drawType !== undefined) {
        let newDrawDirection = drawDirection;
        if (drawDirection === DrawDirection.None) {
          const [vertDistance, horzDistance] = [
            Math.abs(i - startWall[0]),
            Math.abs(j - startWall[1]),
          ];
          newDrawDirection =
            vertDistance > horzDistance
              ? DrawDirection.Vertical
              : DrawDirection.Horizontal;
        }

        if (newDrawDirection === DrawDirection.Vertical) {
          set({ drawDirection, endWall: [i, startWall[1]] });
        } else {
          set({ drawDirection, endWall: [startWall[0], j] });
        }
        computeDisplayStates();
      }
    },

    handleTouchStart: (event: TouchEvent) => {
      event.preventDefault();
      if (!isSingleTouch(event)) return;
      event.target.dispatchEvent(createMouseEvent('mousedown'));
    },

    handleTouchMove: (e: TouchEvent) => {
      e.preventDefault();
      if (!isSingleTouch(e)) return;
      const [i, j] = getTouchedWall(e);
      if (i < 0 && j < 0) return;
      get().draw.handleMouseEnter([i, j]);
    },

    handleDeleteAll: () => {
      const newLayout = get().layout.clone();
      newLayout.removeWalls();
      newLayout.fixCornerWalls();
      set({ layout: newLayout });
      get().computeDisplayStates();
    },
  },
});

export const useLayoutStore = create<
  LayoutSlice & MenuDragSlice & CellSlice & EventSlice & WallSlice
>()((...a) => ({
  ...createLayoutSlice(...a),
  ...createMenuDragSlice(...a),
  ...createCellSlice(...a),
  ...createWallSlice(...a),
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
