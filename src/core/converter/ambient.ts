import CreateThree from '../../common/three';
import { AmbientType } from '../../../types/options';
export default (amb: AmbientType, scene: ThreeConstruct.Scene): ThreeConstruct.AmbientLight => {
  const ambient: ThreeConstruct.AmbientLight = CreateThree.createAmbientLight(
    amb?.color ? amb?.color : 'rgb(255,255,255)',
    amb?.intensity || 1
  );
  scene.add(ambient);
  return ambient;
};
