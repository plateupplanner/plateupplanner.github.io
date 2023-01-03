export type Cell = [number, number];
export type CellOption = Cell | undefined;

export type SquareState = {
  squareType: SquareType;
  opacity: number;
  isSelected: boolean;
};

export type WallState = {
  wallType: WallType;
};

export type ElementState = SquareState | WallState;
