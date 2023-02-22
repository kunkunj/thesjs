/// <reference path="./threeType/ThreeConstruct.d.ts" />
import { optionsType, CameraType } from './options';
import { GeometryType } from './geometry';
export interface ThesContainer {
  opt: optionsType | {};
  id: number | null;
  models: any[];
  events: { [key in 'click' | 'move' | 'leave']: 'on' | 'off' };
  add(me: ThreeConstruct.Group | ThreeConstruct.Geometry): void;
  on(type: string, cb: Function): void;
  clear(): void;
}
