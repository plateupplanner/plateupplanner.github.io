import LZString from "lz-string";
import { SquareType, WallType } from "../helpers";
import { Layout } from "../Layout";
import { Utils } from "./utils";
import Deserializer from "./deserializer";

export class Serializer {
  private static characterMap = new Map([
    [0, "0"],
    [1, "1"],
    [2, "2"],
    [3, "3"],
    [4, "4"],
    [5, "5"],
    [6, "6"],
    [7, "7"],
    [8, "8"],
    [9, "9"],
    [10, "a"],
    [11, "b"],
    [12, "c"],
    [13, "d"],
    [14, "e"],
    [15, "f"],
  ]);

  private static characterUnMap = new Map([
    ["0", 0],
    ["1", 1],
    ["2", 2],
    ["3", 3],
    ["4", 4],
    ["5", 5],
    ["6", 6],
    ["7", 7],
    ["8", 8],
    ["9", 9],
    ["a", 10],
    ["b", 11],
    ["c", 12],
    ["d", 13],
    ["e", 14],
    ["f", 15],
  ]);

  private static wallEncodeMap = new Map([
    ["line-empty", 0b11],
    ["line-wall", 0b01],
    ["line-half", 0b10],
  ]);

  private static wallDecodeMap = new Map([
    [0b11, "0"],
    [0b01, "w"],
    [0b10, "h"],
  ]);

  private static serializeRowWalls(elements: (SquareType | WallType)[]) {
    const binaryList = elements.map((element) => {
      if ('className' in element) {
        return Serializer.wallEncodeMap.get(element.className) as number;
      } else {
        return 0b00;
      }
    }).filter((x) => !!x);

    const hexString = Utils.chunk(binaryList, 2)
      .map((arr: any) => (arr[0] << 0) | (arr[1] << 2))
      .map((num: number) => Serializer.characterMap.get(num))
      .join('');

    return hexString;
  }

  static serializeWalls(layout: Layout) {
    const walls = layout.layout
      .map((row, i) => {
        return row.filter((_, j) => i % 2 === 0 || j % 2 === 0);
      })
      .flat();
    return Serializer.serializeRowWalls(walls);
  }

  static *deserializeWalls(wallEncoding: string): Generator<string, null, null> {
    const walls = wallEncoding
      .split('')
      .map((char) => Serializer.characterUnMap.get(char) as number)
      .map((num) => {
        return [
          (num & 0b0011) >> 0,
          (num & 0b1100) >> 2,
        ]
      })
      .flat()
      .map((wallCode) => Serializer.wallDecodeMap.get(wallCode) as string);

    for (const wall of walls) {
      yield wall;
    }

    return null;
  }

  static encodeLayoutString(layout: Layout) {
    let layoutString = `v2 ${layout.height}x${layout.width} `;
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

  static decodeLayoutString(compressedLayoutString: string) {
    let decompressed = LZString.decompressFromEncodedURIComponent(decodeURI(compressedLayoutString).slice(1));
    if (decompressed === null) {
      throw new URIError("Invalid layout string, decompression failed");
    }

    const version = decompressed.split(" ")[0];
    const deserializer = Deserializer.get(version);
    if (!deserializer) {
      throw new URIError("Invalid version number, cannot deserialize");
    }

    return deserializer(decompressed);
  }
}
