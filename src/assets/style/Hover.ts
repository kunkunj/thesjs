import { isArray } from 'loadsh';
/**
 * name -- hover名称
 * process -- hover的进程
 */
type IniteData = {
  name?: string;
  process?: Array<{ attr: string; data: string }>;
};
//初始化动画
export function initHover(data: IniteData | IniteData[]): string {
  let classStr: string = '';
  if (isArray(data)) {
    (data as []).map((item: IniteData) => {
      classStr += getClassContent(item);
    });
  } else {
    classStr = getClassContent(data as IniteData);
  }
  return classStr;
}
function getClassContent(data: IniteData): string {
  const list = (data.process || []) as [];
  let processStr = list.reduce(
    (str, item: Record<'attr' | 'data', string>) =>
      str +
      `${item.attr}:${item.data};
  `,
    ''
  );
  return `${data.name}:hover{
  ${processStr}
}
`;
}
