import CreateThree from '../common/three';
import CreateLine from './converter/line';
import { CameraType, optionsType, PointType, AmbientType } from '../types/options';
import { defaultCamera, defaultLight, defaultAmbient } from '../data/option';
import { ThesContainer, SceneBoxType, PositionType, LoaderTypeOption } from '../types/thesFull';
import {
  GeometryOptionType,
  GeometryContainer,
  TextGeometryType,
  ContentType,
  LineGeometryType,
  LineContainer,
  LoaderType,
} from '../types/geometry';
import {
  compiler,
  convert2Dto3D,
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
import CreateLoader from './converter/loader';
import Group from './group';
import CreateFlame from './converter/flame';
import Tween from '@tweenjs/tween.js';
import SceneBox from './sceneBox';
import { uniqBy, isArray, cloneDeep } from 'loadsh';
import { createGeofn, createMaFn } from './converter/geometry';
import { PopupContainer, PopupType } from '../types/popup';
import { Popup } from './popup';
import { _CONSTANT_, _CONSTANT_BUS_, _Events } from '../common/constant';
import { _bus, _keybus } from '../common/bus';
import { Collecter, CollecterContainer } from '../common/collecter';
import { animateHook, mouseDownHook, toastHook } from '../common/hooks';
import { LoadTip, TipType } from '../common/tsx';

const { thes_add, thes_update } = animateHook();

export let _collecter: CollecterContainer;
export const _UPDATE_HOOK_ = thes_update;
export const _ADD_HOOK_ = thes_add;

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
  models = [];
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
  _LOOK_POSITION_: any;
  _THES_THING: any;
  stats: any;
  constructor(opt: optionsType) {
    let loading: boolean = opt.loading || true;
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
      this.opt.camera,
      this.scene,
      this.opt.width,
      this.opt.height,
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
      this.opt.width,
      this.opt.height,
      this.scene,
      this.camera
    );
    this.control = CreateControl(this.camera, this.renderer);
    this.control.enableRotate = true;
    this.control.rotateSpeed = 0.5;
    this.control.enableDamping = true;
    this.control.dampingFactor = 0.1;
    let _ = this;
    function render() {
      Tween.update();
      _UPDATE_HOOK_();
      _.stats?.update();
      _.renderer.render(_.scene, _.camera);
      _.renderer.aniID = requestAnimationFrame(render);
    }
    render();
    this._POPUP_ChANGE();
    this._INIT(_collecter.watcher);
  }
  static createGeometry(geometry: GeometryOptionType) {
    return new CreateGeometry(geometry);
  }
  static createGroup() {
    return new Group();
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
    return new CreateGeometry(opt as any, CreateLine(opt));
  }
  //弹窗
  static createPopup(opt: PopupType): PopupContainer {
    let popup = new Popup(opt);
    Thes.popupList.push(popup);
    return popup;
  }
  //loader
  static async createLoader(opt: LoaderType): Promise<GeometryContainer> {
    let loaderText = _createLoaderKey({});
    _collecter.collect(loaderText);
    const geo: any = await CreateThree.createOBJLoader(
      opt?.url,
      loaderText,
      _collecter.watcher,
      opt?.mtlUrl
    );
    let group = CreateThree.createGroup();
    const mat = createMaFn(opt);
    //此处忽略类型是套用geometry封装流程
    return new CreateGeometry(opt as any, {
      mat,
      geo,
      group,
      thing: group.add(geo),
    });
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
  createState() {
    this.stats = CreateThree.createStats();

    // 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
    this.stats.setMode(0);
    // 设置监视器位置
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    // 将监视器添加到页面中
    document.body.appendChild(this.stats.domElement);
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
    cancelAnimationFrame(this.renderer.aniID);
    let _ = this;
    function render() {
      Tween.update();
      _UPDATE_HOOK_();
      _.stats?.update();
      _.renderer.render(_.scene, _.camera);
      _.renderer.aniID = requestAnimationFrame(render);
    }
    render();
    // this.renderer.render(scene, camera);
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
      return true;
    }
    return false;
  }
  on(type: keyof EventsType, cb: Function) {
    switch (type) {
      case _CONSTANT_.EVENTCLICK:
        if (this.events[type] == _CONSTANT_.EVENTOFF) {
          this.opt.el.addEventListener(_CONSTANT_.EVENTCLICK, event => {
            const ls = isArray(CreateThree.getModelList(event, this.camera, this.scene))
              ? uniqBy(CreateThree.getModelList(event, this.camera, this.scene), _CONSTANT_.UNIQKEY)
              : [];
            this.events[_CONSTANT_.EVENTCLICK] = _CONSTANT_.EVENTON;
            cb(ls);
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
  flyTo(position: { x: number; y: number; z: number; time?: number }) {
    // console.log(position)
    let tween = new Tween.Tween(this.camera.position);
    tween
      .to({ ...position }, position?.time || 1000)
      .start()
      .onUpdate(() => {
        this.lookAt(this._LOOK_POSITION_);
      });
  }
  lookAt(me: GeometryContainer | { position: [number, number, number] }) {
    this.camera.lookAt(me.position[0], me.position[1], me.position[2]);
    this.control.position0.set(me.position[0], me.position[1], me.position[2]);
    this.control.target.set(me.position[0], me.position[1], me.position[2]);
    this.control.update();
    this._LOOK_POSITION_ = me;
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
        // console.log(last10,Date.now()-date)
        if (!rtb.firstExcute) {
          rtb.firstExcute = {
            point: last10,
            date: Date.now() - date,
          };
        }
        // this.flyTo({ x: last10?.x, y: last10?.y + (view || 30), z: last10?.z, time: 1 });
        this.camera.position.set(last10?.x, view || 60, last10?.z);
      }
      this.camera.lookAt(val.x, val.y, val.z);
      this._LOOK_POSITION_ = { position: [val.x, val.y, val.z] };
      // console.log(val)
      // this.lookAt({
      //   position: [val.x, val.y, val.z],
      // });
      cb?.call(null, rtb);
    });
  }
  flyReset() {}
  //获取视图中心的地图坐标
  getCenter(): PositionType | undefined {
    return this.sceneBox.cameraInit._LOOKCENTER;
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

  _Test() {
    const Loader = (fn: Function) => {
      let loader: any = _createLoaderKey({});
      if (_collecter.watchType == 'count') {
        let time = Math.random() * 10000;
        setTimeout(() => {
          loader._DEP_KEY._IS_FINISHED = true;
          fn();
        }, time);
      }
      if (_collecter.watchType == 'byte') {
        loader._DEP_KEY._SIZE = Math.random() * 50;
        loader._DEP_KEY._CURRENT = 0;
        let timer = setInterval(() => {
          let add = Math.random() * 10;
          if (loader._DEP_KEY._CURRENT < loader._DEP_KEY._SIZE) {
            if (loader._DEP_KEY._CURRENT + add > loader._DEP_KEY._SIZE) {
              loader._DEP_KEY._CURRENT = loader._DEP_KEY._SIZE;
            } else {
              loader._DEP_KEY._CURRENT += add;
            }
            fn();
          } else {
            loader._DEP_KEY._CURRENT = loader._DEP_KEY._SIZE;
            clearInterval(timer);
          }
        }, 500);
      }
      return loader;
    };
    _collecter.collect(Loader(_collecter.watcher));
    _collecter.collect(Loader(_collecter.watcher));
    _collecter.collect(Loader(_collecter.watcher));
    _collecter.collect(Loader(_collecter.watcher));
  }
  _POPUP_ChANGE() {
    this.control.addEventListener(_CONSTANT_.EVENTCHANGE, () => {
      Thes.popupList.map(item => {
        if (item.th?.cid === this.sceneBox.cid) {
          item.setPosition(
            threeToScreen(item.opt.position, this.camera, item.opt.content as HTMLElement).top,
            threeToScreen(item.opt.position, this.camera, item.opt.content as HTMLElement)
              .left as any
          );
        }
      });
    });
  }
  clear(): void {
    this.opt.el.innerHTML = '';
    this.opt.el.removeEventListener('mousemove', () => {});
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
  _INIT(fn?: Function, isCollected: boolean = false) {
    this.scenes.map((scene: SceneBoxType) => {
      scene.camera = this.camera;
    });
    document.onkeydown = e => {
      if (e.key == 'Control' && !this._IS_CTRL_FLAG) {
        this._SET_CTRL_EVENT(true);
        _bus.$emit('keyDowmControl', true);
      }
      console.log(_keybus)
      if (_keybus.queues['Key' + e.key] && _keybus.queues['Key' + e.key].length) {
        console.log(_keybus.queues['Key' + e.key])
        _keybus.$emit('Key' + e.key)
      }
    };
    document.onkeyup = e => {
      if (e.key == 'Control' && this._IS_CTRL_FLAG) {
        this._SET_CTRL_EVENT(false);
        _bus.$emit('keyDowmControl', false);
        this.renderer.domElement.style.cursor = 'default';
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
    if (!isCollected) {
      this._load._DEP_KEY._CURRENT = 50;
      this._load._DEP_KEY._IS_FINISHED = true;
      fn?.call(null);
    }
    return this._load;
  }
}
