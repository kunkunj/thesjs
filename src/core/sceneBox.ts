import { SceneBoxType } from '../types/thesFull';
import { GeometryContainer } from '../types/geometry';
/// <reference path="../types/threeType/ThreeConstruct.d.ts" />
export default class SceneBox implements SceneBoxType {
  scene: ThreeConstruct.Scene;
  name: string = '';
  constructor(scene: ThreeConstruct.Scene) {
    this.scene = scene;
  }
  add(me: GeometryContainer) {
    this.scene.add(me.content.thing);
  }
}
