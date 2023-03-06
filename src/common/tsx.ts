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
// </div>
export type TsxType = {
  tag: 'div' | 'a' | 'img';
  attrs: Record<string, any>;
  content?: string;
  children?: TsxType[];
};
export const LoadToast = (num: any): TsxType => {
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
              id: '_toast_loading_thes',
            },
            content: Math.floor(num) + '%',
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
