import CreateThree from '../../common/three';
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
