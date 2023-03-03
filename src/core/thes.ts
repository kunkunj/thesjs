import CreateThree from '../common/three';
import CreateLine from './converter/line';
import { CameraType, optionsType, PointType, AmbientType } from '../types/options';
import { defaultCamera, defaultLight, defaultAmbient } from '../data/option';
import { ThesContainer, SceneBoxType, PositionType } from '../types/thesFull';
import {
  GeometryOptionType,
  GeometryContainer,
  TextGeometryType,
  ContentType,
  LineGeometryType,
  LineContainer,
  LoaderType,
} from '../types/geometry';
import { setId, threeToScreen, throwError } from '../common/utils';
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
import Tween from '@tweenjs/tween.js';
import SceneBox from './sceneBox';
import { uniqBy, isArray, cloneDeep } from 'loadsh';
import { createMaFn } from './converter/geometry';
import { PopupContainer, PopupType } from '../types/popup';
import { Popup } from './popup';
import { _CONSTANT_, _CONSTANT_BUS_, _Events } from '../common/constant';
import { _bus } from '../common/bus';
import { Collecter } from '../common/collecter';
// import thesParent from '../common/thesParent';

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
  constructor(opt: optionsType) {
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
    this._POPUP_ChANGE();
    this._INIT();
  }
  static createGeometry(geometry: GeometryOptionType) {
    return new CreateGeometry(geometry);
  }
  static createGroup() {
    return new Group();
  }
  //文本
  static async createText(opt: TextGeometryType): Promise<GeometryContainer> {
    const font = await CreateThree.createFont(opt?.style?.font);
    const mat = createMaFn(opt);
    const geo = CreateThree.createTextGeometry(opt?.content, {
      ...opt?.style,
      font: font,
    });
    //此处忽略类型是套用geometry封装流程
    return new CreateGeometry(opt as any, {
      mat,
      geo,
      thing: CreateThree.createMesh(geo, mat),
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
  static createLoader(opt: LoaderType): GeometryContainer {
    return new CreateGeometry(opt as any, CreateLoader(opt));
  }
  static createVector3(position: [number, number, number]) {
    return CreateThree.vector3(position);
  }
  static createWebGLCubeRenderTarget(): null {
    return null;
  }
  //场景
  createScene(opt: optionsType) {
    let aopt = OptionFilter(opt);
    const scene = CreateScene(aopt);
    CreateLight(aopt.lights as PointType, scene);
    CreateAmbient(aopt.ambientLight, scene);
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
      this.scenes[0].scene.add(me.content.thing);
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
      scene.scene.add(me.content.thing);
      return true;
    }
    return false;
  }
  on(type: keyof EventsType, cb: Function) {
    switch (type) {
      case _CONSTANT_.EVENTCLICK:
        if (this.events[type] == _CONSTANT_.EVENTOFF) {
          this.opt.el.addEventListener(_CONSTANT_.EVENTCLICK, event =>
            cb(
              isArray(CreateThree.getModelList(event, this.camera, this.scene))
                ? uniqBy(
                    CreateThree.getModelList(event, this.camera, this.scene),
                    _CONSTANT_.UNIQKEY
                  )
                : []
            )
          );
          this.events[_CONSTANT_.EVENTCLICK] = _CONSTANT_.EVENTON;
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
    function notify(num: number, finshedFiles: LoaderType[], files: LoaderType[]) {
      if (num < 1) {
        _bus.$emit(_CONSTANT_.ONPROGRESS, num);
      } else {
        _bus.$emit(_CONSTANT_.LOADED, num);
      }
      // console.log(num, finshedFiles, files);
    }
    const collecter = new Collecter(notify, 'byte');
    const Loader = (fn: Function) => {
      let loader: any = {}; //模拟文件对象
      loader._DEP_KEY = { _IS_DEPED: false, _IS_FINISHED: false, _SIZE: 0, _CURRENT: 0 };
      //模拟加载时间
      // let time = Math.random() * 10000;
      // console.log(time);
      // //模拟文件加载成功回调
      // setTimeout(() => {
      //   loader._DEP_KEY._IS_FINISHED = true;
      //   fn();
      // }, time);
      //   //模拟文件加载中回调
      loader._DEP_KEY._SIZE = Math.random() * 50;
      loader._DEP_KEY._CURRENT = 0;
      let timer = setInterval(() => {
        if (loader._DEP_KEY._CURRENT < loader._DEP_KEY._SIZE) {
          loader._DEP_KEY._CURRENT += Math.random() * 10;
          fn();
        } else {
          loader._DEP_KEY._CURRENT = loader._DEP_KEY._SIZE;
          clearInterval(timer);
        }
      }, 500);
      return loader;
    };
    collecter.collect(Loader(collecter.watcher));
    collecter.collect(Loader(collecter.watcher));
    collecter.collect(Loader(collecter.watcher));
    collecter.collect(Loader(collecter.watcher));
  }
  _POPUP_ChANGE() {
    this.control.addEventListener(_CONSTANT_.EVENTCHANGE, () => {
      Thes.popupList.map(item => {
        if (item.th.cid === this.sceneBox.cid) {
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
  _INIT() {
    this.scenes.map((scene: SceneBoxType) => {
      scene.camera = this.camera;
    });
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
  }
}
