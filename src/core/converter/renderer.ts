import CreateThree from '../../common/three';
import Tween from '@tweenjs/tween.js';
/// <reference path="./threeType/ThreeConstruct.d.ts" />
export default (
  el: Element,
  width: number,
  height: number,
  scene: ThreeConstruct.Scene,
  camera: ThreeConstruct.Camera
): ThreeConstruct.Renderer => {
  const renderer: ThreeConstruct.Renderer = CreateThree.createRenderer();
  renderer.setSize(width, height);
  el.appendChild(renderer.domElement);
  function render() {
    Tween.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
  return renderer;
};
