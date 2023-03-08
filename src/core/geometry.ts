import {
  GeometryOptionType,
  GeometryContainer,
  ContentType,
  MaterialType,
  TextGeometryType,
} from '../types/geometry';
import CreateThree from '../common/three';
import { setId, extendParent, throwError, _createLoaderKey } from '../common/utils';
import { geometryInspect } from './inspect/inspect';
import CreateGeometry from './converter/geometry';
import Tween from '@tweenjs/tween.js';
import { isArray, isObject, isString } from 'loadsh';
import { _CONSTANT_ } from '../common/constant';
import { _collecter } from './thes';
import { LoaderTypeOption } from '../types/thesFull';
import { _bus } from '../common/bus';
/**
 *
 * 懒加载思路标记，目前实用地少，后续改动
 *
 * 新增getMoudle方法，用来构造模型
 * th.add(geo.getMoudle)调用
 *
 * 预加载
 *
 * 配置预加载场景id
 *
 * 接收预加载和当前场景id，读取id加载文件
 *
 * 优点，构造时不会加载模型，调用th.add时才加载
 */
export default class Geometry implements GeometryContainer {
  id = -1;
  opt: GeometryOptionType | undefined;
  content: ContentType;
  tween: any;
  _load: LoaderTypeOption;
  dragControl: any = {};
  position: number[];
  static props = [];
  _IS_DRAG_: boolean = false;
  _IS_CTRL_: boolean = false;
  get isDrag() {
    return this._IS_DRAG_;
  }
  set isDrag(type: boolean) {
    this._IS_DRAG_ = type;
    if (type && this._IS_CTRL_) {
      this.dragControl.enabled = true;
    } else {
      this.dragControl.enabled = false;
    }
  }
  constructor(opt: GeometryOptionType, geo?: ThreeConstruct.Geometry) {
    this._load = _createLoaderKey({});
    setId(_CONSTANT_.GEOMETRYIDNAME, this);
    this.opt = opt;
    let geometry: ContentType;
    if (typeof geo == 'undefined') {
      geometryInspect(opt);
      geometry = _collecter.collect(CreateGeometry(opt, _collecter.watcher)) as any;
      geometry._DEP_KEY._CURRENT = 0;
      geometry._DEP_KEY._SIZE = 50;
    } else {
      geometry = geo;
    }
    this.content = geometry;
    opt.position && this.content.thing.position.set(...opt.position);
    this.position = opt.position;
    this.tween = new Tween.Tween(geometry.thing.position);
    extendParent(Geometry.props, this, geometry);
    geometry.thing._PARENT_BOX_ = this;
    _bus.$on('keyDowmControl', (bol: boolean) => {
      this._IS_CTRL_ = bol;
      this.isDrag = this._IS_DRAG_;
    });
  }
  setColor(color: ThreeConstruct.Color | ThreeConstruct.Color[]) {
    if (isString(color) && isObject(this.content.mat)) {
      this.content.mat.color = CreateThree.createColor(color as ThreeConstruct.Color);
      return;
    }
    if (isArray(color) && isArray(this.content.mat)) {
      this.content.mat.map((item: ThreeConstruct.Material, index: number) => {
        item.color = CreateThree.createColor(color[index]);
      });
      return;
    }
    throwError('color格式和Material库不匹配');
  }
  setPosition(position: [number, number, number]) {
    this.content.group.position.set(...position);
    this.position = position;
  }
  moveTo(
    position: {
      x: number;
      y: number;
      z: number;
      time?: number;
      deg?: any;
      direction: 'x' | 'y' | 'z';
    } & {
      x: number;
      y: number;
      z: number;
      time?: number;
      deg?: any;
      direction: 'x' | 'y' | 'z';
    }[]
  ) {
    // this.content.geo.translate();
    console.log(position.x);
    if (position.x) {
      this.tween = new Tween.Tween(this.content.group.position);
      this.tween
        .to({ ...position },position?.time || 1000)
        .start()
        .onComplete(() => {
          if (position.deg) {
            if (position.direction == 'x') {
              this.content.group.rotateX(position.deg);
            }
            if (position.direction == 'y') {
              this.content.group.rotateY(position.deg);
            }
            if (position.direction == 'z') {
              this.content.group.rotateZ(position.deg);
            }
          }
        });
    } else {
      let index = 0;
      const mo = () => {
        console.log(position[index]);
        if (position[index]) {
          this.tween = new Tween.Tween(this.content.group.position);
          this.tween
            .to({ ...position[index] },position[index]?.time || 1000)
            .start()
            .onComplete(() => {
              if (position[index].deg) {
                if (position[index].direction == 'x') {
                  this.content.group.rotateX(position[index].deg);
                }
                if (position[index].direction == 'y') {
                  this.content.group.rotateY(position[index].deg);
                }
                if (position[index].direction == 'z') {
                  this.content.group.rotateZ(position[index].deg);
                }
              }
              index++;
              mo();
            });
        }
      };
      mo();
    }
  }
  initDrag(camera: ThreeConstruct.Camera, renderer: ThreeConstruct.Renderer) {
    this.dragControl = CreateThree.createDragControls(
      [this.content.thing],
      camera,
      renderer.domElement
    );
    this.isDrag = this._IS_DRAG_;
    this.dragControl.addEventListener('dragend', (e: any) => {
      this.position = [e.object.position.x, e.object.position.y, e.object.position.z];
    });
  }
  bind(me: GeometryContainer) {
    this.content.group?.add(me.content.thing);
  }
  unBind(me: GeometryContainer) {
    this.content.group?.remove(me.content.thing);
  }
  scale(position: [number, number, number]): void {
    this.content.group.scale.set(...position);
  }
  translate(...arg: any): void {
    this.content.group.translate(...arg);
  }
  rotateX(...arg: any): void {
    this.content.group.rotateX(...arg);
  }
  rotateY(...arg: any): void {
    this.content.group.rotateY(...arg);
  }
  center(): void {
    this.content.group.center();
  }
  rotateZ(...arg: any): void {
    this.content.group.rotateZ(...arg);
  }
  delete() {
    this.content.geo.dispose();
    this.content.group.dispose();
    this.content.thing.dispose();
    this.content.thing.removeFromParent();
    this.dragControl.dispose();
  }
}
