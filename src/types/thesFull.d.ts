/// <reference path="./threeType/ThreeConstruct.d.ts" />
import { optionsType, CameraType } from './options';
import { GeometryType } from './geometry';
export interface ThesContainer {
  opt: optionsType | {};
  id: number | null;
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
  add(me: ThreeConstruct.Group | ThreeConstruct.Geometry): void;
}
