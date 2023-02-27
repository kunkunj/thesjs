import CreateThree from '../../common/three';
import { ContentType, GeometryOptionType, MaterialType } from '../../types/geometry';
import { throwError } from '../../common/utils';
import { isArray, isObject } from 'loadsh';
export const createGeofn: ThreeConstruct.Geometry = (opt: GeometryOptionType) => {
  let geo: ThreeConstruct.Geometry;
  switch (opt.geometry) {
    case 'BoxGeometry':
      geo = CreateThree.createBoxGeometry(
        opt?.geometryOption?.width || 10,
        opt?.geometryOption?.height || 10,
        opt?.geometryOption?.depth || 10,
        opt?.geometryOption?.widthSegments || 1,
        opt?.geometryOption?.heightSegments || 1,
        opt?.geometryOption?.depthSegments || 1
      );
      break;
    case 'CircleGeometry':
      geo = CreateThree.createCircleGeometry(
        opt?.geometryOption?.radius || 10,
        opt?.geometryOption?.segments || 10,
        opt?.geometryOption?.thetaStart || 0,
        opt?.geometryOption?.thetaLength || 2 * Math.PI
      );
      break;
    case 'ConeGeometry':
      geo = CreateThree.createConeGeometry(
        opt?.geometryOption?.radius || 10,
        opt?.geometryOption?.height || 10,
        opt?.geometryOption?.radialSegments || 32,
        opt?.geometryOption?.heightSegments || 1,
        opt?.geometryOption?.openEnded || false,
        opt?.geometryOption?.thetaStart || 0,
        opt?.geometryOption?.thetaLength || 2 * Math.PI
      );
      break;
    case 'CylinderGeometry':
      geo = CreateThree.createCylinderGeometry(
        opt?.geometryOption?.radiusTop || 10,
        opt?.geometryOption?.radiusBottom || 10,
        opt?.geometryOption?.height || 32,
        opt?.geometryOption?.radialSegments || 32,
        opt?.geometryOption?.heightSegments || 1,
        opt?.geometryOption?.openEnded || false,
        opt?.geometryOption?.thetaStart || 0,
        opt?.geometryOption?.thetaLength || 2 * Math.PI
      );
      break;
    case 'PlaneGeometry':
      geo = CreateThree.createPlaneGeometry(
        opt?.geometryOption?.width || 10,
        opt?.geometryOption?.height || 10,
        opt?.geometryOption?.widthSegments || 1,
        opt?.geometryOption?.heightSegments || 1
      );
      break;
    case 'SphereGeometry':
      geo = CreateThree.createSphereGeometry(
        opt?.geometryOption?.radius || 10,
        opt?.geometryOption?.widthSegments || 32,
        opt?.geometryOption?.heightSegments || 16,
        opt?.geometryOption?.phiStart || 0,
        opt?.geometryOption?.phiLength || 2 * Math.PI,
        opt?.geometryOption?.thetaStart || 0,
        opt?.geometryOption?.thetaLength || 2 * Math.PI
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
      if (isObject(opt.materialOption)) {
        let map: ThreeConstruct.Texture;
        if (opt.materialOption?.map) {
          map = CreateThree.createTextureLoader(opt.materialOption?.map);
        }
        mat = CreateThree.createMeshBasicMaterial({
          ...opt.materialOption,
          color: CreateThree.createColor(
            (opt?.materialOption as MaterialType)?.color || 'rgb(255,255,255)'
          ),
          side: CreateThree.getSlide(),
          map: map,
        });
      }
      if (isArray(opt.materialOption)) {
        mat = opt.materialOption?.map((item: MaterialType) => {
          let map: ThreeConstruct.Texture;
          if (item?.map) {
            map = CreateThree.createTextureLoader(opt.materialOption?.map);
          }
          return CreateThree.createMeshBasicMaterial({
            ...item,
            color: CreateThree.createColor(item?.color || 'rgb(255,255,255)'),
            side: CreateThree.getSlide(),
            map: map,
          });
        });
      }
      break;

    default:
      throwError(`无“${opt.material}”该材质`);
      break;
  }
  return mat;
};
export default (opt: GeometryOptionType): ContentType => {
  const geo: ThreeConstruct.Geometry = createGeofn(opt);
  const mat: ThreeConstruct.Material = createMaFn(opt);
  return {
    thing: CreateThree.createMesh(geo, mat),
    geo,
    mat,
  };
};
