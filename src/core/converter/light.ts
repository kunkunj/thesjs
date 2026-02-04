import { PointType } from '../../../types/options';
import CreateThree from '../../common/three';
import { _CONSTANT_CAMERA_, _CONSTANT_LIGHT_ } from '../../common/constant';

export default (lig: PointType, scene?: ThreeConstruct.Scene): ThreeConstruct.Camera => {
  if (!lig) {
    return {};
  }
  let light: ThreeConstruct.Light;
  //光源类型
  switch (lig.type) {
    case _CONSTANT_LIGHT_.PointLight:
      light = CreateThree.createPointLight(
        lig?.LightOption?.color ? lig?.LightOption.color : 'rgb(255,255,255)',
        lig?.LightOption?.intensity || 1,
        lig?.LightOption?.distance || 0,
        lig?.LightOption?.decay || 2
      );
      break;
    case _CONSTANT_LIGHT_.RectAreaLight:
      light = CreateThree.createRectAreaLight(
        lig?.LightOption
          ? CreateThree.createColor(lig?.LightOption.color as string)
          : CreateThree.createColor('rgb(255,255,255)'),
        lig?.LightOption?.intensity || 1,
        lig?.LightOption?.width || 10,
        lig?.LightOption?.height || 10
      );
      break;
    case _CONSTANT_LIGHT_.SpotLight:
      light = CreateThree.createRectAreaLight(
        lig?.LightOption
          ? CreateThree.createColor(lig?.LightOption.color as string)
          : CreateThree.createColor('rgb(255,255,255)'),
        lig?.LightOption?.intensity || 1,
        lig?.LightOption?.distance,
        lig?.LightOption?.angle || 0,
        lig?.LightOption?.penumbra || 0,
        lig?.LightOption?.decay || 0
      );
      break;
  }
  //光源位置
  light.position.set(lig.position.x, lig.position.y, lig.position.z);
  //   camera.lookAt(scene.position);
  scene?.add(light);
  return light;
};
