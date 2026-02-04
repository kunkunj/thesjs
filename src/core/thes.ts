import CreateThree from '../common/three';
import CreateLine from './converter/line';
import CreateCurve from './converter/curve';
import {
  CameraType,
  optionsType,
  PointType,
  AmbientType,
  PointLightType,
} from '../../types/options';
import { defaultCamera, defaultLight, defaultAmbient } from '../data/option';
import html2canvas from 'html2canvas';
import {
  ThesContainer,
  SceneBoxType,
  PositionType,
  LoaderTypeOption,
  HDRBackground,
  FogType,
  ShapeBoxType,
  HtmlOptionType,
  SpriteOptionType,
  ArcCurveType,
} from '../../types/thesFull';
import {
  GeometryOptionType,
  GeometryContainer,
  TextGeometryType,
  ContentType,
  LineGeometryType,
  LineContainer,
  LoaderType,
  TipType,
  TubeGeometryType,
} from '../../types/geometry';
import {
  compiler,
  convert2Dto3D,
  lonlatToMercator,
  positionToCenter,
  setId,
  threeToScreen,
  throttle,
  throwError,
  _createLoaderKey,
} from '../common/utils';
import OptionFilter from '../common/optionFilter';
import CreateCamera from './converter/camera';
import CreateRenderer from './converter/renderer';
import CreateScene from './converter/scene';
import CreateLight from './converter/light';
import CreateAmbient from './converter/ambient';
import CreateControl from './converter/control';
import CreateGeometry from './geometry';
// import CreateLoader from './converter/loader';
import Group from './group';
import CreateFlame from './converter/flame';
import Tween from '@tweenjs/tween.js';
import SceneBox from './sceneBox';
import { uniqBy, isArray, cloneDeep } from 'loadsh';
import { createMaFn } from './converter/geometry';
import { PopupContainer, PopupType } from '../../types/popup';
import { Popup } from './popup';
import { _CONSTANT_, _CONSTANT_BUS_, _Events } from '../common/constant';
import { _bus, _keybus } from '../common/bus';
import { Collecter, CollecterContainer } from '../common/collecter';
import {
  animateHook,
  breathHook,
  renderHooks,
  styleContainerHook,
  toastHook,
} from '../common/hooks';
import { LoadTip, LoadToast } from '../common/tsx';

import { FrameAnimation } from '../frame/index';
import { Pass } from './converter/pass';
import { StyleContainer } from '../assets/style/index';
import { clearClassNameList, initWidget } from '../widgets/index';
import { ButtonOptionGroupType } from '../widgets/button';
export const frameAnimation = FrameAnimation();

const { thes_add, thes_update } = animateHook();

export const { styleItemList, addStyleContent } = styleContainerHook();

export let _collecter: CollecterContainer;
export const _UPDATE_HOOK_ = thes_update;
export const _ADD_HOOK_ = thes_add;

export const { excuteRender, addRenderFunction, deleteRender, clearRenders } = renderHooks();

export let breathhook: any;
export let composer: any;
export let disposeCompser: any;

export let bodyElement: any;

