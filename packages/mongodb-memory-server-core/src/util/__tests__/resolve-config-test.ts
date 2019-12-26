import fs from 'fs';
import tmp, { DirResult } from 'tmp';
import { promisify } from 'util';
import resolveConfig, { reInitializePackageJson } from '../resolve-config';

tmp.setGracefulCleanup();
const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);

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
  let tmpObj: DirResult;

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

      await mkdirAsync(`${tmpName}/project`);
      await mkdirAsync(`${tmpName}/project/subproject`);

      // prettier-ignore
      await Promise.all([
        writeFileAsync(
          `${tmpName}/project/package.json`,
          JSON.stringify(outerPackageJson)
        ),
        writeFileAsync(
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
      reInitializePackageJson();
      const got = resolveConfig('VERSION');
      expect(got).toBe('3.0.0');
    });

    test('in subproject', () => {
      process.chdir(`${tmpObj.name}/project/subproject`);
      reInitializePackageJson();
      const got = resolveConfig('VERSION');
      expect(got).toBe('4.0.0');
    });

    test('with explicit directory in reInitializePackageJson', () => {
      process.chdir(`${tmpObj.name}/project`);
      reInitializePackageJson(`${tmpObj.name}/project/subproject`);
      const got = resolveConfig('VERSION');
      expect(got).toBe('4.0.0');
    });
  });
});
