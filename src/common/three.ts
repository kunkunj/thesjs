import * as THREE from 'three';

import { OrbitControls } from '../controls/OrbitControls.js';
import { throwError } from './utils';
//场景
const createScene = () => new THREE.Scene();
//点光源
const createLight = (...arg: any) => new THREE.PointLight(...arg);
//环境光
const createAmbient = (...arg: any) => new THREE.AmbientLight(...arg);
//正交相机
const createOrthographicCamera = (...arg: any) => new THREE.OrthographicCamera(...arg);
//立方相机
const createCubeCamera = (...arg: any) => new THREE.CubeCamera(...arg);
//透视相机
const createPerspectiveCamera = (...arg: any) => new THREE.PerspectiveCamera(...arg);
//立体相机
const createStereoCamera = (...arg: any) => new THREE.StereoCamera(...arg);
//渲染器
const createRenderer = () => new THREE.WebGLRenderer();
//颜色
const createColor = (color: string) => {
  if (color.indexOf('rgb') == -1) {
    throwError('颜色错误！颜色必须是rgb颜色。');
  }
  return new THREE.Color(color);
};
//点光源
const createPointLight = (...arg: any) => new THREE.PointLight(...arg);
//平面光光源
const createRectAreaLight = (...arg: any) => new THREE.RectAreaLight(...arg);
//环境光
const createAmbientLight = (...arg: any) => new THREE.AmbientLight(...arg);
//控件对象
const createOrbitControls = (...arg: any) => new OrbitControls(...arg);
//创建组
const createGroup= () => new THREE.Group();
const createMa = (scene: any) => {
  const geometry = new THREE.PlaneGeometry(100, 100,2,2);
  const material = new THREE.MeshBasicMaterial({ color: createColor('rgb(255,255,255)'), side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
};
//正方体
const createBoxGeometry = (...arg: any) => new THREE.BoxGeometry(...arg);
//基础材质
const createMeshBasicMaterial = (...arg: any) => new THREE.MeshBasicMaterial(...arg);
//mesh
const createMesh  = (...arg: any) => new THREE.Mesh(...arg);
export default {
  THREE,
  createScene,
  createLight,
  createAmbient,
  createOrthographicCamera,
  createCubeCamera,
  createPerspectiveCamera,
  createStereoCamera,
  createRenderer,
  createColor,
  createPointLight,
  createRectAreaLight,
  createAmbientLight,
  createMa,
  createOrbitControls,
  createGroup,
  createBoxGeometry,
  createMeshBasicMaterial,
  createMesh
};
