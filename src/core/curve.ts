import CreateThree from '../common/three';
import { setId, throwError } from '../common/utils';
import { _CONSTANT_ } from '../common/constant';
import { CurveContainer, CurveType } from '../../types/curve';
export default class Curve implements CurveContainer {
  id = -1;
  content: CurveType;
  tween: any;
  constructor() {
    setId(_CONSTANT_.CURVE, this);
    this.content = {
      thing: CreateThree.createGroup(),
    };
  }
}
