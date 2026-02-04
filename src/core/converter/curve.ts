import { ContentType, LineGeometryType } from '../../../types/geometry';
import { PointType } from '../../../types/options';
import CreateThree from '../../common/three';
import { throwError } from '../../common/utils';
export default (opt: LineGeometryType): ContentType & { points: number[] } => {
  let mat: Omit<LineGeometryType, 'points' | 'type'>;
  if (opt.type == 'dashed') {
    mat = CreateThree.createDashedMaterial({
      color: CreateThree.createColor(opt.color || 'rgb(0,0,0)'),
      linewidth: opt.linewidth || 1,
      linecap: opt.linecap || 'round',
      linejoin: opt.linejoin || 'round',
      dashSize: opt.dashSize || 5,
      gapSize: opt.linejoin || 1,
      isLineDashedMaterial: opt.isLineDashedMaterial || false,
      scale: opt.scale || 1,
    });
  } else {
    mat = CreateThree.createBasicMaterial({
      color: CreateThree.createColor(opt.color || 'rgb(0,0,0)'),
      linewidth: opt.linewidth || 1,
      linecap: opt.linecap || 'round',
      linejoin: opt.linejoin || 'round',
    });
  }
  let curve: ThreeConstruct.Geometry;
  if (opt.isBezier) {
    curve = CreateThree.createCubicBezierCurve3(opt.points);
  } else {
    curve = CreateThree.createLineCurve3(opt.points);
  }
  let points = curve.getPoints(opt.pointNum || 50);
  const geo = new CreateThree.THREE.BufferGeometry().setFromPoints(points);
  let group = CreateThree.createGroup();
  return {
    mat,
    geo,
    group,
    curve,
    points,
    thing: group.add(CreateThree.createLine(geo, mat)),
  };
};
