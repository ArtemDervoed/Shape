import * as PIXI from 'pixi.js';

import TextureRender from './TextureRender.js';

export default class Background {
  constructor(collecion, container) {
    this.collecion = collecion;
    this.container = container;
    this.content = null;
    this.loader = new PIXI.Loader();
    this.isLoaded = false;

    this.curent = 0;
    this.isAnimate = false;
  }

  setInitImage = (newTextureInd) => {
    this.lowerTexture = new TextureRender(this.collecion[newTextureInd], this.container);
    this.upperTexture = new TextureRender(this.collecion[newTextureInd], this.container);
  }

  changeTo = (newTextureInd, duration = 0) => {
    if (this.isAnimate) return;

    this.isAnimate = true;
    this.lowerTexture.setTexture(this.collecion[newTextureInd]);
    this.upperTexture.hide(
      duration,
      () => {
        this.upperTexture.setTexture(this.collecion[newTextureInd]);
        this.isAnimate = false;
      }
    );
  }

  handleImgsLoaded = (loader, resource) => {
    this.mergeTexturesAndColors();
    this.setInitImage(0);
    this.isLoaded = true;
  }

  mergeTexturesAndColors = () => {
    this.collecion.forEach(item => {
      for (var i in this.loader.resources) {
        if (this.loader.resources.hasOwnProperty(i)) {
          if (this.loader.resources[i].url === item.fill) {
            item.fill = this.loader.resources[i].texture;
          }
        }
      }
    });
  }

  preload = () => {
    this.collecion.forEach((item) => {
      if (item.type === 'image') {
        this.loader.add(item.aliase, item.fill);
      }
    });
    this.loader.load(this.handleImgsLoaded);
  }

  render = () => {
    if (this.isLoaded) {
      this.lowerTexture.render();
      this.upperTexture.render();
    }
  }
}
