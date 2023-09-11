import { throwError } from '../../common/utils';
import { GeometryOptionType } from '../../types/geometry';
//
export const geometryInspect = (opt: GeometryOptionType) => {
  if (!opt.geometry) {
    throwError('geometry不存在');
  }
  if (!opt.material) {
    throwError('material不存在');
  }
};
