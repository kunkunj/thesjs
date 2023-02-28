import { SceneBoxType } from '../types/thesFull';
import { GeometryContainer } from '../types/geometry';
import { optionsType } from '../types/options';
import { setId } from '../common/utils';
export default class SceneBox implements SceneBoxType {
  scene: ThreeConstruct.Scene;
  name: string = '';
  cid: number = -1;
  opt: optionsType | null = null;
  camera:ThreeConstruct.Camera
  constructor(scene: ThreeConstruct.Scene) {
    setId('scene', this);
    this.scene = scene;
  }
  add(me: GeometryContainer) {
    this.scene.add(me.content.thing);
  }
}
