import CreateThree from '../common/three';
import CreateLine from './converter/line';
import { CameraType, optionsType, PointType, AmbientType } from '../types/options';
import { defaultCamera, defaultLight, defaultAmbient } from '../data/option';
import { ThesContainer, SceneBoxType } from '../types/thesFull';
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
import CreateLoader from './converter/loader'
import Group from './group';
import Tween from '@tweenjs/tween.js';
import SceneBox from './sceneBox';
import { uniqBy, isArray, cloneDeep } from 'loadsh';
import { createMaFn } from './converter/geometry';
import { PopupContainer, PopupType } from '../types/popup';
import { Popup } from './popup';
import { _CONSTANT_, _Events } from '../common/constant';
// import thesParent from '../common/thesParent';

type eventsType = {
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
  models = [];
  scenes: ThreeConstruct.Scene[] = [];
  static popupList: PopupContainer[] = [];
  props: Array<string> = [];
  events: eventsType = {
    [_CONSTANT_.EVENTCLICK]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTDOWN]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTLEAVE]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTMOVE]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTOVER]: _CONSTANT_.EVENTOFF,
    [_CONSTANT_.EVENTUP]: _CONSTANT_.EVENTOFF,
  };
  constructor(opt: optionsType) {
    //赋值id
    // this.id =
    //格式化数据
    this.opt = OptionFilter(opt);
    this.sceneBox = this.createScene(this.opt);
    this.useScene(this.sceneBox);
    //创建场景
    // this.scene = CreateScene(this.opt);
    // setId('scene', this.scene);
    // this.scenes.push(this.scene);
    //创建相机
    this.camera = CreateCamera(
      this.opt.camera,
      this.scene,
      this.opt.width,
      this.opt.height,
      this.opt.view
    );
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
    this.onChange();
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
  static createLoader(opt:LoaderType): GeometryContainer {
    return new CreateGeometry(opt as any, CreateLoader(opt));
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
  useScene(scene: SceneBoxType) {
    Thes.popupList.map((item: PopupContainer) => {
      if (item.th.cid === scene.cid) {
        item.show();
      } else if (item.th.cid !== scene.cid) {
        item.hide();
      }
    });
    if (!scene || !scene.scene.isObject3D) {
      throwError('请输入正确的场景');
    }
    //第一次加载只设置场景
    if (!this.scene) {
      this.sceneBox = cloneDeep(scene);
      this.scene = scene.scene;
      return;
    }
    //判断切换的是否是当前场景
    if (this.scene.cid == scene.cid) {
      return;
    }
    this.sceneBox = cloneDeep(scene);
    //切换重置场景
    this.scene = scene.scene;
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
  on(type: keyof eventsType, cb: Function) {
    switch (type) {
      case _CONSTANT_.EVENTCLICK:
        if (this.events[type] == _CONSTANT_.EVENTOFF) {
          this.opt.el.addEventListener(_CONSTANT_.EVENTCLICK, event =>
            cb(
              isArray(CreateThree.getModelList(event, this.camera, this.scene))
                ? uniqBy(CreateThree.getModelList(event, this.camera, this.scene), _CONSTANT_.UNIQKEY)
                : []
            )
          );
          this.events[_CONSTANT_.EVENTCLICK] = _CONSTANT_.EVENTON;
        }
        break;

      default:
        break;
    }
  }
  off(type: keyof eventsType) {
    if (this.events[type] == _CONSTANT_.EVENTON) {
      this.opt.el.removeEventListener(type, () => {});
      this.events[type] == _CONSTANT_.EVENTOFF;
    }
  }
  onChange() {
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
}
