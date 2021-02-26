import { promises as fspromises, constants } from 'fs';
import debug from 'debug';
import { envToBool, resolveConfig, ResolveConfigVariables } from './resolveConfig';
import { isNullOrUndefined, pathExists } from './utils';
import * as path from 'path';
import { arch, homedir, platform } from 'os';
import findCacheDir from 'find-cache-dir';
import getOS, { AnyOS } from './getos';
import { MongoBinaryDownloadUrl } from './MongoBinaryDownloadUrl';

const log = debug('MongoMS:DryMongoBinary');

export interface BaseDryMongoBinaryOptions {
  version?: string;
  downloadDir?: string;
  os?: AnyOS;
  arch?: string;
  systemBinary?: string;
}

export interface DryMongoBinaryOptions extends BaseDryMongoBinaryOptions {
  version: string;
}

export interface DryMongoBinaryPaths {
  resolveConfig: string;
  legacyHomeCache: string;
  modulesCache: string;
  relative: string;
}

/**
 * Locate an Binary, without downloading / locking
 */
export class DryMongoBinary {
  /**
   * Binaries already found, values are: [Version, Path]
   */
  static binaryCache: Map<string, string> = new Map();
  /**
   * Cache the "getOS" call, so that not much has to be re-executed over and over
   */
  static cachedGetOs: AnyOS;

  /**
   * Try to locate an existing binary
   * @returns The Path to an Binary Found, or undefined
   */
  static async locateBinary(opts: DryMongoBinaryOptions): Promise<string | undefined> {
    log(`locateBinary: Trying to locate Binary for version "${opts.version}"`);
    const systemBinary = opts.systemBinary ?? (await this.generateOptions()).systemBinary;

    if (!isNullOrUndefined(systemBinary) && systemBinary.length > 0) {
      log(`locateBinary: env "SYSTEM_BINARY" was provided with value: "${systemBinary}"`);

      const systemReturn = await this.getSystemPath(systemBinary);

      if (isNullOrUndefined(systemReturn)) {
        throw new Error(
          `Config option "SYSTEM_BINARY" was provided with value "${systemBinary}", but no binary could be found!`
        );
      }

      return systemReturn;
    }

    if (this.binaryCache.has(opts.version)) {
      const binary = this.binaryCache.get(opts.version);
      log(`locateBinary: Requested Version found in cache: "[${opts.version}, ${binary}]"`);

      return binary;
    }

    log('locateBinary: running generateDownloadPath');
    const returnValue = await this.generateDownloadPath(opts);

    if (!returnValue[0]) {
      log('locateBinary: could not find an existing binary');

      return undefined;
    }

    log(`locateBinary: found binary at "${returnValue[1]}"`);
    this.binaryCache.set(opts.version, returnValue[1]);

    return returnValue[1];
  }

  /**
   * Generate All required options for the binary name / path generation
   */
  static async generateOptions(
    opts?: DryMongoBinaryOptions
  ): Promise<Required<DryMongoBinaryOptions>> {
    const defaultVersion = resolveConfig(ResolveConfigVariables.VERSION) ?? '4.0.20';
    const ensuredOpts: DryMongoBinaryOptions = isNullOrUndefined(opts)
      ? { version: defaultVersion }
      : opts;

    if (isNullOrUndefined(this.cachedGetOs)) {
      this.cachedGetOs = await getOS();
    }

    const final: Required<DryMongoBinaryOptions> = {
      version: ensuredOpts.version || defaultVersion,
      downloadDir: opts?.downloadDir || '',
      os: opts?.os ?? this.cachedGetOs,
      arch: opts?.arch || MongoBinaryDownloadUrl.translateArch(arch(), platform()),
      systemBinary: resolveConfig(ResolveConfigVariables.SYSTEM_BINARY) || '',
    };

    // fix the path, because what gets returned is the full path to the binary (base/version/binary)
    final.downloadDir = path.resolve((await this.generateDownloadPath(final))[1], '..', '..');

    return final;
  }

  /**
   * Get the full path with filename
   * @return Absoulte Path with FileName
   */
  static getBinaryName(): string {
    const addExe = platform() === 'win32' ? '.exe' : '';

    return `mongod${addExe}`;
  }

  /**
   * Combine basePath with binaryName and Options
   * This is an placeholder function until https://github.com/nodkz/mongodb-memory-server/issues/256
   */
  static combineBinaryName(
    opts: DryMongoBinaryOptions,
    basePath: string,
    binaryName: string
  ): string {
    return path.resolve(basePath, opts.version, binaryName);
  }

  /**
   * Probe if the provided "systemBinary" is an existing path
   * @param systemBinary The Path to probe for an System-Binary
   * @return System Binary path or undefined
   */
  static async getSystemPath(systemBinary: string): Promise<string | undefined> {
    try {
      await fspromises.access(systemBinary, constants.X_OK); // check if the provided path exists and has the execute bit for current user

      log(`getSystemPath: found system binary path at "${systemBinary}"`);

      return systemBinary; // returns if "access" is successful
    } catch (err) {
      log(`getSystemPath: can't find system binary at "${systemBinary}".\n${err.message}`);
    }

    return undefined;
  }

