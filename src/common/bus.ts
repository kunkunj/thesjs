type Id = 'id';
type Fun = 'fn';
type Ty = 'type';
type Cb = Record<Id | Fun | Ty, any> | Function;
type QueuesType = Record<string, Array<Cb>>;
interface BusContainer {
  queues: QueuesType;
  $on(name: string, cb: Cb): void;
  $emit(name: string, text?: any): void;
  $off(name: string): void;
  $delete(name: string, poy: any): void;
}
class Bus implements BusContainer {
  queues: QueuesType = {};
  $on(name: string, cb: Cb) {
    if (!this.queues[name]) {
      this.queues[name] = [cb];
    } else {
      this.queues[name].push(cb);
    }
  }
  $emit(name: string, text?: any) {
    const fnList: Array<Cb> | undefined = this.queues[name];
    fnList &&
      fnList.map((fn: any) => {
        if (fn.id) {
          fn.fn.apply(null, [text, fn]);
        } else {
          fn(text);
        }
      });
  }
  $delete(name: string, poy: any) {
    if (!this.queues[name]) {
      return;
    }
    let item = this.queues[name];
    if (item.length) {
      this.queues[name] = item.filter((cur: any) => cur.id != poy.id || cur.type != poy.type);
    }
  }
  $off(name: string) {
    if (!this.queues[name]) {
      return;
    }
    this.queues[name].length = 0;
    delete this.queues[name];
  }
}
export const _bus: BusContainer = new Bus();
export const _keybus: BusContainer = new Bus();
