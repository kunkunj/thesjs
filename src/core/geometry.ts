import { GeometryOptionType, GeometryContainer, ContentType } from '../types/geometry';
import CreateThree from '../common/three';
import { setId, extendParent } from '../common/utils';
import { geometryInspect } from './inspect/inspect';
import CreateGeometry from './converter/geometry';
import Tween from '@tweenjs/tween.js';
/// <reference path="../types/threeType/ThreeConstruct.ts" />
export default class Geometry implements GeometryContainer {
  id = -1;
  opt: GeometryOptionType;
  content: ContentType;
  tween: any;
  static props = [];
  constructor(opt: GeometryOptionType) {
    setId('geometry', this);
    this.opt = opt;
    geometryInspect(opt);
    const geometry = CreateGeometry(opt);
    this.content = geometry;
    this.content.thing.position.set(...opt.position)
    this.tween = new Tween.Tween(geometry.thing.position);
    extendParent(Geometry.props, this, geometry);
  }
  setColor(color: ThreeConstruct.Color) {
    this.content.mat.color = CreateThree.createColor(color);
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
}
