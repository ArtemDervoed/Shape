export default class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.scale = {
      x: 1,
      y: 1,
    };
    this.oldX = 0;
    this.oldY = 0;
    window.addEventListener('mousemove', (e) => {
      this.oldX = this.x;
      this.oldY = this.y;
      this.x = (e.clientX - this.dx) / this.scale.x;
      this.y = (e.clientY - this.dy) / this.scale.y;
    });
  }

  setOffset = (dx, dy) => {
    this.dx = dx;
    this.dy = dy;
  }

  setScale = (scale) => {
    this.scale.x = scale.x;
    this.scale.y = scale.y;
  }
}
