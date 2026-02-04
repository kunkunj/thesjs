import {
    ContentType,
    LoaderType,
  } from '../../../types/geometry';
  import CreateThree from '../../common/three';
  export default (opt: LoaderType): ContentType => {
    let mat: any = {};
    const geo = CreateThree.createLineGeometry(opt);
    return {
      mat,
      geo,
      thing: CreateThree.createLine(geo, mat),
    };
  };