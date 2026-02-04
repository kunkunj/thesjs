/**---------------------------------相机相关--------------------------------------- */

import { _CONSTANT_, _CONSTANT_CAMERA_, _CONSTANT_LIGHT_ } from '../common/constant';
import { GeometryContainer } from './geometry';

/**
 * 立方相机（CubeCamera）
 * 正交相机（OrthographicCamera）
 * 透视相机（PerspectiveCamera）
 * 立体相机（StereoCamera）
 */
export type Cameras =
  | _CONSTANT_CAMERA_.CubeCamera
  | _CONSTANT_CAMERA_.OrthographicCamera
  | _CONSTANT_CAMERA_.PerspectiveCamera
  | 'StereoCamera';

export type PerspectiveCameraType = {
  fov: number; //视野角度
  aspectRatio: number; //长宽比
  near: number; //近截面
  far: number; //远截面
};
/**
 * left — 摄像机视锥体左侧面。
 * right — 摄像机视锥体右侧面。
 * top — 摄像机视锥体上侧面。
 * bottom — 摄像机视锥体下侧面。
 * near — 摄像机视锥体近端面。
 * far — 摄像机视锥体远端面。
 */
export type OrthographicCameraType = {
  near: number;
  far: number;
};
/**
 * near -- 近剪切面的距离
 * far -- 远剪切面的距离
 * renderTarget -- The destination cube render target.
 */
export type CubeCameraType = {
  near: Number;
  far: Number;
  renderTarget: Record<keyof any, any>;
};
/**
 * 相机参数
 * type -- 相机类型
 * position -- 相机位置
 * PerspectiveCameraOption -- 透视相机参数
 * OrthographicCameraOption -- 正交相机参数
 * CubeCamera -- 立方相机
 */
export type CameraType = {
  type: Cameras;
  position: {
    x: number;
    y: number;
    z: number;
  };
  PerspectiveCameraOption?: PerspectiveCameraType;
  OrthographicCameraOption?: OrthographicCameraType;
  CubeCameraOption?: CubeCameraType;
};

/**---------------------------------光源相关--------------------------------------- */
/**
 * color -- 十六进制光照颜色
 * intensity -- 光照强度
 * distance -- 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。默认值 0.
 * decay - 沿着光照距离的衰退量。默认值 2。
 */
export type PointLightType = {
  target?: number[] & GeometryContainer;
  color?: ThreeConstruct.Color;
  intensity?: number;
  distance?: number;
  decay?: number;
  isLight?: boolean;
  penumbra?: number;
  angle?: number;
  position: [number, number, number];
};
/**
 * color -- 十六进制光照颜色
 * intensity -- 光照强度
 * width -- 光源宽度。缺省值为 10。
 * height - 光源高度。缺省值为 10。
 */
export type RectAreaLightType = {
  color?: ThreeConstruct.Color;
  intensity?: number;
  width?: number;
  height?: number;
};
/**
 * color -- 十六进制光照颜色
 * intensity -- 光照强度
 * distance -- 从光源发出光的最大距离，其强度根据光源的距离线性衰减。
 * angle - 光线散射角度，最大为Math.PI/2。
 * penumbra - 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
 * decay - 沿着光照距离的衰减量。
 */
export type SpotLightType = {
  color?: ThreeConstruct.Color;
  intensity?: number;
  distance?: number;
  angle?: number;
  penumbra?: number;
  decay?: number;
};
/**
 * 光源类型
 * 点光源（PointLight）
 * 平面光光源（RectAreaLight）
 * 聚光灯（SpotLight）
 */
export type Lights =
  | _CONSTANT_LIGHT_.PointLight
  | _CONSTANT_LIGHT_.RectAreaLight
  | _CONSTANT_LIGHT_.SpotLight;
/**
 * 光源参数
 * type -- 光源类型
 * PointLightOption -- 点光源参数
 */
export type PointType = {
  type: Lights;
  position: {
    x: number;
    y: number;
    z: number;
  };
  LightOption?: PointLightType & RectAreaLightType & SpotLightType;
};
/**
 * 环境光
 * color -- 十六进制光照颜色
 * intensity -- 光照强度
 */
export type AmbientType = {
  color?: ThreeConstruct.Color;
  intensity?: number;
};
/**---------------------------------主函数相关--------------------------------------- */
/**
 * el -- 节点
 * view -- 视野宽广，越大视野越广，默认200
 * sceneName -- 场景名称
 * camera -- 相机参数详见相机相关
 * width -- 宽
 * height -- 高
 * background -- 背景：color颜色、CubeTexture对象、Texture对象
 * backgroundBlurriness -- 模糊度：0-1
 * environment -- 每个材质默认环境贴图，如果物体有自己的环境贴图，将不会被覆盖
 * fog -- 一个fog实例定义了影响场景中的每个物体的雾的类型。默认值为nul
 * overrideMaterial -- 如果不为空，它将强制场景中的每个物体使用这里的材质来渲染。默认值为null。
 * lights -- 点光源
 * ambientLight -- 环境光
 */
export type optionsType = {
  el: HTMLElement;
  loading?: boolean;
  loadType?: _CONSTANT_.WATCHBYTE | _CONSTANT_.WATCHCOUNT;
  camera?: CameraType;
  width?: number;
  height?: number;
  view?: number;
  sceneName?: string;
  lights?: PointType;
  ambientLight?: AmbientType;
  background?: ThreeConstruct.Color | ThreeConstruct.CubeTexture | ThreeConstruct.Texture;
  backgroundBlurriness?: number;
  environment?: null | ThreeConstruct.Texture;
  fog?: null | ThreeConstruct.Fog;
  overrideMaterial?: null | ThreeConstruct.Material;
};
