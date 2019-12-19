import { readFile, read, stat, readdir } from "fs";
import { platform } from "os";

import { exec } from "child_process";
import { promisify, isNullOrUndefined } from "util";

/** Collection of Regexes for "lsb_release -a" parsing */
const LSBRegex = {
  name: /^distributor id:\s*(.*)$/mi,
  codename: /^codename:\s*(.*)$/mi,
  release: /^release:\s*(.*)$/mi
}

/** Collection of Regexes for "/etc/os-release" parsing */
const OSRegex = {
  name: /^id\s*=\s*"?(.*)"?$/mi,
  /** uses VERSION_CODENAME */
  codename: /^version_codename\s*=\s*(.*)$/mi,
  release: /^version_id\s*=\s*"?(.*)"?$/mi
}

export interface OtherOS {
  os: 'aix'
    | 'android'
    | 'darwin'
    | 'freebsd'
    | 'openbsd'
    | 'sunos'
    | 'win32'
    | 'cygwin' 
    | string;
}

export interface LinuxOS extends OtherOS {
  os: 'linux';
  dist: string;
  release: string;
  codename?: string;
}

export type AnyOS = OtherOS | LinuxOS;

/**
 * Check if the OS is a LinuxOS Typeguard
 * @param os The OS object to check for
 */
export function isLinuxOS(os: AnyOS): os is LinuxOS {
  return os.os === "linux";
}

/** Get an OS object */
export default async function getOS(): Promise<AnyOS> {
  /** Node builtin function for first determinations */
  let osName = platform();

  // Linux is a special case.
  if (osName === 'linux') return await getLinuxInfomation();

  return { os: osName };
}

/** Function to outsource Linux Infomation Parsing */
async function getLinuxInfomation(): Promise<AnyOS> {
  // Structure of this function:
  // 1. try lsb_release
  // (if not 1) 2. try /etc/os-release
  // (if not 2) 3. try read dir /etc and filter any file "-release" and try to parse the first file found

  try {
    const lsb = await promisify(exec)("lsb_release -a"); // exec this for safety, because "/etc/lsb-release" could be changed to another file

    return parseLSB(lsb.stdout);
  } catch (err) {
    if ((err as Error).message.match(/: not found/mi)) {
      try {
        const os = await promisify(readFile)("/etc/os-release");

        return parseOS(os.toString());
      } catch (err) {
        if (err?.code === "ENOENT") {
          // last resort testing (for something like archlinux)
          const file = (await promisify(readdir)("/etc")).filter((v) => v.match(/.*-release$/mi))[0];
          if (isNullOrUndefined(file) || file.length <= 0) {
            throw new Error("No release file found!");
          }
          const os = await promisify(exec)("cat /etc/" + file);

          return parseOS(os.stdout);
        }

        throw err;
      }
    } else {
      // throw the error in case it is not a "not found" error
      throw err;
    }
  }  
}

/** Function to outsource "lsb_release -a" parsing */
function parseLSB(input: string): LinuxOS {
  return {
    os: "linux",
    dist: input.match(LSBRegex.name)?.[1] ?? "unkown",
    codename: input.match(LSBRegex.codename)?.[1],
    release: input.match(LSBRegex.release)?.[1] ?? ""
  }
}

/** Function to outsource "/etc/os-release" parsing */
function parseOS(input: string): LinuxOS {
  return {
    os: "linux",
    dist: input.match(OSRegex.name)?.[1] ?? "unkown",
    codename: input.match(OSRegex.codename)?.[1],
    release: input.match(OSRegex.release)?.[1] ?? ""
  }
}
