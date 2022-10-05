import { Button } from 'antd'

export enum GridMode {
  Draw,
  Plan,
}

export enum Rotation {
  Up = "u",
  Right = "r",
  Down = "d",
  Left = "l",
}

export class WallType {
  static Empty = new WallType("0", "line-empty");
  static Wall = new WallType("w", "line-wall");
  static Half = new WallType("h", "line-half");

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
    if (this.className === "line-empty") {
      return WallType.Wall;
    } else if (this.className === "line-wall") {
      return WallType.Half;
    } else {
      return WallType.Empty;
    }
  }

  static fromStrRepr(str: string) {
    if (str === "0") {
      return WallType.Empty;
    } else if (str === "w") {
      return WallType.Wall;
    } else if (str === "h") {
      return WallType.Half
    }
    throw new URIError("Invalid SquareType string: " + str);
  }
}

export class SquareType {
  static Empty = new SquareType("00", "empty-tile.png", "Empty tile", 0);

  private static items = new Map([
    ["00", ["empty-tile.png", "Empty tile", 0]],

    // Appliances
    ["O9", ["starter-hob.png", "Starter Hob", 1]],
    ["UQ", ["hob.png", "Hob", 2]],
    ["96", ["safety-hob.png", "Safety Hob", 3]],
    ["ud", ["danger-hob.png", "Danger Hob", 4]],
    ["JD", ["oven.png", "Oven", 5]],
    ["2Q", ["microwave.png", "Microwave", 6]],
    ["e6", ["gas-limiter.png", "Gas Limiter", 7]],
    ["5V", ["gas-override.png", "Gas Override", 8]],
    ["n2", ["starter-bin.png", "Starter Bin", 9]],
    ["0R", ["bin.png", "Bin", 10]],
    ["2V", ["compactor-bin.png", "Compactor Bin", 11]],
    ["Qs", ["composter-bin.png", "Composter Bin", 12]],
    ["70", ["expanded-bin.png", "Expanded Bin", 13]],
    ["ze", ["counter.png", "Counter", 14]],
    ["wn", ["freezer.png", "Freezer", 15]],
    ["E2", ["workstation.png", "Workstation", 16]],
    ["31", ["prep-station.png", "Prep Station", 17]],
    ["ot", ["frozen-prep-station.png", "Frozen Prep Station", 18]],
    ["ao", ["starter-plates.png", "Starter Plates", 19]],
    ["m2", ["plates.png", "Plates", 20]],
    ["hp", ["auto-plater.png", "Autoplater", 21]],
    ["NH", ["pot-stack.png", "Pot Stack", 22]],
    ["2A", ["serving-boards.png", "Serving Boards", 23]],
    ["94", ["woks.png", "Woks", 24]],
    ["3D", ["kitchen-floor-protector.png", "Kitchen Floor Protector", 25]],
    ["WS", ["rolling-pin.png", "Rolling Pin", 26]],
    ["kv", ["sharp-knife.png", "Sharp Knife", 27]],
    ["lq", ["dining-table.png", "Dining Table", 28]],
    ["tV", ["bar-table.png", "Bar Table", 29]],
    ["cJ", ["metal-table.png", "Metal Table", 30]],
    ["T2", ["table-simple-cloth.png", "Table - Simple Cloth", 31]],
    ["GM", ["table-fancy-cloth.png", "Table - Fancy Cloth", 32]],
    ["r6", ["breadsticks.png", "Breadsticks", 33]],
    ["Yn", ["candle-box.png", "Candle Box", 34]],
    ["mD", ["napkins.png", "Napkins", 35]],
    ["zZ", ["sharp-cutlery.png", "Sharp Cutlery", 36]],
    ["CZ", ["specials-menu.png", '"Specials" Menu', 37]],
    ["oH", ["supplies.png", "Supplies", 38]],
    ["3G", ["tray-stand.png", "Tray Stand", 39]],
    ["qC", ["coffee-table.png", "Coffee Table", 40]],
    ["J1", ["flower-pot.png", "Flower Pot", 41]],
    ["bZ", ["starter-sink.png", "Starter Sink", 42]],
    ["W1", ["sink.png", "Sink", 43]],
    ["Nt", ["soaking-sink.png", "Soaking Sink", 44]],
    ["v2", ["power-sink.png", "Power Sink", 45]],
    ["1g", ["wash-basin.png", "Wash Basin", 46]],
    ["xm", ["dishwasher.png", "Dishwasher", 47]],
    ["HD", ["mop.png", "Mop", 48]],
    ["VX", ["lasting-mop.png", "Lasting Mop", 49]],
    ["6O", ["fast-mop.png", "Fast Mop", 50]],
    ["9V", ["robot-mop.png", "Robot Mop", 51]],
    ["Ad", ["floor-buffer.png", "Floor Buffer", 52]],
    ["1Z", ["robot-buffer.png", "Robot Buffer", 53]],
    ["2M", ["dish-rack.png", "Dish Rack", 54]],
    ["1P", ["scrubbing-brush.png", "Scrubbing Brush", 55]],
    ["fU", ["conveyor.png", "Conveyor", 56]],
    ["BM", ["grabber.png", "Grabber", 57]],
    ["sC", ["smart-grabber.png", "Smart Grabber", 58]],
    ["w5", ["combiner.png", "Combiner", 59]],
    ["Dg", ["portioner.png", "Portioner", 60]],
    ["Z9", ["mixer.png", "Mixer", 61]],
    ["eY", ["conveyor-mixer.png", "Conveyor Mixer", 62]],
    ["60", ["heated-mixer.png", "Heated Mixer", 63]],
    ["AY", ["rapid-mixer.png", "Rapid Mixer", 64]],
    ["F5", ["blueprint-cabinet.png", "Blueprint Cabinet", 65]],
    ["8B", ["research-desk.png", "Research Desk", 66]],
    ["CR", ["blueprint-desk.png", "Blueprint Desk", 67]],
    ["5T", ["copying-desk.png", "Copying Desk", 68]],
    ["4K", ["discount-desk.png", "Discount Desk", 69]],
    ["ZE", ["trainers.png", "Trainers", 70]],
    ["kF", ["wellies.png", "Wellies", 71]],
    ["py", ["work-boots.png", "Work Boots", 72]],
    ["pj", ["booking-desk.png", "Booking Desk", 73]],
    ["5d", ["display-stand.png", "Display Stand", 74]],
    ["H5", ["dumbwaiter.png", "Dumbwaiter", 75]],
    ["hM", ["ordering-terminal.png", "Ordering Terminal", 76]],
    ["Gt", ["specials-terminal.png", "Specials Terminal", 77]],

    // Ingredients
    ["yi", ["apples.png", "Apples", 77]],
    ["FG", ["beans.png", "Beans", 78]],
    ["dG", ["broccoli.png", "Broccoli", 79]],
    ["Dc", ["burger-buns.png", "Burger Buns", 80]],
    ["P7", ["burger-patties.png", "Burger Patties", 81]],
    ["Ar", ["carrots.png", "Carrots", 82]],
    ["zQ", ["cheese.png", "Cheese", 83]],
    ["IX", ["christmas-crackers.png", "Christmas Crackers", 84]],
    ["6D", ["coffee.png", "Coffee", 85]],
    ["NV", ["eggs.png", "Eggs", 86]],
    ["Ls", ["fish.png", "Fish", 87]],
    ["AG", ["flour.png", "Flour", 88]],
    ["1D", ["hot-dog-buns.png", "Hotdog Buns", 89]],
    ["Sx", ["hot-dogs.png", "Hotdogs", 90]],
    ["vu", ["ice-cream.png", "Ice Cream", 91]],
    ["We", ["ketchup.png", "Ketchup", 92]],
    ["NG", ["mustard.png", "Mustard", 93]],
    ["SS", ["lettuce.png", "Lettuce", 94]],
    ["uW", ["meat.png", "Meat", 95]],
    ["CH", ["thick-meat.png", "Thick Meat", 96]],
    ["jt", ["thin-meat.png", "Thin Meat", 97]],
    ["5B", ["mushrooms.png", "Mushrooms", 98]],
    ["Ja", ["nuts.png", "Nuts", 99]],
    ["WU", ["oil.png", "Oil", 100]],
    ["2o", ["olives.png", "Olives", 101]],
    ["fH", ["onions.png", "Onions", 102]],
    ["co", ["potatoes.png", "Potatoes", 103]],
    ["Qi", ["rice.png", "Rice", 104]],
    ["1K", ["tomatoes.png", "Tomatoes", 105]],
    ["ET", ["turkey.png", "Turkey", 106]],
    ["0s", ["wine.png", "Wine", 107]]
  ])

