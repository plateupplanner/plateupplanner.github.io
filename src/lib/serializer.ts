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

  // 0b00 reserved as error state
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

  private static bitsPerWall = 2;

  // Extracts the ith wall from an encoding in the characterUnMap
  private static extractWallAtIndex(wallEncoding: number, i: number) {
    const extractor = (1 << Serializer.bitsPerWall) - 1; // 0b11
    const shift = i * Serializer.bitsPerWall;
    const wallRepresentation = (wallEncoding >> shift) & extractor
    return wallRepresentation;
  }

  // Extracts a list of walls from a given wall encoding
  private static extractWalls(wallEncoding: number) {
    return ([...Array(Serializer.bitsPerWall)]).map((_, i) => {
      return Serializer.extractWallAtIndex(wallEncoding, i);
    });
  }

  private static packWalls(walls: number[]) {
    return walls.reduce((previous, current, i) => {
      const shift = Serializer.bitsPerWall * i;
      return previous | (current << shift);
    });
  }

  private static serializeRowWalls(elements: (SquareType | WallType)[]) {
    const binaryList = elements
      .filter((element) => 'className' in element)
      .map((element) => {
        const className = (element as WallType).className;
        const wallEncoding = Serializer.wallEncodeMap.get(className);
        if (wallEncoding === undefined) {
          throw new URIError(`Invalid className ${className}: cannot encode walls`);
        } else {
          return wallEncoding
        }
      });

    const hexString = Utils.chunk(binaryList, 2)
      .map((walls: any) => Serializer.packWalls(walls))
      .map((num: number) => {
        const wallRepresentation = Serializer.characterMap.get(num);
        if (wallRepresentation === undefined) {
          throw new URIError(`Invalid characterMap character, cannot encode walls: ${num}`);
        } else {
          return wallRepresentation;
        }
      })
      .join('');

    return hexString;
  }

  static serializeWalls(layout: Layout) {
    const walls = layout.layout
      .map((row, i) => {
        return row.filter((_, j) => i % 2 === 0 || j % 2 === 0); // remove corner walls
      })
      .flat();
    return Serializer.serializeRowWalls(walls);
  }

  static *deserializeWalls(wallEncoding: string): Generator<string, null, null> {
    const walls = wallEncoding
      .split('')
      .map((char) => {
        const wallEncoding = Serializer.characterUnMap.get(char);
        if (wallEncoding === undefined) {
          throw new URIError(`Invalid characterUnMap character, cannot decode walls: ${char}`);
        } else {
          return wallEncoding;
        }
      })
      .map((wallEncoding) => Serializer.extractWalls(wallEncoding))
      .flat()
      .map((wallCode) => {
        const wall = Serializer.wallDecodeMap.get(wallCode);
        if (wall === undefined) {
          throw new URIError(`Invalid wallDecodeMap representation, cannot decode walls: ${wallCode}`);
        } else {
          return wall;
        }
      });

    for (const wall of walls) {
      yield wall;
    }

    return null;
  }

  static encodeLayoutString(layout: Layout) {
    let layoutString = `v2 ${layout.height}x${layout.width} `;
    const numVerticalElements = layout.height * 2 - 1;
    const numHorizontalElements = layout.width * 2 - 1;
    for (let i = 0; i < numVerticalElements; i++) {
      for (let j = 0; j < numHorizontalElements; j++) {
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
