import { SquareType, WallType } from "../helpers";
import { Layout } from "../Layout";

export class Serializer {
    private static serializeRowWalls(elements: (SquareType | WallType)[]) {
        const walls: any = [];
        elements.forEach((element) => {
            if ('className' in element) {
                const wallType = ["line-empty", "line-wall", "line-half"].indexOf(element.className)
                walls.push(wallType);
            }
        });

        let buffer = [];
        const uint8s = []
        for (let i = 0; i < walls.length; i++) {
            buffer.push(walls[i]);
            if (i === walls.length - 1 || buffer.length === 4) {
                let uint8 = 0;
                buffer.forEach((int, i) => {
                    const intOffset = int << (i * 2);
                    uint8 = uint8 | intOffset;
                })
                buffer = [];
                uint8s.push(uint8);
            }
        }

        let encodedWalls = 0;
        uint8s.forEach((uint8, i) => {
            const wallEncoding = uint8 << (i * 8);
            encodedWalls = encodedWalls | wallEncoding;
        })

        return encodedWalls;
    }

    private static deserializeRowWalls(numWalls:number, encodedWalls: number) {
        const walls: any = []

        for (let i = 0; i < numWalls; i++) {
            const wallType = 0b11 & (encodedWalls >> (i * 2))
            const className = ["line-empty", "line-wall", "line-half"][wallType];
            walls.push(className);

        }

        return walls;
    }

    static serializeWalls(layout: Layout) {
        return layout.layout.map((row) => Serializer.serializeRowWalls(row));
    }

    static deserializeWalls(wallEncoding: number[], layoutWidth: number) {
        return wallEncoding.map((rowWalls, i) => {
            const numWalls = i % 2 ? layoutWidth * 2 - 1 : layoutWidth - 1;
            return Serializer.deserializeRowWalls(numWalls, rowWalls);
          })
    }
}