interface BusContainer {
  queues: Record<string, Function[]>;
  $on(name: string, cb: Function): void;
  $emit(name: string, text?: any): void;
}
class Bus implements BusContainer {
  queues: Record<string, Array<Function>> = {};
  $on(name: string, cb: Function) {
    if (!this.queues[name]) {
      this.queues[name] = [cb];
    } else {
      this.queues[name].push(cb);
    }
  }
  $emit(name: string, text?: any) {
    const fnList: Function[] | undefined = this.queues[name];
    fnList &&
      fnList.map((fn: Function) => {
        fn(text);
      });
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
