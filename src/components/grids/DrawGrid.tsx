import { Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { SyntheticEvent, useCallback } from 'react';
import shallow from 'zustand/shallow';
import { useLayoutStore } from '../../store/layoutStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Cell, SquareState, WallState } from '../../types/project';
import { SquareType } from '../../utils/helpers';
import * as styled from './styled';

const DrawGridSquare = (props: { cell: Cell }) => {
  const [i, j] = props.cell;

  const squareState = useLayoutStore(
    useCallback(
      (state) => {
        if (
          state.displayStates === undefined ||
          state.displayStates[i] === undefined ||
          state.displayStates[i][j] === undefined
        ) {
          return;
        }
        return state.displayStates[i][j];
      },
      [i, j],
    ),
    shallow,
  );

  const [handleMouseUp, handleMouseEnter] = useLayoutStore(
    (state) => [state.draw.handleMouseUp, state.draw.handleMouseEnter],
    shallow,
  );

  if (!squareState) return null;
  const { squareType } = squareState as SquareState;

  let image = null;
  if (squareType !== undefined && squareType !== SquareType.Empty) {
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

  return (
    <div
      className='grid-square draw'
      key={i + '-' + j}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => handleMouseEnter([i, j])}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
    >
      {image}
    </div>
  );
};

const DrawGridWall = (props: { cell: Cell }) => {
  const [i, j] = props.cell;
  const wallState = useLayoutStore(
    useCallback(
      (state) => {
        if (
          state.displayStates === undefined ||
          state.displayStates[i] === undefined ||
          state.displayStates[i][j] === undefined
        ) {
          return;
        }
        return state.displayStates[i][j];
      },
      [i, j],
    ),
    shallow,
  );

  const [
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleTouchStart,
    handleTouchMove,
  ] = useLayoutStore(
    (state) => [
      state.draw.handleMouseDown,
      state.draw.handleMouseUp,
      state.draw.handleMouseEnter,
      state.draw.handleTouchStart,
      state.draw.handleTouchMove,
    ],
    shallow,
  );

  if (!wallState) return null;

  const { wallType, isDrawable } = wallState as WallState;
  return (
    <div
      className={
        wallType.getClassName() + '-draw' + (isDrawable ? ' line-drawable' : '')
      }
      data-wall-row={i}
      data-wall-col={j}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => {
        handleMouseEnter([i, j]);
      }}
      onTouchStart={handleTouchStart}
      onMouseDown={() => {
        handleMouseDown([i, j]);
      }}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
      key={i + '-   ' + j}
    />
  );
};

const DrawGrid = () => {
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const [handleMouseUp, handleDeleteAll] = useLayoutStore(
    (state) => [state.draw.handleMouseUp, state.draw.handleDeleteAll],
    shallow,
  );

  const drawGridElements = [];
  for (let i = 0; i < height * 2 - 1; i++) {
    for (let j = 0; j < width * 2 - 1; j++) {
      if (i % 2 === 0 && j % 2 === 0) {
        drawGridElements.push(
          <DrawGridSquare cell={[i, j]} key={i + '-' + j} />,
        );
      } else {
        drawGridElements.push(<DrawGridWall cell={[i, j]} key={i + '-' + j} />);
      }
    }
  }

  return (
    <styled.GridContainer>
      <i>
        Click and drag to draw a straight wall; click again to indicate counters
        or delete.
      </i>
      <styled.DrawGrid
        onMouseUp={() => handleMouseUp()}
        onMouseLeave={() => handleMouseUp()}
        width={width - 1}
        height={height - 1}
      >
        {drawGridElements}
      </styled.DrawGrid>
      <styled.Buttons>
        <Button
          onClick={handleDeleteAll}
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
