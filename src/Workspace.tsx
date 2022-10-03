import { useState } from "react";
import { Modal, Popover } from "antd";
import { DoubleLeftOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Obfuscate } from '@south-paw/react-obfuscate-ts';

import { DrawGrid, PlanGrid } from "./grids";
import { Menu } from "./Menu";
import { SquareType, GridMode, styledButton } from "./helpers";
import { Layout } from "./Layout";

import "./Workspace.css";
export interface WorkspaceProps {
  height: number;
  width: number;
  handleResetParent: () => void;
}

export default function Workspace(props: WorkspaceProps) {
  const [layout, setLayout] = useState(new Layout(props.height, props.width));
  const [mode, setMode] = useState(GridMode.Plan);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<SquareType | undefined>(
    undefined
  );
  const [draggedPosition, setDraggedPosition] = useState<[number, number] | undefined>(undefined);
  const [textInputInFocus, setTextInputInFocus] = useState(false);

  const handleStartPlan = () => {
    let newLayout = layout.clone();
    newLayout.fixCornerWalls();
    setLayout(newLayout);
    setMode(GridMode.Plan);
  };

  const handleStartDraw = () => {
    setMode(GridMode.Draw);
  };

  const handleReset = () => {
    props.handleResetParent();
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
  }

  const handleAddItem = (squareType: SquareType) => {
    let newLayout = layout.clone();
    for (let i = 0; i < props.height * 2 - 1; i++) {
      for (let j = 0; j < props.width * 2 - 1; j++) {
        if (newLayout.layout[i][j] === SquareType.Empty) {
          newLayout.setElement(i, j, squareType);
          setLayout(newLayout);
          return;
        }
      }
    }
  }

  // Drag event handlers passed to PlanGrid
  const handleMenuDragInGrid = (i: number, j: number) => {
    setDraggedPosition([i, j]);
  }

  const handleMenuDropInGrid = () => {
    if (draggedItem !== undefined && draggedPosition !== undefined) {
      let newLayout = layout.clone();
      newLayout.setElement(draggedPosition[0], draggedPosition[1], draggedItem);
      setLayout(newLayout);
    }
    setDraggedItem(undefined);
    setDraggedPosition(undefined);
  };

  const handleMenuDragOffGrid = () => {
    setDraggedItem(undefined);
    setDraggedPosition(undefined);
  }

  let menu = (
    <div
      className="menu-container"
      style={{
        gridColumn: "2 / 3",
        gridRow: "1 / 2",
      }}
    >
      <Menu active={mode === GridMode.Plan} 
            handleDrag={handleMenuDrag} 
            handleDragEnd={handleMenuDragEnd}
            handleAddItem={handleAddItem}
            setTextInputInFocus={setTextInputInFocus}/>
    </div>
  );

  let grid = (
    <PlanGrid
      height={props.height}
      width={props.width}
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

  let drawButton = styledButton("Add walls", () => handleStartDraw());

  let infoElement = (
    <div
      style={{
        position: "absolute",
        bottom: "1em",
        left: "1em",
        fontSize: "2em",
      }}>
      <Popover
        content={<>
          <p>
            We are not officially affiliated with PlateUp! or its creators. No copyright infringement intended. We just love the game ♥
          </p>
          <p>
            If you have any problems or queries, or would like to report a bug, contact us at <Obfuscate email>plateupplanner@gmail.com</Obfuscate>.
          </p>
        </>}
        placement={"topLeft"}
        overlayStyle={{
          width: "20vw"
        }}>
        <QuestionCircleOutlined
          style={{
            cursor: "pointer"
          }}
        />
      </Popover>
    </div>
  )

  if (mode === GridMode.Draw) {
    grid = (
      <DrawGrid
        height={props.height}
        width={props.width}
        layout={layout}
        setLayoutParent={setLayout}
        handleStartPlan={handleStartPlan}
      />
    );

    drawButton = styledButton("Back to kitchen", () => handleStartPlan());
  }

  return (
    <div
      className="workspace"
      style={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        gridTemplateRows: "1fr",
      }}
    >
      {infoElement}
      <div
        style={{
          position: "absolute",
          left: "0",
          top: "0",
        }}
      >
        {styledButton(
          "New floor plan",
          () => setIsModalOpen(true),
          <DoubleLeftOutlined />
        )}
        {drawButton}
      </div>
      <Modal
        title="Discard current floorplan?"
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
        className="grid-container"
        style={{
          gridColumn: "1 / 2",
          gridRow: "1 / 2",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {grid}
      </div>
      {menu}
    </div>
  );
}
