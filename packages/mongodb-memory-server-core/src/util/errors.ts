import { isNullOrUndefined } from './utils';

export class StateError extends Error {
  constructor(public wantedStates: [string], public gotState: string) {
    super(
      `Incorrect State for operation: "${gotState}", allowed States: "[${wantedStates.join(',')}]"`
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
