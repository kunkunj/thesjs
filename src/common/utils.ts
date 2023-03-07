import idStorage from '../common/map';
import { ContentType } from '../types/geometry';
import { LoaderTypeOption } from '../types/thesFull';
import CreateThree from './three';
import { TsxType } from './tsx';
import { cloneDeep } from 'loadsh';
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
  loader._DEP_KEY = cloneDeep({ _IS_DEPED: false, _IS_FINISHED: false, _SIZE: 0, _CURRENT: 0 });
  return loader;
}
export function loadFinish(_load: ContentType, fn: Function) {
  setTimeout(() => {
    _load._DEP_KEY._CURRENT = 50;
    _load._DEP_KEY._IS_FINISHED = true;
    fn.call(null);
  }, 0);
}
//等待异步执行
// export function setPromise(pro: Promise<any>) {
//   try {
//     throw pro
//   } catch (error) {
//     pro.then((res) => {

//     })
//   }
// }
export function compiler(tsx: TsxType) {
  let dom: any = null;
  dom = document.createElement(tsx['tag']);
  for (const key1 in tsx['attrs']) {
    if (!['tag', 'attrs', 'children', 'content'].includes(key1)) {
      dom.setAttribute(key1, tsx['attrs'][key1]);
    }
  }
  if (tsx['content']) {
    dom.innerHTML = tsx['content'];
  }
  if (tsx['children'] && tsx['children'].length) {
    tsx['children'].map((item: TsxType) => {
      dom.appendChild(compiler(item));
    });
  }
  return dom;
}
export function throttle(fn: Function, time: number) {
  let d0 = Date.now();
  return function () {
    if (Date.now() - d0 > time) {
      fn.call(null);
      d0 = Date.now();
    }
  };
}
export function convert2Dto3D(
  x: number,
  y: number,
  camera: ThreeConstruct.Camera,
  renderer: ThreeConstruct.Renderer
) {
  let pX = (x / renderer.domElement.clientWidth) * 2 - 1;
  let pY = -(y / renderer.domElement.clientHeight) * 2 + 1;
  let p = CreateThree.vector3([pX, pY, -1]).unproject(camera);
  return CreateThree.vector2([p.x, p.y]);
}
