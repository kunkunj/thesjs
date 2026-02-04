import { throwError } from '../../common/utils';
import { GeometryOptionType } from '../../../types/geometry';
import { isElement } from 'loadsh';
import { PopupType } from '../../../types/popup';
//
export const geometryInspect = (opt: GeometryOptionType) => {
  if (!opt.geometry) {
    throwError('geometry不存在');
  }
  if (!opt.material) {
    throwError('material不存在');
  }
};
export const popupInspect = (opt: PopupType, pDom?: HTMLElement) => {
  if (!isElement(opt.content)) {
    throwError('请输入正确的dom');
  }
  if (pDom && !isElement(pDom)) {
    throwError('请输入正确的dom');
  }
};
