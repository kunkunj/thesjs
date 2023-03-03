import { CameraInitType, PositionType, SceneBoxType } from '../types/thesFull';
import { GeometryContainer } from '../types/geometry';
import { optionsType } from '../types/options';
import { setId } from '../common/utils';
import { _CONSTANT_, _CONSTANT_BUS_ } from '../common/constant';
import { _bus } from '../common/bus';
export default class SceneBox implements SceneBoxType {
  scene: ThreeConstruct.Scene;
  name: string = '';
  cid: number = -1;
  opt: optionsType | null = null;
  cameraInit: CameraInitType = {
    _LOOKCENTER: {
      x: 0,
      y: 0,
      z: 0,
    },
  };
  camera: ThreeConstruct.Camera;
  constructor(scene: ThreeConstruct.Scene) {
    setId(_CONSTANT_.SCENEIDNAME, this);
    this.scene = scene;
  }
  add(me: GeometryContainer) {
    this.scene.add(me.content.thing);
  }
  //获取视图中心的地图坐标
  getCenter(): PositionType | undefined {
    return this.cameraInit._LOOKCENTER;
  }
  //切换视图中心
  setCenter(_LOOKCENTER: PositionType) {
    console.log(1111,_LOOKCENTER)
    this.cameraInit._LOOKCENTER = _LOOKCENTER;
    _bus.$emit(_CONSTANT_BUS_.UPDATE_SCENE)
  }
  setCameraUp(up: PositionType) {
    this.cameraInit.UP = up;
    _bus.$emit(_CONSTANT_BUS_.UPDATE_SCENE)
  }
  // _SET_CAMERA_CENTER() {
  //   this.camera.lookAt(
  //     this.cameraInit?._LOOKCENTER?.x || 0,
  //     this.cameraInit?._LOOKCENTER?.x || 0,
  //     this.cameraInit?._LOOKCENTER?.x || 0
  //   );
  //   this.control.target = CreateThree.vector3([
  //     this.cameraInit?._LOOKCENTER?.x || 0,
  //     this.cameraInit?._LOOKCENTER?.x || 0,
  //     this.cameraInit?._LOOKCENTER?.x || 0,
  //   ]);
  //   this.camera.up = CreateThree.vector3([
  //     this.sceneBox.cameraInit?.UP?.x || 0,
  //     this.sceneBox.cameraInit?.UP?.x || 1,
  //     this.sceneBox.cameraInit?.UP?.x || 0,
  //   ]);
  // }
}
