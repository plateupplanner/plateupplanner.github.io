import type {
  Cell,
  ElementState,
  SquareState,
  WallState,
} from '../types/project';

export enum GridMode {
  Draw,
  Plan,
}

import { itemData } from './itemData';
import { legacyItemData } from './legacyItemData';

export enum Rotation {
  Up = 'u',
  Right = 'r',
  Down = 'd',
  Left = 'l',
}

export class WallType {
  static Empty = new WallType('0', 'line-empty');
  static Wall = new WallType('w', 'line-wall');
  static Half = new WallType('h', 'line-half');

  id: string;
  className: string;

  constructor(id: string, className: string) {
    this.id = id;
    this.className = className;
  }

  getStrRepr() {
    return this.id;
  }

  getClassName() {
    return this.className;
  }

  cycle() {
    if (this.className === 'line-empty') {
      return WallType.Wall;
    } else if (this.className === 'line-wall') {
      return WallType.Half;
    } else {
      return WallType.Empty;
    }
  }

  clone() {
    return WallType.fromStrRepr(this.id);
  }

  static fromStrRepr(str: string) {
    if (str === '0') {
      return WallType.Empty;
    } else if (str === 'w') {
      return WallType.Wall;
    } else if (str === 'h') {
      return WallType.Half;
    }
    throw new URIError('Invalid SquareType string: ' + str);
  }
}

export class SquareType {
  static Empty = new SquareType('00', 'empty-tile.png', 'Empty tile');
  static CornerGrabber = new SquareType( // Default corner grabber for tally display
    'cornerGrabber',
    'corner-grabber-left.png',
    'Corner Grabber',
  );

  private static itemsDatatset: [string, [string, string]][] = [
    ['00', ['404.png', 'Empty tile']],
  ];

  private static idMap = new Map(itemData);
  private static legacyIdMap = new Map(legacyItemData);

  id: string;
  imagePath: string;
  imageAlt: string;
  rotation: Rotation;

  constructor(
    id: string,
    imagePath: string,
    imageAlt: string,
    rotation?: Rotation,
  ) {
    this.id = id;
    this.imagePath = imagePath;
    this.imageAlt = imageAlt;

    if (rotation) {
      this.rotation = rotation;
    } else {
      this.rotation = Rotation.Up;
    }
  }

  getStrRepr() {
    return `${this.id},${this.rotation}|`;
  }

  getImageMenuPath() {
    return '/images/menu/' + this.imagePath;
  }

  getImageDisplayPath() {
    return '/images/display/' + this.imagePath;
  }

  getImageAlt() {
    return this.imageAlt;
  }

  getOrder() {
    let index = 0;
    for (const [key] of itemData) {
      if (key === this.id) {
        return index;
      }
      index++;
    }
  }

  getTransform() {
    if (this.rotation === Rotation.Right) {
      return 'rotate(90deg)';
    } else if (this.rotation === Rotation.Down) {
      return 'rotate(180deg)';
    } else if (this.rotation === Rotation.Left) {
      return 'rotate(270deg)';
    } else {
      return 'rotate(0deg)';
    }
  }

  rotateLeft() {
    if (this.rotation === Rotation.Up) {
      this.rotation = Rotation.Left;
    } else if (this.rotation === Rotation.Left) {
      this.rotation = Rotation.Down;
    } else if (this.rotation === Rotation.Down) {
      this.rotation = Rotation.Right;
    } else {
      this.rotation = Rotation.Up;
    }
  }

  rotateRight() {
    if (this.rotation === Rotation.Up) {
      this.rotation = Rotation.Right;
    } else if (this.rotation === Rotation.Right) {
      this.rotation = Rotation.Down;
    } else if (this.rotation === Rotation.Down) {
      this.rotation = Rotation.Left;
    } else {
      this.rotation = Rotation.Up;
    }
  }

  clone() {
    const item = new SquareType(this.id, this.imagePath, this.imageAlt);
    item.rotation = this.rotation;
    return item;
  }

  static getAllItems() {
    const allItems: SquareType[] = [];

    this.idMap.forEach((value, key) => {
      if (key !== SquareType.Empty.id) {
        allItems.push(
          new SquareType(key, value[0] as string, value[1] as string),
        );
      }
    });
    return allItems;
  }

  static fromStrRepr(strRepr: string, version: string) {
    if (version === 'v3') {
      const [itemId, rotationStr] = strRepr.split(',');

      if (itemId === SquareType.Empty.id) {
        return SquareType.Empty;
      }
      if (this.idMap.has(itemId)) {
        const value = this.idMap.get(itemId);
        const square = new SquareType(
          itemId,
          value?.[0] as string,
          value?.[1] as string,
        );
        square.rotation = rotationStr as Rotation;
        return square;
      }
      throw new URIError('Invalid SquareType string: ' + strRepr);
    } else if (version === 'v1' || version === 'v2') {
      const itemId = strRepr.slice(0, 2);
      const rotationStr = strRepr.slice(2, 3);

      if (itemId === SquareType.Empty.id) {
        return SquareType.Empty;
      }
      if (this.legacyIdMap.has(itemId)) {
        const value = this.legacyIdMap.get(itemId);
        const square = new SquareType(
          itemId,
          value?.[0] as string,
          value?.[1] as string,
        );
        square.rotation = rotationStr as Rotation;
        return square;
      }
      throw new URIError('Invalid SquareType string: ' + strRepr);
    }

    return SquareType.Empty;
  }
}

export const areSameCell = (cell1: Cell, cell2: Cell) =>
  cell1[0] === cell2[0] && cell1[1] === cell2[1];

export const isSquareState = (state: ElementState): state is SquareState =>
  (state as SquareState).squareType !== undefined;

export const isWallState = (state: ElementState): state is WallState =>
  (state as WallState).wallType !== undefined;

export enum DrawDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  None = 'none', // For wall corners
}

export const getDirection = (cell: Cell) => {
  if (cell[0] % 2 === 0 && cell[1] % 2 === 0) {
    throw Error("Can't get direction of a square cell");
  } else if (cell[0] % 2 === 0) {
    return DrawDirection.Horizontal;
  } else if (cell[1] % 2 === 0) {
    return DrawDirection.Vertical;
  } else {
    return DrawDirection.None;
  }
};

export const isTouchDevice = () =>
  'ontouchstart' in window || window.navigator.maxTouchPoints > 0;

export const isSingleTouch = (event: React.TouchEvent) =>
  event.touches.length <= 1 &&
  event.targetTouches.length <= 1 &&
  event.changedTouches.length <= 1;

export const getTouchedPosition = (e: React.TouchEvent) => {
  const { clientX, clientY } = e.targetTouches[0];
  const maybeGrid = document.elementFromPoint(clientX, clientY)?.parentElement;
  return [
    +(maybeGrid?.dataset.row ?? -1),
    +(maybeGrid?.dataset.col ?? -1),
  ] as Cell;
};

export const getTouchedWall = (e: React.TouchEvent) => {
  const { clientX, clientY } = e.targetTouches[0];
  const maybeWall = document.elementFromPoint(clientX, clientY) as HTMLElement;
  return [
    +(maybeWall?.dataset.wallRow ?? -1),
    +(maybeWall?.dataset.wallCol ?? -1),
  ] as Cell;
};

export const createMouseEvent = (name: string, config: MouseEventInit = {}) =>
  new window.MouseEvent(name, {
    button: 0,
    bubbles: true,
    cancelable: true,
    view: window,
    ...config,
  });
