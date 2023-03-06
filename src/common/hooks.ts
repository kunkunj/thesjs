import { initAnimate } from '../assets/style/Ani';
import { StyleContainer } from '../assets/style/index';
import { LoaderType } from '../types/geometry';
import { _bus } from './bus';
import { _CONSTANT_ } from './constant';
import { LoadToast } from './tsx';
import { compiler } from './utils';
export function toastHook(loading: boolean) {
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
      loading && loadpage && document.getElementsByTagName('body')[0].removeChild(loadpage);
      loadpage = null;
      _bus.$emit(_CONSTANT_.LOADED, num);
    }
    if (loading && !loaded && !toasted) {
      loadpage = compiler(LoadToast(0));
      console.log(loadpage);
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
