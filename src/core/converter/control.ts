import CreateThree from '../../common/three';
export default (
  camera: ThreeConstruct.Camera,
  renderer: ThreeConstruct.Renderer
): ThreeConstruct.Controls => {
  const controls: ThreeConstruct.Controls = CreateThree.createOrbitControls(
    camera,
    renderer.domElement
  );
  controls.enableRotate = true;
  controls.rotateSpeed = 0.5;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  return controls;
};
