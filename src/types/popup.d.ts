/**
 * position -- 位置
 * content -- 弹窗内容
 */
export type PopupType = {
  position: [number, number, number];
  content?: HTMLElement;
  offset?:number
};
export interface PopupContainer {
  cid: number;
  opt: PopupType;
  isShow: boolean
  th: any;
  setStyle(): void;
  setPosition(top: number, left: number): void;
  hide(): void;
  show(): void;
}
