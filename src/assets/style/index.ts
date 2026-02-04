import { isArray } from 'loadsh';
function createStyle(children: string | Array<string>, id?: string) {
  let lastStyle = document.getElementById(id || 'thes-css-full');
  if (lastStyle) {
    document.getElementsByTagName('head')[0].removeChild(lastStyle);
  }
  let style = document.createElement('style');
  style.id = id || 'thes-css-full';
  if (isArray(children)) {
    style.innerHTML = (children as []).reduce((str: string, item: string) => str + item, '');
  } else {
    style.innerHTML = children as string;
  }
  document.getElementsByTagName('head')[0].appendChild(style);
}
//缓存css
let obj: Record<string, any> = {};
function addChild(children: string | Array<string>, id?: string) {
  if (isArray(children)) {
    obj[id || 'thes-css-full'] = obj[id || 'thes-css-full'] || '';
    obj[id || 'thes-css-full'] += (children as []).reduce(
      (total: string, item: string) => item + total,
      ''
    );
  } else {
    obj[id || 'thes-css-full'] = obj[id || 'thes-css-full'] || '';
    obj[id || 'thes-css-full'] += children;
  }
  window.onload = () => {
    let lastStyle = document.getElementById(id || 'thes-css-full');
    if (lastStyle) {
      lastStyle.innerHTML += obj[id || 'thes-css-full'];
    } else {
      createStyle(children, id);
    }
  };
}
import { initAnimate } from './Ani';
import { initHover } from './Hover';
export const StyleContainer = {
  createStyle,
  addChild,
  initAnimate,
  initHover,
};
