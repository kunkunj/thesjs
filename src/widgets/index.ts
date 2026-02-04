import { StyleContainer } from '../assets/style/index';
import { compiler } from '../common/utils';
import { ButtonOptionGroupType, widgetButton, widgetGroup } from './button';

enum Widgets {
  Button = 'Button',
}

let classNameList: Array<string> = [];
export const clearClassNameList = () => {
  classNameList = []
}
const loadeStyle = (childName: string) => {
  if (childName == Widgets.Button && !classNameList.includes(Widgets.Button)) {
    let style = StyleContainer.initHover([
      {
        name: '.thes-full-widget-button-dark',
        process: [
          {
            attr: 'opacity',
            data: '0.9',
          },
          {
            attr: 'color',
            data: '#e3fffe !important',
          },
        ],
      },
      {
        name: '.thes-full-widget-button-light',
        process: [
          {
            attr: 'opacity',
            data: '0.9',
          },
          {
            attr: 'color',
            data: '#e3fffe !important',
          },
        ],
      },
    ]);
    StyleContainer.addChild(style, 'thes-css-full');
    classNameList.push(Widgets.Button);
  }
};

const widgetToDom = (component: Function, opt: any): any => {
  return {
    vnode: component(opt),
    el: compiler(component(opt)),
    insetChild(childName: string, childComponent: Function) {
      this[childName] = (opt: Record<string, any>, cb: Function) => {
        loadeStyle(childName);
        this.el.appendChild(compiler(childComponent(opt, cb)));
      };
    },
  };
};

export const initWidget = (
  opt: ButtonOptionGroupType = { left: 50, top: 50, direction: 'column' }
) => {
  let group = widgetToDom(widgetGroup, opt);
  group.insetChild(Widgets.Button, widgetButton);
  return group;
};
