import { Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { SyntheticEvent, useState } from 'react';
import shallow from 'zustand/shallow';
import { useLayoutStore } from '../../store/layoutStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { SquareType, WallType } from '../../utils/helpers';
import { Layout } from '../layout/Layout';
import * as styled from './styled';

const DrawGrid = () => {
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const [layout, setLayout] = useLayoutStore(
    (state) => [state.layout ?? new Layout(width, height), state.setLayout],
    shallow,
  );
  const [dragType, setDragType] = useState<WallType | undefined>(undefined);
  const [lastWall, setLastWall] = useState<[number, number] | undefined>(
    undefined,
  );

  const drawLine = (i: number, j: number, walltype: WallType) => {
    if (i % 2 !== 0 || j % 2 !== 0) {
      setLastWall([i, j]);
      const newLayout = layout?.clone();
      newLayout.setElement(i, j, walltype);
      if (i % 2 === 0 || j % 2 === 0) {
        // Fix corner walls only if we're drawing a wall, so
        newLayout.fixCornerWalls(); // users can still draw from corners
      }
      setLayout(newLayout);
    }
  };

  const handleMouseDown = (i: number, j: number) => {
    const oldWallType = layout.layout[i][j] as WallType;
    const newWallType = oldWallType.cycle();

    setDragType(newWallType);
    drawLine(i, j, newWallType);
  };

  const handleMouseUp = () => {
    setDragType(undefined);
  };

  const handleMouseEnter = (i: number, j: number) => {
    if (dragType !== undefined) {
      drawLine(i, j, dragType);
    }
  };

  const handleClosestMouseMove = (i: number, j: number) => {
    if (dragType !== undefined && lastWall !== undefined) {
      if (
        (lastWall[0] === i - 1 || lastWall[0] === i + 1) &&
        (lastWall[1] === j - 2 || lastWall[1] === j + 2)
      ) {
        handleMouseEnter(lastWall[0], j);
      } else if (
        (lastWall[0] === i - 2 || lastWall[0] === i + 2) &&
        (lastWall[1] === j - 1 || lastWall[1] === j + 1)
      ) {
        handleMouseEnter(i, lastWall[1]);
      }
    }
  };

  const getDrawGridElements = () => {
    const gridElements = [];
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        const squareType = layout.layout[i][j] as SquareType;
        if (i % 2 === 0 && j % 2 === 0) {
          // Cells
          gridElements.push(
            <div
              className='grid-square'
              key={i + '-' + j}
              style={{
                backgroundImage: `url(${SquareType.Empty.getImageDisplayPath()})`,
                filter: 'grayscale(100%) contrast(40%) brightness(130%)',
                backgroundSize: '100% 100%',
              }}
              onMouseMove={() => {
                handleClosestMouseMove(i, j);
              }}
            >
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
                  filter: 'grayscale(100%) contrast(40%) brightness(130%)',
                  transform: squareType.getTransform(),
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>,
          );
        } else if (i % 2 === 0 || j % 2 === 0) {
          // Walls
          const wallType = layout.layout[i][j] as WallType;
          gridElements.push(
            <div
              className={wallType.getClassName() + '-draw'}
              onMouseEnter={() => {
                handleMouseEnter(i, j);
              }}
              onMouseDown={() => {
                handleMouseDown(i, j);
              }}
              key={i + '-   ' + j}
            />,
          );
        } else {
          const wallType = layout.layout[i][j] as WallType; // Wall corners
          gridElements.push(
            <div
              className={wallType.getClassName() + '-draw'}
              onMouseEnter={() => {
                handleMouseEnter(i, j);
              }}
              onMouseDown={() => {
                handleMouseDown(i, j);
              }}
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
      <i>
        Click and drag to draw your floor plan; click again to indicate counters
        or delete.
      </i>
      <styled.DrawGrid
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        width={width - 1}
        height={height - 1}
      >
        {getDrawGridElements()}
      </styled.DrawGrid>
      <styled.Buttons>
        <Button
          onClick={() => {
            const newLayout = layout.clone();
            newLayout.removeWalls();
            newLayout.fixCornerWalls();
            setLayout(newLayout);
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
