import LZString from 'lz-string';

import { Rotation, SquareType, WallType } from "./helpers";
import { Serializer } from './lib/serializer';

export class Layout {
  readonly width: number;
  readonly height: number;
  layout: Array<Array<WallType | SquareType>>;
  elements: Array<SquareType> = [];

  constructor(height: number, width: number, fromLayout?: Array<Array<WallType | SquareType>>) {
    this.height = height;
    this.width = width;

    let layout = Array.from(Array(height * 2 - 1), () =>
      Array(width * 2 - 1)
    );

    for (let i = 0; i < height * 2 - 1; i++) {
      for (let j = 0; j < width * 2 - 1; j++) {
        if (fromLayout !== undefined) {
          layout[i][j] = fromLayout[i][j];
          if (fromLayout[i][j] instanceof SquareType && fromLayout[i][j] !== SquareType.Empty) {
            let square = fromLayout[i][j] as SquareType
            this.elements.push(square);
          }
        } else {
          if (i % 2 === 0 && j % 2 === 0) {
            layout[i][j] = SquareType.Empty;
          } else {
            layout[i][j] = WallType.Empty;
          }
        }
      }
    }
    this.layout = layout;
  }

  setElement(i: number, j: number, element: WallType | SquareType) {
    if (i % 2 === 0 && j % 2 === 0 && element instanceof WallType) {
      throw new TypeError("Cannot set a wall type on a square");
    } else if ((i % 2 !== 0 || j % 2 !== 0) && element instanceof SquareType) {
      throw new TypeError("Cannot set a square type on a wall");
    }

    this.layout[i][j] = element;

    if (element instanceof SquareType) {
      this.elements.push(element)
    }
  }

  swapElements(i1: number, j1: number, i2: number, j2: number) {
    if (i1 % 2 !== 0 || j1 % 2 !== 0 || i2 % 2 !== 0 || j2 % 2 !== 0) {
      throw new Error("Cannot swap wall elements");
    }
    let temp = this.layout[i1][j1];
    this.layout[i1][j1] = this.layout[i2][j2];
    this.layout[i2][j2] = temp;
  }

  fixCornerWalls() {
    for (let i = 0; i < this.height * 2 - 1; i++) {
      for (let j = 0; j < this.width * 2 - 1; j++) {
        if (i % 2 !== 0 && j % 2 !== 0) {
          let cornerWallType = WallType.Empty;
          if (
            this.layout[i][j - 1] === WallType.Wall ||
            this.layout[i][j + 1] === WallType.Wall ||
            this.layout[i - 1][j] === WallType.Wall ||
            this.layout[i + 1][j] === WallType.Wall
          ) {
            cornerWallType = WallType.Wall;
          } else if (
            this.layout[i - 1][j] === WallType.Half ||
            this.layout[i][j - 1] === WallType.Half ||
            this.layout[i + 1][j] === WallType.Half ||
            this.layout[i][j + 1] === WallType.Half
          ) {
            cornerWallType = WallType.Half;
          }

          this.layout[i][j] = cornerWallType;
        }
      }
    }
  }

  rotateElementLeft(i: number, j: number) {
    if (this.layout[i][j] instanceof SquareType) {
      let square = this.layout[i][j] as SquareType;
      square.rotateLeft();
    } else {
      throw new Error("Cannot rotate a wall element");
    }
  }

  rotateElementRight(i: number, j: number) {
    if (this.layout[i][j] instanceof SquareType) {
      let square = this.layout[i][j] as SquareType;
      square.rotateRight();
    } else {
      throw new Error("Cannot rotate a wall element");
    }
  }

  clone() {
    let newLayout = new Layout(this.height, this.width, this.layout);
    return newLayout;
  }

  removeWalls() {
    for (let i = 0; i < this.height * 2 - 1; i++) {
      for (let j = 0; j < this.width * 2 - 1; j++) {
        if ((i % 2 !== 0) !== (j % 2 !== 0)) {
          this.setElement(i, j, WallType.Empty);
        }
      }
    }
  }

  removeSquares() {
    for (let i = 0; i < this.height * 2 - 1; i++) {
      for (let j = 0; j < this.width * 2 - 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          this.setElement(i, j, SquareType.Empty);
        }
      }
    }
    this.elements = [];
  }
}

export function encodeLayoutString(layout: Layout) {
  let layoutString = `v1 ${layout.height}x${layout.width} `;
  for (let i = 0; i < layout.height * 2 - 1; i++) {
    for (let j = 0; j < layout.width * 2 - 1; j++) {
      const element = layout.layout[i][j];
      const notCornerWall = i % 2 === 0 || j % 2 === 0;
      const isWall = 'className' in element;
      if (notCornerWall && !isWall) {   // Skip corner walls
        layoutString += element.getStrRepr();
      }
    }
  }

  layoutString += ` ${Serializer.serializeWalls(layout)}`;
  return encodeURI(LZString.compressToEncodedURIComponent(layoutString));
}

export function decodeLayoutString(compressedLayoutString: string) {
  let decompressed = LZString.decompressFromEncodedURIComponent(decodeURI(compressedLayoutString).slice(1));
  if (decompressed === null) {
    throw new URIError("Invalid layout string, decompression failed");
  }
  let [version, size, layoutString, wallString] = decompressed.split(" ");
  if (version !== "v1") {
    throw new URIError("Invalid layout string version");
  }
  let [height, width] = size.split("x").map((x) => parseInt(x));

  const wallEncoding = wallString.split('x');
  const wallsDecoded = Serializer.deserializeWalls(width, wallEncoding).flat();
  let wi = 0;

  let layout = new Layout(height, width);
  for (let i = 0; i < layout.height * 2 - 1; i++) {
    for (let j = 0; j < layout.width * 2 - 1; j++) {
      // Squares (2 characters + 1 for rotation)
      if (i % 2 === 0 && j % 2 === 0) {
        let squareStrRepr = layoutString.slice(0, 2);
        let rotationStrRepr = layoutString.slice(2, 3);
        layoutString = layoutString.slice(3);

        if (squareStrRepr === "00") {
          layout.setElement(i, j, SquareType.Empty);
        } else {
          let square = SquareType.fromStrRepr(squareStrRepr);
          square.rotation = rotationStrRepr as Rotation;
          layout.setElement(i, j, square);
        }
      // Walls (1 character)
      } else {
        let wallStrRepr = wallsDecoded[wi];
        const wall = WallType.fromStrRepr(wallStrRepr)
        layout.setElement(i, j, wall);
        wi++;
      }
      // Corner walls skipped
    }
  }
  layout.fixCornerWalls();
  return layout;
}