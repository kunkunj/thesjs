import { GeometryType, GeometryContainer } from '../types/geometry';
import { setId } from '../common/utils';
/// <reference path="../types/threeType/ThreeConstruct.ts" />
export default class Geometry implements GeometryContainer {
  id = -1;
  opt: GeometryType;
  static geometry: ThreeConstruct.Geometry;
  constructor(opt: GeometryType) {
    setId('geometry', this);
    this.opt = opt;
  }
}
