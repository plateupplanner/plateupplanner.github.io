export enum GridMode {
  Draw,
  Plan,
}

export enum Rotation {
  Up = 'u',
  Right = 'r',
  Down = 'd',
  Left = 'l',
}

export class WallType {
  static Empty = new WallType('0', 'line-empty');
  static Wall = new WallType('w', 'line-wall');
  static Half = new WallType('h', 'line-half');

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
    if (this.className === 'line-empty') {
      return WallType.Wall;
    } else if (this.className === 'line-wall') {
      return WallType.Half;
    } else {
      return WallType.Empty;
    }
  }

  clone() {
    return WallType.fromStrRepr(this.id);
  }

  static fromStrRepr(str: string) {
    if (str === '0') {
      return WallType.Empty;
    } else if (str === 'w') {
      return WallType.Wall;
    } else if (str === 'h') {
      return WallType.Half;
    }
    throw new URIError('Invalid SquareType string: ' + str);
  }
}

export class SquareType {
  static Empty = new SquareType('00', 'empty-tile.png', 'Empty tile', 0);

  private static items = new Map([
    ['00', ['empty-tile.png', 'Empty tile', 0]],

    // Appliances
    ['O9', ['starter-hob.png', 'Starter Hob', 1]],
    ['UQ', ['hob.png', 'Hob', 2]],
    ['96', ['safety-hob.png', 'Safety Hob', 3]],
    ['ud', ['danger-hob.png', 'Danger Hob', 4]],
    ['JD', ['oven.png', 'Oven', 5]],
    ['2Q', ['microwave.png', 'Microwave', 6]],
    ['e6', ['gas-limiter.png', 'Gas Limiter', 7]],
    ['5V', ['gas-override.png', 'Gas Override', 8]],
    ['n2', ['starter-bin.png', 'Starter Bin', 9]],
    ['0R', ['bin.png', 'Bin', 10]],
    ['2V', ['compactor-bin.png', 'Compactor Bin', 11]],
    ['Qs', ['composter-bin.png', 'Composter Bin', 12]],
    ['70', ['expanded-bin.png', 'Expanded Bin', 13]],
    ['ze', ['counter.png', 'Counter', 14]],
    ['wn', ['freezer.png', 'Freezer', 15]],
    ['E2', ['workstation.png', 'Workstation', 16]],
    ['31', ['prep-station.png', 'Prep Station', 17]],
    ['ot', ['frozen-prep-station.png', 'Frozen Prep Station', 18]],
    ['ao', ['starter-plates.png', 'Starter Plates', 19]],
    ['m2', ['plates.png', 'Plates', 20]],
    ['hp', ['auto-plater.png', 'Autoplater', 21]],
    ['NH', ['pot-stack.png', 'Pot Stack', 22]],
    ['2A', ['serving-boards.png', 'Serving Boards', 23]],
    ['94', ['woks.png', 'Woks', 24]],
    ['3D', ['kitchen-floor-protector.png', 'Kitchen Floor Protector', 25]],
    ['WS', ['rolling-pin.png', 'Rolling Pin', 26]],
    ['kv', ['sharp-knife.png', 'Sharp Knife', 27]],
    ['lq', ['dining-table.png', 'Dining Table', 28]],
    ['tV', ['bar-table.png', 'Bar Table', 29]],
    ['cJ', ['metal-table.png', 'Metal Table', 30]],
    ['T2', ['table-simple-cloth.png', 'Table - Simple Cloth', 31]],
    ['GM', ['table-fancy-cloth.png', 'Table - Fancy Cloth', 32]],
    ['qB', ['chair.png', 'Chair', 33]],
    ['r6', ['breadsticks.png', 'Breadsticks', 34]],
    ['Yn', ['candle-box.png', 'Candle Box', 35]],
    ['mD', ['napkins.png', 'Napkins', 36]],
    ['zZ', ['sharp-cutlery.png', 'Sharp Cutlery', 37]],
    ['CZ', ['specials-menu.png', '"Specials" Menu', 38]],
    ['oH', ['supplies.png', 'Supplies', 39]],
    ['3G', ['tray-stand.png', 'Tray Stand', 40]],
    ['qC', ['coffee-table.png', 'Coffee Table', 41]],
    ['J1', ['flower-pot.png', 'Flower Pot', 42]],
    ['bZ', ['starter-sink.png', 'Starter Sink', 43]],
    ['W1', ['sink.png', 'Sink', 44]],
    ['Nt', ['soaking-sink.png', 'Soaking Sink', 45]],
    ['v2', ['power-sink.png', 'Power Sink', 46]],
    ['1g', ['wash-basin.png', 'Wash Basin', 47]],
    ['xm', ['dishwasher.png', 'Dishwasher', 48]],
    ['HD', ['mop.png', 'Mop', 49]],
    ['VX', ['lasting-mop.png', 'Lasting Mop', 50]],
    ['6O', ['fast-mop.png', 'Fast Mop', 51]],
    ['9V', ['robot-mop.png', 'Robot Mop', 52]],
    ['Ad', ['floor-buffer.png', 'Floor Buffer', 53]],
    ['1Z', ['robot-buffer.png', 'Robot Buffer', 54]],
    ['2M', ['dish-rack.png', 'Dish Rack', 55]],
    ['1P', ['scrubbing-brush.png', 'Scrubbing Brush', 56]],
    ['fU', ['conveyor.png', 'Conveyor', 57]],
    ['BM', ['grabber.png', 'Grabber', 58]],
    ['sC', ['smart-grabber.png', 'Smart Grabber', 59]],
    ['w5', ['combiner.png', 'Combiner', 60]],
    ['Dg', ['portioner.png', 'Portioner', 61]],
    ['Z9', ['mixer.png', 'Mixer', 62]],
    ['eY', ['conveyor-mixer.png', 'Conveyor Mixer', 63]],
    ['60', ['heated-mixer.png', 'Heated Mixer', 64]],
    ['AY', ['rapid-mixer.png', 'Rapid Mixer', 65]],
    ['F5', ['blueprint-cabinet.png', 'Blueprint Cabinet', 66]],
    ['8B', ['research-desk.png', 'Research Desk', 67]],
    ['CR', ['blueprint-desk.png', 'Blueprint Desk', 68]],
    ['5T', ['copying-desk.png', 'Copying Desk', 69]],
    ['4K', ['discount-desk.png', 'Discount Desk', 70]],
    ['ZE', ['trainers.png', 'Trainers', 71]],
    ['kF', ['wellies.png', 'Wellies', 72]],
    ['py', ['work-boots.png', 'Work Boots', 73]],
    ['pj', ['booking-desk.png', 'Booking Desk', 74]],
    ['5d', ['display-stand.png', 'Display Stand', 75]],
    ['H5', ['dumbwaiter.png', 'Dumbwaiter', 76]],
    ['hM', ['ordering-terminal.png', 'Ordering Terminal', 77]],
    ['Gt', ['specials-terminal.png', 'Specials Terminal', 78]],
    ['lu', ['door.png', 'Door', 79]],

    // Ingredients
    ['yi', ['apples.png', 'Apples', 80]],
    ['FG', ['beans.png', 'Beans', 81]],
    ['dG', ['broccoli.png', 'Broccoli', 82]],
    ['Dc', ['burger-buns.png', 'Burger Buns', 83]],
    ['P7', ['burger-patties.png', 'Burger Patties', 84]],
    ['Ar', ['carrots.png', 'Carrots', 85]],
    ['zQ', ['cheese.png', 'Cheese', 86]],
    ['IX', ['christmas-crackers.png', 'Christmas Crackers', 87]],
    ['6D', ['coffee.png', 'Coffee', 88]],
    ['NV', ['eggs.png', 'Eggs', 89]],
    ['Ls', ['fish.png', 'Fish', 90]],
    ['AG', ['flour.png', 'Flour', 91]],
    ['1D', ['hot-dog-buns.png', 'Hotdog Buns', 92]],
    ['Sx', ['hot-dogs.png', 'Hotdogs', 93]],
    ['vu', ['ice-cream.png', 'Ice Cream', 94]],
    ['We', ['ketchup.png', 'Ketchup', 95]],
    ['NG', ['mustard.png', 'Mustard', 96]],
    ['SS', ['lettuce.png', 'Lettuce', 97]],
    ['uW', ['meat.png', 'Meat', 98]],
    ['CH', ['thick-meat.png', 'Thick Meat', 99]],
    ['jt', ['thin-meat.png', 'Thin Meat', 100]],
    ['5B', ['mushrooms.png', 'Mushrooms', 101]],
    ['Ja', ['nuts.png', 'Nuts', 102]],
    ['WU', ['oil.png', 'Oil', 103]],
    ['2o', ['olives.png', 'Olives', 104]],
    ['fH', ['onions.png', 'Onions', 105]],
    ['co', ['potatoes.png', 'Potatoes', 106]],
    ['Qi', ['rice.png', 'Rice', 107]],
    ['1K', ['tomatoes.png', 'Tomatoes', 108]],
    ['ET', ['turkey.png', 'Turkey', 109]],
    ['0s', ['wine.png', 'Wine', 110]],
  ]);

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
    rotation?: Rotation,
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
    return '/images/menu/' + this.imagePath;
  }

  getImageDisplayPath() {
    return '/images/display/' + this.imagePath;
  }

  getImageAlt() {
    return this.imageAlt;
  }

  getOrder() {
    return this.order;
  }

  getTransform() {
    if (this.rotation === Rotation.Right) {
      return 'rotate(90deg)';
    } else if (this.rotation === Rotation.Down) {
      return 'rotate(180deg)';
    } else if (this.rotation === Rotation.Left) {
      return 'rotate(270deg)';
    } else {
      return 'rotate(0deg)';
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

  clone() {
    const item = new SquareType(
      this.id,
      this.imagePath,
      this.imageAlt,
      this.order,
    );
    return item;
  }

  static getAllItems() {
    const allItems: SquareType[] = [];

    this.items.forEach((value, key) => {
      if (key !== SquareType.Empty.id) {
        allItems.push(
          new SquareType(
            key,
            value[0] as string,
            value[1] as string,
            value[2] as number,
          ),
        );
      }
    });
    return allItems;
  }

  static fromStrRepr(strRepr: string) {
    const itemStrRepr = strRepr.slice(0, 2);
    const rotationStrRepr = strRepr.slice(2, 3);

    if (itemStrRepr === SquareType.Empty.id) {
      return SquareType.Empty;
    }
    if (this.items.has(itemStrRepr)) {
      const value = this.items.get(itemStrRepr);
      const square = new SquareType(
        itemStrRepr,
        value?.[0] as string,
        value?.[1] as string,
        value?.[2] as number,
      );
      square.rotation = rotationStrRepr as Rotation;
      return square;
    }
    throw new URIError('Invalid SquareType string: ' + strRepr);
  }
}
