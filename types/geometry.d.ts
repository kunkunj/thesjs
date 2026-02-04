/**---------------------------------材质相关--------------------------------------- */

import { _CONSTANT_GEOMETRY_, _CONSTANT_MATERAIL_ } from '../common/constant';
import { PointType } from './options';
import { LoaderTypeOption, PositionType, ThesContainer } from './thesFull';

/**
 * MeshBasicMaterial -- 基础网格材质，不受光照影响的材质
 * MeshLambertMaterial -- Lambert网格材质，与光照有反应，漫反射
 * MeshPhongMaterial -- 高光Phong材质,与光照有反应
 * MeshStandardMaterial -- PBR物理材质，相比较高光Phong材质可以更好的模拟金属、玻璃等效果
 */
export type MaterialList =
  | _CONSTANT_MATERAIL_.MeshBasicMaterial
  | _CONSTANT_MATERAIL_.MeshLambertMaterial
  | 'MeshPhongMaterial'
  | 'MeshStandardMaterial';

/**
 * 所有模型类型
 * geometry -- 几何体
 */
export type Geometry = 'geometry';

/**---------------------------------普通几何体--------------------------------------- */
/**
 * 几何体集合
 * BoxGeometry -- 正方体
 * CircleGeometry -- 平面圆
 * ConeGeometry -- 圆锥
 * CylinderGeometry -- 圆柱
 * PlaneGeometry -- 平面方行
 * SphereGeometry -- 球
 */
export type GeometryList =
  | _CONSTANT_GEOMETRY_.BoxGeometry
  | _CONSTANT_GEOMETRY_.CircleGeometry
  | _CONSTANT_GEOMETRY_.ConeGeometry
  | _CONSTANT_GEOMETRY_.CylinderGeometry
  | _CONSTANT_GEOMETRY_.PlaneGeometry
  | _CONSTANT_GEOMETRY_.SphereGeometry;
// | 'TextGeometry';
/**
 * 文本
 * content -- 内容
 * font — THREE.Font的实例。
 * size — Float。字体大小，默认值为100。
 * height — Float。挤出文本的厚度。默认值为50。
 * curveSegments — Integer。（表示文本的）曲线上点的数量。默认值为12。
 * bevelEnabled — Boolean。是否开启斜角，默认为false。
 * bevelThickness — Float。文本上斜角的深度，默认值为20。
 * bevelSize — Float。斜角与原始文本轮廓之间的延伸距离。默认值为8。
 * bevelSegments — Integer。斜角的分段数。默认值为3。
 */
export type TextGeometryType = {
  content: string;
  style?: {
    font: ThreeConstruct.Font;
    size?: number;
    height?: number;
    curveSegments?: number;
    bevelEnabled?: boolean;
    bevelThickness?: number;
    bevelSize?: number;
    bevelSegments?: number;
  };
};
/**
 * 虚线
 * dashSize -- 虚线的大小，是指破折号和间隙之和。默认值为 3。
 * gapSize -- 间隙的大小，默认值为 1。
 * isLineDashedMaterial -- Read-only flag to check if a given object is of type LineDashedMaterial.
 * scale -- 线条中虚线部分的占比。默认值为 1。
 */
export type DashedLine = {
  dashSize?: number;
  gapSize?: number;
  isLineDashedMaterial?: boolean;
  scale?: number;
};
/**
 * 线条
 * point -- 点数组，[[x,y,z],[x,y,z]]
 * color -- 线颜色
 * isCover -- 曲线连接
 * type -- 线类型 solid（实线）dashed（虚线）
 * linewidth -- 线宽
 * linecap -- 定义线两端的样式。可选值为 'butt', 'round' 和 'square'。
 * linejoin -- 定义线连接节点的样式。可选值为 'round', 'bevel' 和 'miter'。默认值为 'round'。
 */
export type LineGeometryType = {
  points: Array<number[]>;
  type: 'solid' | 'dashed';
  pointNum?: number;
  isCover?: boolean;
  color?: ThreeConstruct.Color;
  linewidth?: number;
  linecap?: 'butt' | 'round' | 'square';
  linejoin?: 'round' | 'bevel' | 'miter';
  isBezier?: boolean;
} & DashedLine;
/**
 * 正方体参数
 * width — X轴上面的宽度，默认值为1。
 * height — Y轴上面的高度，默认值为1。
 * depth — Z轴上面的深度，默认值为1。
 * widthSegments — （可选）宽度的分段数，默认值是1。
 * heightSegments — （可选）高度的分段数，默认值是1。
 * depthSegments — （可选）深度的分段数，默认值是1。
 */
export type BoxGeometryType = {
  width: number;
  height: number;
  depth: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
};
/**
 * 平面圆
 * radius — 圆形的半径，默认值为1
 * segments — 分段（三角面）的数量，最小值为3，默认值为32。
 * thetaStart — 第一个分段的起始角度，默认为0。（three o'clock position）
 * thetaLength — 圆形扇区的中心角，通常被称为“θ”（西塔）。默认值是2*Pi，这使其成为一个完整的圆。
 */
