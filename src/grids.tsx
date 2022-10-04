import { useState, useEffect, MouseEvent, SyntheticEvent, DragEvent, useRef } from "react";
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";

import { WallType, SquareType, styledButton } from "./helpers";
import { Layout } from "./Layout";

import "./grids.css";
interface DrawGridProps {
  height: number;
  width: number;
  layout: Layout;
  setLayoutParent: (layout: Layout) => void;
  handleStartPlan: () => void;
}

export function DrawGrid(props: DrawGridProps) {
  const [dragType, setDragType] = useState<WallType | undefined>(undefined);
  const [lastWall, setLastWall] = useState<[number, number] | undefined>(
    undefined
  );

  const drawLine = (i: number, j: number, walltype: WallType) => {
    if (i % 2 !== 0 || j % 2 !== 0) {
      setLastWall([i, j]);
      let newLayout = props.layout.clone();
      newLayout.setElement(i, j, walltype);
      if (i % 2 === 0 || j % 2 === 0) {
        // Fix corner walls only if we're drawing a wall, so
        newLayout.fixCornerWalls(); // users can still draw from corners
      }
      props.setLayoutParent(newLayout);
    }
  };

  const handleMouseDown = (i: number, j: number) => {
    let oldWallType = props.layout.layout[i][j] as WallType;
    let newWallType = oldWallType.cycle();

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

  const handleClosestMouseMove = (i: number, j: number, event: MouseEvent) => {
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

  const handleRemoveWalls = () => {
    let newLayout = props.layout.clone();
    newLayout.removeWalls();
    newLayout.fixCornerWalls();
    props.setLayoutParent(newLayout);
  };

  const getDrawGridElements = () => {
    let gridElements = [];
    for (let i = 0; i < props.height * 2 - 1; i++) {
      for (let j = 0; j < props.width * 2 - 1; j++) {
        let squareType = props.layout.layout[i][j] as SquareType;
        if (i % 2 === 0 && j % 2 === 0) {
          // Cells
          gridElements.push(
            <div
              className="grid-square"
              key={i + "-" + j}
              style={{
                backgroundImage: `url(${SquareType.Empty.getImageDisplayPath()})`,
                filter: "grayscale(100%) contrast(40%) brightness(130%)",
                backgroundSize: "100% 100%",
              }}
              onMouseMove={(event: MouseEvent) => {
                handleClosestMouseMove(i, j, event);
              }}
            >
              <img
                className="grid-image"
                draggable={false}
                src={squareType.getImageDisplayPath()}
                alt={squareType.getImageAlt()}
                onError={(event: SyntheticEvent) => {
                  let target = event.currentTarget as HTMLImageElement;
                  target.onerror = null; // prevents looping
                  target.src = "/images/display/404.png";
                }}
                style={{
                  filter: "grayscale(100%) contrast(40%) brightness(130%)",
                  transform: squareType.getTransform(),
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          );
        } else if (i % 2 === 0 || j % 2 === 0) {
          // Walls
          let wallType = props.layout.layout[i][j] as WallType;
          gridElements.push(
            <div
              className={wallType.getClassName() + "-draw"}
              onMouseEnter={() => {
                handleMouseEnter(i, j);
              }}
              onMouseDown={() => {
                handleMouseDown(i, j);
              }}
              key={i + "-   " + j}
            />
          );
        } else {
          let wallType = props.layout.layout[i][j] as WallType; // Wall corners
          gridElements.push(
            <div
              className={wallType.getClassName() + "-draw"}
              onMouseEnter={() => {
                handleMouseEnter(i, j);
              }}
              onMouseDown={() => {
                handleMouseDown(i, j);
              }}
              key={i + "-" + j}
            ></div>
          );
        }
      }
    }
    return gridElements;
  };

  return (
    <div className="draw-grid-container">
      <div
        style={{
          textAlign: "center",
          paddingBottom: "0.5em",
        }}
      >
        <i>Click and drag to draw your floorplan; click again to indicate counters
        or delete.</i>
      </div>
      <div
        className="draw-grid"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          userSelect: "none",
          gridTemplateColumns: `repeat(${props.width - 1}, 2fr 1fr) 2fr`,
          gridTemplateRows: `repeat(${props.height - 1}, 2fr 1fr) 2fr`,
          aspectRatio: `${
            ((props.width - 1) * 3 + 2) / ((props.height - 1) * 3 + 2)
          }`,
        }}
      >
        {getDrawGridElements()}
      </div>
      <div
        className="draw-grid-buttons"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <>
          {styledButton(
            "Remove all walls",
            handleRemoveWalls,
            <DeleteOutlined />
          )}
        </>
      </div>
    </div>
  );
}

interface PlanGridProps {
  height: number;
  width: number;
  layout: Layout;
  setLayoutParent: (layout: Layout) => void;
  draggedMenuItem: SquareType | undefined;
  draggedMenuPosition: [number, number] | undefined;
  handleMenuDrag: (i: number, j: number) => void
  handleMenuDrop: () => void;
  handleMenuDragAway: () => void;
  textInputInFocus: boolean
}

export function PlanGrid(props: PlanGridProps) {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [hoveredCell, setHoveredCell] = useState<[number, number] | undefined>(
    undefined
  );
  const [selectedCell, setSelectedCell] = useState<
    [number, number] | undefined
  >(undefined);
  const [clickedCell, setClickedCell] = useState<[number, number] | undefined>(
    undefined
  );
  const [draggedOverCell, setDraggedOverCell] = useState<
    [number, number] | undefined
  >(undefined);

  const getCursorState = () => {
    if (props.draggedMenuItem !== undefined && props.draggedMenuPosition !== undefined) {
      if (props.layout.layout[props.draggedMenuPosition[0]][props.draggedMenuPosition[1]] !== SquareType.Empty) {
        let existingItem = props.layout.layout[props.draggedMenuPosition[0]][props.draggedMenuPosition[1]] as SquareType
        return `Replace ${existingItem.getImageAlt()} with ${props.draggedMenuItem.getImageAlt()}`
      } else {
        return `Add ${props.draggedMenuItem.getImageAlt()}`;
      }
    }

    if (clickedCell !== undefined && draggedOverCell !== undefined) {
      let clickedCellType = props.layout.layout[clickedCell[0]][
        clickedCell[1]
      ] as SquareType;
      let draggedOverCellType = props.layout.layout[draggedOverCell[0]][
        draggedOverCell[1]
      ] as SquareType;
      if (draggedOverCellType === SquareType.Empty) {
        return `Move ${clickedCellType.getImageAlt()}`;
      } else {
        return `Swap ${clickedCellType.getImageAlt()} and ${draggedOverCellType.getImageAlt()}`;
      }
    }

    if (hoveredCell !== undefined) {
      let hoveredCellType = props.layout.layout[hoveredCell[0]][
        hoveredCell[1]
      ] as SquareType;
      if (hoveredCellType !== SquareType.Empty) {
        return `${hoveredCellType.getImageAlt()}`;
      }
    }

    if (selectedCell !== undefined) {
      let selectedCellType = props.layout.layout[selectedCell[0]][
        selectedCell[1]
      ] as SquareType;
      return `Selected ${selectedCellType.getImageAlt()}`;
    }

    return (
      <i>
        Left click to select or drag; right click to rotate.
      </i>
    );
  };

  const handleMouseDown = (i: number, j: number, event: MouseEvent) => {
    if (event.button === 0 && clickedCell === undefined) {
      setClickedCell([i, j]);
    } else if (event.button === 2) {
      let newLayout = props.layout.clone();
      newLayout.rotateElementRight(i, j);
      props.setLayoutParent(newLayout);
    }
  };

  const handleMouseEnter = (i: number, j: number) => {
    if (clickedCell !== undefined) {
      setDraggedOverCell([i, j]);
    }
    setHoveredCell([i, j]);
  };

  const handleMouseLeave = (i: number, j: number) => {
    setHoveredCell(undefined);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (event.button === 2) {
      return;
    }
    if (clickedCell !== undefined && draggedOverCell !== undefined) {
      let newLayout = props.layout.clone();
      newLayout.swapElements(
        clickedCell[0],
        clickedCell[1],
        draggedOverCell[0],
        draggedOverCell[1]
      );
      setSelectedCell(undefined);
      props.setLayoutParent(newLayout);
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
      let newLayout = props.layout.clone();
      newLayout.setElement(selectedCell[0], selectedCell[1], SquareType.Empty);
      props.setLayoutParent(newLayout);
      setSelectedCell(undefined);
    }
  };

  const handleRotateLeft = () => {
    if (selectedCell !== undefined) {
      let newLayout = props.layout.clone();
      newLayout.rotateElementLeft(selectedCell[0], selectedCell[1]);
      props.setLayoutParent(newLayout);
    }
  };

  const handleRotateRight = () => {
    if (selectedCell !== undefined) {
      let newLayout = props.layout.clone();
      newLayout.rotateElementRight(selectedCell[0], selectedCell[1]);
      props.setLayoutParent(newLayout);
    }
  };

  const handleRemoveSquares = () => {
    let newLayout = props.layout.clone();
    newLayout.removeSquares();
    props.setLayoutParent(newLayout);
  };

  const handleExportLayout = () => {
    const layoutString = JSON.stringify(props.layout);
    const encodingMetadata = 'data:text/json;charset=utf-8';
    const layoutURI = encodeURI(`${encodingMetadata},${layoutString}`);

    const link = document.createElement('a');
    link.setAttribute('href', layoutURI);
    link.setAttribute('download', 'layout.json');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportLayout = () => {
    if (!fileUploadRef.current) {
      return;
    }

    fileUploadRef.current.click();
  }

  useEffect(() => {
    window.onkeydown = (event: KeyboardEvent) => {
      if (!props.textInputInFocus && (event.key === "Backspace" || event.key === "Delete")) {
        handleDelete();
      }
    }
    return function cleanup() {
      window.onkeydown = null;
    };
  });

  const getPlanGridElements = () => {
    let gridElements = [];
    for (let i = 0; i < props.height * 2 - 1; i++) {
      for (let j = 0; j < props.width * 2 - 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          let selected = "";
          if (
            selectedCell !== undefined &&
            selectedCell[0] === i &&
            selectedCell[1] === j
          ) {
            selected = "grid-selected";
          }

          let squareType = props.layout.layout[i][j] as SquareType;
          let opacity = 1;
          if (draggedOverCell !== undefined) {
            if (draggedOverCell[0] === i && draggedOverCell[1] === j) {
              squareType = props.layout.layout[clickedCell![0]][
                clickedCell![1]
              ] as SquareType;
              opacity = 0.7;
            } else if (
              clickedCell !== undefined &&
              clickedCell[0] === i &&
              clickedCell[1] === j
            ) {
              squareType = props.layout.layout[draggedOverCell[0]][
                draggedOverCell[1]
              ] as SquareType;
              opacity = 0.7;
            }
          }

          if (props.draggedMenuItem !== undefined &&
              props.draggedMenuPosition !== undefined &&
              props.draggedMenuPosition[0] === i &&
              props.draggedMenuPosition[1] === j) {
                squareType = props.draggedMenuItem
                opacity = 0.7
              }

          let image = null;
          if (squareType !== SquareType.Empty) {
            image = (
              <img
                className="grid-image"
                draggable={false}
                src={squareType.getImageDisplayPath()}
                alt={squareType.getImageAlt()}
                onError={(event: SyntheticEvent) => {
                  let target = event.currentTarget as HTMLImageElement;
                  target.onerror = null; // prevents looping
                  target.src = "/images/display/404.png";
                }}
                style={{
                  opacity: opacity,
                  transform: squareType.getTransform(),
                  cursor: "grab",
                }}
                onMouseDown={(event: MouseEvent) =>
                  handleMouseDown(i, j, event)
                }
                onContextMenu={(e) => e.preventDefault()}
              />
            );
          }
          gridElements.push(
            <div
              className={`grid-square ${selected}`}
              key={i + "-" + j}
              onMouseEnter={() => handleMouseEnter(i, j)}
              onMouseLeave={() => handleMouseLeave(i, j)}
              onDragOver={(event: DragEvent) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move"
                props.handleMenuDrag(i, j);
              }}
              onDrop={(event: DragEvent) => {
                event.preventDefault();
                props.handleMenuDrop();
              }}
              style={{
                backgroundImage: `url(${SquareType.Empty.getImageDisplayPath()})`,
                backgroundSize: "100% 100%",
                userSelect: "none",
              }}
            >
              {image}
            </div>
          );
        } else {
          let wallType = props.layout.layout[i][j] as WallType;
          gridElements.push(
            <div className={wallType.getClassName() + "-plan"} key={i + "-" + j} />
          );
        }
      }
    }
    return gridElements;
  };

  return (
    <div
      className="plan-grid-container"
    >
      <div
        style={{
          textAlign: "center",
          paddingBottom: "0.5em",
        }}
      >
        {getCursorState()}
      </div>
      <div 
        className="plan-grid-bounding-box"
        style={{aspectRatio: `${
          ((props.width - 1) * 9 + 8) / ((props.height - 1) * 9 + 8)
        }`}}
        onDragOver={(event: DragEvent) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move"
        }}
        onDrop={(event: DragEvent) => {
          event.preventDefault();
          props.handleMenuDrop();
        }}
        onDragLeave={(event: DragEvent) => {
          event.preventDefault();
          let target = event.target as HTMLDivElement
          if (target.className === "plan-grid") {
            props.handleMenuDragAway();
          }
        }}
        >
        <div
          className="plan-grid"
          style={{
            gridTemplateColumns: `repeat(${props.width - 1}, 8fr 1fr) 8fr`,
            gridTemplateRows: `repeat(${props.height - 1}, 8fr 1fr) 8fr`,
          }}
          onMouseUp={(event) => handleMouseUp(event)}
        >
          {getPlanGridElements()}
        </div>
        <div
          className="plan-grid-buttons"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <>
            {styledButton(
              "",
              handleRotateLeft,
              <RotateLeftOutlined />,
              false,
              selectedCell === undefined
            )}
            {styledButton(
              "",
              handleDelete,
              <DeleteOutlined />,
              false,
              selectedCell === undefined
            )}
            {styledButton(
              "",
              handleRotateRight,
              <RotateRightOutlined />,
              false,
              selectedCell === undefined
            )}
            {styledButton(
              "Remove all",
              handleRemoveSquares,
              <DeleteOutlined />,
              false,
              props.layout.elements.length <= 0
            )}
            {styledButton(
              "Export layout",
              handleExportLayout,
              <SaveOutlined />,
              false,
              false
            )}
            {styledButton(
              "Import layout",
              handleImportLayout,
              <CloudUploadOutlined />,
              false,
              false
            )}
            <input ref={fileUploadRef} id='fileid' type='file' hidden/>
          </>
        </div>
      </div>
      
    </div>
  );
}
