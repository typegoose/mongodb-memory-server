import { promises as fspromises } from 'fs';
import { platform } from 'os';
import { execSync } from 'child_process';
import { join } from 'path';
import resolveConfig, { envToBool, ResolveConfigVariables } from '../resolveConfig';
import debug from 'debug';
import { isNullOrUndefined } from '../utils';

const log = debug('MongoMS:getos');

/** Collection of Regexes for "lsb_release -a" or plain lsb file parsing */
const LSBRegex = {
  name: /^(distributor id:\s*|DISTRIB_ID=)(.*)$/im,
  codename: /^(codename:\s*|DISTRIB_CODENAME=)(.*)$/im,
  release: /^(release:\s*|DISTRIB_RELEASE=)(.*)$/im,
};

/** Collection of Regexes for "/etc/os-release" parsing */
const OSRegex = {
  name: /^id\s*=\s*"?(.*)"?$/im,
  /** uses VERSION_CODENAME */
  codename: /^version_codename\s*=\s*(.*)$/im,
  release: /^version_id\s*=\s*"?(.*)"?$/im,
  id_like: /^id_like\s*=\s*"?(.*)"?$/im,
};

export interface OtherOS {
  os: 'aix' | 'android' | 'darwin' | 'freebsd' | 'openbsd' | 'sunos' | 'win32' | 'cygwin' | string;
}

export interface LinuxOS extends OtherOS {
  os: 'linux';
  dist: string;
  release: string;
  codename?: string;
  id_like?: string;
}

export type AnyOS = OtherOS | LinuxOS;

/**
 * Check if the OS is a LinuxOS Typeguard
 * @param os The OS object to check for
 */
export function isLinuxOS(os: AnyOS): os is LinuxOS {
  return os.os === 'linux';
}

/** Get an OS object */
export async function getOS(): Promise<AnyOS> {
  /** Node builtin function for first determinations */
  const osName = platform();

  // Linux is a special case.
  if (osName === 'linux') {
    return await getLinuxInformation();
  }

  return { os: osName };
}

export default getOS;

/** Function to outsource Linux Information Parsing */
async function getLinuxInformation(): Promise<LinuxOS> {
  // Structure of this function:
  // 1. try lsb_release
  // (if not 1) 2. try /etc/os-release
  // (if not 2) 3. try read dir /etc and filter any file "-release" and try to parse the first file found

  // Force "lsb_release" to be used
  if (envToBool(resolveConfig(ResolveConfigVariables.USE_LINUX_LSB_RELEASE))) {
    log('Forced LSB-Release file!');

    return (await tryLSBRelease()) as LinuxOS;
  }
  // Force /etc/os-release to be used
  if (envToBool(resolveConfig(ResolveConfigVariables.USE_LINUX_OS_RELEASE))) {
    log('Forced OS-Release file!');

    return (await tryOSRelease()) as LinuxOS;
  }
  // Force the first /etc/*-release file to be used
  if (envToBool(resolveConfig(ResolveConfigVariables.USE_LINUX_ANY_RELEASE))) {
    log('Forced First *-Release file!');

    return (await tryFirstReleaseFile()) as LinuxOS;
  }

  // Try everything
  // Note: these values are stored, because this code should not use "inline value assignment"

  log('Trying LSB-Release');
  const lsbOut = await tryLSBRelease();
  log('Trying OS-Release');
  const osOut = await tryOSRelease();

  if (!isNullOrUndefined(lsbOut)) {
    // add id_like info if available
    return { ...lsbOut, id_like: osOut?.id_like };
  }

  if (!isNullOrUndefined(osOut)) {
    return osOut;
  }

  log('Trying First *-Release file');
  const releaseOut = await tryFirstReleaseFile();

  if (!isNullOrUndefined(releaseOut)) {
    return releaseOut;
  }

  log("Couldn't find a release file");

  // if none has worked, return unknown
  return {
    os: 'linux',
    dist: 'unknown',
    release: '',
  };
}

/**
 * Try the "lsb_release" command, and if it works, parse it
 */
async function tryLSBRelease(): Promise<LinuxOS | undefined> {
  try {
    // use upstream lsb file if it exists (like in linux mint)
    if (await fspromises.stat('/etc/upstream-release/lsb-release')) {
      return parseLSB(await fspromises.readFile('/etc/upstream-release/lsb-release', 'utf8'));
    }

    // exec this for safety, because "/etc/lsb-release" could be changed to another file
    return parseLSB(execSync('lsb_release -a').toString());
  } catch (err) {
    // check if "USE_LINUX_LSB_RELEASE" is unset, when yes - just return to start the next try
    if (isNullOrUndefined(resolveConfig(ResolveConfigVariables.USE_LINUX_LSB_RELEASE))) {
      return;
    }

    // otherwise throw the error
    throw err;
  }
}

/**
 * Try to read the /etc/os-release file, and if it works, parse it
 */
async function tryOSRelease(): Promise<LinuxOS | undefined> {
  try {
    const os = await fspromises.readFile('/etc/os-release', 'utf-8');

    return parseOS(os.toString());
  } catch (err) {
    // check if the error is an "ENOENT" OR "SKIP_OS_RELEASE" is set
    // AND "USE_LINUX_OS_RELEASE" is unset
    // and just return
    if (
      (err?.code === 'ENOENT' ||
        envToBool(resolveConfig(ResolveConfigVariables.SKIP_OS_RELEASE))) &&
      isNullOrUndefined(resolveConfig(ResolveConfigVariables.USE_LINUX_OS_RELEASE))
    ) {
      return;
    }

    // otherwise throw the error
    throw err;
  }
}

/**
 * Try to read any /etc/*-release file, take the first, and if it works, parse it
 */
async function tryFirstReleaseFile(): Promise<LinuxOS | undefined> {
  try {
    const file = (await fspromises.readdir('/etc')).filter(
      (v) =>
        // match if file ends with "-release"
        v.match(/.*-release$/im) &&
        // check if the file does NOT contain "lsb"
        !v.match(/lsb/im)
    )[0];

    if (isNullOrUndefined(file) || file.length <= 0) {
      throw new Error('No release file found!');
    }

    const os = await fspromises.readFile(join('/etc/', file));

    return parseOS(os.toString());
  } catch (err) {
    // check if the error is an "ENOENT" OR "SKIP_RELEASE" is set
    // AND "USE_LINUX_RELEASE" is unset
    // and just return
    if (
      err?.code === 'ENOENT' &&
      isNullOrUndefined(resolveConfig(ResolveConfigVariables.USE_LINUX_ANY_RELEASE))
    ) {
      return;
    }

    // otherwise throw the error
    throw err;
  }
}

/** Function to outsource "lsb_release -a" parsing */
export function parseLSB(input: string): LinuxOS {
  return {
    os: 'linux',
    dist: input.match(LSBRegex.name)?.[1] ?? 'unknown',
    codename: input.match(LSBRegex.codename)?.[1],
    release: input.match(LSBRegex.release)?.[1] ?? '',
  };
}

/** Function to outsource "/etc/os-release" parsing */
function parseOS(input: string): LinuxOS {
  return {
    os: 'linux',
    dist: input.match(OSRegex.name)?.[1] ?? 'unknown',
    codename: input.match(OSRegex.codename)?.[1],
    release: input.match(OSRegex.release)?.[1] ?? '',
  };
}
