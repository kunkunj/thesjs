/**
 * 常量
 * EVENTON -- 事件已注册
 * EVENTOFF -- 事件关闭
 * EVENTCLICK -- 点击
 * EVENTMOVE -- 拖动
 * EVENTOVER -- 移入
 * EVENTLEAVE -- 移开
 * EVENTDOWN -- 按下
 * EVENTUP -- 松开
 * EVENTCHANGE -- change事件
 * DEFAULTSCENENAME -- 默认scene前缀
 * UNIQKEY -- 查找索引
 * SCENEIDNAME -- 设置场景id的name
 * LOADED -- 加载完成
 */
export enum _CONSTANT_ {
  EVENTON = 'on',
  EVENTOFF = 'off',
  EVENTCLICK = 'click',
  EVENTMOVE = 'move',
  EVENTOVER = 'over',
  EVENTLEAVE = 'leave',
  EVENTDOWN = 'down',
  EVENTUP = 'up',
  EVENTCHANGE = 'change',
  DEFAULTSCENENAME = 'scene',
  UNIQKEY = 'uuid',
  SCENEIDNAME = 'scene',
  GEOMETRYIDNAME = 'geometry',
  GROUPIDNAME = 'group',
  POPUPIDNAME = 'popup',
  LOADED = 'loaded',
  ONPROGRESS = 'progress',
  WATCHBYTE = 'byte',
  WATCHCOUNT = 'count',
  CURVE = 'curve'
}

/**
 * 事件
 */
export type _Events =
  | _CONSTANT_.EVENTCLICK
  | _CONSTANT_.EVENTMOVE
  | _CONSTANT_.EVENTLEAVE
  | _CONSTANT_.EVENTDOWN
  | _CONSTANT_.EVENTUP
  | _CONSTANT_.EVENTOVER
  | _CONSTANT_.LOADED
  | _CONSTANT_.ONPROGRESS;

/**
 * 相机
 */
export enum _CONSTANT_CAMERA_ {
  CubeCamera = 'CubeCamera',
  OrthographicCamera = 'OrthographicCamera',
  PerspectiveCamera = 'PerspectiveCamera',
}
/**
 * 光源
 */
export enum _CONSTANT_LIGHT_ {
  PointLight = 'PointLight',
  RectAreaLight = 'RectAreaLight',
  SpotLight = 'SpotLight',
}
/**
 * 模型
 */
export enum _CONSTANT_GEOMETRY_ {
  BoxGeometry = 'box',
  CircleGeometry = 'circle',
  ConeGeometry = 'cone',
  CylinderGeometry = 'cylinder',
  PlaneGeometry = 'plane',
  SphereGeometry = 'sphere',
}
/**
 * 材质
 */
export enum _CONSTANT_MATERAIL_ {
  MeshBasicMaterial = 'basic',
  MeshLambertMaterial = 'lamber',
  MeshSpriteMaterial = 'sprite'
}

/**
 * bus events
 */

export enum _CONSTANT_BUS_ {
  UPDATE_SCENE = 'UPDATE_SCENE',
  ADD_POPUP = 'ADD_POPUP',
}

/**
 * bus component load
 */
export enum _CONSTANT_LOAD_ {
  SCENE = _CONSTANT_.EVENTOFF,
}
