import {
  GeometryOptionType,
  GeometryContainer,
  ContentType,
  MaterialType,
  TextGeometryType,
} from '../types/geometry';
import CreateThree from '../common/three';
import { setId, extendParent, throwError } from '../common/utils';
import { geometryInspect } from './inspect/inspect';
import CreateGeometry from './converter/geometry';
import Tween from '@tweenjs/tween.js';
import { isArray, isObject, isString } from 'loadsh';
/// 
export default class Geometry implements GeometryContainer {
  id = -1;
  opt: GeometryOptionType | undefined;
  content: ContentType;
  tween: any;
  static props = [];
  constructor(opt: GeometryOptionType, geo?: ThreeConstruct.Geometry) {
    console.log(geo);
    setId('geometry', this);
    this.opt = opt;
    let geometry: ContentType;
    if (typeof geo == 'undefined') {
      geometryInspect(opt);
      geometry = CreateGeometry(opt);
    } else {
      geometry = geo;
    }
    this.content = geometry;
    opt.position && this.content.thing.position.set(...opt.position);
    this.tween = new Tween.Tween(geometry.thing.position);
    extendParent(Geometry.props, this, geometry);
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
    this.content.thing.position.set(...position);
  }
  moveTo(position: { x: number; y: number; z: number }, time?: number) {
    // this.content.geo.translate();
    this.tween = new Tween.Tween(this.content.thing.position);
    this.tween.to({ ...position }, time || 1000).start();
    this.setPosition([position.x, position.y, position.z]);
  }
  scale(...arg: any): void {
    this.content.geo.scale(...arg);
  }
  translate(...arg: any): void {
    this.content.geo.translate(...arg);
  }
  rotateX(...arg: any): void {
    this.content.geo.rotateX(...arg);
  }
  rotateY(...arg: any): void {
    this.content.geo.rotateY(...arg);
  }
  center(): void{
    this.content.geo.center();
  }
  rotateZ(...arg: any): void {
    this.content.geo.rotateZ(...arg);
  }
  delete() {
    this.content.geo.dispose()
    this.content.thing.removeFromParent();
  }
}
