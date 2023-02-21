/// <reference path="./threeType/ThreeConstruct.ts" />
import { optionsType, CameraType } from '../types/options';
import { GeometryType } from './geometry';
export interface ThesContainer {
  opt: optionsType | {};
  id: number | null;
  models: any[];
  add(me: ThreeConstruct.Group | ThreeConstruct.Geometry): void;
  clear(): void;
}
