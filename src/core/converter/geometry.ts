import CreateThree from '../../common/three';
import { GeometryOptionType } from '../../types/geometry';
import { throwError } from '../../common/utils';
/// <reference path="./threeType/ThreeConstruct.d.ts" />
export const createGeofn: ThreeConstruct.Geometry = (opt: GeometryOptionType) => {
  let geo: ThreeConstruct.Geometry;
  switch (opt.geometry) {
    case 'BoxGeometry':
      geo = CreateThree.createBoxGeometry(
        opt?.BoxGeometryOption?.width || 10,
        opt?.BoxGeometryOption?.height || 10,
        opt?.BoxGeometryOption?.depth || 10,
        opt?.BoxGeometryOption?.widthSegments || 1,
        opt?.BoxGeometryOption?.heightSegments || 1,
        opt?.BoxGeometryOption?.depthSegments || 1
      );
      break;

    default:
      throwError(`无“${opt.geometry}”该类型`);
      break;
  }
  return geo;
};
export const createMaFn: ThreeConstruct.Material = (opt: GeometryOptionType) => {
  let mat: ThreeConstruct.Material;
  switch (opt.material) {
    case 'MeshBasicMaterial':
      mat = CreateThree.createMeshBasicMaterial({
        ...opt.materialOption,
        color: CreateThree.createColor(opt?.materialOption?.color || 'rgb(255,255,255)'),
      });
      break;

    default:
      throwError(`无“${opt.material}”该材质`);
      break;
  }
  return mat;
};
export default (opt: GeometryOptionType): ThreeConstruct.Mesh => {
  const geo: ThreeConstruct.Geometry = createGeofn(opt);
  const mat: ThreeConstruct.Material = createMaFn(opt);
  return {
    thing: CreateThree.createMesh(geo, mat),
    geo,
    mat,
  };
};
