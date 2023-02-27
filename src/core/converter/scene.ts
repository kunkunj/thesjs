import CreateThree from '../../common/three';
import { optionsType } from '../../types/options';
import { isArray } from 'loadsh';
import * as THREE from 'three';
const isColor = (color: ThreeConstruct.Color) => {
  return color.indexOf('rgb') == -1 ? false : true;
};
export default (opt: optionsType): ThreeConstruct.Scene => {
  const scene: ThreeConstruct.Scene = CreateThree.createScene();
  if (opt.background && isColor(opt.background)) {
    console.log(1)
    scene.background = opt.background ? CreateThree.createColor(opt.background) : null;
  } else if (isArray(opt.background)) {
    //此处不需要加载进度监听
    scene.background =  CreateThree.createCubeTextureLoader(opt.background);
  } else if (opt.background && !isColor(opt.background) && !isArray(opt.background)) {
    console.log(3)
    //此处不需要加载进度监听
    scene.background = CreateThree.createTextureLoader(opt.background);
  }
  scene.backgroundBlurriness = opt.backgroundBlurriness || 0;
  scene.environment = opt.environment || null;
  scene.fog = opt.fog || null;
  scene.overrideMaterial = opt.overrideMaterial || null;
  return scene;
};
