import { CameraType } from '../../../types/options';
import CreateThree from '../../common/three';
import { _CONSTANT_CAMERA_ } from '../../common/constant';

export default (
  cra: CameraType,
  scene: ThreeConstruct.Scene,
  width: number,
  height: number,
  view?: number
): ThreeConstruct.Camera => {
  let camera: ThreeConstruct.Camera;
  var k = width / height; //窗口宽高比
  var s = view || 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
  switch (cra.type) {
    case _CONSTANT_CAMERA_.CubeCamera:
      camera = CreateThree.createCubeCamera(
        cra?.CubeCameraOption?.near,
        cra?.CubeCameraOption?.far,
        cra?.CubeCameraOption?.renderTarget
      );
      break;
    case _CONSTANT_CAMERA_.OrthographicCamera:
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
    case _CONSTANT_CAMERA_.PerspectiveCamera:
      camera = CreateThree.createPerspectiveCamera(
        cra?.PerspectiveCameraOption?.fov,
        cra?.PerspectiveCameraOption?.aspectRatio,
        cra?.PerspectiveCameraOption?.near,
        cra?.PerspectiveCameraOption?.far
      );
      break;
  }
  camera.position.set(cra.position.x, cra.position.y, cra.position.z);
  camera._LOOKCENTER = scene.position
  camera.lookAt(scene.position);
  return camera;
};
