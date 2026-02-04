import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from '../controls/DragControls.js';
import { throwError } from './utils';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { LoaderTypeOption } from '../../types/thesFull.js';
import { _collecter } from '../core/thes.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
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
const createRenderer = (...arg: any) => new THREE.WebGLRenderer(...arg);
//颜色
const createColor = (color: string) => {
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
const createDragControls = (...arg: any) => new DragControls(...arg);
//创建组
const createGroup = () => new THREE.Group();
const createMa = (scene: any) => {
  const geometry = new THREE.PlaneGeometry(100, 100, 2, 2);
  const material = new THREE.MeshBasicMaterial({
    color: createColor('rgb(255,255,255)'),
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
};
//正方体
const createBoxGeometry = (...arg: any) => new THREE.BoxGeometry(...arg);
//平面圆
const createCircleGeometry = (...arg: any) => new THREE.CircleGeometry(...arg);
//圆锥
const createConeGeometry = (...arg: any) => new THREE.ConeGeometry(...arg);
//圆柱
const createCylinderGeometry = (...arg: any) => new THREE.CylinderGeometry(...arg);
//平面
const createPlaneGeometry = (...arg: any) => new THREE.PlaneGeometry(...arg);
//球
const createSphereGeometry = (...arg: any) => new THREE.SphereGeometry(...arg);
//文本
const createTextGeometry = (...arg: any) => new TextGeometry(...arg);
//球
const createLine = (...arg: any) => new THREE.Line(...arg);
//线条
const createLineGeometry = (...arg: any) => {
  return new THREE.BufferGeometry().setFromPoints(
    new Array(...arg)[0].map((item: [number, number, number]) => new THREE.Vector3(...item))
  );
};
//曲线
const createCubicBezierCurve3 = (...arg: any) => {
  return new THREE.CubicBezierCurve3(
    ...new Array(...arg)[0].map((item: [number, number, number]) => new THREE.Vector3(...item))
  );
};
//曲线
const createLineCurve3 = (...arg: any) => {
  return new THREE.QuadraticBezierCurve3(
    ...new Array(...arg)[0].map((item: [number, number, number]) => new THREE.Vector3(...item))
  );
};
//曲角直线
const createCatmullRomCurve3 = (...arg: any) => {
  const curve = new THREE.CatmullRomCurve3(
    new Array(...arg)[0].map((item: [number, number, number]) => new THREE.Vector3(...item))
  );
  return new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
};
//实线
const createBasicMaterial = (...arg: any) => new THREE.LineBasicMaterial(...arg);
//虚线
const createDashedMaterial = (...arg: any) => new THREE.LineDashedMaterial(...arg);
//字体
const createFont = (url: string, loaderText: LoaderTypeOption, fn: Function) => {
  return new Promise((resolve: Function) => {
    new FontLoader().load(
      url,
      (font: ThreeConstruct.Font) => {
        if (_collecter.watchType == 'count') {
          loaderText._DEP_KEY._IS_FINISHED = true;
          fn();
        } else {
          loaderText._DEP_KEY._SIZE = loaderText._DEP_KEY._CURRENT;
          fn();
        }
        resolve(font);
      },
      (xhr: any) => {
        if (_collecter.watchType == 'byte') {
          loaderText._DEP_KEY._CURRENT = xhr.loaded;
          loaderText._DEP_KEY._SIZE = xhr.total || loaderText._DEP_KEY._CURRENT + 100;
          fn();
        }
        // console.log(xhr)
      }
    );
  });
};
//FBXLoader
const createFBXLoader = (url: string, loaderText: LoaderTypeOption, fn: Function) => {
  return new Promise((resolve: Function) => {
    new FBXLoader().load(
      url,
      (object: ThreeConstruct.Geometry) => {
        if (_collecter.watchType == 'count') {
          loaderText._DEP_KEY._IS_FINISHED = true;
          fn();
        } else {
          loaderText._DEP_KEY._SIZE = loaderText._DEP_KEY._CURRENT;
          fn();
        }
        resolve(object);
      },
      (xhr: any) => {
        if (_collecter.watchType == 'byte') {
          loaderText._DEP_KEY._CURRENT = xhr.loaded;
          loaderText._DEP_KEY._SIZE = xhr.total || loaderText._DEP_KEY._CURRENT + 100;
          fn();
        }
        // console.log(xhr)
      }
    );
  });
};
//obj
const createOBJLoader = (
  url: string,
  loaderText: LoaderTypeOption,
  fn: Function,
  mtlUrl?: string
) => {
  return new Promise((resolve: Function) => {
    new MTLLoader().load(mtlUrl, function (material: ThreeConstruct.Material) {
      // 返回一个包含材质的对象MaterialCreator
      //obj的模型会和MaterialCreator包含的材质对应起来
      var oj = new OBJLoader();
      material.transparent = true;
      oj.setMaterials(material);
      oj.load(
        url,
        (object: ThreeConstruct.Geometry) => {
          if (_collecter.watchType == 'count') {
            loaderText._DEP_KEY._IS_FINISHED = true;
            fn();
          } else {
            loaderText._DEP_KEY._SIZE = loaderText._DEP_KEY._CURRENT;
            fn();
          }
          resolve({ object, material });
        },
        (xhr: any) => {
          if (_collecter.watchType == 'byte') {
            loaderText._DEP_KEY._CURRENT = xhr.loaded;
            loaderText._DEP_KEY._SIZE = xhr.total || loaderText._DEP_KEY._CURRENT + 100;
            fn();
          }
          // console.log(xhr)
        }
      );
    });
  });
};
//基础材质
const createMeshBasicMaterial = (...arg: any) => new THREE.MeshBasicMaterial(...arg);
const createMeshLambertMaterial = (...arg: any) => new THREE.MeshLambertMaterial(...arg);
//mesh
const createMesh = (...arg: any) => new THREE.Mesh(...arg);
const createEdgesHelper = (...arg: any) => new THREE.BoxHelper(...arg);
const getSlide = () => THREE.DoubleSide;
//创建CubeTextureLoader
const createCubeTextureLoader = (...arg: any) => new THREE.CubeTextureLoader().load(...arg);
//创建TextureLoader
const createTextureLoader = (...arg: any) => new THREE.TextureLoader().load(...arg);
//获取点击模型列表
const getModelList = (event: any, camera: any, scene: any, dom: any) => {
  event.preventDefault();
  let rayCaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  mouse.x = (event.offsetX / dom.offsetWidth) * 2 - 1;
  mouse.y = -(event.offsetY / dom.offsetHeight) * 2 + 1;
  rayCaster.setFromCamera(mouse, camera);
  let intersects = rayCaster.intersectObjects(scene.children, true);
  return intersects;
};
const vector3 = (position: number[]) => {
  return new THREE.Vector3(...position);
};
const vector2 = (position: [number, number]) => {
  return new THREE.Vector2(...position);
};
const createMatrix4 = () => {
  return new THREE.Matrix4();
};
const createBox3 = (...arg: any) => {
  return new THREE.Box3().setFromObject(...arg);
};
const createStats = () => new (Stats as any)();
const createRGBELoader = (...arg: any) => new RGBELoader().load(...arg);
// const createFirstPersonControls = (...arg: any) => new FirstPersonControls(...arg);
const createPointerLockControls = (...arg: any) => new PointerLockControls(...arg);
const createCurvePath = (points: Array<number[]>) => {
  let CurvePath = new THREE.CurvePath();
  let index = 0;
  points.map(() => {
    if (points[index + 1]) {
      let line = new THREE.LineCurve3(
        new THREE.Vector3(...points[index]),
        new THREE.Vector3(...points[index + 1])
      );
      index += 1;
      CurvePath.curves.push(line);
    }
  });
  return CurvePath;
};
export default {
  THREE,
  createCurvePath,
  createPointerLockControls,
  // createFirstPersonControls,
  createStats,
  createBox3,
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
  createMesh,
  createCircleGeometry,
  getSlide,
  createConeGeometry,
  createCylinderGeometry,
  createPlaneGeometry,
  createSphereGeometry,
  getModelList,
  createCubeTextureLoader,
  createTextureLoader,
  createTextGeometry,
  createFont,
  createLineGeometry,
  createBasicMaterial,
  createDashedMaterial,
  createLine,
  vector3,
  createCatmullRomCurve3,
  createCubicBezierCurve3,
  createLineCurve3,
  createMatrix4,
  vector2,
  createDragControls,
  createMeshLambertMaterial,
  createFBXLoader,
  createOBJLoader,
  createEdgesHelper,
  createRGBELoader,
};
