export interface idMapType {
  map: Map<string, number>;
  setById(name: string, value: any): void;
  findById(name: string): number | undefined;
  hasId(name: string): boolean;
}
