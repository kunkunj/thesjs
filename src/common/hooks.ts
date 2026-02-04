import { initAnimate } from '../assets/style/Ani';
import { StyleContainer } from '../assets/style/index';
import { LoaderType } from '../../types/geometry';
import { _bus } from './bus';
import { _CONSTANT_ } from './constant';
import { LoadToast } from './tsx';
import { compiler, setId, throwError } from './utils';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import CreateThree from './three';
import { cloneDeep } from 'loadsh';
import { addRenderFunction, styleItemList } from '../core/thes';
export function toastHook(loading: boolean) {
  let loaded = false;
  let toasted = false;
  let loadpage: any;
  let idObj: Record<string, any> = {};
  function notify(num: number, finshedFiles: LoaderType[], files: LoaderType[]) {
    if (num < 1) {
      _bus.$emit(_CONSTANT_.ONPROGRESS, num);
    } else {
      if (loaded) {
        return;
      }
      loaded = true;
      loading && loadpage && document.getElementsByTagName('body')[0].removeChild(loadpage);
      loadpage = null;
      if (!document.getElementById('thes-css-full')) {
        StyleContainer.createStyle(styleItemList, 'thes-css-full');
      }
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
      StyleContainer.createStyle(styleList, 'thes-css-loading');
      loadpage = compiler(LoadToast('0%', idObj));
      document.getElementsByTagName('body')[0].appendChild(loadpage);
      toasted = true;
    }
    if (document.getElementById('_toast_loading_thes' + idObj.cid)) {
      (document.getElementById('_toast_loading_thes' + idObj.cid) as HTMLElement).innerHTML =
        Math.floor(num * 100) + '%';
    }
  }
  return {
    notify,
  };
}

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
export const renderHooks = () => {
  let renders: Record<string, any>[] = [];
  const addRenderFunction = (fn: Function, parmes?: any[], th?: any) => {
    let child = cloneDeep({});
    setId('renders', child);
    child.fn = fn;
    child.parmes = parmes;
    child.th = th;
    renders.push(child);
    return child.cid;
  };
  const excuteRender = () => {
    renders.map((item: Record<string, any>) => {
      item.fn && (item.fn as Function).apply(item.th || null, item.parmes);
    });
  };
  const deleteRender = (cid: number) => {
    renders = renders.filter((item: Record<string, any>) => item.cid != cid);
  };
  const clearRenders = () => {
    renders = [];
  };
  return {
    renders,
    addRenderFunction,
    excuteRender,
    deleteRender,
    clearRenders,
  };
};

export const breathHook = (renderer: ThreeConstruct.Renderer) => {
  let composer = new EffectComposer(renderer);
  const addPass = (renderScene: any, outlinePass: any) => {
    composer.addPass(renderScene);
    composer.addPass(outlinePass);
  };
  let FXAAShaderPass = new ShaderPass(FXAAShader);
  const pixelRatio = renderer.getPixelRatio();
  FXAAShaderPass.uniforms['resolution'].value.set(
    1 / (renderer.domElement.offsetWidth * pixelRatio),
    1 / (renderer.domElement.offsetHeight * pixelRatio)
  );
  FXAAShaderPass.renderToScreen = true;
  composer.addPass(FXAAShaderPass);
  const disposeCompser = () => {
    composer.dispose()
    FXAAShaderPass.dispose()
  }
  return {
    composer,
    addPass,
    disposeCompser
  };
};

//加载style
export const styleContainerHook = () => {
  let styleItemList: string[] = [];
  function addStyleContent(str: string) {
    styleItemList.push(str);
  }
  return {
    styleItemList,
    addStyleContent,
  };
};