export type CircleGeometryType = {
  radius: number;
  segments: number;
  thetaStart: number;
  thetaLength?: number;
};
/**
 * 圆锥参数
 * radius — 圆锥底部的半径，默认值为1。
 * height — 圆锥的高度，默认值为1。
 * radialSegments — 圆锥侧面周围的分段数，默认为32。
 * heightSegments — 圆锥侧面沿着其高度的分段数，默认值为1。
 * openEnded — 一个Boolean值，指明该圆锥的底面是开放的还是封顶的。默认值为false，即其底面默认是封顶的。
 * thetaStart — 第一个分段的起始角度，默认为0。（three o'clock position）
 * thetaLength — 圆锥底面圆扇区的中心角，通常被称为“θ”（西塔）。默认值是2*Pi，这使其成为一个完整的圆锥
 */
export type ConeGeometryType = {
  radius: number;
  height: number;
  radialSegments: number;
  heightSegments?: number;
  openEnded?: boolean;
  thetaStart?: number;
  thetaLength?: number;
};
/**
 * 圆柱参数
 * radiusTop — 圆柱的顶部半径，默认值是1。
 * radiusBottom — 圆柱的底部半径，默认值是1。
 * height — 圆柱的高度，默认值是1。
 * radialSegments — 圆柱侧面周围的分段数，默认为32。
 * heightSegments — 圆柱侧面沿着其高度的分段数，默认值为1。
 * openEnded — 一个Boolean值，指明该圆锥的底面是开放的还是封顶的。默认值为false，即其底面默认是封顶的。
 * thetaStart — 第一个分段的起始角度，默认为0。（three o'clock position）
 * thetaLength — 圆柱底面圆扇区的中心角，通常被称为“θ”（西塔）。默认值是2*Pi，这使其成为一个完整的圆柱。
 */
export type CylinderGeometryType = {
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
  thetaStart?: number;
  thetaLength?: number;
};
/**
 * 平面参数
 * width — 平面沿着X轴的宽度。默认值是1。
 * height — 平面沿着Y轴的高度。默认值是1。
 * widthSegments — （可选）平面的宽度分段数，默认值是1。
 * heightSegments — （可选）平面的高度分段数，默认值是1。
 */
export type PlaneGeometryType = {
  width: number;
  height: number;
  widthSegments?: number;
  heightSegments?: number;
};
/**
 * 球参数
 * radius — 球体半径，默认为1。
 * widthSegments — 水平分段数（沿着经线分段），最小值为3，默认值为32。
 * heightSegments — 垂直分段数（沿着纬线分段），最小值为2，默认值为16。
 * phiStart — 指定水平（经线）起始角度，默认值为0。
 * phiLength — 指定水平（经线）扫描角度的大小，默认值为 Math.PI * 2。
 * thetaStart — 指定垂直（纬线）起始角度，默认值为0。
 * thetaLength — 指定垂直（纬线）扫描角度大小，默认值为 Math.PI。
 */
export type SphereGeometryType = {
  radius: number;
  widthSegments?: number;
  heightSegments?: number;
  phiStart?: number;
  phiLength?: number;
  thetaStart?: number;
  thetaLength?: number;
};
/**
 * 材质参数
 * color -- 颜色
 * envMap -- 环境贴图
 * fog -- 材质是否受雾影响
 * map -- 颜色贴图
 * wireframe -- 线框模式
 * side -- 显示模式，MeshLambertMaterial有效
 * transparent -- 是否开启透明度
 * opacity -- 透明度
 */
export type MaterialType = {
  color?: ThreeConstruct.Color;
  envMap?: ThreeConstruct.Texture;
  fog?: boolean;
  map?: ThreeConstruct.Texture;
  wireframe?: boolean;
  transparent?: boolean;
  opacity?: number;
  side?: Record<keyof any, any>;
  isCanvas?: boolean;
};
/**
 * geometry -- 几何体类型
 * BoxGeometryOption -- 正方体参数
 * CircleGeometryOption -- 平面圆参数
 * ConeGeometryType -- 圆锥
 */
export type GeometryOptionType = {
  geometry: GeometryList;
  material: MaterialList;
  position: number[];
  geometryOption?: BoxGeometryType &
    CircleGeometryType &
    CylinderGeometryType &
    PlaneGeometryType &
    SphereGeometryType &
    TextGeometryType;
  materialOption?: MaterialType | MaterialType[];
  // BoxGeometryOption?: BoxGeometryType;
  // CircleGeometryOption?: CircleGeometryType;
  // ConeGeometryOption?: ConeGeometryType;
  // CylinderGeometryOption?: CylinderGeometryType;
  // PlaneGeometryOption?: PlaneGeometryType;
  // SphereGeometryOption?: SphereGeometryType;
};
/**
 * 新增参数类型
 */
