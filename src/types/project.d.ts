export type Cell = [number, number];

export type SquareState = {
  squareType: SquareType;
  opacity: number;
  isSelected: boolean;
};

export type WallState = {
  wallType: WallType;
  isDrawable: boolean;
};

export type ElementState = SquareState | WallState;
