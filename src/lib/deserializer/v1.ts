import { SquareType, WallType } from "../../helpers";
import { Layout } from "../../Layout";
import { Serializer } from "../serializer";

export default function decodeLayoutV2(decompressed: string) {
  let [version, size, layoutString] = decompressed.split(" ");
  if (version !== "v1") {
    throw new URIError("Invalid layout string version");
  }
  let [height, width] = size.split("x").map((x) => parseInt(x));

  let layout = new Layout(height, width);
  for (let i = 0; i < layout.height * 2 - 1; i++) {
    for (let j = 0; j < layout.width * 2 - 1; j++) {
      // Squares (2 characters + 1 for rotation)
      if (i % 2 === 0 && j % 2 === 0) {
        let squareStrRepr = layoutString.slice(0, 3);
        layoutString = layoutString.slice(3);
        layout.setElement(i, j, SquareType.fromStrRepr(squareStrRepr));
      // Walls (1 character)
      } else if (i % 2 === 0 || j % 2 === 0) {
        let wallStrRepr = layoutString.slice(0, 1);
        layoutString = layoutString.slice(1);
        layout.setElement(i, j, WallType.fromStrRepr(wallStrRepr));
      }
      // Corner walls skipped
    }
  }
  layout.fixCornerWalls();
  return layout;
}