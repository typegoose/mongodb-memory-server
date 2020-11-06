import { promises as fspromises } from 'fs';
import * as tmp from 'tmp';
import resolveConfig, { findPackageJson, ResolveConfigVariables } from '../resolveConfig';

tmp.setGracefulCleanup();

const outerPackageJson = {
  config: {
    mongodbMemoryServer: {
      version: '3.0.0',
    },
  },
};
const innerPackageJson = {
  config: {
    mongodbMemoryServer: {
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
      process.chdir(`${tmpObj.name}/project`);
      findPackageJson();
      const got = resolveConfig(ResolveConfigVariables.VERSION);
      expect(got).toBe('3.0.0');
    });

    test('in subproject', () => {
      process.chdir(`${tmpObj.name}/project/subproject`);
      findPackageJson();
      const got = resolveConfig(ResolveConfigVariables.VERSION);
      expect(got).toBe('4.0.0');
    });

    test('with explicit directory in reInitializePackageJson', () => {
      process.chdir(`${tmpObj.name}/project`);
      findPackageJson(`${tmpObj.name}/project/subproject`);
      const got = resolveConfig(ResolveConfigVariables.VERSION);
      expect(got).toBe('4.0.0');
    });
  });
});
