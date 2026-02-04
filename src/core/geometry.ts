import {
  GeometryOptionType,
  GeometryContainer,
  ContentType,
  MaterialType,
  TextGeometryType,
  TubeGeometryType,
  ShadowSetType,
} from '../../types/geometry';
import CreateThree from '../common/three';
import {
  setId,
  extendParent,
  throwError,
  _createLoaderKey,
  throttle,
  positionToCenter,
  lonlatToMercator,
  setObjShadow,
} from '../common/utils';
import { geometryInspect } from './inspect/inspect';
import CreateGeometry from './converter/geometry';
import Tween from '@tweenjs/tween.js';
import { isArray, isObject, isString } from 'loadsh';
import { _CONSTANT_ } from '../common/constant';
import { addRenderFunction, deleteRender, frameAnimation, Thes, _collecter } from './thes';
import { LoaderTypeOption, PositionType } from '../../types/thesFull';
import { _bus, _keybus } from '../common/bus';
import { cloneDeep } from 'loadsh';
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
  opt:
    | (GeometryOptionType & {
        animationId?: number;
        isLight?: boolean;
        targetObject?: any;
        isObj?: boolean;
      })
    | undefined;
  content: ContentType;
  tween: any;
  _load: LoaderTypeOption;
  dragControl: any = {};
  PARENT_THES: any;
  static props = [];
  static GPScenter: PositionType | null = null;
  _ONMOVE_: Function | null = null;
  _IS_DRAG_: boolean = false;
  _IS_CTRL_: boolean = false;
  _IS_MOVE_: boolean = false;
  _ROTATEX_: any;
  _ROTATEY_: any;
  _ROTATEZ_: any;
  _POSITION_: any;
  lastParent: any;
  _IS_FPS_: any;
  tubeGeometry: any;
  _FPS_ONMOVE: any;
  _DOWN_KEY: any = {};
  _SCALE: [number, number, number] = [1, 1, 1];
  get position() {
    return this._POSITION_;
  }
  set position(val: any) {
    this._POSITION_ = val;
    if (this._IS_FPS_) {
      this._FPS_ONMOVE?.call(null, val);
    }
  }
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
    opt.position && this.setPosition(opt.position);
    this.position = opt.position;
    this.tween = new Tween.Tween(geometry.thing.position);
    extendParent(Geometry.props, this, geometry);
    geometry.thing._PARENT_BOX_ = this;
    _bus.$on('keyDowmControl', (bol: boolean) => {
      this._IS_CTRL_ = bol;
      this.isDrag = this._IS_DRAG_;
    });
    this.rotateY = this.rotateY.bind(this);
    this.rotateX = this.rotateX.bind(this);
    this.rotateZ = this.rotateZ.bind(this);
    this.rotateZTo = this.rotateZTo.bind(this);
    this.rotateXTo = this.rotateXTo.bind(this);
    this.rotateYTo = this.rotateYTo.bind(this);
    this.openShadow();
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
  setPosition(position: [number | undefined, number | undefined, number | undefined] | number[]) {
    if (Thes.isGps) {
      let po = {
        lon: position[0],
        height: position[1],
        lat: position[2],
      };
      let op = positionToCenter({ ...lonlatToMercator(po), y: position[1] }, Thes.MercatorCenter);
      this.content.group.position.set(op.x, op.y, op.z);
      this.position = op;
    } else {
      this.content.group.position.set(...position);
      this.position = position;
    }
  }
  moveTo(
    position: {
      x: number;
      y: number;
      z: number;
      lon?: number;
      lat?: number;
      height?: number;
      time?: number;
      deg?: any;
      degTime?: number;
      direction: 'x' | 'y' | 'z';
    } & {
      x: number;
      y: number;
      z: number;
      lon?: number;
      lat?: number;
      height?: number;
      time?: number;
      deg?: any;
      degTime?: number;
      direction: 'x' | 'y' | 'z';
    }[],
    onMove?: Function,
    onEnded?: Function
  ) {
    this.isMove = true;
    if (position.x || position.lon) {
      this.tween = new Tween.Tween(this.content.group.position);
      let po = {
        lon: position.lon,
        y: position.height,
        lat: position.lat,
      };
      if (Thes.isGps) {
        position = {
          ...position,
          ...(positionToCenter(
            { ...lonlatToMercator(po), y: position.height },
            Thes.MercatorCenter
          ) as any),
        };
      }
      this.tween
        .to({ ...position }, position?.time || 10)
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
          this.tween = null;
          onEnded?.call(null);
          if (Thes.isGps) {
            this.setPosition([po.lon, po.y, po.lat]);
          } else {
            this.setPosition([position.x, position.y, position.z]);
          }
        })
        .onStop((e:any) => {
          if (Thes.isGps) {
            this.setPosition([po.lon, po.y, po.lat]);
          } else {
            // this
            this.setPosition([e.x, e.y, e.z]);
          }
        });
    } else {
      let index = 0;
      const mo = () => {
        if (position[index]) {
          if (Thes.isGps) {
            let po = {
              lon: position[index].lon,
              y: position[index].height,
              lat: position[index].lat,
            };
            position[index] = {
              ...position[index],
              ...(positionToCenter(
                { ...lonlatToMercator(po), y: position[index].height },
                Thes.MercatorCenter
              ) as any),
            };
          }
          this.tween = new Tween.Tween(this.content.group.position);
          this.tween
            .to({ ...position[index] }, position[index]?.time || 10)
            .start()
            .onUpdate((val: Record<string, any>) => {
              this._ONMOVE_?.call(null, { ...val, line: index + 1 });
              onMove?.call(null, { ...val, line: index + 1 });
            })
            .onComplete(() => {
              if (position[index].deg) {
                if (position[index].direction == 'x') {
                  this.rotateXTo(position[index].deg, position[index]?.degTime || 1000).onEnded(
                    () => {
                      index++;
                      mo();
                    }
                  );
                } else if (position[index].direction == 'y') {
                  this.rotateYTo(position[index].deg, position[index]?.degTime || 1000).onEnded(
                    () => {
                      index++;
                      mo();
                    }
                  );
                } else if (position[index].direction == 'z') {
                  this.rotateZTo(position[index].deg, position[index]?.degTime || 1000).onEnded(
                    () => {
                      index++;
                      mo();
                    }
                  );
                } else {
                  this.rotateYTo(position[index].deg, position[index]?.degTime || 1000).onEnded(
                    () => {
                      index++;
                      mo();
                    }
                  );
                }
              } else {
                if ((position[index] as any).isVector3 && position[index + 1]) {
                  if (Thes.isGps) {
                    let po = {
                      lon: position[index + 1].lon,
                      y: position[index + 1].height,
                      lat: position[index + 1].lat,
                    };
                    position[index + 1] = {
                      ...position[index + 1],
                      ...(positionToCenter(
                        { ...lonlatToMercator(po), y: position[index + 1].height },
                        Thes.MercatorCenter
                      ) as any),
                    };
                  }
                  this.lookAt([
                    position[index + 1].x,
                    position[index + 1].y,
                    position[index + 1].z,
                  ]);
                }
                index++;
                mo();
              }
            })
            .onStop((e: any) => {
              if (Thes.isGps) {
                // this.setPosition([po.lon, po.y, po.lat]);
              } else {
                this.setPosition([e.x, e.y, e.z]);
              }
            });
        } else {
          if (Thes.isGps) {
            let po = {
              lon: position[index - 1].lon,
              y: position[index - 1].height,
              lat: position[index - 1].lat,
            };
            this.setPosition([po.lon, po.y, po.lat]);
          } else {
            this.setPosition([position[index - 1].x, position[index - 1].y, position[index - 1].z]);
          }
          this._ONMOVE_?.call(null, { finish: true });
          this.isMove = false;
          this.tween = null;
          onEnded?.call(null);
        }
      };
      mo();
    }
  }
  moveStop() {
    if (!this.tween) {
      return;
    }
    this.tween.pause();
  }
  moveStart() {
    if (!this.tween) {
      return;
    }
    this.tween.resume();
  }
  moveDispose() {
    if (!this.tween) {
      return;
    }
    this.tween.stop();
    this.tween = null;
    this._ONMOVE_?.call(null, { finish: true });
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
  moveOnLine(line: any, time?: { [index: number]: number }, onMove?: Function, onEnded?: Function) {
    if (this.isMove) {
      this.moveDispose();
    }
    let point: any = [];
    if (line.content) {
      point =
        cloneDeep(line).content.points?.map((item: any) => {
          item.time = 1;
          item.x = item.x + line.content.thing.position.x;
          item.y = item.y + line.content.thing.position.y;
          item.z = item.z + line.content.thing.position.z;
          return item;
        }) || [];
    } else {
      cloneDeep(line).map((item: any, index: number) => {
        let arr = cloneDeep(item.content.points).map((cur: any, i: number) => {
          let obj: any = {};
          obj.time = (time && time[index]) || 1000;
          if (item.opt.isLine) {
            obj.x = cur[0] + item.content.thing.position.x;
            obj.y = cur[1] + item.content.thing.position.y;
            obj.z = cur[2] + item.content.thing.position.z;
            if (i == 0) {
              obj.time = 1;
            }
          } else if (item.opt.isCurve) {
            obj.x = cur.x + item.content.thing.position.x;
            obj.y = cur.y + item.content.thing.position.y;
            obj.z = cur.z + item.content.thing.position.z;
            obj.isVector3 = true;
            obj.time = 1;
          } else {
            throwError('请传入正确的线条');
          }
          return obj;
        });
        point = point.concat(arr);
      });
    }
    this.moveTo(point, onMove, onEnded);
  }
  bind(me: GeometryContainer) {
    if (me.content.thing.parent.uuid == this.content.thing.uuid) {
      return;
    }
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
    me.lastParent = me.content.thing.parent;
    this.content.group?.add(me.content.thing);
  }
  unBind(me: GeometryContainer) {
    me.PARENT_THES = null;
    if ((me as any).type == 'popup') {
      (me as any).dispose();
      return;
    }
    this.content.group?.remove(me.content.thing);
    if (me.lastParent) {
      me.lastParent.add(me.content.thing);
    } else {
      me.delete();
    }
  }
  getSize() {
    return CreateThree.createBox3(this.content.thing);
  }
  onKey(keyName: string, cb: Function) {
    _keybus.$on('Key' + keyName.toLocaleLowerCase(), {
      id: this.cid,
      type: this.type,
      fn: (falg: any) => {
        this._DOWN_KEY.keyName = falg;
        if (!this._IS_FPS_) {
          cb(this);
        }
      },
    });
  }
  offKey(keyName: string) {
    _keybus.$delete('Key' + keyName, {
      id: this.cid,
      type: this.type,
    });
  }
  scale(position: [number, number, number]): void {
    this.content.group.scale.set(...position);
    this._SCALE = position;
  }
  lookAt(position: number[]) {
    if (Thes.isGps) {
      let po = {
        lon: position[0],
        y: position[1],
        lat: position[2],
      };
      let op = positionToCenter({ ...lonlatToMercator(po), y: position[1] }, Thes.MercatorCenter);
      this.content.group.lookAt(op.x, op.y, op.z);
      this.position = po;
    } else {
      this.content.group.lookAt(position[0], position[1], position[2]);
      this.position = position;
    }
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
  setOpacity(num: number) {
    this.content.mat.transparent = true;
    this.content.mat.opacity = num;
  }
  rotateZ(deg: number): void {
    this.content.group.rotateZ(deg);
    this._ROTATEZ_ = deg;
  }
  rotateXTo(deg: number, time?: number): Record<string, any> {
    let instance = frameAnimation.instance({
      time: time || 1000,
      method: 'rotateX',
    });
    instance.from(0).to(deg).start(this);
    return instance;
  }
  rotateYTo(deg: number, time?: number): Record<string, any> {
    let instance = frameAnimation.instance({
      time: time || 1000,
      method: 'rotateY',
    });
    instance.from(0).to(deg).start(this);
    return instance;
  }
  rotateZTo(deg: number, time?: number): Record<string, any> {
    let instance = frameAnimation.instance({
      time: time || 1000,
      method: 'rotateZ',
    });
    instance.from(0).to(deg).start(this);
    return instance;
  }
  closeShadow(content?: string) {
    setObjShadow(this.content.thing, false, content);
  }
  openShadow(content?: string) {
    setObjShadow(this.content.thing, true, content);
  }
  setShadowAngle(shadow: number) {
    if (this.opt?.isLight) {
      this.content.light && (this.content.light.angle = shadow || Math.PI / 2);
    }
  }
  setLightTargetPosition(position: number[]) {
    this.content.light?.target.position.set(...position);
  }
  center(): void {
    this.content.group.center();
  }
  _MOVEAT_(cb: Function) {
    this._ONMOVE_ = cb;
  }
  _SETHOVER(flag: boolean) {
    if (flag) {
      // this.setColor('rgb(255,0,0)');
    } else {
      // this.setColor('rgb(255,255,255)');
    }
  }
  delete() {
    this.content.geo?.dispose();
    // this.content.mat?.dispose();
    this.content.thing?.removeFromParent();
    this.dragControl?.dispose();
    if (this.opt?.animationId) {
      deleteRender(this.opt?.animationId);
    }
    if (this.opt?.isLight) {
      this.opt?.targetObject.dispose();
    }
  }
}
