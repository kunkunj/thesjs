import { optionsType } from '../../types/options';
import { isEmpty, cloneDeep } from 'loadsh';
import { throwError } from './utils';
import { defaultOption, defaultCamera, defaultLight, defaultAmbient } from '../data/option';
export default (opt: optionsType): optionsType => {
  if (!opt || !opt.el) {
    throwError('请传入节点！');
  }
  for (const key in defaultOption) {
    if (key != 'el' && !opt[key as keyof optionsType]) {
      opt[key as keyof optionsType] = defaultOption[key as keyof optionsType];
    }
  }
  if (!opt.width) {
    opt.width = window?.innerWidth;
  }
  if (!opt.height) {
    opt.height = window?.innerHeight;
  }
  return opt;
};
