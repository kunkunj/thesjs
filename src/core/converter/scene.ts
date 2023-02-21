import CreateThree from '../../common/three';
import { optionsType } from '../../types/options';
/// <reference path="./threeType/ThreeConstruct.d.ts" />
export default (opt: optionsType): ThreeConstruct.Scene => {
  const scene: ThreeConstruct.Scene = CreateThree.createScene();
  scene.background = opt.background ? CreateThree.createColor(opt.background) : null;
  scene.backgroundBlurriness = opt.backgroundBlurriness || 0;
  scene.environment = opt.environment || null;
  scene.fog = opt.fog || null;
  scene.overrideMaterial = opt.overrideMaterial || null;
  return scene;
};
