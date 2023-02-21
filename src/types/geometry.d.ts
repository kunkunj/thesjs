/// <reference path="./threeType/ThreeConstruct.d.ts" />
/**---------------------------------材质相关--------------------------------------- */
/**
 * MeshBasicMaterial -- 基础网格材质，不受光照影响的材质
 * MeshLambertMaterial -- Lambert网格材质，与光照有反应，漫反射
 * MeshPhongMaterial -- 高光Phong材质,与光照有反应
 * MeshStandardMaterial -- PBR物理材质，相比较高光Phong材质可以更好的模拟金属、玻璃等效果
 */
export type MaterialList =
  | 'MeshBasicMaterial'
  | 'MeshLambertMaterial'
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
  | 'BoxGeometry'
  | 'CircleGeometry'
  | 'ConeGeometry'
  | 'CylinderGeometry'
  | 'PlaneGeometry'
  | 'SphereGeometry';
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
  depthetaStartth: number;
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
  depth: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
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
 */
export type MaterialType = {
  color?: ThreeConstruct.Color;
  envMap?: ThreeConstruct.Texture;
  fog?: boolean;
  map?: ThreeConstruct.Texture;
  wireframe?: boolean;
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
  materialOption?: MaterialType;
  BoxGeometryOption?: BoxGeometryType;
  CircleGeometryOption?: CircleGeometryType;
  ConeGeometryOption?: ConeGeometryType;
  CylinderGeometryOption?: CylinderGeometryType;
  PlaneGeometryOption?: PlaneGeometryType;
  SphereGeometryOption?: SphereGeometryType;
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
  id: number;
  content: ThreeConstruct.Mesh;
  opt: GeometryOptionType;
  setColor(color: ThreeConstruct.Color): void;
}
/**
 *
 */
export type ContentType = {
  thing: ThreeConstruct.Mesh;
  geo: ThreeConstruct.Geometry;
  mat: ThreeConstruct.Material;
};
