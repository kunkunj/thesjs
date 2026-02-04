import { ContentType } from './geometry';

export type GroupContainer = {
  id: number;
  tween: Record<keyof any, any>;
  content: GroupType;
};
export type GroupType = {
  thing: Record<keyof any, any>;
};
