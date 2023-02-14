import { idMapType } from '../types/idType';
/**
 * id存储库
 */

class storage implements idMapType {
  map: Map<string, number>;
  constructor() {
    this.map = new Map();
  }
  setById(name: string, value: any) {
    this.map.set(name, value);
  }
  findById(name: string) {
    return this.map.get(name);
  }
  hasId(name: string) {
    return this.map.has(name);
  }
}

//单例模式
const idStorage: any = (function () {
  let instance: any;
  return function () {
    if (!instance) {
      instance = new storage();
    }
    return instance;
  };
})();
export default new idStorage();
