import { Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { SyntheticEvent, useMemo, useRef } from 'react';
import shallow from 'zustand/shallow';
import { useLayoutRef, useLayoutStore } from '../../store/layoutStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { SquareType, WallType } from '../../utils/helpers';
import * as styled from './styled';

const DrawGrid = () => {
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const layoutRef = useLayoutRef();
  const setLayout = useLayoutStore((state) => state.setLayout);
  const dragTypeRef = useRef<WallType | undefined>(undefined);

  const drawLine = (i: number, j: number, walltype: WallType) => {
    if (i % 2 !== 0 || j % 2 !== 0) {
      const newLayout = layoutRef.current.clone();
      newLayout.setElement(i, j, walltype.clone());
      if (i % 2 === 0 || j % 2 === 0) {
        // Fix corner walls only if we're drawing a wall, so
        newLayout.fixCornerWalls(); // users can still draw from corners
      }
      setLayout(newLayout);
    }
  };

  const handleMouseDown = (i: number, j: number) => {
    const oldWallType = layoutRef.current.layout[i][j] as WallType;
    const newWallType = oldWallType.cycle();

    dragTypeRef.current = newWallType;
    drawLine(i, j, newWallType);
  };

  const handleMouseUp = () => {
    dragTypeRef.current = undefined;
  };

  const handleMouseEnter = (i: number, j: number) => {
    if (dragTypeRef.current !== undefined) {
      drawLine(i, j, dragTypeRef.current);
    }
  };

  const gridElements = useMemo(() => {
    const gridElements = [];
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        const squareType = layoutRef.current.layout[i][j] as SquareType;
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
          const wallType = layoutRef.current.layout[i][j] as WallType;
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
          const wallType = layoutRef.current.layout[i][j] as WallType; // Wall corners
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
  }, [layoutRef.current]);

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
            const newLayout = layoutRef.current.clone();
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
