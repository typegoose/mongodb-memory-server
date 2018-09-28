/**
 * Flowtype definitions for decompress v4.2
 */

declare module "decompress" {
  declare interface File {
    data: Buffer;
    mode: number;
    mtime: string;
    path: string;
    type: string;
  }

  declare interface DecompressOptions {
    /**
     * Filter out files before extracting
     */
    filter(file: File): boolean;

    /**
     * Map files before extracting
     */
    map(file: File): File;

    /**
     * Array of plugins to use.
     * Default: [decompressTar(), decompressTarbz2(), decompressTargz(), decompressUnzip()]
     */
    plugins?: any[];

    /**
     * Remove leading directory components from extracted files.
     * Default: 0
     */
    strip?: number;
  }

  declare var decompress: (input: string | Buffer, output: string, opts?: DecompressOptions) => Promise<File>;

  declare module.exports: typeof decompress;
}
