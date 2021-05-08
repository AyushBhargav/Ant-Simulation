import { Ant, Vector2 } from "./app";

export default class CanvasDisplay {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.ctx = this.canvas.getContext("2d");
    this.ant = new Ant(new Vector2(320, 240), Math.PI / 4);
  }

  update = () => {
    this.clear();

    this.ant.move();
    this.ant.draw(this.ctx);

    window.requestAnimationFrame(this.update);
  };

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
