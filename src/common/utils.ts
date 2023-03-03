import idStorage from '../common/map';
import { LoaderTypeOption } from '../types/thesFull';
import CreateThree from './three';
//16进制转换
export function octalReplace(str: string): string {
  return str.replace('#', '0x');
}
//抛出异常
export function throwError(str: string) {
  throw new Error(str);
}
//赋值id
export function setId(type: string, the: any) {
  if (idStorage.hasId(type)) {
    the.cid = idStorage.findById(type);
  } else {
    the.cid = 1;
  }
  idStorage.setById(type, the.cid + 1);
}
//继承
export function extendParent(props: string[], the: any, geo: ThreeConstruct.Geometry) {
  props.map(item => {
    the[item] = the[item] ? the[item] : geo[item];
  });
}
type ScreenPosition = { left: number; top: number };
//世界坐标转平面坐标
export function threeToScreen(
  position: [number, number, number],
  camera: ThreeConstruct.Camera,
  dom: HTMLElement
): ScreenPosition {
  var worldVector = CreateThree.vector3(position);
  var standardVector = worldVector.project(camera); //世界坐标转标准设备坐标
  var a = window.innerWidth / 2;
  var b = window.innerHeight / 2;
  var x: number | string = Math.round(standardVector.x * a + a) - dom.offsetWidth / 2; //标准设备坐标转屏幕坐标
  var y: number | string = Math.round(-standardVector.y * b + b) - dom.offsetHeight; //标准设备坐标转屏幕坐标
  return {
    left: x,
    top: y,
  };
}
export function _createLoaderKey(loader: any): LoaderTypeOption {
  loader._DEP_KEY = { _IS_DEPED: false, _IS_FINISHED: false, _SIZE: 0, _CURRENT: 0 };
  return loader;
}
