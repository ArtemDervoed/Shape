import * as PIXI from 'pixi.js';
import { TweenMax } from 'gsap';

export default class TextureRender {
  constructor(texture, parentContainer) {
    this.texture = texture;
    this.container = new PIXI.Container();
    this.Texture = new PIXI.Graphics();
    this.container.addChild(this.Texture);
    parentContainer.addChild(this.container);
  }

  hide = (duration = 0, calback) => {
    this.isAnimate = true;
    TweenMax.to(
      this.Texture,
      duration,
      {
        alpha: 0,
        onComplete: () => {
          calback();
        }
      });
  }

  setTexture = (newTexture) => {
    this.texture = newTexture;
    this.Texture.alpha = 1;
  }

  render = () => {
    this.Texture.clear();
    if (this.texture.type === 'image') {
      const offsetX = (this.texture.fill.orig.width - window.innerWidth) / 2;
      const offsetY = (this.texture.fill.orig.height - window.innerHeight) / 2;
      this.Texture.beginTextureFill(this.texture.fill);
      this.Texture.drawRect(
        -offsetX,
        -offsetY,
        this.texture.fill.orig.width,
        this.texture.fill.orig.height,
      );
      this.Texture.pivot.set(offsetX, offsetY)
    }
    if (this.texture.type === 'color') {
      this.Texture.pivot.set(0, 0)
      this.Texture.beginFill(this.texture.fill);
      this.Texture.drawRect(0, 0, window.innerWidth, window.innerHeight);
    }
    this.Texture.endFill();
  }
}
