import { Button } from 'antd'

export enum GridMode {
  Draw,
  Plan,
}

export enum Rotation {
  Up,
  Right,
  Down,
  Left,
}

export class WallType {
  static Empty = new WallType("line-empty");
  static Wall = new WallType("line-wall");
  static Half = new WallType("line-half");

  className: string;

  constructor(className: string) {
    this.className = className;
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
}

export class SquareType {
  static Empty = new SquareType("empty-tile.png", "Empty tile", 0);

  private static appliances = [
    // Cooking appliances
    ["starter-hob.png", "Starter Hob"],
    ["hob.png", "Hob"],
    ["safety-hob.png", "Safety Hob"],
    ["danger-hob.png", "Danger Hob"],
    ["oven.png", "Oven"],
    ["microwave.png", "Microwave"],
    ["gas-limiter.png", "Gas Limiter"],
    ["gas-override.png", "Gas Override"],

    // Kitchen necessities
    ["starter-bin.png", "Starter Bin"],
    ["bin.png", "Bin"],
    ["compactor-bin.png", "Compactor Bin"],
    ["composter-bin.png", "Composter Bin"],
    ["expanded-bin.png", "Expanded Bin"],
    ["counter.png", "Counter"],
    ["freezer.png", "Freezer"],
    ["workstation.png", "Workstation"],
    ["prep-station.png", "Prep Station"],
    ["frozen-prep-station.png", "Frozen Prep Station"],
    ["starter-plates.png", "Starter Plates"],
    ["plates.png", "Plates"],
    ["auto-plater.png", "Autoplater"],
    ["pot-stack.png", "Pot Stack"],
    ["serving-boards.png", "Serving Boards"],
    ["woks.png", "Woks"],
    ["kitchen-floor-protector.png", "Kitchen Floor Protector"],
    ["rolling-pin.png", "Rolling Pin"],
    ["sharp-knife.png", "Sharp Knife"],

    // Dining room necessities
    ["dining-table.png", "Dining Table"],
    ["bar-table.png", "Bar Table"],
    ["metal-table.png", "Metal Table"],
    ["table-simple-cloth.png", "Table - Simple Cloth"],
    ["table-fancy-cloth.png", "Table - Fancy Cloth"],
    ["breadsticks.png", "Breadsticks"],
    ["candle-box.png", "Candle Box"],
    ["napkins.png", "Napkins"],
    ["sharp-cutlery.png", "Sharp Cutlery"],
    ["specials-menu.png", '"Specials" Menu'],
    ["supplies.png", "Supplies"],
    ["tray-stand.png", "Tray Stand"],
    ["coffee-table.png", "Coffee Table"],
    ["flower-pot.png", "Flower Pot"],

    // Cleaning necessities
    ["starter-sink.png", "Starter Sink"],
    ["sink.png", "Sink"],
    ["soaking-sink.png", "Soaking Sink"],
    ["power-sink.png", "Power Sink"],
    ["wash-basin.png", "Wash Basin"],
    ["dishwasher.png", "Dishwasher"],
    ["mop.png", "Mop"],
    ["lasting-mop.png", "Lasting Mop"],
    ["fast-mop.png", "Fast Mop"],
    ["robot-mop.png", "Robot Mop"],
    ["floor-buffer.png", "Floor Buffer"],
    ["robot-buffer.png", "Robot Buffer"],
    ["dish-rack.png", "Dish Rack"],
    ["scrubbing-brush.png", "Scrubbing Brush"],

    // Kitchen automation
    ["conveyor.png", "Conveyor"],
    ["grabber.png", "Grabber"],
    ["smart-grabber.png", "Smart Grabber"],
    ["combiner.png", "Combiner"],
    ["portioner.png", "Portioner"],
    ["mixer.png", "Mixer"],
    ["conveyor-mixer.png", "Conveyor Mixer"],
    ["heated-mixer.png", "Heated Mixer"],
    ["rapid-mixer.png", "Rapid Mixer"],

    // Research
    ["blueprint-cabinet.png", "Blueprint Cabinet"],
    ["research-desk.png", "Research Desk"],
    ["blueprint-desk.png", "Blueprint Desk"],
    ["copying-desk.png", "Copying Desk"],
    ["discount-desk.png", "Discount Desk"],

    // Footwear
    ["trainers.png", "Trainers"],
    ["wellies.png", "Wellies"],
    ["work-boots.png", "Work Boots"],

    // Other
    ["booking-desk.png", "Booking Desk"],
    ["display-stand.png", "Display Stand"],
    ["dumbwaiter.png", "Dumbwaiter"],
    ["ordering-terminal.png", "Ordering Terminal"],
    ["specials-terminal.png", "Specials Terminal"],
  ];

  private static ingredients = [
    ["apples.png", "Apples"],
    ["beans.png", "Beans"],
    ["broccoli.png", "Broccoli"],
    ["burger-buns.png", "Burger Buns"],
    ["burger-patties.png", "Burger Patties"],
    ["carrots.png", "Carrots"],
    ["cheese.png", "Cheese"],
    ["christmas-crackers.png", "Christmas Crackers"],
    ["coffee.png", "Coffee"],
    ["eggs.png", "Eggs"],
    ["fish.png", "Fish"],
    ["flour.png", "Flour"],
    ["hot-dog-buns.png", "Hotdog Buns"],
    ["hot-dogs.png", "Hotdogs"],
    ["ice-cream.png", "Ice Cream"],
    ["ketchup.png", "Ketchup"],
    ["mustard.png", "Mustard"],
    ["lettuce.png", "Lettuce"],
    ["meat.png", "Meat"],
    ["thick-meat.png", "Thick Meat"],
    ["thin-meat.png", "Thin Meat"],
    ["mushrooms.png", "Mushrooms"],
    ["nuts.png", "Nuts"],
    ["oil.png", "Oil"],
    ["olives.png", "Olives"],
    ["onions.png", "Onions"],
    ["potatoes.png", "Potatoes"],
    ["rice.png", "Rice"],
    ["tomatoes.png", "Tomatoes"],
    ["turkey.png", "Turkey"],
    ["wine.png", "Wine"],
  ];

  imagePath: string;
  imageAlt: string;
  order: number;
  rotation: Rotation;

  constructor(
    imagePath: string,
    imageAlt: string,
    order: number,
    rotation?: Rotation
  ) {
    this.imagePath = imagePath;
    this.imageAlt = imageAlt;
    this.order = order;
    if (rotation) {
      this.rotation = rotation;
    } else {
      this.rotation = Rotation.Up;
    }
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

  static getAllAppliances() {
    let allAppliances = [];
    for (let i = 0; i < this.appliances.length; i++) {
      allAppliances.push(
        new SquareType(this.appliances[i][0], this.appliances[i][1], i)
      );
    }
    for (let j = 0; j < this.ingredients.length; j++) {
      allAppliances.push(
        new SquareType(
          this.ingredients[j][0],
          this.ingredients[j][1],
          j + this.appliances.length
        )
      );
    }
    return allAppliances;
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