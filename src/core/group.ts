import CreateThree from '../common/three';
import { GroupContainer, GroupType } from '../../types/group';
import { setId, throwError } from '../common/utils';
import { _CONSTANT_ } from '../common/constant';
export default class Group implements GroupContainer {
  id = -1;
  content:GroupType
  tween: any;
  constructor() {
    setId(_CONSTANT_.GROUPIDNAME, this)
    this.content = {
      thing: CreateThree.createGroup()
    }
  }
  add(ch:ThreeConstruct.Mesh): void{
    if (!ch.isObject3D) {
      throwError('不可新增不是Object3D类型的内容')
    }
    this.content.thing.add(ch)
  }
}
