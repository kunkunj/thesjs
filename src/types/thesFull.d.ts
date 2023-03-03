import { optionsType, CameraType } from './options';
import { GeometryType } from './geometry';
type CameraInitType = {
  _LOOKCENTER?: PositionType;
  UP?: PositionType;
};
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
  cameraInit: CameraInitType;
  camera: ThreeConstruct.Camera;
  add(me: ThreeConstruct.Group | ThreeConstruct.Geometry): void;
}
export interface ParentType {
  scale(th: ThesContainer, dir: [number, number, number]): void;
}
export type PositionType = {
  x: number;
  y: number;
  z: number;
};
export type LoaderTypeOption = {
  _DEP_KEY: {
    _IS_DEPED: boolean;
    _IS_FINISHED: boolean;
    _SIZE: number;
    _CURRENT: number;
  };
};
