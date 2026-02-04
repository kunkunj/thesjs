import { ContentType } from '../../types/geometry';
import { _bus } from './bus';
import { _CONSTANT_ } from './constant';
import { _createLoaderKey,throwError } from './utils';
import { cloneDeep } from 'loadsh'
type LoaderType = any;
export interface CollecterContainer {
  deps: LoaderType[];
  notify: Function;
  watchType: 'count' | 'byte';
  watcher(): void;
  collect(loader: LoaderType): void;
}
/**
 * 依赖收集
 * 场景模型懒加载、预加载----------------后续实现，，留个标记
 */
export class Collecter implements CollecterContainer {
  deps: LoaderType[] = [];
  notify: Function;
  watchType: 'count' | 'byte';
  constructor(notify: Function, type: 'count' | 'byte') {
    this.watcher = this.watcher.bind(this);
    this.notify = notify;
    this.watchType = type || 'count';
  }
  collect(loader: LoaderType): ContentType {
    if (typeof loader == 'undefined') {
      loader = _createLoaderKey({});
    }
    if (typeof loader == 'object' && !loader['_DEP_KEY']) {
      loader = _createLoaderKey(loader);
    }
    if (typeof loader == 'function') {
      return this.collect(loader.call(null));;
    }
    try {
      loader._DEP_KEY._IS_DEPED = true;
      this.deps.push(loader);
    } catch (error) {
      throwError('loader类型只能是object和function')
    }
    return loader
  }
  watcher(): void {
    const finshedFiles = this.deps.filter(
      (loader: LoaderType) => loader._DEP_KEY._IS_FINISHED == true
    );
    const files = this.deps.filter((loader: LoaderType) => loader._DEP_KEY._IS_DEPED == true);
    if (this.watchType == _CONSTANT_.WATCHCOUNT) {
      const num = (finshedFiles.length / files.length).toFixed(2);
      this.notify(num, finshedFiles, files);
    } else if (this.watchType == _CONSTANT_.WATCHBYTE) {
      const totalNum = this.deps.reduce(
        (total: number, loader: LoaderType) => (loader._DEP_KEY._SIZE || loader._DEP_KEY._CURRENT) + total,
        0
      );
      const curentNum = this.deps.reduce(
        (total: number, loader: LoaderType) => loader._DEP_KEY._CURRENT + total,
        0
      );
      const num = (curentNum / totalNum);
      // console.log(curentNum , totalNum,num)
      this.notify(num, finshedFiles, files);
    }
  }
}

// Example

/**
 * 发布订阅
 */

// interface _CollecterContainer {
//   queues: Record<string, Function[]>;
//   $on(name: string, cb: Function): void;
//   $emit(name: string, text?: any): void;
// }
// export class _Collecter implements _CollecterContainer {
//   queues: Record<string, Array<Function>> = {};
//   $on(name: string, cb: Function) {
//     if (!this.queues[name]) {
//       this.queues[name] = [cb];
//     } else {
//       this.queues[name].push(cb);
//     }
//   }
//   $emit(name: string, text?: any) {
//     const fnList: Function[] | undefined = this.queues[name];
//     fnList &&
//       fnList.map((fn: Function) => {
//         fn(text);
//       });
//   }
// }
// //Example
// function notify(num: number) {
//   console.log(num);
// }
// const _collecter = new _Collecter();
// const Loader = (fn: Function) => {
//   let loader: any = {}; //模拟文件对象
//   loader._DEP_KEY = { _IS_DEPED: false, _IS_FINISHED: false };
//   //模拟加载时间
//   let time = Math.random() * 10000;
//   console.log(time);
//   //模拟文件加载成功回调
//   setTimeout(() => {
//     loader._DEP_KEY._IS_FINISHED = true;
//     _collecter.$emit('finish');
//     fn();
//   }, time);
//   //模拟文件加载中回调
//   let total = Math.random() * 50;
//   let progress = 0;
//   setTimeout(() => {
//     progress += Math.random() * 10;
//     _collecter.$emit('load',progress);
//   }, 500);
//   return loader;
// };
// _collecter.$on('finish', (text?: any) => {
//   // notify()
// });
// _collecter.$on('load', (text?: any) => {
//   // notify()
// });
