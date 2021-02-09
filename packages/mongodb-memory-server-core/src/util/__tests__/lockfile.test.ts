import * as lockFile from '../lockfile';
import * as tmp from 'tmp';
import * as path from 'path';
import { pathExists } from '../utils';
import { promises as fspromises } from 'fs';

let tmpDir: tmp.DirResult;
beforeAll(() => {
  tmpDir = tmp.dirSync({ prefix: 'reuse-mongo-mem-', unsafeCleanup: true });
});

afterAll(() => {
  tmpDir.removeCallback();
});

describe('LockFile', () => {
  it('should successfully acquire and release an lock', async () => {
    const lockPath = path.resolve(tmpDir.name, 'sucessful.lock');
    expect(await pathExists(lockPath)).toBeFalsy();

    expect(lockFile.LockFile.files.size).toBe(0);

    const lock = await lockFile.LockFile.lock(lockPath);
    expect(lock).toBeInstanceOf(lockFile.LockFile);
    expect(await pathExists(lockPath)).toBeTruthy();
    expect(lockFile.LockFile.files.size).toBe(1);
    expect(lockFile.LockFile.files.has(lockPath)).toBeTruthy();

    const lockReadout = parseInt((await fspromises.readFile(lockPath)).toString());
    expect(lockReadout).toEqual(process.pid);

    await lock.unlock();
    expect(await pathExists(lockPath)).toBeFalsy();
    expect(lockFile.LockFile.files.size).toBe(0);
    expect(lockFile.LockFile.files.has(lockPath)).toBeFalsy();

    // @ts-expect-error Somehow jest dosnt find the method "checkLock" in types
    jest.spyOn(lockFile.LockFile, 'checkLock');
    await lock.unlock();
    // @ts-expect-error because "checkLock" is protected
    expect(lockFile.LockFile.checkLock).not.toBeCalled();
  });

  it('should successfully acquire lock after another unlocked', async () => {
    // @ts-expect-error Somehow jest dosnt find the method "waitForLock" in types
    jest.spyOn(lockFile.LockFile, 'waitForLock');
    const lockPath = path.resolve(tmpDir.name, 'sucessful_another.lock');
    expect(await pathExists(lockPath)).toBeFalsy();

    expect(lockFile.LockFile.files.size).toBe(0);

    const lock1 = await lockFile.LockFile.lock(lockPath);
    expect(lock1).toBeInstanceOf(lockFile.LockFile);
    expect(await pathExists(lockPath)).toBeTruthy();
    expect(lockFile.LockFile.files.size).toBe(1);
    expect(lockFile.LockFile.files.has(lockPath)).toBeTruthy();
    expect(lockFile.LockFile.events.listenerCount(lockFile.LockFileEvents.unlock)).toBe(0);

    const lock2 = lockFile.LockFile.lock(lockPath);
    expect(await pathExists(lockPath)).toBeTruthy();
    expect(lockFile.LockFile.files.size).toBe(1);
    expect(lockFile.LockFile.files.has(lockPath)).toBeTruthy();
    // ensure that "lock2" gets executed as far as possible
    await new Promise(async (res) => {
      setTimeout(res, 10);
      await lock2;
    });
    // @ts-expect-error because "waitForLock" is protected
    expect(lockFile.LockFile.waitForLock).toBeCalled();
    expect(lockFile.LockFile.events.listenerCount(lockFile.LockFileEvents.unlock)).toBe(1);

    await lock1.unlock();
    await new Promise(async (res) => {
      setTimeout(res, 10);
      await lock2;
    });
    expect(await pathExists(lockPath)).toBeTruthy();
    expect(lockFile.LockFile.files.size).toBe(1);
    expect(lockFile.LockFile.files.has(lockPath)).toBeTruthy();
    expect(lockFile.LockFile.events.listenerCount(lockFile.LockFileEvents.unlock)).toBe(0);

    const lock2return = await lock2;
    expect(lock2return).toBeInstanceOf(lockFile.LockFile);

    await lock2return.unlock();
    expect(await pathExists(lockPath)).toBeFalsy();
    expect(lockFile.LockFile.files.size).toBe(0);
    expect(lockFile.LockFile.files.has(lockPath)).toBeFalsy();
  });
});