export type GeometryType = {
  type: Geometry;
  geometryOption?: GeometryOptionType;
};
/**
 * 几何体参数
 */
export interface GeometryContainer {
  cid: number;
  content: ContentType;
  PARENT_THES: Record<keyof any, any> | null;
  isDrag: boolean;
  isMove: boolean;
  position: number[];
  opt: GeometryOptionType | undefined;
  _ONMOVE_?: Function | null;
  _IS_FPS_?: boolean;
  _FPS_ONMOVE?: Record<keyof any, any>;
  lastParent: any;
  setColor(color: ThreeConstruct.Color): void;
  setPosition(position: [number, number, number]): void;
  _SETHOVER(flag: boolean): void;
  moveTo(
    position: {
      x: number;
      y: number;
      z: number;
      time?: number;
      deg?: number;
      degTime?: number;
      direction: 'x' | 'y' | 'z';
    } & {
      x: number;
      y: number;
      z: number;
      time?: number;
      deg?: number;
      degTime?: number;
      direction: 'x' | 'y' | 'z';
    }[],
    onMove?: Function,
    onEnded?: Function
  ): void;
  _MOVEAT_(fn: Function): void;
  closeShadow(content?: string): void;
  openShadow(content?: string): void;
  setShadowAngle(shadow: number): void;
  setLightTargetPosition(position: number[]): void;
  bind(me: GeometryContainer): void;
  moveOnLine(line: any, time?: { [index: number]: number }): void;
  unBind(me: GeometryContainer): void;
  onKey(keyName: string, cb: Function): void;
  offKey(keyName: string): void;
  setOpacity(num: number): void;
  scale(position: [number, number, number]): void;
  translateX(num: number): void;
  translateY(num: number): void;
  translateZ(num: number): void;
  rotateX(deg: number): void;
  rotateY(deg: number): void;
  rotateZ(deg: number): void;
  rotateXTo(deg: number, time?: number): Record<string, any>;
  rotateYTo(deg: number, time?: number): Record<string, any>;
  rotateZTo(deg: number, time?: number): Record<string, any>;
  center(): void;
  delete(): void;
  getSize(): { max: { x: number; y: number; z: number }; min: { x: number; y: number; z: number } };
  initDrag(camera: ThreeConstruct.Camera, renderer: ThreeConstruct.Renderer): void;
}
/**
 *
 */
export type ContentType = {
  thing: ThreeConstruct.Mesh | ThreeConstruct.Line;
  geo: ThreeConstruct.Geometry;
  mesh?: ThreeConstruct.Mesh;
  group?: ThreeConstruct.Group;
  points?: Array<number[]>;
  curve?: Record<keyof any, any>;
  light?: Record<keyof any, any>;
  helper?: any;
  targetObject?: Record<keyof any, any>;
  mat: ThreeConstruct.Material | ThreeConstruct.Material[];
  _DEP_KEY?: LoaderTypeOption._DEP_KEY;
};
export type LineContainer = {
  id: number;
  content: ContentType;
  opt: LineGeometryType | undefined;
};
/**
 * loader
 * type -- 文件类型
 * url -- 文件地址
 * mtlurl -- obj时的材质模型
 * loaderOption:{
 *  color -- 颜色
 *  position -- 位置
 * }
 */
export type LoaderList = 'obj' | 'mmd' | 'gltf' | 'fbx';
export type LoaderOptionType = {
  color?: string;
  position?: [number, number, number];
};
export type LoaderType = {
  type: LoaderList;
  url: string;
  mtlUrl?: string;
};

export type TsxType = {
  tag: 'div' | 'a' | 'img';
  attrs?: Record<string, any>;
  content?: string;
  children?: TsxType[];
  on?: {
    type?: string;
    fn?: Function;
  }[];
};

export type TipType = {
  content?: string;
  mask?: boolean;
  cancleText?: string;
  cancleBackground?: string;
  cancleColor?: string;
  sureText?: string;
  sureBackground?: string;
  sureColor?: string;
  onSure?: Function;
  onCancle?: Function;
  showSure?: boolean;
  showCancle?: boolean;
  showTime?: number;
};
/**
 * segments -- 分段数，默认值为64。
 * radius — Float - 管道的半径，默认值为1。
 * radialSegments — Integer - 管道横截面的分段数目，默认值为8。
 * closed — Boolean 管道的两端是否闭合，默认值为false。
 * repeatX-x方向修正值
 * repeatY-y方向上的修正值
 * speed - 速度 1-20
 */
export type TubeGeometryType = {
  url: string;
  segments?: number;
  radius?: number;
  radialSegments?: number;
  closed?: boolean;
  x?: number;
  y?: number;
  repeatX: number;
  repeatY: number;
  speed: number;
  animationId?: number;
  width?: number;
  height?: number;
};
export type ShadowSetType = {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
};
