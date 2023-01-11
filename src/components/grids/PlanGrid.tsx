import { ActionIcon, Button } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import {
  IconRotate2,
  IconRotateClockwise2,
  IconTrash,
  IconTrashX,
  IconCopy,
} from '@tabler/icons';
import { SyntheticEvent, DragEvent, useCallback } from 'react';
import shallow from 'zustand/shallow';
import { Cell, WallState } from '../../types/project';
import { useLayoutStore } from '../../store/layoutStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { isSquareState, isTouchDevice, SquareType } from '../../utils/helpers';
import * as styled from './styled';

const CursorState = () => {
  const [
    layout,
    clickedCell,
    draggedOverCell,
    hoveredCell,
    selectedCell,
    menuDraggedItem,
    menuDraggedOverCell,
  ] = useLayoutStore(
    (state) => [
      state.layout,
      state.clickedCell,
      state.draggedOverCell,
      state.hoveredCell,
      state.selectedCell,
      state.menuDraggedItem,
      state.menuDraggedOverCell,
    ],
    shallow,
  );

  if (!layout) {
    return <i></i>;
  }

  if (menuDraggedItem !== undefined && menuDraggedOverCell !== undefined) {
    if (layout.getElement(menuDraggedOverCell) !== SquareType.Empty) {
      const existingItem = layout.getElement(menuDraggedOverCell) as SquareType;
      return (
        <i>
          {`Replace ${existingItem.getImageAlt()} with ${menuDraggedItem.getImageAlt()}`}
        </i>
      );
    } else {
      return <i>{`Add ${menuDraggedItem.getImageAlt()}`}</i>;
    }
  }

  if (clickedCell !== undefined && draggedOverCell !== undefined) {
    const clickedCellType = layout.getElement(clickedCell) as SquareType;
    const draggedOverCellType = layout.getElement(
      draggedOverCell,
    ) as SquareType;
    if (draggedOverCellType === SquareType.Empty) {
      return <i>{`Move ${clickedCellType.getImageAlt()}`}</i>;
    } else {
      return (
        <i>
          {`Swap ${clickedCellType.getImageAlt()} and ${draggedOverCellType.getImageAlt()}`}
        </i>
      );
    }
  }

  if (hoveredCell !== undefined) {
    const hoveredCellType = layout.getElement(hoveredCell) as SquareType;
    if (hoveredCellType !== SquareType.Empty) {
      return <i>{`${hoveredCellType?.getImageAlt()}`}</i>;
    }
  }

  if (selectedCell !== undefined) {
    const selectedCellType = layout.getElement(selectedCell) as SquareType;
    return <i>{`Selected ${selectedCellType.getImageAlt()}`}</i>;
  }

  return (
    <i>
      {isTouchDevice()
        ? 'Tap to select or drag.'
        : 'Left click to select or drag; right click to rotate.'}
    </i>
  );
};

const PlanGridButtons = () => {
  const [
    layout,
    selectedCell,

    handleRotateLeft,
    handleRotateRight,
    handleDuplicateSelected,
    handleDelete,
    handleDeleteAll,
  ] = useLayoutStore(
    (state) => [
      state.layout,
      state.selectedCell,

      state.plan.handleRotateLeft,
      state.plan.handleRotateRight,
      state.plan.handleDuplicateSelected,
      state.plan.handleDelete,
      state.plan.handleDeleteAll,
    ],
    shallow,
  );

  return (
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
        onClick={() => handleRotateRight()}
        size='xl'
        radius='xl'
        disabled={selectedCell === undefined}
      >
        <IconRotateClockwise2 stroke='2.5' size={20} />
      </ActionIcon>
      <ActionIcon
        onClick={() => handleDuplicateSelected()}
        size='xl'
        radius='xl'
        disabled={selectedCell === undefined}
      >
        <IconCopy stroke='2.5' size={20} />
      </ActionIcon>
      <ActionIcon
        onClick={() => handleDelete()}
        size='xl'
        radius='xl'
        disabled={selectedCell === undefined}
      >
        <IconTrashX stroke='2.5' size={20} />
      </ActionIcon>
      <Button
        onClick={() => handleDeleteAll()}
        leftIcon={<IconTrash />}
        size='md'
        radius='xl'
        disabled={(layout?.elements.length ?? -1) <= 0}
      >
        Remove all items
      </Button>
    </styled.Buttons>
  );
};