type EventsType = {
  [index in _Events]: _CONSTANT_.EVENTON | _CONSTANT_.EVENTOFF;
};
//场景主函数
export class Thes implements ThesContainer {
  id = -1;
  opt: optionsType;
  scene: ThreeConstruct.Scene;
  sceneBox: SceneBoxType;
  camera: ThreeConstruct.Camera;
  renderer: ThreeConstruct.Renderer;
  light: ThreeConstruct.Light;
  ambient: ThreeConstruct.AmbientLight;
  control: ThreeConstruct.Controls;
  static getDefaultCameraOptions: CameraType = defaultCamera;
  static getDefaultLightOptions: PointType = defaultLight;
  static getDefaultAmbientOptions: AmbientType = defaultAmbient;
  static MOUSE = CreateThree.THREE.MOUSE;
  static GPScenter: any = null;
  static MercatorCenter: any = null;
  static isGps: boolean = false;
  scenes: ThreeConstruct.Scene[] = [];
  static popupList: PopupContainer[] = [];
  props: Array<string> = [];
  events: EventsType = {
    [_CONSTANT_.EVENTCLICK]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTDOWN]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTLEAVE]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTMOVE]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTOVER]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTUP]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.LOADED]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.ONPROGRESS]: _CONSTANT_.EVENTOFF,
  };
  _load: LoaderTypeOption;
  _IS_CTRL_FLAG: boolean = false;
  _IS_DRAG_MODAL: any;
  _LOOK_POSITION_: any = { position: [0, 0, 0] };
  _THES_THING: any;
  stats: any;
  clock: any;
  _IS_FPS_: any;
  composer: any;
  _FPS_PARMAS: any = {};
  firstPersonControls: any;
  _ROTATE_ID: any = -1;
  get rotateToCenter() {
    return this.control.autoRotate;
  }
  set rotateToCenter(val) {
    if (val) {
      this.control.autoRotate = true;
      this._ROTATE_ID = addRenderFunction(this.control.update, [], this.control);
    } else {
      this.control.autoRotate = false;
      deleteRender(this._ROTATE_ID);
    }
  }
  get rotateToCenterSpeed() {
    return this.control.autoRotateSpeed;
  }
  set rotateToCenterSpeed(val) {
    this.control.autoRotateSpeed = val;
  }
  constructor(opt: optionsType) {
    bodyElement = opt.el || document.body;
    bodyElement.style.position = 'relative';
    let loading: boolean = opt.loading == undefined ? true : opt.loading;
    const { notify } = toastHook(loading);
    _collecter = new Collecter(notify, opt.loadType || 'count');
    this._load = _createLoaderKey({});
    _collecter.collect(this._INIT(_collecter.watcher, true));
    this._load._DEP_KEY._CURRENT = 0;
    this._load._DEP_KEY._SIZE = 50;
    //赋值id
    // this.id =
    //格式化数据
    this.opt = OptionFilter(opt);
    this.sceneBox = this.createScene(this.opt);
    this.useScene(this.sceneBox as SceneBoxType & ThesContainer);
    this.camera = CreateCamera(
      this.opt.camera as CameraType,
      this.scene,
      this.opt.width as number,
      this.opt.height as number,
      this.opt.view
    );
    //创建场景
    // this.scene = CreateScene(this.opt);
    // setId('scene', this.scene);
    // this.scenes.push(this.scene);
    //创建相机
    //创建光源
    // this.light = CreateLight(this.opt.lights as PointType, this.scene);
    //创建环境光
    // this.ambient = CreateAmbient(this.opt.ambientLight, this.scene);
    // CreateThree.createMa(this.scene);
    //构造器
    this.renderer = CreateRenderer(
      this.opt.el,
      this.opt?.width,
      this.opt.height,
      this.scene,
      this.camera
    );
    if (!breathhook) {
      breathhook = breathHook(this.renderer);
      composer = breathhook.composer;
      disposeCompser = breathhook.disposeCompser;
    }
    this.control = CreateControl(this.camera, this.renderer);
    let _ = this;
    addRenderFunction(Tween.update);
    addRenderFunction(frameAnimation.update, undefined, frameAnimation);
    addRenderFunction(_UPDATE_HOOK_);
    function render() {
      _.renderer.render(_.scene, _.camera);
      excuteRender();
      _.renderer.aniID = requestAnimationFrame(render);
    }
    render();
    this._POPUP_ChANGE();
    this._INIT(_collecter.watcher);
  }
  static createGeometry(geometry: GeometryOptionType) {
    return new CreateGeometry(geometry);
  }
  //文本
  static async createText(opt: TextGeometryType): Promise<GeometryContainer> {
    let loaderText = _createLoaderKey({});
    _collecter.collect(loaderText);
    const font = await CreateThree.createFont(opt?.style?.font, loaderText, _collecter.watcher);
    const mat = createMaFn(opt);
    const geo = CreateThree.createTextGeometry(opt?.content, {
      ...opt?.style,
      font: font,
    });
    let group = CreateThree.createGroup();
    //此处忽略类型是套用geometry封装流程
    return new CreateGeometry(opt as any, {
      mat,
      geo,
      group,
      thing: group.add(CreateThree.createMesh(geo, mat)),
    });
  }
  //线条
  static createLine(opt: LineGeometryType): GeometryContainer {
    return new CreateGeometry({ ...opt, isLine: true } as any, CreateLine(opt));
  }
  //曲线
  static createCurve(opt: LineGeometryType) {
    return new CreateGeometry({ ...opt, isCurve: true } as any, CreateCurve(opt));
  }
  //圆弧
  static createArcCurve(opt: ArcCurveType) {
    const cover1 = new CreateThree.THREE.EllipseCurve(
      0,
      0, // ax, aY
      opt.xOffset || 1,
      opt.yOffset || 1, // xRadius, yRadius
      opt.startAngle || 0,
      opt.endAngle || Math.PI * 2, // aStartAngle, aEndAngle
      opt.clockwise || true, // aClockwise
      opt.rotation || 0 // aRotation
    );
    let points = cover1.getPoints(opt.pointNum || 50);
    let points1 = points.map((item: any) => {
      return new CreateThree.THREE.Vector3(item.x, opt.height || 0, item.y);
    });
    const geometry = new CreateThree.THREE.BufferGeometry().setFromPoints(points1);
    const material = new CreateThree.THREE.LineBasicMaterial({ color: opt.color });
    const ellipse = new CreateThree.THREE.Line(geometry, material);
    let group = CreateThree.createGroup();
    const cover = CreateThree.createCurvePath(points1);
    return new CreateGeometry({ ...opt, isCurve: true } as any, {
      mat: material,
      geo: geometry,
      cover,
      points: points1,
      group,
      thing: group.add(ellipse),
    });
  }
  //弹窗
  static createPopup(opt: PopupType): PopupContainer {
    let popup = new Popup(opt);
    Thes.popupList.push(popup);
    return popup;
  }
  //loader
  static async createLoader(opt: LoaderType & { isObj?: boolean }): Promise<GeometryContainer> {
    let loaderText = _createLoaderKey({});
    _collecter.collect(loaderText);
    const data: any = await Thes._CREATEFILE(opt, loaderText);
    console.log(data);
    let group = CreateThree.createGroup();
    //此处忽略类型是套用geometry封装流程
    opt.isObj = true;
    return new CreateGeometry(opt as any, {
      mat: data.material,
      geo: null,
      group,
      thing: group.add(data.object),
    });
  }
  static async _CREATEFILE(opt: LoaderType, loaderText: LoaderTypeOption) {
    let data = null;
    if (opt.type == 'obj') {
      data = await CreateThree.createOBJLoader(
        opt?.url,
        loaderText,
        _collecter.watcher,
        opt?.mtlUrl
      );
    } else {
      throwError(`目前不支持类型为${opt.type}的模型`);
    }
    return data;
  }
  static createVector3(position: [number, number, number]) {
    return CreateThree.vector3(position);
  }
  static createWebGLCubeRenderTarget(): null {
    return null;
  }
  static createFlame(url: string) {
    let group = CreateThree.createGroup();
    let mat = null;
    let geo = null;
    return new CreateGeometry(url as any, {
      mat,
      geo,
      group,
      thing: group.add(CreateFlame(url)),
    });
  }
  static createTip(opt: TipType) {
    const dom = compiler(LoadTip(opt));
    document.body.appendChild(dom);
    return {
      dispose: () => {
        document.body.removeChild(dom);
      },
    };
  }
  static createBoxByShape(opt: ShapeBoxType) {
    const mat = createMaFn(opt);
    let group = CreateThree.createGroup();
    const shape = new CreateThree.THREE.Shape();
    opt.path.map((item: PositionType, index: number) => {
      if (index == 0) {
        shape.moveTo(item.x, item.y);
      } else {
        shape.lineTo(item.x, item.y);
      }
    });
    let geo = new CreateThree.THREE.ShapeGeometry(shape, opt.radius);
    let mesh = new CreateThree.THREE.Mesh(geo, mat);
    return new CreateGeometry(opt as any, {
      mat,
      geo,
      group,
      mesh,
      thing: group.add(mesh),
    });
  }
  static createOtherFile(geo: any, mat: any, mesh: any) {
    let group = CreateThree.createGroup();
    return new CreateGeometry({} as any, {
      mat,
      geo,
      group,
      mesh,
      thing: group.add(mesh),
    });
  }
  static createCurveByShape(opt: TubeGeometryType) {
    const heartShape = new CreateThree.THREE.Shape();
    heartShape.moveTo(-50, 0);
    heartShape.quadraticCurveTo(20, 0, -30, 0);
    heartShape.quadraticCurveTo(0, 0, 0, 30);
    heartShape.lineTo(0, 50);
    heartShape.lineTo(-20, 50);
    heartShape.lineTo(-20, 30);
    heartShape.quadraticCurveTo(-10, 20, -20, 30);
    heartShape.quadraticCurveTo(-20, 20, -30, 20);
    heartShape.lineTo(-30, 20);
    heartShape.lineTo(-50, 20);
    var textureLoader = new CreateThree.THREE.TextureLoader();
    var texture = textureLoader.load(opt.url);
    console.log(texture);
    texture.wrapS = CreateThree.THREE.RepeatWrapping;
    texture.wrapT = CreateThree.THREE.RepeatWrapping;
    texture.repeat.x = opt.repeatX || 1;
    texture.repeat.y = opt.repeatY || 1;
    const extrudeSettings = {
      steps: 2,
      depth: 16,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1,
    };

    const geometry = new CreateThree.THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    // var points = [
    //   new CreateThree.THREE.Vector3( -10, 0, 10 ),
    //   new CreateThree.THREE.Vector3( -5, 5, 5 ),
    //   new CreateThree.THREE.Vector3( 0, 0, 0 ),
    //   new CreateThree.THREE.Vector3( 5, -5, 5 ),
    //   new CreateThree.THREE.Vector3( 10, 0, 10 )
    // ];
    // // 创建三维样条曲线
    // var catmullRomCurve3 = new CreateThree.THREE.CatmullRomCurve3(points);
    // // 创建管道模型对象
    // var geometry = new CreateThree.THREE.TubeGeometry(catmullRomCurve3,64,1,10);
    const material = new CreateThree.THREE.MeshPhongMaterial({
      map: texture,
      side: CreateThree.getSlide(),
      transparent: true,
    });
    const mesh = new CreateThree.THREE.Mesh(geometry, material);
    opt.animationId = addRenderFunction(() => {
      texture.offset.x -= 0.01 * opt.speed;
    });
    return {
      content: { thing: mesh },
    };
  }
  static createtTextureAnimation(opt: TubeGeometryType) {
    const geo = new CreateThree.THREE.PlaneGeometry(opt.width || 100, opt.height || 10);
    var textureLoader = new CreateThree.THREE.TextureLoader();
    var texture = textureLoader.load(opt.url);
    texture.wrapS = CreateThree.THREE.RepeatWrapping;
    texture.wrapT = CreateThree.THREE.RepeatWrapping;
    texture.repeat.x = opt.repeatX || 1;
    texture.repeat.y = opt.repeatY || 1;
    var mat = new CreateThree.THREE.MeshLambertMaterial({
      map: texture,
      side: CreateThree.getSlide(),
      transparent: true,
    });
    let group = CreateThree.createGroup();
    let mesh = new CreateThree.THREE.Mesh(geo, mat);
    let speed = opt.speed > 20 || opt.speed < 1 || opt.speed == undefined ? 2 : opt.speed;
    opt.animationId = addRenderFunction(() => {
      texture.offset.x -= 0.01 * speed;
    });
    return new CreateGeometry(opt as any, {
      mat,
      geo,
      group,
      mesh,
      thing: group.add(mesh),
    });
  }
  static async creatHtml(opt: HtmlOptionType) {
    document.body.appendChild(opt.html);
    const canvas = await html2canvas(opt.html, { backgroundColor: null });
    document.body.removeChild(opt.html);
    const texture = new CreateThree.THREE.CanvasTexture(canvas);
    const geo = new CreateThree.THREE.PlaneGeometry(opt.width || 100, opt.height || 100);
    opt.materialOption = opt.materialOption
      ? {
          ...opt.materialOption,
          map: texture,
          isCanvas: true,
          side: CreateThree.getSlide(),
        }
      : {
          map: texture,
          isCanvas: true,
          side: CreateThree.getSlide(),
        };
    let loaderText = _createLoaderKey({});
    _collecter.collect(loaderText);
    const mat = createMaFn(opt, _collecter.watcher, loaderText);
    let group = CreateThree.createGroup();
    let mesh = new CreateThree.THREE.Mesh(geo, mat);
    return new CreateGeometry(opt as any, {
      mat,
      geo,
      group,
      mesh,
      thing: group.add(mesh),
    });
  }
  static createSprite(opt: SpriteOptionType) {
    opt.material = 'sprite';
    opt.materialOption = opt.materialOption
      ? {
          ...opt.materialOption,
          map: opt.url,
          side: CreateThree.getSlide(),
        }
      : {
          map: opt.url,
          side: CreateThree.getSlide(),
        };
    let loaderText = _createLoaderKey({});
    _collecter.collect(loaderText);
    const mat = createMaFn(opt, _collecter.watcher, loaderText);
    const geo = new CreateThree.THREE.Sprite(mat);
    let group = CreateThree.createGroup();
    return new CreateGeometry(opt as any, {
      mat,
      geo,
      group,
      thing: group.add(geo),
    });
  }
  setHDRbackground(obj: HDRBackground) {
    console.log(obj);
    let idObj: Record<string, any> = {};
    let loadpage1: any;
    if (obj.loading) {
      loadpage1 = compiler(LoadToast('', idObj));
      loadpage1 && document.getElementsByTagName('body')[0].appendChild(loadpage1);
    }
    CreateThree.createRGBELoader(
      obj.url,
      (texture: ThreeConstruct.Texture) => {
        const gen = new CreateThree.THREE.PMREMGenerator(this.renderer);
        const envMap = gen.fromEquirectangular(texture).texture;
        this.scene.environment = envMap;
        this.scene.background = envMap;
        obj.loaded?.call(null, texture);
        loadpage1 && document.getElementsByTagName('body')[0].removeChild(loadpage1);
        texture.dispose();
        gen.dispose();
      },
      (e: Record<string, any>) => {
        obj.progress?.call(e);
      }
    );
  }
  setFPS(me: GeometryContainer) {
    this._IS_FPS_ = true;
    me._IS_FPS_ = true;

    this.control.enabled = false;
    this.camera.position.set(me.position[0], me.getSize().max.y, me.position[2] - 10);
    this.firstPersonControls = CreateThree.createPointerLockControls(
      this.camera,
      this.renderer.domElement
    );
    this.firstPersonControls.lock();
    // this.firstPersonControls.addEventListener('change', (e: any) => {
    //   console.log(this.firstPersonControls.getDirection());
    // });
    this.scene.add(this.firstPersonControls.getObject());
    // const velocity = ;
    this._FPS_PARMAS.velocity = new CreateThree.THREE.Vector3(
      me.position[0],
      me.getSize().max.y,
      me.position[2]
    );
  }
  _FPS_ANI() {
    if (this.firstPersonControls?.isLocked === true) {
      const time = performance.now();
      // this._FPS_PARMAS.raycaster.ray.origin.copy(this.firstPersonControls.getObject().position);
      // this._FPS_PARMAS.raycaster.ray.origin.y -= 10;

      // const intersections = this._FPS_PARMAS.raycaster.intersectObjects(this.sceneBox.modelBox.map(item => item.content.thing), false);

      // const onObject = intersections.length > 0;

      const delta = (time - this._FPS_PARMAS.prevTime) / 1000;

      this._FPS_PARMAS.velocity.x -= this._FPS_PARMAS.velocity.x * 10.0 * delta;
      this._FPS_PARMAS.velocity.z -= this._FPS_PARMAS.velocity.z * 10.0 * delta;

      this._FPS_PARMAS.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      this._FPS_PARMAS.direction.z =
        Number(this._FPS_PARMAS.moveForward) - Number(this._FPS_PARMAS.moveBackward);
      this._FPS_PARMAS.direction.x =
        Number(this._FPS_PARMAS.moveRight) - Number(this._FPS_PARMAS.moveLeft);
      this._FPS_PARMAS.direction.normalize(); // this ensures consistent movements in all directions

      if (this._FPS_PARMAS.moveForward || this._FPS_PARMAS.moveBackward)
        this._FPS_PARMAS.velocity.z -= this._FPS_PARMAS.direction.z * 400.0 * delta;
      if (this._FPS_PARMAS.moveLeft || this._FPS_PARMAS.moveRight)
        this._FPS_PARMAS.velocity.x -= this._FPS_PARMAS.direction.x * 400.0 * delta;

      // if (onObject === true) {
      //   this._FPS_PARMAS.velocity.y = Math.max(0, this._FPS_PARMAS.velocity.y);
      //   this._FPS_PARMAS.canJump = true;
      // }

      this.firstPersonControls.moveRight(-this._FPS_PARMAS.velocity.x * delta);
      this.firstPersonControls.moveForward(-this._FPS_PARMAS.velocity.z * delta);

      this.firstPersonControls.getObject().position.y += this._FPS_PARMAS.velocity.y * delta; // new behavior

      if (this.firstPersonControls.getObject().position.y < 10) {
        this._FPS_PARMAS.velocity.y = 0;
        this.firstPersonControls.getObject().position.y = 10;

        this._FPS_PARMAS.canJump = true;
      }
      this._FPS_PARMAS.prevTime = time;
    }
  }

  static createState() {
    let stats = CreateThree.createStats();

    // 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
    stats.setMode(0);
    // 设置监视器位置
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    // 将监视器添加到页面中

    addRenderFunction(stats.update, [], stats);
    document.body.appendChild(stats.domElement);
  }
  static createSpotLight(lightOpt: PointLightType & { helper?: boolean }, th: Thes) {
    const light = new CreateThree.THREE.SpotLight(
      lightOpt.color || 0xff0000,
      lightOpt.intensity || 4,
      lightOpt.distance || 100,
      lightOpt.angle || Math.PI / 3,
      lightOpt.penumbra || 0,
      lightOpt.decay || 2
    );
    light.castShadow = true; // 投射阴影
    light.position.set(
      lightOpt?.position[0] || 0,
      lightOpt?.position[1] || 0,
      lightOpt?.position[2] || 0
    );

    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 1000; // default
    light.shadow.focus = 1; // default
    const targetObject = new CreateThree.THREE.Object3D();
    let helper = null;
    if (lightOpt.helper) {
      helper = new CreateThree.THREE.CameraHelper(light.shadow.camera);
    }
    let group = CreateThree.createGroup();
    lightOpt.isLight = true;
    if (lightOpt.target?.content) {
      targetObject.position.set(
        lightOpt.target.content.thing.position.x,
        lightOpt.target.content.thing.position.y,
        lightOpt.target.content.thing.position.z
      );
    }
    if (lightOpt.target && lightOpt.target[0]) {
      targetObject.position.set(lightOpt.target[0], lightOpt.target[1], lightOpt.target[2]);
    }
    // th.scene.add(targetObject);
    light.target = targetObject;
    return new CreateGeometry(lightOpt as any, {
      targetObject,
      helper,
      light,
      group,
      thing: group.add(light),
    });
  }
  initbBreatheLight() {
    return new Pass(this.sceneBox, this.renderer.domElement);
  }
  //场景
  createScene(opt: optionsType) {
    let aopt = OptionFilter(opt);
    const scene = _collecter.collect(CreateScene(aopt, _collecter.watcher)) as any;
    scene._DEP_KEY._CURRENT = 0;
    scene._DEP_KEY._SIZE = 50;
    CreateLight(aopt.lights as PointType, scene);
    CreateAmbient(aopt.ambientLight as AmbientType, scene);
    const sceneBox = new SceneBox(scene);
    sceneBox.opt = { ...opt, el: this.opt.el };
    sceneBox.camera = this.camera;
    sceneBox.name = opt.sceneName || _CONSTANT_.DEFAULTSCENENAME + scene.cid;
    this.scenes.push(sceneBox);
    return sceneBox;
  }
  //使用场景
  useScene(sc: SceneBoxType & ThesContainer) {
    let scene: SceneBoxType;
    if (sc.sceneBox) {
      scene = sc.sceneBox;
    } else {
      scene = sc;
    }
    if (!scene || !scene.scene.isObject3D) {
      throwError('请输入正确的场景');
    }
    //第一次加载只设置场景
    if (!this.scene) {
      this.sceneBox = cloneDeep(scene);
      this.scene = scene.scene;
      this.camera = scene.camera;
      this._FILTERPOP();
      // this._SET_CAMERA_CENTER();
      return;
    }
    //判断切换的是否是当前场景
    if (this.scene.cid == scene.cid) {
      return;
    }
    this.sceneBox = cloneDeep(scene);
    //切换重置场景
    this.scene = scene.scene;
    this.camera = scene.camera;
    this._FILTERPOP();
    this._SET_CAMERA_CENTER();
    // CreateThree.THREE.onEvent(this.scene, this.camera);
    cancelAnimationFrame(this.renderer.aniID);
    let _ = this;
    function render() {
      _.renderer.render(_.scene, _.camera);
      excuteRender();
      _.renderer.aniID = requestAnimationFrame(render);
    }
    render();
    // this.renderer.render(scene, camera);
  }
  setFog(opt: FogType, id: number) {
    if (id) {
      let scene = this.scenes.find((item: SceneBox) => item.cid == id);
      scene &&
        (scene.scene.fog = new CreateThree.THREE.Fog(
          CreateThree.createColor(opt.color),
          opt.near || 1,
          opt.far || 1000
        ));
    } else {
      this.scenes.map((item: SceneBox) => {
        item.scene.fog = new CreateThree.THREE.Fog(
          CreateThree.createColor(opt.color),
          opt.near || 1,
          opt.far || 1000
        );
      });
    }
  }
  add(me: GeometryContainer, sceneBoxId: number): boolean {
    if (!me) {
      throwError('模型不可以为null');
      return false;
    }
    if (!sceneBoxId && this.scenes.length == 1) {
      this.scenes[0].modelBox.push(me);
      this.scenes[0].scene.add(me.content.thing);
      me.PARENT_THES = this.scenes[0];
      me.initDrag && me.initDrag(this.camera, this.renderer);
      if (me.content.targetObject) {
        this.scenes[0].scene.add(me.content.targetObject);
      }
      if (me.content.helper) {
        this.scenes[0].scene.add(me.content.helper);
      }
      return true;
    }
    if (!sceneBoxId && this.scenes.length > 1) {
      throwError('id不可以为null');
      return false;
    }
    if (sceneBoxId && me) {
      let scene: undefined | ThreeConstruct.Scene = this.scenes.find(
        item => sceneBoxId == item.cid
      );
      if (!scene) {
        throwError('没查到该id的模型');
        return false;
      }
      scene.modelBox.push(me);
      scene.scene.add(me.content.thing);
      me.PARENT_THES = scene;
      me.initDrag && me.initDrag(this.camera, this.renderer);
      if (me.content.targetObject) {
        scene.scene.add(me.content.targetObject);
      }
      if (me.content.helper) {
        scene.scene.add(me.content.helper);
      }
      return true;
    }
    return false;
  }
  on(type: keyof EventsType, cb: Function) {
    switch (type) {
      case _CONSTANT_.EVENTCLICK:
        if (this.events[type] == _CONSTANT_.EVENTOFF) {
          this.opt.el.addEventListener(_CONSTANT_.EVENTCLICK, event => {
            console.log(event);
            let arr = isArray(
              CreateThree.getModelList(event, this.camera, this.scene, this.renderer.domElement)
            )
              ? uniqBy(
                  CreateThree.getModelList(
                    event,
                    this.camera,
                    this.scene,
                    this.renderer.domElement
                  ),
                  _CONSTANT_.UNIQKEY
                )
              : [];
            this.events[_CONSTANT_.EVENTCLICK] = _CONSTANT_.EVENTON;
            arr = arr
              .sort((a: Record<string, any>, b: Record<string, any>) => a.distance - b.disatance)
              .map((cur: Record<string, any>) => {
                return {
                  ...cur,
                  thing: cur.object.parent._PARENT_BOX_,
                };
              });
            cb(arr);
          });
        }
        break;
      case _CONSTANT_.LOADED:
        _bus.$on(_CONSTANT_.LOADED, () => {
          cb(this);
        });
        break;
      case _CONSTANT_.ONPROGRESS:
        _bus.$on(_CONSTANT_.ONPROGRESS, (num: any) => {
          cb(num);
        });
        break;
      case _CONSTANT_.EVENTMOVE:
        this._MOUSE_MOVE_(cb);
        break;
      default:
        throwError('Thes没有相关事件:' + type);
        break;
    }
  }
  off(type: keyof EventsType) {
    if (this.events[type] == _CONSTANT_.EVENTON) {
      this.events[type] == _CONSTANT_.EVENTOFF;
      try {
        this.opt.el.removeEventListener(type, () => {});
      } catch (error) {}
    }
  }
  openShadow(type?: any) {
    this.renderer && (this.renderer.shadowMap.type = CreateThree.THREE.PCFSoftShadowMap);
    this.renderer && (this.renderer.shadowMap.enabled = true);
    this.scenes.map((item: SceneBoxType) => {
      item.modelBox.map((cur: GeometryContainer) => {
        cur?.openShadow(type);
      });
    });
  }
  closeShadow(type?: any) {
    this.renderer && (this.renderer.shadowMap.enabled = false);
    this.scenes.map((item: SceneBoxType) => {
      item.modelBox.map((cur: GeometryContainer) => {
        cur?.closeShadow(type);
      });
    });
  }
  flyTo(position: { x: number; y: number; z: number; time?: number }) {
    let tween = new Tween.Tween(this.camera.position);
    tween
      .to({ ...position }, position?.time || 1000)
      .start()
      .onUpdate(() => {
        this._LOOK_POSITION_ && this.lookAt(this._LOOK_POSITION_);
      });
  }
  createWidgets(opt: ButtonOptionGroupType) {
    let group = initWidget(opt);
    this.opt.el.appendChild(group.el);
    return group;
  }
  lookAt(me: GeometryContainer | { position: [number, number, number] }) {
    if (Thes.isGps) {
      let po = {
        lon: me.position[0],
        y: me.position[1],
        lat: me.position[2],
      };
      let op = positionToCenter(
        { ...lonlatToMercator(po), y: me.position[1] },
        Thes.MercatorCenter
      );
      this.camera.lookAt(op.x, op.y, op.z);
      this.control.position0.set(op.x, op.y, op.z);
      this.control.target.set(op.x, op.y, op.z);
      this.control.update();
      this._LOOK_POSITION_ = me;
    } else {
      this.camera.lookAt(me.position[0], me.position[1], me.position[2]);
      this.control.position0.set(me.position[0], me.position[1], me.position[2]);
      this.control.target.set(me.position[0], me.position[1], me.position[2]);
      this.control.update();
      this._LOOK_POSITION_ = me;
    }
  }
  moveAt(me: GeometryContainer, view?: number, distance?: number, cb?: Function) {
    let pointList: Record<string, any>[] = [];
    let date = Date.now();
    let rtb: any = {};
    me._MOVEAT_((val1: Record<string, any>) => {
      let val = cloneDeep(val1);
      if (val.finish) {
        this.control.enabled = true;
        this.lookAt(this._LOOK_POSITION_);
        return;
      } else {
        this.control.enabled && (this.control.enabled = false);
      }
      rtb.point = val;
      if (pointList.length < (distance || 150)) {
        pointList.unshift(val);
      } else {
        pointList.unshift(val);
        let last10 = pointList.pop();
        if (!rtb.firstExcute) {
          rtb.firstExcute = {
            point: { ...last10, y: view },
            date: Date.now() - date,
          };
        }
        this.camera.position.set(last10?.x, view || 60, last10?.z);
      }
      this.camera.lookAt(val.x, val.y, val.z);
      this._LOOK_POSITION_ = { position: [val.x, val.y, val.z] };
      cb?.call(null, rtb);
    });
  }
  flyReset() {}
  //获取视图中心的地图坐标
  getCenter(): PositionType | undefined {
    return this._LOOK_POSITION_;
  }
  setGPScenter(position: PositionType & { height: number }) {
    Thes.isGps = true;
    Thes.GPScenter = position;
    CreateGeometry.GPScenter = position;
    Thes.MercatorCenter = lonlatToMercator(position);
    Thes.MercatorCenter.y = position.height | 0;
  }
  getGPSCenter() {
    return {
      isGps: true,
      GPScenter: Thes.GPScenter,
      MercatorCenter: Thes.MercatorCenter,
    };
  }
  closeGPScenter() {
    Thes.GPScenter = null;
    Thes.MercatorCenter = null;
    Thes.isGps = false;
  }
  //全局切换视图中心
  setCenter(_LOOKCENTER: PositionType) {
    this.scenes.map((item: ThreeConstruct.Scene) => {
      item.cameraInit._LOOKCENTER = _LOOKCENTER;
      item.camera = this.camera;
      return item;
    });
    this.sceneBox.cameraInit._LOOKCENTER = _LOOKCENTER;
    this._SET_CAMERA_CENTER();
  }
  setCameraUp(up: PositionType) {
    this.scenes.map((item: ThreeConstruct.Scene) => {
      item.cameraInit.UP = up;
    });
    this.sceneBox.cameraInit.UP = up;
    this._SET_CAMERA_CENTER();
  }
  _POPUP_ChANGE() {
    this.control.addEventListener(_CONSTANT_.EVENTCHANGE, () => {
      Thes.popupList.map(item => {
        if (item.th?.cid === this.sceneBox.cid) {
          item.setPosition(
            threeToScreen(
              item.opt.position,
              this.camera,
              item.opt.content as HTMLElement,
              this.renderer.domElement
            ).top,
            threeToScreen(
              item.opt.position,
              this.camera,
              item.opt.content as HTMLElement,
              this.renderer.domElement
            ).left as any
          );
        }
      });
    });
  }
  dispose(): void {
    this.opt.el.innerHTML = '';
    this.opt.el.removeEventListener('mousemove', () => {});
    this.scenes.map(item => {
      item.dispose();
    });
    this.renderer.dispose();
    disposeCompser?.call(composer);
    breathhook = null
    composer = null
    clearClassNameList();
    clearRenders();
    cancelAnimationFrame(this.renderer.aniID);
  }
  _FILTERPOP() {
    Thes.popupList.map((item: PopupContainer) => {
      if (item.th.cid === this.sceneBox.cid) {
        item.show();
      } else if (item.th.cid !== this.sceneBox.cid) {
        item.hide();
      }
    });
  }
  _SET_CAMERA_CENTER() {
    this.camera.lookAt(
      this.sceneBox.cameraInit?._LOOKCENTER?.x || 0,
      this.sceneBox.cameraInit?._LOOKCENTER?.y || 0,
      this.sceneBox.cameraInit?._LOOKCENTER?.z || 0
    );
    this.control.target = CreateThree.vector3([
      this.sceneBox.cameraInit?._LOOKCENTER?.x || 0,
      this.sceneBox.cameraInit?._LOOKCENTER?.y || 0,
      this.sceneBox.cameraInit?._LOOKCENTER?.z || 0,
    ]);
    this.camera.up = CreateThree.vector3([
      this.sceneBox.cameraInit?.UP?.x || 0,
      this.sceneBox.cameraInit?.UP?.y || 1,
      this.sceneBox.cameraInit?.UP?.z || 0,
    ]);
  }
  _SET_CTRL_EVENT(type: boolean) {
    this._IS_CTRL_FLAG = type;
    if (type) {
      this.control.enablePan = false;
    } else {
      this.control.enablePan = true;
      this._IS_DRAG_MODAL = null;
    }
  }
  _MOUSE_MOVE_(cb: Function) {
    var raycaster = new CreateThree.THREE.Raycaster();
    var mouse = new CreateThree.THREE.Vector2();
    const onMouseMove = (event: any) => {
      this.sceneBox.modelBox.map((item: GeometryContainer) => {
        item._SETHOVER(false);
      });
      mouse.x = (event.offsetX / this.renderer.domElement.offsetWidth) * 2 - 1;
      mouse.y = -(event.offsetY / this.renderer.domElement.offsetHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);
      let intersects = raycaster.intersectObjects(
        this.sceneBox.modelBox.map((item: any) => item.content.thing)
      );
      let arr: Record<string, any>[] = [];
      intersects.map((item: Record<string, any>) => {
        if (!arr.find((cur: Record<string, any>) => item.object.uuid == cur.object.uuid)) {
          arr.push(item);
        }
      });
      arr = arr
        .sort((a: Record<string, any>, b: Record<string, any>) => a.distance - b.disatance)
        .map((cur: Record<string, any>) => {
          return {
            ...cur,
            thing: cur.object.parent._PARENT_BOX_,
          };
        });
      cb(arr);
    };
    this.renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  }
  _INIT(fn?: Function, isCollected: boolean = false) {
    this.scenes.map((scene: SceneBoxType) => {
      scene.camera = this.camera;
    });
    this.sceneBox = this.scenes.find((item: SceneBoxType) => item.cid == this.sceneBox.cid);
    document.onkeydown = e => {
      // console.log(e)
      if (e.code == 'Escape') {
        this.firstPersonControls.unlock();
      }
      if (e.key == 'Control' && !this._IS_CTRL_FLAG) {
        this._SET_CTRL_EVENT(true);
        _bus.$emit('keyDowmControl', true);
      }
      if (_keybus.queues['Key' + e.key] && _keybus.queues['Key' + e.key].length) {
        _keybus.$emit('Key' + e.key, true);
      }
    };
    document.onkeyup = e => {
      if (e.key == 'Control' && this._IS_CTRL_FLAG) {
        this._SET_CTRL_EVENT(false);
        _bus.$emit('keyDowmControl', false);
        this.renderer.domElement.style.cursor = 'default';
      }
      if (_keybus.queues['Key' + e.key] && _keybus.queues['Key' + e.key].length) {
        _keybus.$emit('Key' + e.key, false);
      }
    };
    _bus.$on(_CONSTANT_BUS_.UPDATE_SCENE, () => {
      this.sceneBox = this.scenes.find(
        (sceneBox: SceneBoxType) => sceneBox.cid == this.sceneBox.cid
      );
      this._SET_CAMERA_CENTER();
    });
    _bus.$on(_CONSTANT_BUS_.ADD_POPUP, (th: ThesContainer & SceneBoxType) => {
      this._FILTERPOP();
    });
    _bus.$emit(_CONSTANT_.LOADED);
    this.openShadow();
    if (!isCollected) {
      this._load._DEP_KEY._CURRENT = 50;
      this._load._DEP_KEY._IS_FINISHED = true;
      fn?.call(null);
    }
    return this._load;
  }
}
