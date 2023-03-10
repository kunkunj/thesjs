import CreateThree from '../../common/three';
import Tween from '@tweenjs/tween.js';
import { _UPDATE_HOOK_ } from '../thes';
export default (
  el: Element,
  width: number,
  height: number,
  scene: ThreeConstruct.Scene,
  camera: ThreeConstruct.Camera,
): ThreeConstruct.Renderer => {
  const renderer: ThreeConstruct.Renderer = CreateThree.createRenderer({ antialias: true });
  renderer.setSize(width, height);
  el.appendChild(renderer.domElement);
  
  return renderer;
};
