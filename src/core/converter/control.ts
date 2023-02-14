import CreateThree from '../../common/three';
/// <reference path="./threeType/ThreeConstruct.ts" />
export default (
  camera: ThreeConstruct.Camera,
  renderer: ThreeConstruct.Renderer
): ThreeConstruct.Controls => {
  const controls: ThreeConstruct.Controls = CreateThree.createOrbitControls(
    camera,
    renderer.domElement
  );
  return controls;
};
