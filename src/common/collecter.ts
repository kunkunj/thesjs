type LoaderType = any;
interface CollecterContainer {
  deps: LoaderType[];
  notify: Function;
  watcher(): void;
  collect(loader: LoaderType): void;
}

export class Collecter implements CollecterContainer {
  deps: LoaderType[] = [];
  notify: Function;
  constructor(notify: Function) {
    this.notify = notify;
  }
  collect(loader: LoaderType): void {
    loader._DEP_KEY._IS_DEPED = true;
    this.deps.push(loader);
  }
  watcher(): void {
    const finshedFiles = this.deps.filter((loader: LoaderType) => {
      loader._DEP_KEY._IS_FINISHED == true;
    });
    const files = this.deps.filter((loader: LoaderType) => {
      loader._DEP_KEY._IS_DEPED == true;
    });
    const num = (finshedFiles.length / files.length).toFixed(2);
    this.notify(num, finshedFiles, files);
  }
}

// Example
function notify(num: number, finshedFiles: LoaderType[], files: LoaderType[]) {
  console.log(num);
}
const collecter = new Collecter(notify);
const Loader = (fn: Function) => {
  let loader: any = {}; //模拟文件对象
  loader._DEP_KEY = { _IS_DEPED: false, _IS_FINISHED: false };
  //模拟加载时间
  let time = Math.random() * 10000;
  console.log(time);
  //模拟文件加载成功回调
  setTimeout(() => {
    loader._DEP_KEY._IS_FINISHED = true;
    fn();
  }, time);
  return loader;
};
collecter.collect(Loader(collecter.watcher));
collecter.collect(Loader(collecter.watcher));
collecter.collect(Loader(collecter.watcher));
collecter.collect(Loader(collecter.watcher));
