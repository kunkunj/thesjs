/// <reference path="../types/threeType/ThreeConstruct.ts" />
import CreateThree from '../common/three';
import { optionsType } from '../types/options';
import { ThesContainer } from '../types/thesFull';
import { GeometryType } from '../types/geometry';
import { setId } from '../common/utils';
import OptionFilter from '../common/optionFilter';
import CreateCamera from './converter/camera';
import CreateRenderer from './converter/renderer';
import CreateScene from './converter/scene';
import CreateLight from './converter/light';
import CreateAmbient from './converter/ambient';
import CreateControl from './converter/control';
import CreateGeometry from './geometry';
import CreateGroup from './group';
//场景主函数
export class Thes implements ThesContainer {
  id = -1;
  opt: optionsType;
  scene: ThreeConstruct.Scene;
  camera: ThreeConstruct.Camera;
  renderer: ThreeConstruct.Renderer;
  light: ThreeConstruct.Light;
  ambient: ThreeConstruct.AmbientLight;
  control: ThreeConstruct.Controls;
  models = [];
  constructor(opt: optionsType) {
    //提交测试
    //赋值id
    setId('scene', this);
    // this.id =
    //格式化数据
    this.opt = OptionFilter(opt);
    //创建场景
    this.scene = CreateScene(this.opt);
    //创建相机
    this.camera = CreateCamera(
      this.opt.camera,
      this.scene,
      this.opt.width,
      this.opt.height,
      this.opt.view
    );
    //创建光源
    this.light = CreateLight(this.opt.lights, this.scene);
    //创建环境光
    this.ambient = CreateAmbient(this.opt.ambientLight, this.scene);
    CreateThree.createMa(this.scene);
    //构造器
    this.renderer = CreateRenderer(
      this.opt.el,
      this.opt.width,
      this.opt.height,
      this.scene,
      this.camera
    );
    this.control = CreateControl(this.camera, this.renderer);
  }
  static createGeometry(geometry: GeometryType) {
    return new CreateGeometry(geometry);
  }
  static createGroup() {
    return CreateGroup();
  }
  add(me: ThreeConstruct.Group | ThreeConstruct.Geometry) {
    this.scene.add(me);
  }
  clear(): void {
    this.opt.el.innerHTML = '';
  }
}
