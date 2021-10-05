import { promises as fspromises } from 'fs';
import * as tmp from 'tmp';
import resolveConfig, {
  envToBool,
  findPackageJson,
  ResolveConfigVariables,
} from '../resolveConfig';
import { assertion, isNullOrUndefined } from '../utils';

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findPackageJson', () => {
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
      assertion(!isNullOrUndefined(out));
      expect(resolveConfig(ResolveConfigVariables.VERSION)).toBe('3.0.0');
      expect(out.config.inner).toBe(false);
    });

    test('in subproject', () => {
      // expect to get the inner package.json
      process.chdir(`${tmpObj.name}/project/subproject`);
      const out = findPackageJson();
      assertion(!isNullOrUndefined(out));
      expect(resolveConfig(ResolveConfigVariables.VERSION)).toBe('4.0.0');
      expect(out.config.inner).toBe(true);
    });

    test('with explicit directory in reInitializePackageJson', () => {
      // expect to get the inner package.json
      process.chdir(`${tmpObj.name}/project`);
      const out = findPackageJson(`${tmpObj.name}/project/subproject`);
      assertion(!isNullOrUndefined(out));
      expect(resolveConfig(ResolveConfigVariables.VERSION)).toBe('4.0.0');
      expect(out.config.inner).toBe(true);
    });
  });

  describe('envToBool', () => {
    it('should resolve all supported cases to right booleans', () => {
      expect(envToBool('1')).toStrictEqual(true);
      expect(envToBool('on')).toStrictEqual(true);
      expect(envToBool('ON')).toStrictEqual(true);
      expect(envToBool('yes')).toStrictEqual(true);
      expect(envToBool('YES')).toStrictEqual(true);
      expect(envToBool('true')).toStrictEqual(true);
      expect(envToBool('TRUE')).toStrictEqual(true);

      expect(envToBool('anythingelse')).toStrictEqual(false);
      expect(envToBool('false')).toStrictEqual(false);
    });

    it('should return false when input is not a string', () => {
      expect(
        // @ts-expect-error "envToBool" only supports "string" as a input
        envToBool(true)
      ).toStrictEqual(false);
    });
  });
});
