import { optionsType, CameraType } from './options';
import { GeometryType } from './geometry';
export interface ThesContainer {
  opt: optionsType;
  id: number | null;
  camera: ThreeConstruct.Camera;
  renderer: ThreeConstruct.Renderer;
  sceneBox: SceneBoxType;
  models: any[];
  add(me: GeometryContainer, sceneBoxId: number): boolean;
  events: { [key in 'click' | 'move' | 'leave']: 'on' | 'off' };
  on(type: string, cb: Function): void;
  clear(): void;
}
export interface SceneBoxType {
  scene: ThreeConstruct.Scene;
  name: string;
  cid: number;
  opt: optionsType | null;
  camera: ThreeConstruct.Camera;
  add(me: ThreeConstruct.Group | ThreeConstruct.Geometry): void;
}
export interface ParentType {
  scale(th: ThesContainer, dir: [number, number, number]): void;
}
