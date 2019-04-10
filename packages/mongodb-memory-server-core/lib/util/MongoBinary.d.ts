import { DebugFn } from '../types';
export declare const LATEST_VERSION: string;
export interface MongoBinaryCache {
    [version: string]: string;
}
export interface MongoBinaryOpts {
    version?: string;
    downloadDir?: string;
    platform?: string;
    arch?: string;
    debug?: boolean | Function;
}
export default class MongoBinary {
    static cache: MongoBinaryCache;
    static debug: DebugFn;
    static getSystemPath(systemBinary: string): Promise<string>;
    static getCachePath(version: string): Promise<string>;
    static getDownloadPath(options: any): Promise<string>;
    static getPath(opts?: MongoBinaryOpts): Promise<string>;
    static hasValidBinPath(files: string[]): boolean;
}
//# sourceMappingURL=MongoBinary.d.ts.map