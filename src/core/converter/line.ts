import {
  ContentType,
  LineGeometryType,
} from '../../types/geometry';
import CreateThree from '../../common/three';
export default (opt: LineGeometryType): ContentType => {
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
  const geo = CreateThree.createLineGeometry(opt.points);
  return {
    mat,
    geo,
    thing: CreateThree.createLine(geo, mat),
  };
};
