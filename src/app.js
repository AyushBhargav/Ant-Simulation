import CanvasDisplay from "./display";

const config = {
  width: 640,
  height: 480,
};

export class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v2) {
    return new Vector2(this.x + v2.x, this.y + v2.y);
  }
}

export class Ant {
  constructor(world, position, rotationDegree) {
    this.world = world;
    this.position = position;
    this.rotation = rotationDegree;
    this.isCarryFood = false;
  }

  // nx = x + cos theta
  draw(canvasDisplay) {
    canvasDisplay.beginPath();
    canvasDisplay.moveTo(this.position.x, this.position.y);
    canvasDisplay.lineTo(
      this.position.x + Math.cos(this.rotation) * 5,
      this.position.y + Math.sin(this.rotation) * 5
    );
    canvasDisplay.stroke();
  }

  move() {
    const cell = this.seekFood();

    this.position.x += Math.sin(this.rotation) * 0.1;
    this.position.y += Math.cos(this.rotation) * 0.1;
  }

  seekFood() {
    nearestCells = this.world.getNearestEntity(this.position);
    const foodCells = nearestCells.filter((cell) => cell.food);
    const blueCells = nearestCells.filter((cell) => cell.blueTrailIntensity);
    const redCells = nearestCells.filter((cell) => cell.redTrailIntensity);

    if (foodCells) return foodCells[foodCells.length * Math.random()];
    if (redCells) return redCells[redCells.length * Math.random()];
    if (blueCells) return blueCells[blueCells.length * Math.random()];
  }

  returnFood() {}
}

class Food {
  constructor(position) {
    this.position = position;
  }
}

class World {
  constructor(cellSize) {
    this.cols = config.width / cellSize;
    this.rows = config.height / cellSize;
    this.cells = new Array(this.rows);
    this.directions = [
      new Vector2(-1, 0),
      new Vector2(0, -1),
      new Vector2(1, 0),
      new Vector2(0, 1),
      new Vector2(1, 1),
      new Vector2(-1, -1),
      new Vector2(1, -1),
      new Vector2(-1, 1),
    ];

    for (let i = 0; i < rows; i++) {
      this.cells[i] = new Array(this.cols);
    }
  }

  addEntity(position, type, value) {
    const [row, col] = this.getCurrentCell(position);

    switch (type) {
      case "FOOD":
        this.cells[row][col].food = value;
        break;
      case "BLUE_TRAIL":
        this.cells[row][col].blueTrailIntensity =
          value + this.cells[row][col].value ? this.cells[row][col].value : 0;
        break;
      case "RED_TRAIL":
        this.cells[row][col].redTrailIntensity =
          value + this.cells[row][col].value ? this.cells[row][col].value : 0;
        break;
    }
  }

  getEntity = (position) => {
    const [row, col] = this.getCurrentCell(position);
    if (row >= 0 && col >= 0 && row < this.rows && cols < this.cols)
      return this.cells[row][col];
    return undefined;
  };

  getNearestEntities(position) {
    return this.directions
      .map((direction) => position.add(direction))
      .map(this.getTrail)
      .filter((trail) => trail != undefined);
  }

  getCurrentCell(position) {
    const col = Math.floor(position.x / cellSize);
    const row = Math.floor(position.y / cellSize);

    return { row, col };
  }
}

const canvasDisplay = new CanvasDisplay();
canvasDisplay.update();
