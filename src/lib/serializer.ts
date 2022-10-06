import { ConsoleSqlOutlined } from "@ant-design/icons";
import { SquareType, WallType } from "../helpers";
import { Layout } from "../Layout";
import { Utils } from "./utils";

export class Serializer {
    private static serializeRowWalls(elements: (SquareType | WallType)[]) {
        const binaryString = elements.map((element) => {
            if ('className' in element) {
                return ({
                    "line-empty": "11",
                    "line-wall": "01",
                    "line-half": "10",
                })[element.className];
            } else {
                return '';
            }
        }).join('');

        const decimal = parseInt(binaryString, 2);
        return decimal.toString(16);
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
            let binaryString = parseInt(rowWalls, 16).toString(2);
            if (binaryString.length % 2) {
                binaryString = `0${binaryString}`; // add back trailing 0s
            }
            return Serializer.deserializeRowWalls(numWalls, binaryString);
        })
    }
}