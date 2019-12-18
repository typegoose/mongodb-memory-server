// @ts-nocheck
// import * as async from "async";
import * as fs from "fs";
import * as os from "os";
import { join } from "path";

import { exec } from "child_process";
import { promisify } from "util";

// const distros = fs.readFileSync(join(__dirname, "os.json"));

const LSBRegex = {
  name: /^distributor id:[\s]*(.*)$/mi,
  codename: /^codename:[\s]*(.*)$/mi,
  release: /^release:[\s]*(.*)$/mi
}

const OSRegex = {
  name: /^id="?(.*)"?$/mi,
  /** uses VERSION_CODENAME */
  codename: /^version_codename=(.*)$/mi,
  release: /^version_id="?(.*)"?$/mi
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
 * Module definition.
 */
export default async function getOS(): Promise<AnyOS> {
  /** Node builtin function for first determinations */
  let osName = os.platform();

  // Linux is a special case.
  if (osName === 'linux') return await getInfomation();

  return { os: osName };
}

async function getInfomation() {
  const lsb = await promisify(exec)("lsb_release -a"); // exec this for safety, because "/etc/lsb-release" could be changed to another file
  if (lsb.stdout.length <= 0) {
    try {
      const os = await promisify(fs.readFile)("/etc/os-release");

      return parseOS(os.toString());
    } catch (err) {
      if (err?.code === "ENOENT") {
        throw new Error("No Appropiate file was found!\nSupported are: \"lsb_release -a\"(command) and \"/etc/os-release\"")
      }

      throw err;
    }
  }

  return parseLSB(lsb.stdout);
}

function parseLSB(input: string): LinuxOS {
  console.log("parseLSB")
  return {
    os: "linux",
    dist: input.match(LSBRegex.name)?.[1] ?? "unkown",
    codename: input.match(LSBRegex.codename)?.[1],
    release: input.match(LSBRegex.release)?.[1] ?? ""
  }
}

function parseOS(input: string): LinuxOS {
  console.log("parseOS")
  return {
    os: "linux",
    dist: input.match(OSRegex.name)?.[1] ?? "unkown",
    codename: input.match(OSRegex.codename)?.[1],
    release: input.match(OSRegex.release)?.[1] ?? ""
  }
}
