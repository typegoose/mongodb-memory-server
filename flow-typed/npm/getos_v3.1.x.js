/**
 * Flowtype definitions for getos_v3.1
 */

declare module "getos" {
  declare type Os = OtherOs | LinuxOs;
  declare interface OtherOs {
    os:
      | "aix"
      | "android"
      | "darwin"
      | "freebsd"
      | "openbsd"
      | "sunos"
      | "win32"
      | "cygwin";
  }

  declare interface LinuxOs {
    os: "linux";
    dist: string;
    release: string;
    codename?: string;
  }

  declare var getos: (cb: (err: Error | null, os: Os) => void) => string;

  declare module.exports: typeof getos;
}
