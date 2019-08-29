import Scene from './js/Scene';
import { figures } from './js/figures.js';

let nextShapeInd = 1;
let nextbackgroundInd = 1;
window.onload = () => {
  const scene = new Scene(figures);
  document.getElementById('chngeShape').addEventListener('click', () => {
    scene.changeShapeTo(nextShapeInd);
    nextShapeInd++;
    nextShapeInd %= 2;
  })
  document.getElementById('changeBackground').addEventListener('click', () => {
    scene.changeBackgroundTo(nextbackgroundInd);
    nextbackgroundInd++;
    nextbackgroundInd %= 7;
  })

  document.getElementById('startDynamicMode').addEventListener('click', () => {
    scene.startDynamicMode(500);
  })
}