const PlanGridSquare = (props: { cell: Cell }) => {
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

  let squareType = SquareType.Empty;
  let opacity = 1;
  let isSelected = false;

  if (squareState !== undefined && isSquareState(squareState)) {
    squareType = squareState.squareType;
    opacity = squareState.opacity;
    isSelected = squareState.isSelected;
  }

  const [
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,

    setMenuDraggedOverCell,
    handleMenuDrop,
    setSelectedCell,
  ] = useLayoutStore(
    (state) => [
      state.plan.handleMouseDown,
      state.plan.handleMouseEnter,
      state.plan.handleMouseLeave,
      state.plan.handleTouchStart,
      state.plan.handleTouchEnd,
      state.plan.handleTouchMove,

      state.setMenuDraggedOverCell,
      state.handleMenuDrop,
      state.setSelectedCell,
    ],
    shallow,
  );

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
        onMouseDown={(e) => handleMouseDown([i, j], e)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  } else {
    // touch events fire on the original target
    // must prevent element from being deleted
    // using transparent 1px
    // alternatively, use div for both?
    image = (
      <img
        className='grid-image empty'
        src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
        alt=''
        onTouchStart={() => null}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    );
  }

  return (
    <div
      className={`grid-square ${isSelected ? 'grid-selected' : ''}`}
      key={i + '-' + j}
      data-row={i}
      data-col={j}
      onMouseEnter={() => handleMouseEnter([i, j])}
      onMouseLeave={() => handleMouseLeave()}
      onDragOver={(event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'move';
        }
        setMenuDraggedOverCell([i, j]);
      }}
      onDrop={(event: DragEvent) => {
        event.preventDefault();
        handleMenuDrop();
        setSelectedCell([i, j]);
      }}
    >
      {image}
    </div>
  );
};

const PlanGridWall = (props: { cell: Cell }) => {
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

  if (!wallState) return null;
  const { wallType } = wallState as WallState;
  return (
    <div className={wallType.getClassName() + '-plan'} key={i + '-' + j} />
  );
};

const PlanGrid = () => {
  const [width, height] = useWorkspaceStore(
    (state) => [state.width, state.height],
    shallow,
  );
  const [
    handleMenuDrop,
    handleMouseUp,
    handleDelete,
    handleRotateLeft,
    handleRotateRight,
    handleMoveItem,
    handleMoveSelection,
    handleDuplicateSelected,
  ] = useLayoutStore(
    (state) => [
      state.handleMenuDrop,
      state.plan.handleMouseUp,
      state.plan.handleDelete,
      state.plan.handleRotateLeft,
      state.plan.handleRotateRight,
      state.plan.handleMoveItem,
      state.plan.handleMoveSelection,
      state.plan.handleDuplicateSelected,
    ],
    shallow,
  );

  useHotkeys([
    ['Backspace', () => handleDelete()],
    ['Delete', () => handleDelete()],
    ['Q', () => handleRotateLeft()],
    ['E', () => handleRotateRight()],
    ['W', () => handleMoveItem(0, -1)],
    ['A', () => handleMoveItem(-1, 0)],
    ['S', () => handleMoveItem(0, 1)],
    ['D', () => handleMoveItem(1, 0)],
    ['ArrowUp', () => handleMoveSelection(0, -1)],
    ['ArrowLeft', () => handleMoveSelection(-1, 0)],
    ['ArrowDown', () => handleMoveSelection(0, 1)],
    ['ArrowRight', () => handleMoveSelection(1, 0)],
    ['CTRL+D', () => handleDuplicateSelected()],
  ]);

  const planGridElements = [];
  for (let i = 0; i < height * 2 - 1; i++) {
    for (let j = 0; j < width * 2 - 1; j++) {
      if (i % 2 === 0 && j % 2 === 0) {
        planGridElements.push(
          <PlanGridSquare key={i + '-' + j} cell={[i, j]} />,
        );
      } else {
        planGridElements.push(<PlanGridWall key={i + '-' + j} cell={[i, j]} />);
      }
    }
  }

  return (
    <styled.GridContainer>
      <CursorState />
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
          handleMenuDrop();
        }}
        onMouseUp={(event) => handleMouseUp(event)}
      >
        {planGridElements}
      </styled.PlanGrid>
      <PlanGridButtons />
    </styled.GridContainer>
  );
};

export default PlanGrid;
