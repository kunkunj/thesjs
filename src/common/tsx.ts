// <div style="position: fixed; width: 100vw; height: 100vh; z-index: 9999; background: #060003">
// <div
//   style="
//     width: 100%;
//     height: 100%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
//     font-size: 80px;
//     color: rgb(73, 92, 233);
//     opacity: 1;
//   "
// >
//   <div>80%</div>
//   <div>THES LOADING...</div>
// </div>

import { TipType, TsxType } from '../../types/geometry';
import { setId } from './utils';

// </div>
export const LoadToast = (text: any, obj: Record<string, any>): TsxType => {
  setId('loading', obj);
  return {
    tag: 'div',
    attrs: {
      style:
        'position: fixed; width: 100vw; height: 100vh; z-index: 9999; background: #060003;top:0;left:0;',
    },
    children: [
      {
        tag: 'div',
        attrs: {
          style: `width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;flex-direction: column;font-size: 80px;color: rgb(73, 92, 233);opacity: 1;animation: o 2s infinite linear alternate`,
        },
        children: [
          {
            tag: 'div',
            attrs: {
              id: '_toast_loading_thes' + obj.cid,
            },
            content: text,
          },
          {
            tag: 'div',
            attrs: {},
            content: 'THES LOADING...',
          },
        ],
      },
    ],
  };
};
export const LoadTip = (tip: TipType): TsxType => {
  return {
    tag: 'div',
    attrs: {
      style:
        ` background: rgba(0, 0, 0, 0);
        position: fixed;
        width: 100vw;
          height: ` +
        (tip.mask ? '100vh' : 0) +
        `;
        left: 0;
        right:0;
        top:0;
        margin:auto;
        z-index: 999;
        display: flex;
        justify-content: center`,
    },
    children: [
      {
        tag: 'div',
        attrs: {
          style: `display: flex;
            flex-direction: column;
            padding: 15px 20px 0;
            border-radius: 10px;
            box-shadow: 0 0 10px 2px #b4afaf;
            border: 1px solid #f2eded;
            position: absolute;
            top: 50px;
            font-size: 16px;
            letter-spacing: 1px;
            color: #7c7b7b;
            min-height: 40px;
            max-width: 600px;
            z-index: 9999;
            background: #fff`,
        },
        children: [
          {
            tag: 'div',
            attrs: {
              style: `flex: 1`,
            },
            content: tip.content,
          },
          getBtns(tip),
        ],
      },
    ],
  };
};
const getBtns = (tip: TipType): TsxType => {
  let arr: Array<TsxType> = [
    {
      tag: 'div',
      attrs: {
        style:
          `padding: 5px 10px;;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          background: ` +
          (tip.cancleBackground || '#4d5054') +
          `;
          color: ` +
          (tip.cancleColor || '#fff') +
          `;
          font-size: 14px;
          cursor: pointer;
          margin: 0 15px 0 0;`,
      },
      content: tip.cancleText || '取消',
      on: [
        {
          type: 'click',
          fn: tip.onCancle,
        },
      ],
    },
    {
      tag: 'div',
      attrs: {
        style:
          `padding: 5px 10px;;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          background: ` +
          (tip.sureBackground || '#4588FF') +
          `;
          color: ` +
          (tip.sureColor || '#fff') +
          `;
          font-size: 14px;
          cursor: pointer;`,
      },
      content: tip.sureText || '确定',
      on: [
        {
          type: 'click',
          fn: tip.onSure,
        },
      ],
    },
  ];
  if (tip.showCancle == false) {
    arr.shift();
  }
  if (tip.showSure == false) {
    arr.pop();
  }
  let ti: TsxType = {
    tag: 'div',
    attrs: {
      style: `height: 50px; display: ${
        tip.showCancle == false && tip.showSure == false ? 'none' : 'flex'
      };justify-content: flex-end;align-items: center;`,
    },
    children: arr,
  };
  return ti;
};
