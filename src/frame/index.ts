import { FrameOption } from '../../types/frameAnimation';
import { setId, throwError } from '../common/utils';
import { FrameInstance } from './instance';
import { cloneDeep } from 'loadsh';
type FrameAnimationContainer<T> = T;
export const FrameAnimation = function <
  T extends Record<string, any>
>(): FrameAnimationContainer<T> {
  let This: Record<string, any> = cloneDeep({});
  This.fnList = [];
  This.__proto__ = FrameAnimation.prototype;
  return This as T;
};
//帧运动
FrameAnimation.prototype.update = function () {
  this.fnList = this.fnList.filter((item: any) => !item._isEnd);
  this.fnList.map((item: any) => {
    item.update();
    return item;
  });
};
//新增动画
FrameAnimation.prototype.instance = function (option?: FrameOption) {
  const ani = FrameInstance(option);
  this.fnList.push(ani);
  return ani;
};
//动画plugin，，提供个带有update方法的对象,并且有结束标识_isEnd代表结束
FrameAnimation.prototype.Plugin = function (plu: Record<keyof any, any>) {
  if (!plu.update) {
    throwError('自定义动画必须带有update方法');
  }
  this.fnList.push(plu);
  return plu;
};
