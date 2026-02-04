import { ContentType, LineGeometryType } from '../../../types/geometry';
import CreateThree from '../../common/three';
export default (opt: LineGeometryType): ContentType & { points: Array<number[]>; cover: Record<keyof any, any> } => {
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
  let geo: ThreeConstruct.Geometry;
  if (opt.isCover) {
    geo = CreateThree.createCatmullRomCurve3(opt.points);
  } else {
    geo = CreateThree.createLineGeometry(opt.points);
  }
  const cover = CreateThree.createCurvePath(opt.points);
  let group = CreateThree.createGroup();
  return {
    mat,
    geo,
    group,
    cover,
    points: opt.points,
    thing: group.add(CreateThree.createLine(geo, mat)),
  };
};
