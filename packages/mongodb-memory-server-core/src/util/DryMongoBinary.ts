import { promises as fspromises, constants } from 'fs';
import debug from 'debug';
import { envToBool, resolveConfig, ResolveConfigVariables } from './resolveConfig';
import { isNullOrUndefined, pathExists } from './utils';
import * as path from 'path';
import { arch, homedir, platform } from 'os';
import findCacheDir from 'find-cache-dir';
import getOS, { AnyOS, isLinuxOS } from './getos';

const log = debug('MongoMS:DryMongoBinary');

export interface BaseDryMongoBinaryOptions {
  version?: string;
  downloadDir?: string;
  os?: AnyOS;
  arch?: string;
  systemBinary?: string;
}

export interface DryMongoBinaryOptions extends BaseDryMongoBinaryOptions {
  version: NonNullable<BaseDryMongoBinaryOptions['version']>;
}

export interface DryMongoBinaryNameOptions {
  version: NonNullable<DryMongoBinaryOptions['version']>;
  arch: NonNullable<DryMongoBinaryOptions['arch']>;
  os: NonNullable<DryMongoBinaryOptions['os']>;
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
    const useOpts = await this.generateOptions(opts);

    if (!!useOpts.systemBinary) {
      log(`locateBinary: env "SYSTEM_BINARY" was provided with value: "${useOpts.systemBinary}"`);

      const systemReturn = await this.getSystemPath(useOpts.systemBinary);

      if (isNullOrUndefined(systemReturn)) {
        throw new Error(
          `Config option "SYSTEM_BINARY" was provided with value "${useOpts.systemBinary}", but no binary could be found!`
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
    const returnValue = await this.generateDownloadPath(useOpts);

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
    log('generateOptions');
    const defaultVersion = resolveConfig(ResolveConfigVariables.VERSION) ?? '4.0.25';
    const ensuredOpts: DryMongoBinaryOptions = isNullOrUndefined(opts)
      ? { version: defaultVersion }
      : opts;

    if (isNullOrUndefined(this.cachedGetOs)) {
      this.cachedGetOs = await getOS();
    }

    const final: Required<DryMongoBinaryOptions> = {
      version: ensuredOpts.version || defaultVersion,
      downloadDir:
        resolveConfig(ResolveConfigVariables.DOWNLOAD_DIR) || ensuredOpts.downloadDir || '',
      os: ensuredOpts.os ?? this.cachedGetOs,
      arch: ensuredOpts.arch || arch(),
      systemBinary:
        resolveConfig(ResolveConfigVariables.SYSTEM_BINARY) || ensuredOpts.systemBinary || '',
    };

    final.downloadDir = path.dirname((await this.generateDownloadPath(final))[1]);

    return final;
  }

  /**
   * Get the full path with filename
   * @return Absoulte Path with FileName
   */
  static getBinaryName(opts: DryMongoBinaryNameOptions): string {
    log('getBinaryName');
    const addExe = platform() === 'win32' ? '.exe' : '';
    const dist = isLinuxOS(opts.os) ? opts.os.dist : opts.os.os;

    return `mongod-${opts.arch}-${dist}-${opts.version}${addExe}`;
  }

  /**
   * Combine basePath with binaryName
   */
  static combineBinaryName(basePath: string, binaryName: string): string {
    log('combineBinaryName');

    return path.resolve(basePath, binaryName);
  }

  /**
   * Probe if the provided "systemBinary" is an existing path
   * @param systemBinary The Path to probe for an System-Binary
   * @return System Binary path or undefined
   */
  static async getSystemPath(systemBinary: string): Promise<string | undefined> {
    log('getSystempath');
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
   *
   * This Function should not hit the FileSystem
   * @return an finished "MongoBinaryPaths" object
   */
  static async generatePaths(
    opts: DryMongoBinaryOptions & DryMongoBinaryNameOptions
  ): Promise<DryMongoBinaryPaths> {
    log('generatePaths');
    const final: DryMongoBinaryPaths = {
      legacyHomeCache: '',
      modulesCache: '',
      relative: '',
      resolveConfig: '',
    };
    const binaryName = this.getBinaryName(opts);
    // Assign "node_modules/.cache" to modulesCache

    // if we're in postinstall script, npm will set the cwd too deep
    // when in postinstall, npm will provide an "INIT_CWD" env variable
    let nodeModulesDLDir = process.env['INIT_CWD'] || process.cwd();
    // as long as "node_modules/mongodb-memory-server*" is included in the path, go the paths up
    while (nodeModulesDLDir.includes(`node_modules${path.sep}mongodb-memory-server`)) {
      nodeModulesDLDir = path.resolve(nodeModulesDLDir, '..', '..');
    }

    const tmpModulesCache = findCacheDir({
      name: 'mongodb-memory-server',
      cwd: nodeModulesDLDir,
    });

    if (!isNullOrUndefined(tmpModulesCache)) {
      final.modulesCache = this.combineBinaryName(path.resolve(tmpModulesCache), binaryName);
    }

    const legacyHomeCache = path.resolve(this.homedir(), '.cache/mongodb-binaries');

    final.legacyHomeCache = this.combineBinaryName(legacyHomeCache, binaryName);

    // Resolve the config value "DOWNLOAD_DIR" if provided, otherwise remove from list
    const resolveConfigValue =
      opts.downloadDir || resolveConfig(ResolveConfigVariables.DOWNLOAD_DIR);

    if (!isNullOrUndefined(resolveConfigValue) && resolveConfigValue.length > 0) {
      log(`generatePaths: resolveConfigValue is not empty`);
      final.resolveConfig = this.combineBinaryName(resolveConfigValue, binaryName);
    }

    // Resolve relative to cwd if no other has been found
    final.relative = this.combineBinaryName(
      path.resolve(process.cwd(), 'mongodb-binaries'),
      binaryName
    );

    return final;
  }

  /**
   * Generate the Path where an Binary will be located
   * @return "boolean" indicating if the binary exists at the provided path, and "string" the path to use for the binary
   */
  static async generateDownloadPath(
    opts: DryMongoBinaryOptions & DryMongoBinaryNameOptions
  ): Promise<[boolean, string]> {
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
    if (preferGlobal && !!paths.legacyHomeCache) {
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

  /**
   * This function is used, because jest just dosnt want "os.homedir" to be mocked
   * if someone can find an way to actually mock this in an test, please change it
   */
  private static homedir(): string {
    return homedir();
  }
}
