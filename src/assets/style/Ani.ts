/**
 * name -- 动画名称
 * process -- keyframes的进程
 */
type IniteData = {
  name?: string;
  process?: Array<{ time: string; data: string }>;
};
//初始化动画
export function initAnimate(data: IniteData) {
  const list = (data.process || []) as [];
  let processStr = list.reduce(
    (str, item: Record<'time' | 'data', string>) => str + item.time + '{' + item.data + '}',
    ''
  );
  return `
        @keyframes ${data.name}{
            ${processStr}
        }
    `;
}
