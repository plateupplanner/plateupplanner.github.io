import { SquareType, WallType } from "../../helpers";
import { Layout } from "../../Layout";
import { Serializer } from "../serializer";

export default function decodeLayoutV2(decompressed: string) {
  let [version, size, layoutString, wallString] = decompressed.split(" ");
  if (version !== "v2") {
    throw new URIError("Invalid layout string version");
  }
  let [height, width] = size.split("x").map((x) => parseInt(x));

  const wallsDecoded = Serializer.deserializeWalls(wallString);

  let layout = new Layout(height, width);
  for (let i = 0; i < layout.height * 2 - 1; i++) {
    for (let j = 0; j < layout.width * 2 - 1; j++) {
      // Squares (2 characters + 1 for rotation)
      if (i % 2 === 0 && j % 2 === 0) {
        let squareStrRepr = layoutString.slice(0, 3);
        layoutString = layoutString.slice(3);
        layout.setElement(i, j, SquareType.fromStrRepr(squareStrRepr));
        // Walls (0.5 characters, 1 character = 2 walls)
      } else if (i % 2 === 0 || j % 2 === 0) { // Skip Corner Walls
        let wallStrRepr = wallsDecoded.next().value;
        if (!!wallStrRepr) {
          const wall = WallType.fromStrRepr(wallStrRepr)
          layout.setElement(i, j, wall);
        } else {
          throw new URIError('Invalid Encoding of Walls');
        }
      }
    }
  }
  layout.fixCornerWalls();
  return layout;
}