  /**
   * Generate an "MongoBinaryPaths" object
   * @return an finished "MongoBinaryPaths" object
   */
  static async generatePaths(opts: DryMongoBinaryOptions): Promise<DryMongoBinaryPaths> {
    const final: DryMongoBinaryPaths = {
      legacyHomeCache: '',
      modulesCache: '',
      relative: '',
      resolveConfig: '',
    };
    const binaryName = this.getBinaryName();
    // Assign "node_modules/.cache" to modulesCache

    // if we're in postinstall script, npm will set the cwd too deep
    let nodeModulesDLDir = process.cwd();
    while (nodeModulesDLDir.endsWith(`node_modules${path.sep}mongodb-memory-server`)) {
      nodeModulesDLDir = path.resolve(nodeModulesDLDir, '..', '..');
    }

    const modulesCache = findCacheDir({
      name: 'mongodb-memory-server',
      cwd: nodeModulesDLDir,
    });

    if (!isNullOrUndefined(modulesCache)) {
      final.modulesCache = this.combineBinaryName(
        opts,
        path.resolve(modulesCache, 'mongodb-binaries'),
        binaryName
      );
    }

    // Probe if the legacy Home Cache exists, if not remove it from the list
    const legacyHomeCache = path.resolve(homedir(), '.cache/mongodb-binaries');

    if (await pathExists(legacyHomeCache)) {
      log(`generateDownloadPath: legacy home cache exist ("${legacyHomeCache}")`);
      final.legacyHomeCache = this.combineBinaryName(opts, legacyHomeCache, binaryName);
    }

    // Resolve the config value "DOWNLOAD_DIR" if provided, otherwise remove from list
    const resolveConfigValue =
      resolveConfig(ResolveConfigVariables.DOWNLOAD_DIR) || opts.downloadDir;

    if (!isNullOrUndefined(resolveConfigValue)) {
      log(`generateDownloadPath: resolveConfigValue is not empty`);
      final.resolveConfig = this.combineBinaryName(opts, resolveConfigValue, binaryName);
    }

    // Resolve relative to cwd if no other has been found
    final.relative = this.combineBinaryName(
      opts,
      path.resolve(process.cwd(), 'mongodb-binaries'),
      binaryName
    );

    return final;
  }

  /**
   * Generate the Path where an Binary will be located
   * @return "boolean" indicating if the binary exists at the provided path, and "string" the path to use for the binary
   */
  static async generateDownloadPath(opts: DryMongoBinaryOptions): Promise<[boolean, string]> {
    const preferGlobal = envToBool(resolveConfig(ResolveConfigVariables.PREFER_GLOBAL_PATH));
    log(`generateDownloadPath: Generating Download Path, preferGlobal: "${preferGlobal}"`);
    const paths = await this.generatePaths(opts);

    log('generateDownloadPath: Paths:', paths);

    // Section where paths are probed for an existing binary
    if (await pathExists(paths.resolveConfig)) {
      log(
        `generateDownloadPath: Found binary in resolveConfig (DOWNLOAD_DIR): "${paths.resolveConfig}"`
      );

      return [true, paths.resolveConfig];
    }
    if (await pathExists(paths.legacyHomeCache)) {
      log(`generateDownloadPath: Found binary in legacyHomeCache: "${paths.legacyHomeCache}"`);

      return [true, paths.legacyHomeCache];
    }
    if (await pathExists(paths.modulesCache)) {
      log(`generateDownloadPath: Found binary in modulesCache: "${paths.modulesCache}"`);

      return [true, paths.modulesCache];
    }
    if (await pathExists(paths.relative)) {
      log(`generateDownloadPath: Found binary in relative: "${paths.relative}"`);

      return [true, paths.relative];
    }

    // Section where binary path gets generated when no binary was found
    log(`generateDownloadPath: no existing binary for version "${opts.version}" was found`);

    if (paths.resolveConfig.length > 0) {
      log(`generateDownloadPath: using resolveConfig (DOWNLOAD_DIR) "${paths.resolveConfig}"`);

      return [false, paths.resolveConfig];
    }
    if (preferGlobal) {
      log(`generateDownloadPath: using global (preferGlobal) "${paths.legacyHomeCache}"`);

      return [false, paths.legacyHomeCache];
    }
    // this case may not happen, if somehow the cwd gets changed outside of "node_modules" reach
    if (paths.modulesCache.length > 0) {
      log(`generateDownloadPath: using modulesCache "${paths.modulesCache}"`);

      return [false, paths.modulesCache];
    }

    log(`generateDownloadPath: using relative "${paths.relative}"`);

    return [false, paths.relative];
  }
}
