import { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import { useLocation } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle } from '@tabler/icons';
import { DrawGrid, PlanGrid } from '../../components/grids/grids';
import { SquareType, GridMode } from '../../utils/helpers';
import { Layout } from '../../components/layout/Layout';
import { useWorkspaceStore } from '../../store/workspaceStore';

import './Workspace.css';
import { Serializer } from '../../lib/serializer';

const Workspace = () => {
  const location = useLocation();
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );

  const [layout, setLayout] = useState<Layout | null>();
  const [mode, setMode] = useState(GridMode.Plan);
  const [draggedItem, setDraggedItem] = useState<SquareType | undefined>(
    undefined,
  );
  const [draggedPosition, setDraggedPosition] = useState<
    [number, number] | undefined
  >(undefined);
  const [textInputInFocus, setTextInputInFocus] = useState(false);

  useEffect(() => {
    if (layout) {
      return;
    }

    if (location.hash) {
      try {
        setLayout(Serializer.decodeLayoutString(location.hash));
      } catch (e) {
        setLayout(new Layout(height, width));
        showNotification({
          id: 'layout-invalid',
          title: 'Oops something went wrong',
          message: 'Your layout link is invalid',
          color: 'red',
          icon: <IconAlertTriangle size={20} />,
          autoClose: 10000,
        });
      }
    } else {
      setLayout(new Layout(height, width));
    }
  }, [location]);

  const handleStartPlan = () => {
    const newLayout = layout?.clone();
    newLayout?.fixCornerWalls();
    setLayout(newLayout);
    setMode(GridMode.Plan);
  };

  // Drag event handlers passed to Menu
  const handleMenuDrag = (item: SquareType) => {
    setDraggedItem(item);
  };

  const handleMenuDragEnd = () => {
    if (draggedItem !== undefined && draggedPosition !== undefined) {
      handleMenuDropInGrid();
    }
    setDraggedItem(undefined);
    setDraggedPosition(undefined);
  };

  const handleAddItem = (squareType: SquareType) => {
    const newLayout = layout?.clone();
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        if (newLayout?.layout[i][j] === SquareType.Empty) {
          newLayout?.setElement(i, j, squareType);
          setLayout(newLayout);
          return;
        }
      }
    }
  };

  // Drag event handlers passed to PlanGrid
  const handleMenuDragInGrid = (i: number, j: number) => {
    setDraggedPosition([i, j]);
  };

  const handleMenuDropInGrid = () => {
    if (draggedItem !== undefined && draggedPosition !== undefined) {
      const newLayout = layout?.clone();
      newLayout?.setElement(
        draggedPosition[0],
        draggedPosition[1],
        draggedItem,
      );
      setLayout(newLayout);
    }
    setDraggedItem(undefined);
    setDraggedPosition(undefined);
  };

  const handleMenuDragOffGrid = () => {
    setDraggedItem(undefined);
    setDraggedPosition(undefined);
  };

  let grid = (
    <PlanGrid
      height={height}
      width={width}
      layout={layout ?? new Layout(height, width)}
      setLayoutParent={setLayout}
      draggedMenuItem={draggedItem}
      draggedMenuPosition={draggedPosition}
      handleMenuDrag={handleMenuDragInGrid}
      handleMenuDrop={handleMenuDropInGrid}
      handleMenuDragAway={handleMenuDragOffGrid}
      textInputInFocus={textInputInFocus}
    />
  );

  if (mode === GridMode.Draw) {
    grid = (
      <DrawGrid
        height={height}
        width={width}
        layout={layout ?? new Layout(height, width)}
        setLayoutParent={setLayout}
        handleStartPlan={handleStartPlan}
      />
    );
  }

  return null;
};

export default Workspace;
