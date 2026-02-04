import { _CONSTANT_CAMERA_, _CONSTANT_LIGHT_ } from '../common/constant';
import { optionsType, CameraType, PointType, AmbientType } from '../../types/options';
//相机默认参数
export const defaultCamera: CameraType = {
  type: _CONSTANT_CAMERA_.OrthographicCamera,
  position: {
    x: 200,
    y: 300,
    z: 200,
  },
  OrthographicCameraOption: {
    near: 1,
    far: 1000,
  },
};
//灯光默认参数
export const defaultLight: PointType = {
  type: _CONSTANT_LIGHT_.PointLight,
  position: {
    x: 400,
    y: 200,
    z: 300,
  },
};
//环境光默认参数
export const defaultAmbient: AmbientType = {
  color: 'rgb(255,144,144)',
};
export const defaultOption: optionsType = {
  el: document.body,
  view: 200,
  sceneName: '',
  camera: defaultCamera,
  width: window?.innerWidth || 1000,
  height: window?.innerHeight || 1000,
  // lights: defaultLight,
  // ambientLight: defaultAmbient,
  background: 'rgb(0,0,0)',
};
