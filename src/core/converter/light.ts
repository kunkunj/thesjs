import { PointType } from '../../types/options';
import CreateThree from '../../common/three';
/// <reference path="./threeType/ThreeConstruct.d.ts" />

export default (lig: PointType, scene: ThreeConstruct.Scene): ThreeConstruct.Camera => {
  let light: ThreeConstruct.Light;
  //光源类型
  switch (lig.type) {
    case 'PointLight':
      light = CreateThree.createPointLight(
        lig?.PointLightOption?.color ? lig?.PointLightOption.color : 'rgb(255,255,255)',
        lig?.PointLightOption?.intensity || 1,
        lig?.PointLightOption?.distance || 0,
        lig?.PointLightOption?.decay || 2
      );
      break;
    case 'RectAreaLight':
      light = CreateThree.createRectAreaLight(
        lig?.RectAreaLightOption
          ? CreateThree.createColor(lig?.RectAreaLightOption.color as string)
          : CreateThree.createColor('rgb(255,255,255)'),
        lig?.RectAreaLightOption?.intensity || 1,
        lig?.RectAreaLightOption?.width || 10,
        lig?.RectAreaLightOption?.height || 10
      );
      break;
    case 'SpotLight':
      light = CreateThree.createRectAreaLight(
        lig?.SpotLightOption
          ? CreateThree.createColor(lig?.SpotLightOption.color as string)
          : CreateThree.createColor('rgb(255,255,255)'),
        lig?.SpotLightOption?.intensity || 1,
        lig?.SpotLightOption?.distance,
        lig?.SpotLightOption?.angle || 0,
        lig?.SpotLightOption?.penumbra || 0,
        lig?.SpotLightOption?.decay || 0
      );
      break;
  }
  //光源位置
  light.position.set(lig.position.x, lig.position.y, lig.position.z);
  //   camera.lookAt(scene.position);
  scene.add(light);
  return light;
};
