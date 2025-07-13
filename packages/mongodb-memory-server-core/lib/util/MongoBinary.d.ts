import { BaseDryMongoBinaryOptions } from './DryMongoBinary';
export interface MongoBinaryOpts extends BaseDryMongoBinaryOptions {
    checkMD5?: boolean;
}
/**
 * Class used to combine "DryMongoBinary" & "MongoBinaryDownload"
 */
export declare class MongoBinary {
    /**
     * Probe download path and download the binary
     * @param options Options Configuring which binary to download and to which path
     * @returns The BinaryPath the binary has been downloaded to
     */
    static download(options: Required<MongoBinaryOpts>): Promise<string>;
    /**
     * Probe all supported paths for an binary and return the binary path
     * @param opts Options configuring which binary to search for
     * @throws {Error} if no valid BinaryPath has been found
     * @returns The first found BinaryPath
     */
    static getPath(opts?: MongoBinaryOpts): Promise<string>;
}
export default MongoBinary;
//# sourceMappingURL=MongoBinary.d.ts.map