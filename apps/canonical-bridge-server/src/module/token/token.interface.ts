export interface ITokenJob {
  start?: number;
  limit?: number;
  ids?: string;
  keyMap?: Record<string, string>;
}

export interface ITokenPriceRecord {
  [k: string]: { price: string; id: number };
}
