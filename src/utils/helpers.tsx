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
  static Empty = new SquareType('00', 'empty-tile.png', 'Empty tile');
  static CornerGrabber = new SquareType( // Default corner grabber for tally display
    'cornerGrabber',
    'corner-grabber-left.png',
    'Corner Grabber',
  );

  private static itemsData: [string, [string, string]][] = [
    ['00', ['empty-tile.png', 'Empty tile']],

    // Appliances
    ['O9', ['starter-hob.png', 'Starter Hob']],
    ['UQ', ['hob.png', 'Hob']],
    ['96', ['safety-hob.png', 'Safety Hob']],
    ['ud', ['danger-hob.png', 'Danger Hob']],
    ['JD', ['oven.png', 'Oven']],
    ['2Q', ['microwave.png', 'Microwave']],
    ['e6', ['gas-limiter.png', 'Gas Limiter']],
    ['5V', ['gas-override.png', 'Gas Override']],
    ['n2', ['starter-bin.png', 'Starter Bin']],
    ['0R', ['bin.png', 'Bin']],
    ['2V', ['compactor-bin.png', 'Compactor Bin']],
    ['Qs', ['composter-bin.png', 'Composter Bin']],
    ['70', ['expanded-bin.png', 'Expanded Bin']],
    ['ze', ['counter.png', 'Counter']],
    ['wn', ['freezer.png', 'Freezer']],
    ['E2', ['workstation.png', 'Workstation']],
    ['31', ['prep-station.png', 'Prep Station']],
    ['ot', ['frozen-prep-station.png', 'Frozen Prep Station']],
    ['ao', ['starter-plates.png', 'Starter Plates']],
    ['m2', ['plates.png', 'Plates']],
    ['hp', ['auto-plater.png', 'Autoplater']],
    ['NH', ['pot-stack.png', 'Pot Stack']],
    ['2A', ['serving-boards.png', 'Serving Boards']],
    ['94', ['woks.png', 'Woks']],
    ['3D', ['kitchen-floor-protector.png', 'Kitchen Floor Protector']],
    ['WS', ['rolling-pin.png', 'Rolling Pin']],
    ['kv', ['sharp-knife.png', 'Sharp Knife']],
    ['lq', ['dining-table.png', 'Dining Table']],
    ['tV', ['bar-table.png', 'Bar Table']],
    ['cJ', ['metal-table.png', 'Metal Table']],
    ['T2', ['table-simple-cloth.png', 'Table - Simple Cloth']],
    ['GM', ['table-fancy-cloth.png', 'Table - Fancy Cloth']],
    ['qB', ['chair.png', 'Chair']],
    ['r6', ['breadsticks.png', 'Breadsticks']],
    ['Yn', ['candle-box.png', 'Candle Box']],
    ['mD', ['napkins.png', 'Napkins']],
    ['zZ', ['sharp-cutlery.png', 'Sharp Cutlery']],
    ['CZ', ['specials-menu.png', '"Specials" Menu']],
    ['oH', ['supplies.png', 'Supplies']],
    ['3G', ['tray-stand.png', 'Tray Stand']],
    ['qC', ['coffee-table.png', 'Coffee Table']],
    ['J1', ['flower-pot.png', 'Flower Pot']],
    ['bZ', ['starter-sink.png', 'Starter Sink']],
    ['W1', ['sink.png', 'Sink']],
    ['Nt', ['soaking-sink.png', 'Soaking Sink']],
    ['v2', ['power-sink.png', 'Power Sink']],
    ['1g', ['wash-basin.png', 'Wash Basin']],
    ['xm', ['dishwasher.png', 'Dishwasher']],
    ['HD', ['mop.png', 'Mop']],
    ['VX', ['lasting-mop.png', 'Lasting Mop']],
    ['6O', ['fast-mop.png', 'Fast Mop']],
    ['9V', ['robot-mop.png', 'Robot Mop']],
    ['Ad', ['floor-buffer.png', 'Floor Buffer']],
    ['1Z', ['robot-buffer.png', 'Robot Buffer']],
    ['2M', ['dish-rack.png', 'Dish Rack']],
    ['1P', ['scrubbing-brush.png', 'Scrubbing Brush']],
    ['fU', ['conveyor.png', 'Conveyor']],
    ['BM', ['grabber.png', 'Grabber']],
    ['sC', ['smart-grabber.png', 'Smart Grabber']],
    ['3V', ['corner-grabber-left.png', 'Corner Grabber (Left)']],
    ['U7', ['corner-grabber-right.png', 'Corner Grabber (Right)']],
    ['mq', ['corner-grabber-straight.png', 'Corner Grabber (Straight)']],
    ['w5', ['combiner.png', 'Combiner']],
    ['Dg', ['portioner.png', 'Portioner']],
    ['Z9', ['mixer.png', 'Mixer']],
    ['eY', ['conveyor-mixer.png', 'Conveyor Mixer']],
    ['60', ['heated-mixer.png', 'Heated Mixer']],
    ['AY', ['rapid-mixer.png', 'Rapid Mixer']],
    ['F5', ['blueprint-cabinet.png', 'Blueprint Cabinet']],
    ['8B', ['research-desk.png', 'Research Desk']],
    ['CR', ['blueprint-desk.png', 'Blueprint Desk']],
    ['5T', ['copying-desk.png', 'Copying Desk']],
    ['4K', ['discount-desk.png', 'Discount Desk']],
    ['ZE', ['trainers.png', 'Trainers']],
    ['kF', ['wellies.png', 'Wellies']],
    ['py', ['work-boots.png', 'Work Boots']],
    ['pj', ['booking-desk.png', 'Booking Desk']],
    ['5d', ['display-stand.png', 'Display Stand']],
    ['H5', ['dumbwaiter.png', 'Dumbwaiter']],
    ['zg', ['teleporter.png', 'Teleporter']],
    ['hM', ['ordering-terminal.png', 'Ordering Terminal']],
    ['Gt', ['specials-terminal.png', 'Specials Terminal']],
    ['lu', ['door.png', 'Door']],

    // Ingredients
    ['yi', ['apples.png', 'Apples']],
    ['FG', ['beans.png', 'Beans']],
    ['dG', ['broccoli.png', 'Broccoli']],
    ['Dc', ['burger-buns.png', 'Burger Buns']],
    ['P7', ['burger-patties.png', 'Burger Patties']],
    ['Ar', ['carrots.png', 'Carrots']],
    ['zQ', ['cheese.png', 'Cheese']],
    ['IX', ['christmas-crackers.png', 'Christmas Crackers']],
    ['6D', ['coffee.png', 'Coffee']],
    ['jC', ['corn.png', 'Corn']],
    ['NV', ['eggs.png', 'Eggs']],
    ['Ls', ['fish.png', 'Fish']],
    ['AG', ['flour.png', 'Flour']],
    ['1D', ['hot-dog-buns.png', 'Hotdog Buns']],
    ['Sx', ['hot-dogs.png', 'Hotdogs']],
    ['vu', ['ice-cream.png', 'Ice Cream']],
    ['We', ['ketchup.png', 'Ketchup']],
    ['NG', ['mustard.png', 'Mustard']],
    ['SS', ['lettuce.png', 'Lettuce']],
    ['uW', ['meat.png', 'Meat']],
    ['CH', ['thick-meat.png', 'Thick Meat']],
    ['jt', ['thin-meat.png', 'Thin Meat']],
    ['E5', ['bone-in-steaks.png', 'Bone-in Steaks']],
    ['5B', ['mushrooms.png', 'Mushrooms']],
    ['Ja', ['nuts.png', 'Nuts']],
    ['WU', ['oil.png', 'Oil']],
    ['2o', ['olives.png', 'Olives']],
    ['fH', ['onions.png', 'Onions']],
    ['co', ['potatoes.png', 'Potatoes']],
    ['I4', ['pumpkins.png', 'Pumpkins']],
    ['Qi', ['rice.png', 'Rice']],
    ['1K', ['tomatoes.png', 'Tomatoes']],
    ['ET', ['turkey.png', 'Turkey']],
    ['0s', ['wine.png', 'Wine']],
  ];

  private static idMap = new Map(this.itemsData);

  id: string;
  imagePath: string;
  imageAlt: string;
  rotation: Rotation;

  constructor(
    id: string,
    imagePath: string,
    imageAlt: string,
    rotation?: Rotation,
  ) {
    this.id = id;
    this.imagePath = imagePath;
    this.imageAlt = imageAlt;

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
    for (let i = 0; i < SquareType.itemsData.length; i++) {
      if (SquareType.itemsData[i][0] === this.id) {
        return i;
      }
    }
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
    const item = new SquareType(this.id, this.imagePath, this.imageAlt);
    return item;
  }

  static getAllItems() {
    const allItems: SquareType[] = [];

    this.idMap.forEach((value, key) => {
      if (key !== SquareType.Empty.id) {
        allItems.push(
          new SquareType(key, value[0] as string, value[1] as string),
        );
      }
    });
    return allItems;
  }

  static fromStrRepr(strRepr: string) {
    const itemId = strRepr.slice(0, 2);
    const rotationStr = strRepr.slice(2, 3);

    if (itemId === SquareType.Empty.id) {
      return SquareType.Empty;
    }
    if (this.idMap.has(itemId)) {
      const value = this.idMap.get(itemId);
      const square = new SquareType(
        itemId,
        value?.[0] as string,
        value?.[1] as string,
      );
      square.rotation = rotationStr as Rotation;
      return square;
    }
    throw new URIError('Invalid SquareType string: ' + strRepr);
  }
}
