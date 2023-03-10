import { initAnimate } from '../assets/style/Ani';
import { StyleContainer } from '../assets/style/index';
import { LoaderType } from '../types/geometry';
import { _bus } from './bus';
import { _CONSTANT_ } from './constant';
import { LoadToast } from './tsx';
import { compiler, throwError } from './utils';
export function toastHook(loading: boolean) {
  let loaded = false;
  let toasted = false;
  let loadpage: any;
  function notify(num: number, finshedFiles: LoaderType[], files: LoaderType[]) {
    if (num < 1) {
      _bus.$emit(_CONSTANT_.ONPROGRESS, num);
    } else {
      if (loaded) {
        return;
      }
      loaded = true
      loading && loadpage && document.getElementsByTagName('body')[0].removeChild(loadpage);
      loadpage = null;
      _bus.$emit(_CONSTANT_.LOADED, num);
    }
    if (loading && !loaded && !toasted) {
      let styleList = [
        initAnimate({
          name: 'o',
          process: [
            { time: 'from', data: 'opacity:0.2' },
            { time: 'to', data: 'opacity:1' },
          ],
        }),
      ];
      StyleContainer.createStyle(styleList);
      loadpage = compiler(LoadToast(0));
      document.getElementsByTagName('body')[0].appendChild(loadpage);
      toasted = true;
    }
    if (document.getElementById('_toast_loading_thes')) {
      (document.getElementById('_toast_loading_thes') as HTMLElement).innerHTML =
        Math.floor(num * 100) + '%';
    }
  }
  return {
    notify,
  };
}

export const mouseDownHook = (fn: Function) => {
  const detail = (event: Event) => {
    fn(event);
  };
  function add() {
    window.addEventListener('mousedown', detail);
  }
  function remove() {
    window.removeEventListener('mousedown', detail);
  }
  return {
    add,
    remove,
  };
};

/**
 * 动画注册hook
 *
 * 每一个组件，每一个功能点只能注册一个该动画
 */
type AniContent = {
  name: string;
  fn: Function;
};
// function THESANI(direction: 'x' | 'y' | 'z', time?: number) {
//   this.direction = 
// }
// THESANI.prototype.from = function (deg: number) {
//   this.start = deg;
// };
export const animateHook = () => {
  let anis: AniContent[] = [];
  function thes_add(anio: AniContent) {
    const newAni = anis.find((ani: AniContent) => ani.name == anio.name);
    if (!newAni) {
      anis.push(anio);
    } else {
      newAni.fn = anio.fn;
    }
  }
  function thes_update() {
    anis.map((ani: AniContent) => {
      ani.fn.call(null);
    });
  }
  //旋转
  return {
    thes_add,
    thes_update,
  };
};
// export const keyDowmHook = (codeKey: string, fn: Function) => {
//   document.onkeydown = e => {
//     if (e.key == codeKey) {
//       fn();
//     }
//   };
// };
