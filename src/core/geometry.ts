import {
  GeometryOptionType,
  GeometryContainer,
  ContentType,
  MaterialType,
  TextGeometryType,
} from '../types/geometry';
import CreateThree from '../common/three';
import { setId, extendParent, throwError, _createLoaderKey, throttle } from '../common/utils';
import { geometryInspect } from './inspect/inspect';
import CreateGeometry from './converter/geometry';
import Tween from '@tweenjs/tween.js';
import { isArray, isObject, isString } from 'loadsh';
import { _CONSTANT_ } from '../common/constant';
import { _collecter } from './thes';
import { LoaderTypeOption } from '../types/thesFull';
import { _bus, _keybus } from '../common/bus';
import { PopupContainer } from '../types/popup';
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
  cid: number = -1;
  type = 'geometry';
  opt: GeometryOptionType | undefined;
  content: ContentType;
  tween: any;
  _load: LoaderTypeOption;
  dragControl: any = {};
  position: number[];
  PARENT_THES: any;
  static props = [];
  _ONMOVE_: Function | null = null;
  _IS_DRAG_: boolean = false;
  _IS_CTRL_: boolean = false;
  _IS_MOVE_: boolean = false;
  _ROTATEX_: any;
  _ROTATEY_: any;
  _ROTATEZ_: any;
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
  get isMove() {
    return this._IS_MOVE_;
  }
  set isMove(val: boolean) {
    this._IS_MOVE_ = val;
    if (!val) {
      this._ONMOVE_ = null;
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
    }[],
    onMove?: Function,
    onEnded?: Function
  ) {
    // this.content.geo.translate();
    if (position.x) {
      this.tween = new Tween.Tween(this.content.group.position);
      this.isMove = true;
      this.tween
        .to({ ...position }, position?.time || 1000)
        .start()
        .onUpdate((val: Record<string, any>) => {
          this._ONMOVE_?.call(null, val);
          onMove?.call(null, val);
        })
        .onComplete(() => {
          if (position.deg) {
            if (position.direction == 'x') {
              this.content.group.rotateX(position.deg);
            } else if (position.direction == 'y') {
              this.content.group.rotateY(position.deg);
            } else if (position.direction == 'z') {
              this.content.group.rotateZ(position.deg);
            } else {
              this.content.group.rotateY(position.deg);
            }
          }
          this._ONMOVE_?.call(null, { finish: true });
          this.isMove = false;
          onEnded?.call(null);
          this.setPosition([position.x, position.y, position.z]);
        });
    } else {
      let index = 0;
      const mo = () => {
        if (position[index]) {
          this.tween = new Tween.Tween(this.content.group.position);
          this.tween
            .to({ ...position[index] }, position[index]?.time || 1000)
            .start()
            .onUpdate(
              throttle((val: Record<string, any>) => {
                this._ONMOVE_?.call(null, { ...val[0], line: index + 1 });
                onMove?.call(null, { ...val[0], line: index + 1 });
              }, 1)
            )
            .onComplete(() => {
              if (position[index].deg) {
                if (position[index].direction == 'x') {
                  this.content.group.rotateX(position[index].deg);
                } else if (position[index].direction == 'y') {
                  this.content.group.rotateY(position[index].deg);
                } else if (position[index].direction == 'z') {
                  this.content.group.rotateZ(position[index].deg);
                } else {
                  this.content.group.rotateY(position[index].deg);
                }
              }
              index++;
              mo();
            });
        } else {
          this.setPosition([position[index - 1].x, position[index - 1].y, position[index - 1].z]);
          this._ONMOVE_?.call(null, { finish: true });
          this.isMove = false;
          console.log('finnish', this._ONMOVE_);
          onEnded?.call(null);
        }
      };
      mo();
    }
  }
  initDrag(camera: ThreeConstruct.Camera, renderer: ThreeConstruct.Renderer) {
    this.dragControl = CreateThree.createDragControls(
      [this.content.group],
      camera,
      renderer.domElement
    );
    this.isDrag = this._IS_DRAG_;
    this.dragControl.addEventListener('dragend', (e: any) => {
      this.position = [e.object.position.x, e.object.position.y, e.object.position.z];
    });
  }
  bind(me: GeometryContainer) {
    me.PARENT_THES = this.PARENT_THES;
    if ((me as any).type == 'popup') {
      (me as any).opt.position = [
        this.position[0],
        this.getSize().max.y + parseFloat((me as any).opt.offset),
        this.position[2],
      ] as any;
      (me as any).addTo(this.PARENT_THES);
      return;
    }
    this.content.group?.add(me.content.thing);
  }
  unBind(me: GeometryContainer) {
    me.PARENT_THES = null;
    if ((me as any).type == 'popup') {
      (me as any).dispose();
      return;
    }
    this.content.group?.remove(me.content.thing);
  }
  getSize() {
    return CreateThree.createBox3(this.content.thing);
  }
  onKey(keyName: string, cb: Function) {
    _keybus.$on('Key' + keyName, {
      id: this.cid,
      type: this.type,
      fn: () => {
        cb(this);
      },
    });
    console.log(_keybus);
  }
  offKey(keyName: string) {
    _keybus.$delete('Key' + keyName, {
      id: this.cid,
      type: this.type,
    });
  }
  scale(position: [number, number, number]): void {
    this.content.group.scale.set(...position);
  }
  translateX(num: number): void {
    this.content.group.translateX(num);
    this.setPosition([this.position[0] + num, this.position[1], this.position[2]]);
  }
  translateY(num: number): void {
    this.content.group.translateY(num);
    this.setPosition([this.position[0], this.position[1] + num, this.position[2]]);
  }
  translateZ(num: number): void {
    this.content.group.translateZ(num);
    this.setPosition([this.position[0], this.position[1], this.position[2] + num]);
  }
  rotateX(deg: number): void {
    this.content.group.rotateX(deg);
    this._ROTATEX_ = deg;
  }
  rotateY(deg: number): void {
    this.content.group.rotateY(deg);
    this._ROTATEY_ = deg;
  }
  center(): void {
    this.content.group.center();
  }
  rotateZ(deg: number): void {
    this.content.group.rotateZ(deg);
    this._ROTATEZ_ = deg;
  }
  _MOVEAT_(cb: Function) {
    this._ONMOVE_ = cb;
  }
  delete() {
    this.content.geo.dispose();
    this.content.group.dispose();
    this.content.thing.dispose();
    this.content.thing.removeFromParent();
    this.dragControl.dispose();
  }
}
