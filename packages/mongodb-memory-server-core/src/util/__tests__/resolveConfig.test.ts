import { promises as fspromises } from 'fs';
import * as tmp from 'tmp';
import resolveConfig, { findPackageJson, ResolveConfigVariables } from '../resolveConfig';

tmp.setGracefulCleanup();

const outerPackageJson = {
  config: {
    mongodbMemoryServer: {
      inner: false,
      version: '3.0.0',
    },
  },
};
const innerPackageJson = {
  config: {
    mongodbMemoryServer: {
      inner: true,
      version: '4.0.0',
    },
  },
};

describe('resolveConfig', () => {
  const originalDir = process.cwd();
  let tmpObj: tmp.DirResult;

  describe('configuration from closest package.json', () => {
    beforeAll(async () => {
      // Set up test project/subproject structure in a temporary directory:
      //
      //     project/
      //     |-- subproject/
      //     |   +-- package.json
      //     +-- package.json

      tmpObj = tmp.dirSync({ unsafeCleanup: true });
      const tmpName = tmpObj.name;

      await fspromises.mkdir(`${tmpName}/project`);
      await fspromises.mkdir(`${tmpName}/project/subproject`);

      // prettier-ignore
      await Promise.all([
        fspromises.writeFile(
          `${tmpName}/project/package.json`,
          JSON.stringify(outerPackageJson)
        ),
        fspromises.writeFile(
          `${tmpName}/project/subproject/package.json`,
          JSON.stringify(innerPackageJson)
        ),
      ]);
    });

    afterAll(() => {
      process.chdir(originalDir);
      tmpObj.removeCallback();
    });

    test('in project', () => {
      // expect to get the outer package.json
      process.chdir(`${tmpObj.name}/project`);
      const out = findPackageJson();
      expect(resolveConfig(ResolveConfigVariables.VERSION)).toBe('3.0.0');
      expect(out.inner).toBe(false);
    });

    test('in subproject', () => {
      // expect to get the inner package.json
      process.chdir(`${tmpObj.name}/project/subproject`);
      const out = findPackageJson();
      expect(resolveConfig(ResolveConfigVariables.VERSION)).toBe('4.0.0');
      expect(out.inner).toBe(true);
    });

    test('with explicit directory in reInitializePackageJson', () => {
      // expect to get the inner package.json
      process.chdir(`${tmpObj.name}/project`);
      const out = findPackageJson(`${tmpObj.name}/project/subproject`);
      expect(resolveConfig(ResolveConfigVariables.VERSION)).toBe('4.0.0');
      expect(out.inner).toBe(true);
    });
  });
});
