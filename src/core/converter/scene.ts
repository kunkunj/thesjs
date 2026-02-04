import CreateThree from '../../common/three';
import { optionsType } from '../../../types/options';
import { isArray } from 'loadsh';
import * as THREE from 'three';
import { loadFinish } from '../../common/utils';
const isColor = (color: ThreeConstruct.Color) => {
  return color.indexOf('rgb') == -1 ? false : true;
};
export default (opt: optionsType, fn: Function): ThreeConstruct.Scene => {
  const scene: ThreeConstruct.Scene = CreateThree.createScene();
  if (opt.background && isColor(opt.background)) {
    scene.background = opt.background ? CreateThree.createColor(opt.background) : null;
    loadFinish(scene, fn);
  } else if (isArray(opt.background)) {
    scene.background = CreateThree.createCubeTextureLoader(opt.background, () => {
      loadFinish(scene, fn);
    });
  } else if (opt.background && !isColor(opt.background) && !isArray(opt.background)) {
    scene.background = CreateThree.createTextureLoader(opt.background, () => {
      loadFinish(scene, fn);
    });
  }
  scene.backgroundBlurriness = opt.backgroundBlurriness || 0;
  scene.environment = opt.environment || null;
  scene.fog = opt.fog || null;
  scene.overrideMaterial = opt.overrideMaterial || null;
  return scene;
};
