import { isNullOrUndefined } from './utils';

export class StateError extends Error {
  constructor(public wantedStates: string[], public gotState: string) {
    super(
      `Incorrect State for operation: "${gotState}", allowed States: "[${wantedStates.join(
        ','
      )}]"\n` +
        'This may be because of using a v6.x way of calling functions, look at the following guide if anything applies:\n' +
        'https://nodkz.github.io/mongodb-memory-server/docs/guides/migrate7#no-function-other-than-start-create-ensureinstance-will-be-starting-anything'
    );
  }
}

export class UnknownLockfileStatusError extends Error {
  constructor(public status: number) {
    super(`Unknown LockFile Status: "${status}"`);
  }
}

export class UnableToUnlockLockfileError extends Error {
  constructor(public thisInstance: boolean, public file: string) {
    super(
      `Cannot unlock file "${file}", because it is not locked by this ${
        thisInstance ? 'instance' : 'process'
      }`
    );
  }
}

export class UnknownPlatformError extends Error {
  constructor(public platform: string) {
    super(`Unknown Platform: "${platform}"`);
  }
}

export class UnknownArchitectureError extends Error {
  constructor(public arch: string, public platform?: string) {
    super();

    if (!isNullOrUndefined(platform)) {
      this.message = `Unsupported Architecture-Platform combination: arch: "${arch}", platform: "${platform}"`;
    } else {
      this.message = `Unsupported Architecture: "${arch}"`;
    }
  }
}

export class WaitForPrimaryTimeoutError extends Error {
  constructor(public timeout: number, public where?: string) {
    super(`Timed out after ${timeout}ms while waiting for a Primary (where: "${where}")`);
  }
}

// REFACTOR: consider merging this with InstanceInfoError
export class EnsureInstanceError extends Error {
  constructor(public isRunning: boolean) {
    super();
    const baseMesasge = '"ensureInstance" failed, because';

    if (isRunning) {
      this.message = `${baseMesasge} state was "running" but "instanceInfo" was undefined!`;
    } else {
      this.message = `${baseMesasge} "instanceInfo" was undefined after running "start"`;
    }
  }
}

// REFACTOR: merge this error with BinaryNotFoundError
export class NoSystemBinaryFoundError extends Error {
  constructor(public binaryPath: string) {
    super(
      `Config option "SYSTEM_BINARY" was provided with value "${binaryPath}", but no binary could be found!`
    );
  }
}

export class Md5CheckFailedError extends Error {
  constructor(public binarymd5: string, public checkfilemd5: string) {
    super(`MD5 check failed! Binary MD5 is "${binarymd5}", Checkfile MD5 is "${checkfilemd5}"`);
  }
}

export class StartBinaryFailedError extends Error {
  constructor(public binary: string) {
    super(`Starting the Binary Failed (PID is undefined)! Binary: "${binary}"`);
  }
}

export class InstanceInfoError extends Error {
  constructor(public where: string) {
    super(`"instanceInfo" was undefined when expected to be defined! (where: "${where}")`);
  }
}

export class KeyFileMissingError extends Error {
  constructor() {
    super(`"keyfileLocation" was undefined when expected!`);
  }
}

export class AuthNotObjectError extends Error {
  constructor() {
    super('"auth" was not a object when it was expected!');
  }
}

export class InsufficientPermissionsError extends Error {
  constructor(public path: string) {
    super(`File "${path}" does not have the required Permissions, required Permissions: "--x"`);
  }
}

export class BinaryNotFoundError extends Error {
  constructor(public path: string) {
    super(`No Binary at path "${path}" was found! (ENOENT)`);
  }
}

/**
 * Custom Fallback Error for "utils.assertion", it is a named/custom Error to confuse less in the stacktrace
 */
export class AssertionFallbackError extends Error {
  constructor() {
    super('Assert failed - no custom error');
  }
}

export class ReplsetCountLowError extends Error {
  constructor(public count: number) {
    super(`ReplSet Count needs to be 1 or higher! (specified count: "${count}")`);
  }
}
