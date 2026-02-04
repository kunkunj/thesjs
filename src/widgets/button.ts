import { TsxType } from '../../types/geometry';

type ButtonOptionType = {
  text: string;
  type: 'light' | 'dark';
};

let styles = {
  light: `
    background: #0c3845;
    box-shadow: 0 0 2px 1px #dcfdff;
    color: #ffffff;
    margin: 10px 10px 0 0;
    border-radius: 3px;
    padding: 0 15px;
    line-height: 30px;
    font-size: 15px;
    letter-spacing: 1px;
    cursor: pointer;
    display: inline-block;
    border: 1px solid #3EAEFC;
    `,
  dark: `
    background: #151518;
    box-shadow: 0 0 2px 1px #8e6d6d7a;
    color: #fff;
    margin: 10px 10px 0 0;
    border-radius: 2px;
    padding: 0 15px;
    line-height: 30px;
    font-size: 15px;
    letter-spacing: 1px;
    cursor: pointer;
    display: inline-block;
    border: 1px solid #282A36;
  `,
};

export const widgetButton = (option: ButtonOptionType, cb: Function): TsxType => {
  return {
    tag: 'div',
    attrs: {
      style: styles[option.type || 'dark'],
      class: 'thes-full-widget-button-' + (option.type || 'dark'),
    },
    on: [
      {
        type: 'click',
        fn: cb,
      },
    ],
    content: option.text,
  };
};

export type ButtonOptionGroupType = {
  left: number;
  top: number;
  direction: 'column' | 'row';
};
export const widgetGroup = (option: ButtonOptionGroupType, cb: Function): TsxType => {
  return {
    tag: 'div',
    attrs: {
      style:
        `position: absolute;height:auto;max-height:80vh;overflow:auto;display: flex;flex-direction: ${option.direction};align-items: flex-start;` +
        `left:${option.left || 50}px;top:${option.top || 50}px;padding:10px`,
    },
  };
};
