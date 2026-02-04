import { optionsType } from './types/options';
import {
  SceneBoxType,
  HDRBackground,
  PositionType,
  ShapeBoxType,
  HtmlOptionType,
  SpriteOptionType,
  PassContinar,
  FogType,
} from './types/thesFull';
import {
  GeometryOptionType,
  GeometryContainer,
  TextGeometryType,
  LineGeometryType,
  LoaderType,
  TipType,
  TubeGeometryType,
} from './types/geometry';
import { PopupContainer, PopupType } from './types/popup';
import { PluginContainer } from './types/plugin';
type Tip = {
  dispose(): void;
};
type GpsCenter = {
  isGps: boolean;
  GPScenter: { lon: number; lat: number; height: number };
  MercatorCenter: PositionType;
};
declare class Thes {
  constructor(opt: optionsType);
  sceneBox: SceneBoxType;
  scenes: SceneBoxType[];
  rotateToCenter: boolean;
  rotateToCenterSpeed: number;
  static getDefaultCameraOptions: CameraType;
  static getDefaultLightOptions: PointType;
  static getDefaultAmbientOptions: AmbientType;
  static createGeometry(opt: GeometryOptionType): GeometryContainer;
  static createText(opt: TextGeometryType): Promise<GeometryContainer>;
  static createLine(opt: LineGeometryType): GeometryContainer;
  static createPopup(opt: PopupType): PopupContainer;
  static createLoader(opt: LoaderType): Promise<GeometryContainer>;
  static createVector3(position: [number, number, number]): void;
  static createFlame(url: string): GeometryContainer;
  static createTip(opt: TipType): Tip;
  static createCurve(opt: LineGeometryType): GeometryContainer;
  static createState(): void;
  static createBoxByShape(opt: ShapeBoxType): GeometryContainer;
  static createtTextureAnimation(opt: TubeGeometryType): GeometryContainer;
  static creatHtml(opt: HtmlOptionType): GeometryContainer;
  static createSprite(opt: SpriteOptionType): GeometryContainer;
  static initPlugin(th: Thes): PluginContainer;
  static createSpotLight(lightOpt: PointLightType & { helper?: boolean }, th: Thes): GeometryContainer;
  initbBreatheLight(): PassContinar;
  createScene(opt: optionsType): SceneBoxType;
  useScene(opt: SceneBoxType): void;
  add(me: GeometryContainer, sceneBoxId: number): boolean;
  setHDRbackground(obj: HDRBackground): void;
  setFPS(me: GeometryContainer): void;
  on(type: keyof EventsType, cb: Function): void;
  off(type: keyof EventsType): void;
  flyTo(position: { x: number; y: number; z: number; time?: number }): void;
  setFog(opt: FogType, id: number): void;
  lookAt(me: GeometryContainer | { position: [number, number, number] }): void;
  moveAt(me: GeometryContainer, view?: number, distance?: number, cb?: Function): void;
  getCenter(): PositionType | undefined;
  setCenter(_LOOKCENTER: PositionType): void;
  setCameraUp(up: PositionType): void;
  setGPScenter(position: PositionType & { height: number }): void;
  getGPSCenter(): GpsCenter;
  closeGPScenter(): void;
  dispose(): void;
}
export = Thes;
