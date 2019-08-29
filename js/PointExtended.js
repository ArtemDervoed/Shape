import * as PIXI from 'pixi.js';

export default class PointExtended extends PIXI.Point {
  constructor(x, y) {
    super();
    this.x = x || 0;
    this.y = y || 0;

    this.vx = 0;
    this.vy = 0;

    this.originalX = x || 0;
    this.originalY = y || 0;

    this.interactionDist = 50;

    this.friction = 0.94;
    this.springFactor = 0.1;
  }

  setPosition = (x, y) => {
    this.x = x;
    this.y = y;
  }

  setOriginalCoordinates = (x, y) => {
    this.originalX = x || this.originalX;
    this.originalY = y || this.originalY;
  }

  think = (mouse) => {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    const dist = Math.sqrt((dx * dx) + (dy * dy));
    // interaction
    if (dist < this.interactionDist) {
      const angle = Math.atan2(dy, dx);
      const tx = mouse.x + (Math.cos(angle) * this.interactionDist);
      const ty = mouse.y + (Math.sin(angle) * this.interactionDist);

      this.vx += tx - this.x;
      this.vy += ty - this.y;
    }

    const dx1 = this.originalX - this.x;
    const dy1 = this.originalY - this.y;

    this.vx += dx1 * this.springFactor;
    this.vy += dy1 * this.springFactor;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }
}
