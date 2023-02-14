import idStorage from '../common/map';
//16进制转换
export function octalReplace(str: string): string {
  return str.replace('#', '0x');
}
//抛出异常
export function throwError(str: string) {
  throw new Error(str);
}
//赋值id
export function setId(type: string, the: any) {
  if (idStorage.hasId(type)) {
    the.id = idStorage.findById(type);
  } else {
    the.id = 1;
  }
  idStorage.setById(type, the.id + 1);
}
