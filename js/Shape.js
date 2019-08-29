import * as PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';
import { TweenMax } from 'gsap';

import Mouse from './Mouse.js';
import Background from './Background.js';
import PointExtended from './PointExtended.js';

export default class Shape {
  constructor(points, images, container) {
    this.shadow = [];
    this.points = [];
    this.images = images;
    this.time = 0;

    points.forEach(point => {
      this.shadow.push(new PointExtended(point[0], point[1]));
      this.points.push(new PointExtended(point[0] * 1.1, point[1] * 1.1));
    });

    this.BackgroundContainer = new PIXI.Container();
    this.Background = new Background(this.images, this.BackgroundContainer);
    this.Background.preload();
    // this.Background.setInitImage(0);

    this.container = container;
    this.graphics = new PIXI.Graphics();
    this.graphics.interactive = true;
    this.graphics
      .on('pointerover', this.onButtonOver)
      .on('pointerout', this.onButtonOut);
    this.container.addChild(this.BackgroundContainer);
    this.container.addChild(this.graphics);
    this.simplex = new SimplexNoise();
    this.pos = new Mouse();

    this.halfWaveLength = 30;
    this.intersectionPoint = 0;
    this.minDist = null;

    this.interactive = false;
    this.isDynamic = true;

    this.offset = { x: 0, y: 0 };
    this.BackgroundContainer.mask = this.graphics;
  }

  translate = (x, y) => {
    this.offset = { x, y };
    this.pos.setOffset(this.offset.x, this.offset.y);
    this.graphics.x = this.offset.x;
    this.graphics.y = this.offset.y;
  }

  getCenter = (balls) => {
    let count = 0;
    let allx = 0;
    let ally = 0;
    const seg = balls;
    for (let i = 0; i < seg.length; i += 1) {
      allx += seg[i].originalX;
      ally += seg[i].originalY;
      count += 1;
    }
    return {
      x: allx / count,
      y: ally / count,
    };
  }

  calcDampedOscillations = (time) => {
    const A = 5;
    const B = 0.05;
    const w = 0.5;
    const x = A * Math.pow(Math.E, -B*time)*Math.cos(w*time);
    return x;
  }

  dynamicProcessingPoints = (time) => {
    this.points.forEach((point, i) => {
      let tx = point.originalX ;
      let ty = point.originalY;
      if (this.isDynamic) {
        const dx = this.shadow[i].x - point.x;
        const dy = this.shadow[i].y - point.y;
        const angle = Math.atan2(dy, dx);
        const noise = 5 * this.simplex.noise2D(
          point.x / 300 + (this.time * 0.005),
          point.y / 300 + (this.time * 0.005)
        );
        tx += (Math.cos(angle) * noise);
        ty += (Math.sin(angle) * noise);
      }

      TweenMax.to(
        point,
        1,
        {
          x: tx,
          y: ty,
        },
      );
      // point.setPosition(tx, ty);
      point.think(this.pos)
    });
  }

  _calcWaveAmp = (i) => ({
    waveX: i * 0.1 * Math.cos((Math.PI / 10 * i) + this.time / 2),
    waveY: i * 0.1 * Math.sin((Math.PI / 10 * i) + this.time / 2),
  })

  prapareWaveSegment = () => {
    const lastPointIndexR = this.intersectionPoint + this.halfWaveLength;
    for (let i = this.intersectionPoint; i < lastPointIndexR; i += 1) {
      const realI = i % this.points.length;
      const { waveX, waveY } = this._calcWaveAmp(realI);
      this.points[realI].x += waveX;
      this.points[realI].y += waveY;
    }
    const lastPointIndexL = this.intersectionPoint - this.halfWaveLength;
    for (let j = this.intersectionPoint - 1; j >= lastPointIndexL; j -= 1) {
      const realI = j >= 0 ?
          j % this.points.length :
          this.points.length - Math.abs((j % this.points.length - 1));
      const { waveX, waveY } = this._calcWaveAmp(realI);
      this.points[realI].x += waveX;
      this.points[realI].y += waveY;
    }
  }

  onButtonOver = () => {
    this.intersectionPoint = this._calcNearsetPoint(this.pos).nearPointIndex;
    // this.prapareWaveSegment();
  }

  onButtonOut = () => {
    this.intersectionPoint = this._calcNearsetPoint(this.pos).nearPointIndex;
    // this.prapareWaveSegment();
  }

  startDynamicMode = (duration) => {
    this.interactive = !this.interactive;
  }

  getContainer = () => {
    return this.container;
  }

  scale = (x, y) => {
    this.graphics.transform.scale.x = x;
    this.graphics.transform.scale.y = y;
  }

  _draw = () => {
    this.graphics.clear();
    this.graphics.beginFill(0x55335A, 1);
    this.graphics.lineStyle(4, 0xffd900, 1);
    this.graphics.moveTo(this.points[0].x, this.points[0].y);
    for (var i = 1; i < this.points.length; i++) {
      this.graphics.lineTo(this.points[i].x, this.points[i].y);
    }
    this.graphics.closePath();
    this.graphics.endFill();
  }

  _calcNearsetPoint = (mouse) => {
    let nearPointIndex = 0;
    let minDist = Number.MAX_VALUE;
    this.points.forEach((point, i) => {
      const dx = point.x - mouse.x;
      const dy = point.y - mouse.y;
      const dist = Math.sqrt((dx * dx) + (dy * dy));
      if (dist <= minDist) {
        minDist = dist;
        nearPointIndex = i;
      }
    });
    return {
      nearPointIndex,
      minDist,
      mx: mouse.x,
      my: mouse.y,
    };
  }

  _drawBezier = (points, color) => {
    this.graphics.beginFill(color, 1);
    this.graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1, jlen = points.length; i <= jlen; ++i) { // eslint-disable-line
      const p0 = points[
        i + 0 >= jlen
          ? i + 0 - jlen // eslint-disable-line
          : i + 0
      ];
      const p1 = points[
        i + 1 >= jlen
          ? i + 1 - jlen // eslint-disable-line
          : i + 1
      ];
      this.graphics.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
    }
    this.graphics.closePath();
    this.graphics.endFill();
  }

  changeShapeTo = (newShapePoints, duration = 0) => {
    this.points.forEach((point, i) => {
      TweenMax.to(
        point,
        duration,
        {
          x: newShapePoints[i][0],
          y: newShapePoints[i][1],
          originalX: newShapePoints[i][0],
          originalY: newShapePoints[i][1],
        },
      );
    });
  }

  changeBackgroundTo = (newTextureInd, duration = 0) => {
    this.Background.changeTo(newTextureInd, duration);
  }

  render = (time) => {
    this.graphics.clear();
    this._drawBezier(this.points, 0xff0000);
    this.time = time;
    this.dynamicProcessingPoints(time);
    this.Background.render();
  }
}
