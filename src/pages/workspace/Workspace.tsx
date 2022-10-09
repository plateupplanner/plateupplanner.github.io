import { useState } from 'react';
import shallow from 'zustand/shallow';
import { useNavigate } from 'react-router-dom';
import { Modal, Popover } from 'antd';
import {
  DoubleLeftOutlined,
  OrderedListOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Obfuscate } from '@south-paw/react-obfuscate-ts';

import { DrawGrid, PlanGrid } from '../../components/grids/grids';
import { Menu } from '../../components/menu/Menu';
import { SquareType, GridMode, styledButton } from '../../utils/helpers';
import { Layout } from '../../components/layout/Layout';

import './Workspace.css';
import { useWorkspaceStore } from '../../store/workspaceStore';
export interface WorkspaceProps {
  height?: number;
  width?: number;
  handleResetParent?: () => void;
  importedLayout?: Layout;
}

export default function Workspace(props: WorkspaceProps) {
  const navigate = useNavigate();
  const [width, height, resetWorkspace] = useWorkspaceStore(
    (state) => [state.width, state.height, state.resetWorkspace],
    shallow,
  );

  const [layout, setLayout] = useState(
    props.importedLayout || new Layout(height, width),
  );
  const [mode, setMode] = useState(GridMode.Plan);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<SquareType | undefined>(
    undefined,
  );
  const [draggedPosition, setDraggedPosition] = useState<
    [number, number] | undefined
  >(undefined);
  const [textInputInFocus, setTextInputInFocus] = useState(false);

  const handleStartPlan = () => {
    const newLayout = layout.clone();
    newLayout.fixCornerWalls();
    setLayout(newLayout);
    setMode(GridMode.Plan);
  };

  const handleStartDraw = () => {
    setMode(GridMode.Draw);
  };

  const handleReset = () => {
    resetWorkspace();
    navigate('/');
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
    const newLayout = layout.clone();
    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        if (newLayout.layout[i][j] === SquareType.Empty) {
          newLayout.setElement(i, j, squareType);
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
      const newLayout = layout.clone();
      newLayout.setElement(draggedPosition[0], draggedPosition[1], draggedItem);
      setLayout(newLayout);
    }
    setDraggedItem(undefined);
    setDraggedPosition(undefined);
  };

  const handleMenuDragOffGrid = () => {
    setDraggedItem(undefined);
    setDraggedPosition(undefined);
  };

  const getItemCounts = () => {
    const counts = new Map<string, number>();
    for (const item of layout.elements) {
      if (item !== SquareType.Empty) {
        const newCount = (counts.get(item.getStrRepr()) || 0) + 1;
        counts.set(item.getStrRepr(), newCount);
      }
    }
    return counts;
  };

  const getTally = () => {
    const counts = getItemCounts();
    if (counts.size > 1) {
      const tallyGridElements: JSX.Element[] = [];
      counts.forEach((count, itemStrRepr) => {
        tallyGridElements.push(<div key={itemStrRepr + '-name'}>{count}</div>);
        tallyGridElements.push(
          <div key={itemStrRepr + '-tally'}>
            {SquareType.fromStrRepr(itemStrRepr).getImageAlt()}
          </div>,
        );
      });
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2em auto',
            gridTemplateRows: 'auto',
          }}
        >
          {tallyGridElements}
        </div>
      );
    }
    return (
      <div
        style={{
          color: '#9c9c9c',
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        No items yet!
      </div>
    );
  };

  const menu = (
    <div
      className='menu-container'
      style={{
        gridColumn: '2 / 3',
        gridRow: '1 / 2',
      }}
    >
      <Menu
        active={mode === GridMode.Plan}
        handleDrag={handleMenuDrag}
        handleDragEnd={handleMenuDragEnd}
        handleAddItem={handleAddItem}
        setTextInputInFocus={setTextInputInFocus}
      />
    </div>
  );

  let grid = (
    <PlanGrid
      height={height}
      width={width}
      layout={layout}
      setLayoutParent={setLayout}
      draggedMenuItem={draggedItem}
      draggedMenuPosition={draggedPosition}
      handleMenuDrag={handleMenuDragInGrid}
      handleMenuDrop={handleMenuDropInGrid}
      handleMenuDragAway={handleMenuDragOffGrid}
      textInputInFocus={textInputInFocus}
    />
  );

  let drawButton = styledButton('Add walls', () => handleStartDraw());

  const infoElement = (
    <div
      style={{
        position: 'absolute',
        bottom: '1em',
        left: '1em',
        fontSize: '2em',
      }}
    >
      <Popover
        content={
          <>
            <p>
              We are not officially affiliated with PlateUp! or its creators. No
              copyright infringement intended. We just love the game ♥
            </p>
            <p>
              🐞 If you would like to report a bug, please open an issue on our{' '}
              <Obfuscate href='https://github.com/plateupplanner/plateupplanner.github.io/issues'>
                GitHub repo
              </Obfuscate>
              .<br />
            </p>
            <p>
              🎁 If you are interested in contributing to this project, please
              join{' '}
              <Obfuscate href='https://discord.gg/hqy2YmQbyf'>
                our Discord server
              </Obfuscate>
              .
            </p>
          </>
        }
        placement={'topLeft'}
        overlayStyle={{
          width: '20vw',
        }}
      >
        <QuestionCircleOutlined
          style={{
            cursor: 'pointer',
          }}
        />
      </Popover>
    </div>
  );

  const tallyElement = (
    <div
      style={{
        position: 'absolute',
        bottom: '1em',
        left: '3em',
        fontSize: '2em',
      }}
    >
      <Popover
        content={getTally()}
        placement={'topLeft'}
        overlayStyle={{
          width: '20vw',
        }}
      >
        <OrderedListOutlined
          style={{
            cursor: 'pointer',
          }}
        />
      </Popover>
    </div>
  );

  if (mode === GridMode.Draw) {
    grid = (
      <DrawGrid
        height={height}
        width={width}
        layout={layout}
        setLayoutParent={setLayout}
        handleStartPlan={handleStartPlan}
      />
    );

    drawButton = styledButton('Back to kitchen', () => handleStartPlan());
  }

  return (
    <div
      className='workspace'
      style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gridTemplateRows: '1fr',
      }}
    >
      {infoElement}
      {tallyElement}
      <div
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
        }}
      >
        {styledButton(
          'New floor plan',
          () => setIsModalOpen(true),
          <DoubleLeftOutlined />,
        )}
        {drawButton}
      </div>
      <Modal
        title='Discard current floorplan?'
        open={isModalOpen}
        onOk={handleReset}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>
          Are you sure you want to start over? You will lose all your current
          progress.
        </p>
      </Modal>
      <div
        className='grid-container'
        style={{
          gridColumn: '1 / 2',
          gridRow: '1 / 2',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {grid}
      </div>
      {menu}
    </div>
  );
}
