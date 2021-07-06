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

export class UnknownLockfileStatus extends Error {
  constructor(public status: number) {
    super(`Unknown LockFile Status: "${status}"`);
  }
}

export class UnknownPlatform extends Error {
  constructor(public platform: string) {
    super(`Unknown Platform: "${platform}"`);
  }
}

export class UnknownArchitecture extends Error {
  constructor(public arch: string, public platform?: string) {
    super();

    if (!isNullOrUndefined(platform)) {
      this.message = `Unsupported Architecture-Platform combination: arch: "${arch}", platform: "${platform}"`;
    } else {
      this.message = `Unsupported Architecture: "${arch}"`;
    }
  }
}