  id: string;
  imagePath: string;
  imageAlt: string;
  order: number;
  rotation: Rotation;

  constructor(
    id: string,
    imagePath: string,
    imageAlt: string,
    order: number,
    rotation?: Rotation
  ) {
    this.id = id;
    this.imagePath = imagePath;
    this.imageAlt = imageAlt;
    this.order = order;
    if (rotation) {
      this.rotation = rotation;
    } else {
      this.rotation = Rotation.Up;
    }
  }

  getStrRepr() {
    return this.id + `${this.rotation}`;
  }

  getImageMenuPath() {
    return "/images/menu/" + this.imagePath;
  }

  getImageDisplayPath() {
    return "/images/display/" + this.imagePath;
  }

  getImageAlt() {
    return this.imageAlt;
  }

  getOrder() {
    return this.order;
  }

  getTransform() {
    if (this.rotation === Rotation.Right) {
      return "rotate(90deg)";
    } else if (this.rotation === Rotation.Down) {
      return "rotate(180deg)";
    } else if (this.rotation === Rotation.Left) {
      return "rotate(270deg)";
    } else {
      return "rotate(0deg)";
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

  static getAllItems() {
    let allItems: SquareType[] = [];

    this.items.forEach((value, key) => {
      if (key !== "00") {
        allItems.push(new SquareType(key,
                                     value[0] as string, 
                                     value[1] as string, 
                                     value[2] as number));
      }
    })
    return allItems;
  }

  static fromStrRepr(str: string) {
    if (this.items.has(str)) {
      let value = this.items.get(str);
      return new SquareType(str,
                            value![0] as string, 
                            value![1] as string, 
                            value![2] as number);
    } else {
      throw new URIError("Invalid SquareType string: " + str);
    }
  }
}

export function styledButton(text: string, onClick: () => void, icon?: JSX.Element, iconRight?: boolean, disabled?: boolean) {
  let child = <>
    {text}
  </>

  if (icon && iconRight) {
    child = <>
      {text + " "}{icon}
      
    </>
  } else if (icon && !iconRight) {
    child = <>
      {icon}{" " + text}
    </>
  }
  return (
    <Button type="primary" shape="round"
      disabled={disabled}
      onClick={onClick}
      style={{ 
        backgroundColor: "#546785",
        font: "1.5em 'Lilita One', sans-serif",
        height: "1.7em",
        borderColor: "#818181",
        margin: "1em"
      }}>
      {child}
    </Button>
  );
}