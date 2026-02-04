import CreateThree from '../../common/three';
import { ContentType, GeometryOptionType, MaterialType } from '../../../types/geometry';
import { loadFinish, throwError } from '../../common/utils';
import { isArray, isObject } from 'loadsh';
import { _CONSTANT_GEOMETRY_, _CONSTANT_MATERAIL_ } from '../../common/constant';
export const createGeofn: ThreeConstruct.Geometry = (
  opt: GeometryOptionType,
  watcher: Function,
  rt: ContentType
) => {
  let geo: ThreeConstruct.Geometry;
  switch (opt.geometry) {
    case _CONSTANT_GEOMETRY_.BoxGeometry:
      geo = CreateThree.createBoxGeometry(
        opt?.geometryOption?.width || 10,
        opt?.geometryOption?.height || 10,
        opt?.geometryOption?.depth || 10,
        opt?.geometryOption?.widthSegments || 1,
        opt?.geometryOption?.heightSegments || 1,
        opt?.geometryOption?.depthSegments || 1
      );
      loadFinish(rt, watcher);
      break;
    case _CONSTANT_GEOMETRY_.CircleGeometry:
      geo = CreateThree.createCircleGeometry(
        opt?.geometryOption?.radius || 10,
        opt?.geometryOption?.segments || 10,
        opt?.geometryOption?.thetaStart || 0,
        opt?.geometryOption?.thetaLength || 2 * Math.PI
      );
      loadFinish(rt, watcher);
      break;
    case _CONSTANT_GEOMETRY_.ConeGeometry:
      geo = CreateThree.createConeGeometry(
        opt?.geometryOption?.radius || 10,
        opt?.geometryOption?.height || 10,
        opt?.geometryOption?.radialSegments || 32,
        opt?.geometryOption?.heightSegments || 1,
        opt?.geometryOption?.openEnded || false,
        opt?.geometryOption?.thetaStart || 0,
        opt?.geometryOption?.thetaLength || 2 * Math.PI
      );
      loadFinish(rt, watcher);
      break;
    case _CONSTANT_GEOMETRY_.CylinderGeometry:
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
      loadFinish(rt, watcher);
      break;
    case _CONSTANT_GEOMETRY_.PlaneGeometry:
      geo = CreateThree.createPlaneGeometry(
        opt?.geometryOption?.width || 10,
        opt?.geometryOption?.height || 10,
        opt?.geometryOption?.widthSegments || 1,
        opt?.geometryOption?.heightSegments || 1
      );
      loadFinish(rt, watcher);
      break;
    case _CONSTANT_GEOMETRY_.SphereGeometry:
      geo = CreateThree.createSphereGeometry(
        opt?.geometryOption?.radius || 10,
        opt?.geometryOption?.widthSegments || 32,
        opt?.geometryOption?.heightSegments || 16,
        opt?.geometryOption?.phiStart || 0,
        opt?.geometryOption?.phiLength || 2 * Math.PI,
        opt?.geometryOption?.thetaStart || 0,
        opt?.geometryOption?.thetaLength || 2 * Math.PI
      );
      loadFinish(rt, watcher);
      break;
    default:
      throwError(`无“${opt.geometry}”该类型`);
      break;
  }
  return geo;
};
export const createMaFn: ThreeConstruct.Material = (
  opt: GeometryOptionType,
  watcher: Function,
  rt: ContentType
) => {
  let mat: ThreeConstruct.Material;
  switch (opt.material) {
    case _CONSTANT_MATERAIL_.MeshBasicMaterial:
      if (Object.getPrototypeOf(opt.materialOption).constructor === Object) {
        let map: ThreeConstruct.Texture;
        if (opt.materialOption?.map && !(opt.materialOption as any)?.isCanvas) {
          map = CreateThree.createTextureLoader(opt.materialOption?.map, () => {
            loadFinish(rt, watcher);
          });
        }
        if ((opt.materialOption as any)?.isCanvas) {
          map = opt.materialOption?.map;
          loadFinish(rt, watcher);
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
          if (item?.map && !(item as MaterialType)?.isCanvas) {
            map = CreateThree.createTextureLoader(opt.materialOption?.map, () => {
              loadFinish(rt, watcher);
            });
          }
          if ((item as any)?.isCanvas) {
            map = item?.map;
            loadFinish(rt, watcher);
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
    case _CONSTANT_MATERAIL_.MeshLambertMaterial:
      if (isObject(opt.materialOption)) {
        let map: ThreeConstruct.Texture;
        if (opt.materialOption?.map && !(opt.materialOption as MaterialType)?.isCanvas) {
          map = CreateThree.createTextureLoader(opt.materialOption?.map, () => {
            loadFinish(rt, watcher);
          });
        }
        if ((opt.materialOption as any)?.isCanvas) {
          map = opt.materialOption?.map;
          loadFinish(rt, watcher);
        }
        mat = CreateThree.createMeshLambertMaterial({
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
          if (item?.map && !(item as MaterialType)?.isCanvas) {
            map = CreateThree.createTextureLoader(opt.materialOption?.map, () => {
              loadFinish(rt, watcher);
              loadFinish(rt, watcher);
            });
          }
          if ((item as any)?.isCanvas) {
            map = item?.map;
          }
          return CreateThree.createMeshLambertMaterial({
            ...item,
            color: CreateThree.createColor(item?.color || 'rgb(255,255,255)'),
            side: CreateThree.getSlide(),
            map: map,
          });
        });
      }
      break;
    case _CONSTANT_MATERAIL_.MeshSpriteMaterial:
      let map: ThreeConstruct.Texture;
      if (opt.materialOption?.map) {
        map = CreateThree.createTextureLoader(opt.materialOption?.map, () => {
          loadFinish(rt, watcher);
        });
      }
      mat = new CreateThree.THREE.SpriteMaterial({
        ...opt.materialOption,
        color: CreateThree.createColor(
          (opt?.materialOption as MaterialType)?.color || 'rgb(255,255,255)'
        ),
        side: CreateThree.getSlide(),
        map: map,
      });
      break;
    default:
      if (opt.material) {
        throwError(`无“${opt.material}”该材质`);
      }
      break;
  }
  return mat;
};
export default (opt: GeometryOptionType, watcher?: Function): ContentType => {
  let rt: ContentType = { geo: null, mat: null, thing: null, group: null, mesh: null };
  rt.geo = createGeofn(opt, watcher, rt);
  rt.mat = createMaFn(opt, watcher, rt);
  rt.mesh = CreateThree.createMesh(rt.geo, rt.mat);
  rt.group = CreateThree.createGroup();
  // rt.edges = CreateThree.createEdgesHelper(
  //   mesh,
  //   CreateThree.createColor((opt?.materialOption as MaterialType)?.color || 'rgb(255,255,255)')
  // );
  rt.thing = rt.group.add(rt.mesh);
  return rt;
};
