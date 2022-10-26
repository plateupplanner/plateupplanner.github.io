import { ActionIcon, Button } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import {
  IconRotate2,
  IconRotateClockwise2,
  IconTrash,
  IconTrashX,
} from '@tabler/icons';
import { useState, SyntheticEvent, MouseEvent, DragEvent } from 'react';
import shallow from 'zustand/shallow';
import { useLayoutStore } from '../../store/layoutStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { SquareType, WallType } from '../../utils/helpers';
import * as styled from './styled';

const PlanGrid = () => {
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const [
    layout,
    setLayout,
    draggedItem,
    draggedPosition,
    setDraggedPosition,
    handleDropInGrid,
    selectedCell,
    setSelectedCell,
  ] = useLayoutStore(
    (state) => [
      state.layout,
      state.setLayout,
      state.draggedItem,
      state.draggedPosition,
      state.setDraggedPosition,
      state.handleDropInGrid,
      state.selectedCell,
      state.setSelectedCell,
    ],
    shallow,
  );

  const [hoveredCell, setHoveredCell] = useState<[number, number] | undefined>(
    undefined,
  );
  const [clickedCell, setClickedCell] = useState<[number, number] | undefined>(
    undefined,
  );
  const [draggedOverCell, setDraggedOverCell] = useState<
    [number, number] | undefined
  >(undefined);

  const getCursorState = () => {
    if (draggedItem !== undefined && draggedPosition !== undefined) {
      if (
        layout.layout[draggedPosition[0]][draggedPosition[1]] !==
        SquareType.Empty
      ) {
        const existingItem = layout.layout[draggedPosition[0]][
          draggedPosition[1]
        ] as SquareType;
        return `Replace ${existingItem.getImageAlt()} with ${draggedItem.getImageAlt()}`;
      } else {
        return `Add ${draggedItem.getImageAlt()}`;
      }
    }

    if (clickedCell !== undefined && draggedOverCell !== undefined) {
      const clickedCellType = layout.layout[clickedCell[0]][
        clickedCell[1]
      ] as SquareType;
      const draggedOverCellType = layout.layout[draggedOverCell[0]][
        draggedOverCell[1]
      ] as SquareType;
      if (draggedOverCellType === SquareType.Empty) {
        return `Move ${clickedCellType.getImageAlt()}`;
      } else {
        return `Swap ${clickedCellType.getImageAlt()} and ${draggedOverCellType.getImageAlt()}`;
      }
    }

    if (hoveredCell !== undefined) {
      const hoveredCellType = layout.layout[hoveredCell[0]][
        hoveredCell[1]
      ] as SquareType;
      if (hoveredCellType !== SquareType.Empty) {
        return `${hoveredCellType?.getImageAlt()}`;
      }
    }

    if (selectedCell !== undefined) {
      const selectedCellType = layout.layout[selectedCell[0]][
        selectedCell[1]
      ] as SquareType;
      return `Selected ${selectedCellType.getImageAlt()}`;
    }

    return <i>Left click to select or drag; right click to rotate.</i>;
  };

  const handleMouseDown = (i: number, j: number, event: MouseEvent) => {
    if (event.button === 0 && clickedCell === undefined) {
      setClickedCell([i, j]);
    } else if (event.button === 2) {
      const newLayout = layout.clone();
      newLayout.rotateElementRight(i, j);
      setLayout(newLayout);
    }
  };

  const handleMouseEnter = (i: number, j: number, event: MouseEvent) => {
    if (clickedCell !== undefined && (event.buttons & 1) !== 0) {
      setDraggedOverCell([i, j]);
    }
    setHoveredCell([i, j]);
  };

  const handleMouseLeave = () => {
    setHoveredCell(undefined);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (event.button === 2) {
      return;
    }
    if (clickedCell !== undefined && draggedOverCell !== undefined) {
      const newLayout = layout.clone();
      newLayout.swapElements(
        clickedCell[0],
        clickedCell[1],
        draggedOverCell[0],
        draggedOverCell[1],
      );
      setSelectedCell(draggedOverCell);
      setLayout(newLayout);
    } else if (
      clickedCell !== undefined &&
      (selectedCell === undefined ||
        clickedCell[0] !== selectedCell[0] ||
        clickedCell[1] !== selectedCell[1])
    ) {
      setSelectedCell(clickedCell);
    } else {
      setSelectedCell(undefined);
    }
    setClickedCell(undefined);
    setDraggedOverCell(undefined);
  };

  const handleDelete = () => {
    if (selectedCell !== undefined) {
      const newLayout = layout.clone();
      newLayout.setElement(selectedCell[0], selectedCell[1], SquareType.Empty);
      setLayout(newLayout);
      setSelectedCell(undefined);
    }
  };

  const handleRotateLeft = () => {
    if (selectedCell !== undefined) {
      const newLayout = layout.clone();
      newLayout.rotateElementLeft(selectedCell[0], selectedCell[1]);
      setLayout(newLayout);
    }
  };

  const handleRotateRight = () => {
    if (selectedCell !== undefined) {
      const newLayout = layout.clone();
      newLayout.rotateElementRight(selectedCell[0], selectedCell[1]);
      setLayout(newLayout);
    }
  };

  const handleRemoveSquares = () => {
    const newLayout = layout.clone();
    newLayout.removeSquares();
    setLayout(newLayout);
  };

  const handleMove = (dx: number, dy: number) => {
    if (selectedCell === undefined) return;
    const [p, q] = selectedCell;
    // add y and x component with wrap around
    let a = (dy + p / 2) % layout.height;
    a = a >= 0 ? 2 * a : 2 * (layout.height + a);
    let b = (dx + q / 2) % layout.width;
    b = b >= 0 ? 2 * b : 2 * (layout.width + b);
    const newLayout = layout.clone();
    newLayout.swapElements(p, q, a, b);
    setLayout(newLayout);
    setSelectedCell([a, b]);
  };

  const handleShiftSelect = (dx: number, dy: number) => {
    if (selectedCell !== undefined) {
      const [p, q] = selectedCell;
      // BFS to find first non-empty cell in that direction (quarter circle) from selected
      const queue: [number, number][] = [[dx, dy]];
      const seen = {} as { [key: string]: boolean };
      while (queue.length > 0) {
        const [cdx, cdy] = queue.shift() as [number, number];
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
          setSelectedCell([i, j]);
          return;
        } else {
          queue.push([cdx + dx, cdy + dy]);
          if (Math.abs(cdx) !== Math.abs(cdy)) {
            queue.push([cdx + dy, cdy + dx]);
            queue.push([cdx - dy, cdy - dx]);
          }
        }
      }
      setSelectedCell(undefined);
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
            setSelectedCell([2 * yy, 2 * xx]);
            return;
          }
        }
      }
      // end for: selected cell is already undefined
    }
  };

  useHotkeys([
    ['Backspace', () => handleDelete()],
    ['Delete', () => handleDelete()],
    ['Q', () => handleRotateLeft()],
    ['E', () => handleRotateRight()],
    ['W', () => handleMove(0, -1)],
    ['A', () => handleMove(-1, 0)],
    ['S', () => handleMove(0, 1)],
    ['D', () => handleMove(1, 0)],
    ['ArrowUp', () => handleShiftSelect(0, -1)],
    ['ArrowLeft', () => handleShiftSelect(-1, 0)],
    ['ArrowDown', () => handleShiftSelect(0, 1)],
    ['ArrowRight', () => handleShiftSelect(1, 0)],
  ]);

  const getPlanGridElements = () => {
    if (!layout) {
      return;
    }

    const gridElements = [];
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          let selected = '';
          if (
            selectedCell !== undefined &&
            selectedCell[0] === i &&
            selectedCell[1] === j
          ) {
            selected = 'grid-selected';
          }

          let squareType = layout.layout?.[i]?.[j] as SquareType;
          let opacity = 1;
          if (draggedOverCell !== undefined) {
            if (draggedOverCell[0] === i && draggedOverCell[1] === j) {
              squareType = layout.layout[clickedCell?.[0] ?? 0][
                clickedCell?.[1] ?? 0
              ] as SquareType;
              opacity = 0.7;
            } else if (
              clickedCell !== undefined &&
              clickedCell[0] === i &&
              clickedCell[1] === j
            ) {
              squareType = layout.layout[draggedOverCell[0]][
                draggedOverCell[1]
              ] as SquareType;
              opacity = 0.7;
            }
          }

          if (
            draggedItem !== undefined &&
            draggedPosition !== undefined &&
            draggedPosition[0] === i &&
            draggedPosition[1] === j
          ) {
            squareType = draggedItem;
            opacity = 0.7;
          }

          let image = null;
          if (squareType !== SquareType.Empty) {
            image = (
              <img
                className='grid-image'
                draggable={false}
                src={squareType?.getImageDisplayPath()}
                alt={squareType?.getImageAlt()}
                onError={(event: SyntheticEvent) => {
                  const target = event.currentTarget as HTMLImageElement;
                  target.onerror = null; // prevents looping
                  target.src = '/images/display/404.png';
                }}
                style={{
                  opacity: opacity,
                  transform: 'scale(1.1)' + squareType?.getTransform(),
                  cursor: 'grab',
                }}
                onMouseDown={(event: MouseEvent) =>
                  handleMouseDown(i, j, event)
                }
                onContextMenu={(e) => e.preventDefault()}
              />
            );
          } else {
            image = <div className='grid-image' />;
          }

          gridElements.push(
            <div
              className={`grid-square ${selected}`}
              key={i + '-' + j}
              onMouseEnter={(e) => handleMouseEnter(i, j, e)}
              onMouseLeave={() => handleMouseLeave()}
              onDragOver={(event: DragEvent) => {
                event.preventDefault();
                if (event.dataTransfer) {
                  event.dataTransfer.dropEffect = 'move';
                }
                setDraggedPosition(i, j);
              }}
              onDrop={(event: DragEvent) => {
                event.preventDefault();
                handleDropInGrid();
                setSelectedCell([i, j]);
              }}
              style={{
                backgroundImage: `url(${SquareType.Empty.getImageDisplayPath()})`,
                backgroundSize: '100% 100%',
                userSelect: 'none',
              }}
            >
              {image}
            </div>,
          );
        } else {
          const wallType = layout.layout?.[i]?.[j] as WallType;
          gridElements.push(
            <div
              className={wallType?.getClassName() + '-plan'}
              key={i + '-' + j}
            />,
          );
        }
      }
    }
    return gridElements;
  };

  return (
    <styled.GridContainer>
      <i>{getCursorState()}</i>
      <styled.PlanGrid
        id='plan-grid'
        width={width - 1}
        height={height - 1}
        onDragOver={(event: DragEvent) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(event: DragEvent) => {
          event.preventDefault();
          handleDropInGrid();
        }}
        onMouseUp={(event) => handleMouseUp(event)}
      >
        {getPlanGridElements()}
      </styled.PlanGrid>
      <styled.Buttons>
        <ActionIcon
          onClick={() => handleRotateLeft()}
          size='xl'
          radius='xl'
          disabled={selectedCell === undefined}
        >
          <IconRotate2 stroke='2.5' size={20} />
        </ActionIcon>
        <ActionIcon
          onClick={() => handleDelete()}
          size='xl'
          radius='xl'
          disabled={selectedCell === undefined}
        >
          <IconTrashX stroke='2.5' size={20} />
        </ActionIcon>
        <ActionIcon
          onClick={() => handleRotateRight()}
          size='xl'
          radius='xl'
          disabled={selectedCell === undefined}
        >
          <IconRotateClockwise2 stroke='2.5' size={20} />
        </ActionIcon>
        <Button
          onClick={() => handleRemoveSquares()}
          leftIcon={<IconTrash />}
          size='md'
          radius='xl'
          disabled={(layout?.elements.length ?? -1) <= 0}
        >
          Remove all items
        </Button>
      </styled.Buttons>
    </styled.GridContainer>
  );
};

export default PlanGrid;
