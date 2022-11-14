import { Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { SyntheticEvent, TouchEvent, useMemo, useRef, useState } from 'react';
import shallow from 'zustand/shallow';
import { useLayoutRef, useLayoutStore } from '../../store/layoutStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import {
  createMouseEvent,
  getTouchedWall,
  isSingleTouch,
  SquareType,
  WallType,
} from '../../utils/helpers';
import * as styled from './styled';

const DrawGrid = () => {
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const layoutRef = useLayoutRef();
  // using local layout to prevent too many URL update DOMException
  const [newLayout, setNewLayout] = useState(layoutRef.current.clone());
  const setLayout = useLayoutStore((state) => state.setLayout);
  const dragTypeRef = useRef<WallType | undefined>(undefined);

  const drawLine = (i: number, j: number, walltype: WallType) => {
    if (i % 2 !== 0 || j % 2 !== 0) {
      newLayout.setElement(i, j, walltype.clone());
      if (i % 2 === 0 || j % 2 === 0) {
        // Fix corner walls only if we're drawing a wall, so
        newLayout.fixCornerWalls(); // users can still draw from corners
      }
      setNewLayout(newLayout.clone());
    }
  };

  const handleMouseDown = (i: number, j: number) => {
    const oldWallType = newLayout.layout[i][j] as WallType;
    const newWallType = oldWallType.cycle();

    dragTypeRef.current = newWallType;
    drawLine(i, j, newWallType);
  };

  const handleTouchStart = (i: number, j: number, e: TouchEvent) => {
    e.preventDefault();
    if (!isSingleTouch(e)) return;
    e.target.dispatchEvent(createMouseEvent('mousedown'));
  };

  const handleMouseUp = () => {
    dragTypeRef.current = undefined;
    // update URL
    setLayout(newLayout);
  };

  const handleMouseEnter = (i: number, j: number) => {
    if (dragTypeRef.current !== undefined) {
      drawLine(i, j, dragTypeRef.current);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!isSingleTouch(e)) return;
    const [i, j] = getTouchedWall(e);
    if (i < 0 && j < 0) return;
    handleMouseEnter(i, j);
  };

  const gridElements = useMemo(() => {
    const gridElements = [];
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        const squareType = newLayout.layout[i][j] as SquareType;
        if (i % 2 === 0 && j % 2 === 0) {
          let image = null;
          if (squareType !== SquareType.Empty) {
            image = (
              <img
                className='grid-image'
                draggable={false}
                src={squareType.getImageDisplayPath()}
                alt={squareType.getImageAlt()}
                onError={(event: SyntheticEvent<HTMLImageElement>) => {
                  const target = event.currentTarget as HTMLImageElement;
                  target.onerror = null; // prevents looping
                  target.src = '/images/display/404.png';
                }}
                style={{
                  transform: squareType.getTransform(),
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            );
          }
          // Cells
          gridElements.push(
            <div className='grid-square draw' key={i + '-' + j}>
              {image}
            </div>,
          );
        } else if (i % 2 === 0 || j % 2 === 0) {
          // Walls
          const wallType = newLayout.layout[i][j] as WallType;
          gridElements.push(
            <div
              className={wallType.getClassName() + '-draw'}
              data-wall-row={i}
              data-wall-col={j}
              onTouchMove={handleTouchMove}
              onMouseEnter={() => {
                handleMouseEnter(i, j);
              }}
              onTouchStart={(e) => handleTouchStart(i, j, e)}
              onMouseDown={() => {
                handleMouseDown(i, j);
              }}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseUp}
              key={i + '-   ' + j}
            />,
          );
        } else {
          const wallType = newLayout.layout[i][j] as WallType; // Wall corners
          gridElements.push(
            <div
              className={wallType.getClassName() + '-draw'}
              data-wall-row={i}
              data-wall-col={j}
              onTouchMove={handleTouchMove}
              onMouseEnter={() => {
                handleMouseEnter(i, j);
              }}
              onTouchStart={(e) => handleTouchStart(i, j, e)}
              onMouseDown={() => {
                handleMouseDown(i, j);
              }}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseUp}
              key={i + '-' + j}
            />,
          );
        }
      }
    }
    return gridElements;
  }, [newLayout]);

  return (
    <styled.GridContainer>
      <i>
        Click and drag to draw your floor plan; click again to indicate counters
        or delete.
      </i>
      <styled.DrawGrid
        onMouseUp={() => handleMouseUp()}
        onMouseLeave={() => handleMouseUp()}
        width={width - 1}
        height={height - 1}
      >
        {gridElements}
      </styled.DrawGrid>
      <styled.Buttons>
        <Button
          onClick={() => {
            newLayout.removeWalls();
            newLayout.fixCornerWalls();
            setLayout(newLayout);
            setNewLayout(newLayout.clone());
          }}
          leftIcon={<IconTrash />}
          size='md'
          radius='xl'
        >
          Remove all walls
        </Button>
      </styled.Buttons>
    </styled.GridContainer>
  );
};

export default DrawGrid;
