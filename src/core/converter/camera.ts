import { CameraType } from '../../types/options';
import CreateThree from '../../common/three';
/// <reference path="./threeType/ThreeConstruct.d.ts" />

export default (
  cra: CameraType,
  scene: ThreeConstruct.Scene,
  width: number,
  height: number,
  view: number
): ThreeConstruct.Camera => {
  let camera: ThreeConstruct.Camera;
  switch (cra.type) {
    case 'CubeCamera':
      camera = CreateThree.createCubeCamera(
        cra?.CubeCameraOption?.near,
        cra?.CubeCameraOption?.far,
        cra?.CubeCameraOption?.renderTarget
      );
      break;
    case 'OrthographicCamera':
      var k = width / height; //窗口宽高比
      var s = view; //三维场景显示范围控制系数，系数越大，显示的范围越大
      camera = CreateThree.createOrthographicCamera(
        -s * k,
        s * k,
        s,
        -s,
        cra?.OrthographicCameraOption?.near,
        cra?.OrthographicCameraOption?.far
      );
      break;
    case 'StereoCamera':
      camera = CreateThree.createStereoCamera();
      break;
    case 'PerspectiveCamera':
      camera = CreateThree.createPerspectiveCamera(
        cra?.PerspectiveCameraOption?.fov,
        cra?.PerspectiveCameraOption?.aspectRatio,
        cra?.PerspectiveCameraOption?.near,
        cra?.PerspectiveCameraOption?.far
      );
      break;
  }
  camera.position.set(cra.position.x, cra.position.y, cra.position.z);
  camera.lookAt(scene.position);
  return camera;
};
