import { _bus } from '../common/bus';
import { _CONSTANT_, _CONSTANT_BUS_ } from '../common/constant';
import { setId, threeToScreen } from '../common/utils';
import { PopupContainer, PopupType } from '../../types/popup';
import { ThesContainer } from '../../types/thesFull';
import { popupInspect } from './inspect/inspect';
import { bodyElement } from './thes';
export class Popup implements PopupContainer {
  cid: number = -1;
  type = 'popup';
  opt: PopupType;
  th: any;
  isShow: boolean = false;
  //   pDom: HTMLElement;
  constructor(opt: PopupType) {
    setId(_CONSTANT_.POPUPIDNAME, this);
    popupInspect(opt);
    // this.pDom = pDom;
    this.opt = opt;
    this.setStyle();
    // this.pDom.appendChild(this.opt.content as Node);
  }
  setStyle() {
    this.opt.content && (this.opt.content.style.position = 'absolute');
    this.opt.content && (this.opt.content.style.zIndex = '2023');
  }
  setPosition(top: number, left: number) {
    this.opt.content && (this.opt.content.style.top = top + 'px');
    this.opt.content && (this.opt.content.style.left = left + 'px');
  }
  hide() {
    this.isShow = false;
    this.opt.content && (this.opt.content.style.display = 'none');
  }
  show() {
    this.isShow = true;
    this.opt.content && (this.opt.content.style.display = 'block');
  }
  dispose() {
    this.th?.opt.el.removeChild(this.opt.content as Node);
  }
  addTo(th: ThesContainer) {
    this.th = th.sceneBox || th;
    th.opt.el.appendChild(this.opt.content as Node);
    new (MutationObserver as any)(() => {
      this.setPosition(
        threeToScreen(this.opt.position, th.camera, this.opt.content as HTMLElement, bodyElement)
          .top,
        threeToScreen(this.opt.position, th.camera, this.opt.content as HTMLElement, bodyElement)
          .left as any
      );
      _bus.$emit(_CONSTANT_BUS_.ADD_POPUP, th);
    }).observe(th.opt.el, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    });
  }
}
