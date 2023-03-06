function createStyle(children: string[]) {
  let style = document.createElement('style');
  style.innerHTML = children.reduce((str: string, item: string) => str + item, '');
  document.getElementsByTagName('head')[0].appendChild(style);
}
import { initAnimate } from './Ani';
export const StyleContainer = {
  createStyle,
  initAnimate,
};
