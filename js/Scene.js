import * as PIXI from 'pixi.js';

import Shape from './Shape.js';

import { images } from './images.js';

export default class Scene {
  constructor(figures) {
    this.app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
        transparent: true,
        autoResize: false,
    });

    this.shapes = [];
    this.figures = figures;
    this.containers = [];
    this.currentShape = 0;

    this._initShapes(figures);
    window.addEventListener('resize', this.handleResize);

    this.time = 0;

    this.app.ticker.add((delta) => {
      this.draw(delta);
    });
  }

  handleResize = () => {
    this.app.view.width = window.innerWidth;
    this.app.view.height = window.innerHeight;
  }

  _initShapes(figures) {
    figures.forEach((shape, i) => {
      const points = [];
      const container = new PIXI.Container();
      this.shapes.push(new Shape(shape, images, container))
      this.app.stage.addChild(container);
    });
    document.getElementById('renderer').appendChild(this.app.view);
  }

  changeShapeTo = (ind) => {
    this.shapes[this.currentShape].changeShapeTo(this.figures[ind], 2);
  }

  changeBackgroundTo = (ind) => {
    this.shapes[this.currentShape].changeBackgroundTo(ind, 2);
  }

  startDynamicMode = (duration) => {
    this.shapes[this.currentShape].startDynamicMode(duration);
  }

  draw = (delta) => {
    this.shapes[this.currentShape].translate(window.innerWidth / 2, window.innerHeight / 2);
    this.shapes[this.currentShape].render(this.time);

    // this.shapes[1].translate(200, 300);
    // this.shapes[1].dynamicProcessingPoints(this.time);
    // this.shapes[this.currentShape + 1].translate(window.innerWidth / 3, window.innerHeight / 3);
    // this.shapes[1].render(\this.time);
    this.time += 1;
  }
}
