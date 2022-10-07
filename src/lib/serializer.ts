import { SquareType, WallType } from "../helpers";
import { Layout } from "../Layout";
import { Utils } from "./utils";

export class Serializer {
    private static serializeRowWalls(elements: (SquareType | WallType)[]) {
        const binaryList = elements.map((element) => {
            if ('className' in element) {
                return ({
                    "line-empty":   0b11,
                    "line-wall":    0b01,
                    "line-half":    0b10,
                })[element.className] as number;
            } else {
                return 0b00;
            }
        }).filter((x) => !!x);

        let bin = BigInt(0);
        binaryList.reverse().forEach((num, i) => {
            const wallEncoding = BigInt(num) << BigInt((i * 2));
            bin = bin | wallEncoding;
        })

        const binNum = bin.toString();

        return binNum;
    }

    private static deserializeRowWalls(numWalls: number, encodedWalls: string) {
        return Utils.chunkJoin(encodedWalls.split(''), 2).map((wall: string) => {
            return ({
                "11": "0",
                "01": "w",
                "10": "h",
            })[wall] as string;
        });
    }

    static serializeWalls(layout: Layout) {
        return layout.layout
            .map((row) => Serializer.serializeRowWalls(row))
            .join('x');
    }

    static deserializeWalls(layoutWidth: number, wallEncoding: string[]) {
        return wallEncoding.map((rowWalls, i) => {
            const numWalls = i % 2 ? layoutWidth * 2 - 1 : layoutWidth - 1;
            let binaryString = BigInt(rowWalls).toString(2);
            if (binaryString.length % 2) {
                binaryString = `0${binaryString}`; // add back trailing 0s
            }
            return Serializer.deserializeRowWalls(numWalls, binaryString);
        })
    }
}