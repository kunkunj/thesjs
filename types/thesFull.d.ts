import { optionsType, CameraType } from './options';
import { GeometryType, MaterialList, MaterialType } from './geometry';
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
  stats: Record<keyof any, any>;
  add(me: GeometryContainer, sceneBoxId: number): boolean;
  events: { [key in 'click' | 'move' | 'leave']: 'on' | 'off' };
  on(type: string, cb: Function): void;
  dispose(): void;
}
export interface SceneBoxType {
  scene: ThreeConstruct.Scene;
  modelBox: GeometryContainer[];
  name: string;
  cid: number;
  opt: optionsType | null;
  cameraInit: CameraInitType;
  camera: ThreeConstruct.Camera;
  add(me: ThreeConstruct.Group | ThreeConstruct.Geometry): void;
  getCenter(): PositionType | undefined;
  setCenter(_LOOKCENTER: PositionType): void;
  setCameraUp(up: PositionType): void;
  dispose(): void;
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
export type HDRBackground = {
  url: string;
  loading?: boolean;
  progress?: Function;
  loaded?: Function;
};
export type FogType = {
  color: ThreeConstruct.Color;
  near: number;
  far: number;
};
export type ShapeBoxType = {
  path: Array<PositionType>;
  radius: number;
  material: MaterialList;
  materialOption: MaterialType;
};
export type HtmlOptionType = {
  html: Node;
  width: number;
  height: number;
  material: MaterialList;
  materialOption: MaterialType;
};
export type SpriteOptionType = {
  url: string;
  material: string;
  materialOption: MaterialType;
};
export type PointLightType = {
  color?: string;
  intensity?: number;
  distance?: number;
  decay?: number;
}
export type PassContinar = {
  id: number;
  setLightStrength(num: number): void;
  setLightGlow(num: number): void;
  setLightThickness(num: number): void;
  setPulsePeriod(num: number): void;
  setColor(color: string): void;
  push(thing: GeometryContainer): void;
  replace(arr: Array<GeometryContainer>): void;
  open(): void;
  close(): void;
  dispose(): void;
}

export type ArcCurveType = {
  position: [number,number,number];
  pointNum: number;
  xOffset: number;
  yOffset: number;
  color: string;
  startAngle: number;
  endAngle: number;
  clockwise: boolean;
  rotation: number;
  height: number;
}