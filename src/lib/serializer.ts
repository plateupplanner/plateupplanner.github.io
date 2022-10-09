import LZString from 'lz-string';

import { WallType } from '../utils/helpers';
import { Layout } from '../components/layout/Layout';
import { Utils } from './utils';
import Deserializer from './deserializer';

export class Serializer {
  private static characterMap = new Map([
    [0, '0'],
    [1, '1'],
    [2, '2'],
    [3, '3'],
    [4, '4'],
    [5, '5'],
    [6, '6'],
    [7, '7'],
    [8, '8'],
    [9, '9'],
    [10, 'a'],
    [11, 'b'],
    [12, 'c'],
    [13, 'd'],
    [14, 'e'],
    [15, 'f'],
    [16, 'g'],
    [17, 'h'],
    [18, 'i'],
    [19, 'j'],
    [20, 'k'],
    [21, 'l'],
    [22, 'm'],
    [23, 'n'],
    [24, 'o'],
    [25, 'p'],
    [26, 'q'],
    [27, 'r'],
    [28, 's'],
    [29, 't'],
    [30, 'u'],
    [31, 'v'],
    [32, 'w'],
    [33, 'x'],
    [34, 'y'],
    [35, 'z'],
    [36, 'A'],
    [37, 'B'],
    [38, 'C'],
    [39, 'D'],
    [40, 'E'],
    [41, 'F'],
    [42, 'G'],
    [43, 'H'],
    [44, 'I'],
    [45, 'J'],
    [46, 'K'],
    [47, 'L'],
    [48, 'M'],
    [49, 'N'],
    [50, 'O'],
    [51, 'P'],
    [52, 'Q'],
    [53, 'R'],
    [54, 'S'],
    [55, 'T'],
    [56, 'U'],
    [57, 'V'],
    [58, 'W'],
    [59, 'X'],
    [60, 'Y'],
    [61, 'Z'],
    [62, '_'],
    [63, '-'],
  ]);

  private static characterUnMap = new Map([
    ['0', 0],
    ['1', 1],
    ['2', 2],
    ['3', 3],
    ['4', 4],
    ['5', 5],
    ['6', 6],
    ['7', 7],
    ['8', 8],
    ['9', 9],
    ['a', 10],
    ['b', 11],
    ['c', 12],
    ['d', 13],
    ['e', 14],
    ['f', 15],
    ['g', 16],
    ['h', 17],
    ['i', 18],
    ['j', 19],
    ['k', 20],
    ['l', 21],
    ['m', 22],
    ['n', 23],
    ['o', 24],
    ['p', 25],
    ['q', 26],
    ['r', 27],
    ['s', 28],
    ['t', 29],
    ['u', 30],
    ['v', 31],
    ['w', 32],
    ['x', 33],
    ['y', 34],
    ['z', 35],
    ['A', 36],
    ['B', 37],
    ['C', 38],
    ['D', 39],
    ['E', 40],
    ['F', 41],
    ['G', 42],
    ['H', 43],
    ['I', 44],
    ['J', 45],
    ['K', 46],
    ['L', 47],
    ['M', 48],
    ['N', 49],
    ['O', 50],
    ['P', 51],
    ['Q', 52],
    ['R', 53],
    ['S', 54],
    ['T', 55],
    ['U', 56],
    ['V', 57],
    ['W', 58],
    ['X', 59],
    ['Y', 60],
    ['Z', 61],
    ['_', 62],
    ['-', 63],
  ]);

  // 0b00 reserved as error state
  private static wallTypeMap = new Map([
    ['line-empty', 0b11],
    ['line-wall', 0b01],
    ['line-half', 0b10],
  ]);

  private static bitsPerWall = 2;
  private static wallsPerByte = 3;

  // Extracts the ith wall from an encoding in the characterUnMap
  private static extractWallAtIndex(wallEncoding: number, i: number) {
    const extractor = (1 << Serializer.bitsPerWall) - 1; // 0b11
    const shift = i * Serializer.bitsPerWall;
    const wallRepresentation = (wallEncoding >> shift) & extractor;
    return wallRepresentation;
  }

  // Extracts a list of walls from a given wall encoding
  private static extractWalls(wallEncoding: number) {
    return [...Array(Serializer.wallsPerByte)].map((_, i) => {
      return Serializer.extractWallAtIndex(wallEncoding, i);
    });
  }

  private static packWalls(walls: number[]) {
    return walls.reduce((previous, current, i) => {
      const shift = Serializer.bitsPerWall * i;
      return previous | (current << shift);
    });
  }

  private static serializeWallsArray(elements: WallType[]) {
    const binaryList = elements.map((element) => {
      const className = (element as WallType).className;
      const wallType = Serializer.wallTypeMap.get(className);
      if (wallType === undefined) {
        throw new URIError(
          `Invalid className ${className}: cannot encode walls`,
        );
      } else {
        return wallType;
      }
    });

    const hexString = Utils.chunk(binaryList, Serializer.wallsPerByte)
      .map((walls) => Serializer.packWalls(walls))
      .map((num) => {
        const wallRepresentation = Serializer.characterMap.get(num);
        if (wallRepresentation === undefined) {
          throw new URIError(
            `Invalid characterMap character, cannot encode walls: ${num}`,
          );
        } else {
          return wallRepresentation;
        }
      })
      .join('');

    return hexString;
  }

  // Serializes walls as a packing of 3 binary numbers as a character representing digits between 0 and 64
  static serializeLayoutWalls(layout: Layout) {
    const walls = layout.layout
      .map((row, i) => {
        return row.filter((_, j) => i % 2 === 0 || j % 2 === 0); // remove corner walls
      })
      .flat()
      .filter((element) => element instanceof WallType) as WallType[];

    return Serializer.serializeWallsArray(walls);
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
        if (notCornerWall && !isWall) {
          // Skip corner walls
          layoutString += element.getStrRepr();
        }
      }
    }

    layoutString += ` ${Serializer.serializeLayoutWalls(layout)}`;
    return LZString.compressToEncodedURIComponent(layoutString);
  }

  static decodeLayoutString(compressedLayoutString: string) {
    const decompressed = LZString.decompressFromEncodedURIComponent(
      compressedLayoutString.slice(1),
    );
    console.log('!', decompressed);
    if (decompressed === null) {
      throw new URIError('Invalid layout string, decompression failed');
    }

    const version = decompressed.split(' ')[0];
    const deserializer = Deserializer.get(version);
    if (!deserializer) {
      throw new URIError('Invalid version number, cannot deserialize');
    }

    return deserializer(decompressed);
  }
}
