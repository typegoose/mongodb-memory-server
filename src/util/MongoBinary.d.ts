import { DebugPropT } from '../types';

export interface MongoBinaryCache {
  [version: string]: string;
}

export interface MongoBinaryOpts {
  version?: string;
  downloadDir?: string;
  platform?: string;
  arch?: string;
  debug?: DebugPropT;
}

// disable error for a class with all static functions,
// so the TypeScript declaration would map the implementation with flow types for easier support.
// tslint:disable-next-line:no-unnecessary-class
export default class MongoBinary {
  static cache: MongoBinaryCache;

  static getPath(opts?: MongoBinaryOpts): Promise<string>;
  static hasValidBinPath(files: string[]): boolean;
}
