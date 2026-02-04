import { FrameOption } from '../../types/frameAnimation';

export const FrameInstance = function <T>(option?: FrameOption): T {
  let This: Record<string, any> = {};
  This._direction = option?.method;
  This._time = option?.time;
  This.__proto__ = FrameInstance.prototype;
  return This as T;
};

//起点
FrameInstance.prototype.from = function (deg: number) {
  this._start = deg;
  return this;
};
//终点
FrameInstance.prototype.to = function (deg: number) {
  this._end = deg;
  return this;
};
//帧运动
FrameInstance.prototype.update = function () {
  if (this._flag == 'off') {
    return;
  }
  if (this._currentTime + this._space >= this._time) {
    this._updateFn?.call(null, this._end - this._start - this._progress);
    this._updateBack?.call(null, this._end);
    this._callBack?.call(null);
    this._isEnd = true;
    this._flag = 'off';
    this._callBack = null;
    this._updateFn = null;
    return false;
  }
  if (this._flag == 'on') {
    let d1 = Date.now();
    this._updateFn?.call(null, (this._end - this._start) / (this._time / (d1 - this._timePoint)));
    this._updateBack?.call(null, this._progress);
    this._progress += (this._end - this._start) / (this._time / (d1 - this._timePoint));
    this._currentTime += d1 - this._timePoint;
    this._space = d1 - this._timePoint;
    this._timePoint = d1;
  }
};
//初始化
FrameInstance.prototype.start = function <T extends Record<string, any>>(me: T) {
  this._currentTime = 0;
  this._timePoint = Date.now();
  this._progress = 0;
  this._flag = 'on';
  this._updateFn = this._direction && me[this._direction];
  return this;
};

FrameInstance.prototype.onEnded = function (cb: Function) {
  this._callBack = cb;
  return this;
};
FrameInstance.prototype.onUpdate = function (cb: Function) {
  this._updateBack = cb;
  return this;
};
